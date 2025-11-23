"use server";

import { ID } from "node-appwrite";
import { createAdminClient, createSessionClient } from "@/lib/appwrite";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Query } from "node-appwrite";

export async function signupWithAppwrite(formData: any) {
  const { name, email, password, phone, dob, location } = formData;

  try {
    const { account, databases } = await createAdminClient();

    // 1. Create the Auth Account
    const userId = ID.unique();
    await account.create(userId, email, password, name);

    // 2. Create the Session immediately
    const session = await account.createEmailPasswordSession(email, password);

    // 3. Set the Cookie (Critical for your createSessionClient to work later)
    cookies().set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
      expires: new Date(session.expire),
    });

    // 4. Create the User Document in Database
    // Ensure these ENV variables are set in .env.local
    await databases.createDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_USER_COLLECTION_ID!,
      userId, // Use same ID as Auth Account for easy linking
      {
        name,
        email,
        phone,
        dob,
        location,
        role: "guest", // Default
        kycStatus: "unverified", // Default
      }
    );

    return { success: true };
  } catch (error: any) {
    console.error("Signup Action Error:", error);

    // Return readable errors to the UI
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

export async function getLoggedInUser() {
  try {
    const { account } = await createSessionClient();
    return await account.get();
  } catch (error) {
    // If no session exists, specific Appwrite errors are thrown.
    // We return null to indicate "Not Logged In"
    return null;
  }
}

export async function logout() {
  try {
    const { account } = await createSessionClient();

    // Delete the session from Appwrite
    await account.deleteSession("current");

    // Delete the cookie from the browser
    cookies().delete("appwrite-session");
  } catch (error) {
    console.error("Logout failed", error);
    // Even if Appwrite fails, we force delete the cookie
    cookies().delete("appwrite-session");
  }

  // Redirect to home page after logout
  redirect("/");
}

export async function signinWithAppwrite(formData) {
  const { email, password } = formData;

  try {
    // Init Admin Client
    const { account } = await createAdminClient();

    // Create Session
    const session = await account.createEmailPasswordSession(email, password);

    // Set Cookie securely
    cookies().set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
      expires: new Date(session.expire),
    });

    return { success: true };
  } catch (error) {
    // Return the specific error message from Appwrite if available
    return { error: error.message || "Invalid email or password" };
  }
}

export async function sendPasswordRecovery(email) {
  try {
    const { account } = await createAdminClient();

    await account.createRecovery(
      email,
      process.env.NEXT_PUBLIC_APP_URL
        ? `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`
        : "http://localhost:3000/reset-password"
    );

    return { success: true };
  } catch (error) {
    console.error("Recovery Error:", error);
    return { error: error.message || "Failed to send recovery email" };
  }
}

export async function getUserProfile() {
  try {
    const { account, databases } = await createSessionClient();

    // get the Auth User (to verify session and get ID)
    const authUser = await account.get();

    // get the User Profile Document from Database
    const userDoc = await databases.getDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
      process.env.NEXT_PUBLIC_APPWRITE_USER_COLLECTION_ID,
      authUser.$id
    );

    // (Optional) Get Property Count
    // If you have a properties collection, you can count them here.
    // For now, we will return 0 or fetch it if you have the collection ID ready.
    // const properties = await databases.listDocuments(
    //    process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
    //    process.env.NEXT_PUBLIC_APPWRITE_PROPERTIES_COLLECTION_ID, // You need this env var
    //    [Query.equal("userId", authUser.$id)]
    // );

    // Merge and Return
    return {
      ...authUser, // Contains $id, email, phoneVerification, etc.
      ...userDoc, // Contains location, dob, role, etc.
      // propertyCount: properties.total // Uncomment if using step 3
    };
  } catch (error) {
    // If anything fails (no session, doc not found), return null
    return null;
  }
}
