"use server";
import { ID, Query, Client, Account, Databases } from "node-appwrite";
import { createAdminClient, createSessionClient } from "@/lib/appwrite";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// --- EXISTING OTP LOGIC ---
export async function sendEmailOtp(email) {
  try {
    const { account, users } = await createAdminClient();
    try {
      const existingUsers = await users.list([Query.equal("email", email)]);
      if (existingUsers.total > 0) {
        return { error: "An account with this email already exists." };
      }
    } catch (err) {
      console.log("User check skipped:", err.message);
    }
    const userId = ID.unique();
    await account.createEmailToken(userId, email);
    return { success: true, userId };
  } catch (error) {
    console.error("Send OTP Error:", error);
    return { error: error.message || "Failed to send OTP" };
  }
}

export async function verifyEmailOtp(userId, secret) {
  try {
    const { account } = await createAdminClient();
    const session = await account.createSession(userId, secret);
    return { success: true, sessionSecret: session.secret };
  } catch (error) {
    console.error("Verify OTP Error:", error);
    return { error: "Invalid code. Please check your email and try again." };
  }
}

export async function completeSignup(formData, sessionSecret) {
  const { name, password, phone, dob, location } = formData;
  try {
    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
      .setSession(sessionSecret);

    const account = new Account(client);
    const databases = new Databases(client);
    const user = await account.get();

    await account.updatePassword(password);
    await account.updateName(name);

    await databases.createDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
      process.env.NEXT_PUBLIC_APPWRITE_USER_COLLECTION_ID,
      user.$id,
      {
        name,
        email: user.email,
        phone,
        dob,
        location,
        role: "guest",
        kycStatus: "unverified",
      }
    );

    cookies().set("appwrite-session", sessionSecret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
    });

    return { success: true };
  } catch (error) {
    console.error("Complete Signup Error:", error);
    return { error: error.message || "Failed to complete registration." };
  }
}

// --- STANDARD AUTH ---
export async function signupWithAppwrite(formData) {
  const { name, email, password, phone, dob, location } = formData;
  try {
    const { account, databases } = await createAdminClient();
    const userId = ID.unique();
    await account.create(userId, email, password, name);
    const session = await account.createEmailPasswordSession(email, password);

    cookies().set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      expires: new Date(session.expire),
    });

    try {
      await databases.createDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        process.env.NEXT_PUBLIC_APPWRITE_USER_COLLECTION_ID,
        userId,
        {
          name,
          email,
          phone,
          dob,
          location,
          role: "guest",
          kycStatus: "unverified",
        }
      );
    } catch (dbError) {
      console.error("DB Creation failed:", dbError);
      // We don't throw here to avoid failing the whole signup if just profile creation fails
    }
    return { success: true };
  } catch (error) {
    console.error("Signup Action Error:", error);
    let message = error.message || "An unexpected error occurred.";
    if (error.code === 409) {
      if (message.includes("email"))
        message = "This email is already registered.";
      else if (message.includes("phone"))
        message = "This phone number is already registered.";
      else message = "User already exists.";
    }
    return { error: message };
  }
}

export async function signinWithAppwrite(formData) {
  const { email, password } = formData;
  try {
    const { account } = await createAdminClient();
    const session = await account.createEmailPasswordSession(email, password);

    cookies().set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      expires: new Date(session.expire),
    });
    return { success: true };
  } catch (error) {
    return { error: error.message || "Invalid email or password" };
  }
}

export async function logout() {
  try {
    const { account } = await createSessionClient();
    await account.deleteSession("current");
  } catch (error) {
    // Session might be invalid already, just ignore
  }
  // Always delete cookie
  cookies().delete("appwrite-session");
  redirect("/");
}

// --- USER RETRIEVAL ---
export async function getLoggedInUser() {
  try {
    const { account } = await createSessionClient();
    return await account.get();
  } catch (error) {
    return null;
  }
}

export async function getUserProfile() {
  try {
    const { account, databases } = await createSessionClient();
    const authUser = await account.get();
    const userDoc = await databases.getDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
      process.env.NEXT_PUBLIC_APPWRITE_USER_COLLECTION_ID,
      authUser.$id
    );
    return { ...authUser, ...userDoc };
  } catch (error) {
    return null;
  }
}

// --- PASSWORD RECOVERY ---
export async function sendPasswordRecovery(email) {
  try {
    const { account } = await createAdminClient();
    const redirectUrl = process.env.NEXT_PUBLIC_BASE_URL
      ? `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password`
      : "http://localhost:3000/reset-password";

    await account.createRecovery(email, redirectUrl);
    return { success: true };
  } catch (error) {
    console.error("Recovery Error:", error);
    return { error: error.message || "Failed to send recovery email" };
  }
}

export async function confirmPasswordReset(
  userId,
  secret,
  password,
  confirmPassword
) {
  if (password !== confirmPassword) {
    return { error: "Passwords do not match" };
  }
  try {
    const { account } = await createAdminClient();
    await account.updateRecovery(userId, secret, password, confirmPassword);
    return { success: true };
  } catch (error) {
    console.error("Reset Confirm Error:", error);
    return { error: error.message || "Invalid or expired reset link" };
  }
}
