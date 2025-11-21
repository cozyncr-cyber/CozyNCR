"use server";

import { createAdminClient } from "@/lib/appwrite";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ID, Permission, Role } from "node-appwrite";

export async function signIn(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // 1. Use Admin client to create a session for the user
  const { account } = await createAdminClient();
  const session = await account.createEmailPasswordSession(email, password);

  // 2. Set the cookie so the browser remembers the user
  cookies().set("appwrite-session", session.secret, {
    path: "/",
    httpOnly: true,
    sameSite: "strict",
    secure: true,
  });

  // 3. Redirect to dashboard
  redirect("/dashboard");
}

export async function signUp(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;
  const phone = formData.get("phone") as string;
  const role = formData.get("role") as string; // 'host' or 'guest'
  const dob = formData.get("dob") as string;

  const { account, databases } = await createAdminClient();

  const userId = ID.unique();

  // create the Auth Account
  await account.create(userId, email, password, name);

  const session = await account.createEmailPasswordSession(email, password);

  await databases.createDocument(
    process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
    process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID!,
    userId,
    {
      fullName: name,
      email: email,
      phone: phone,
      role: role,
      dob: dob,
      isVerified: false,
      kycStatus: "none",
    },
    // 5. Set Permissions: Public can read, only User can update their own
    [Permission.read(Role.any()), Permission.update(Role.user(userId))]
  );

  cookies().set("appwrite-session", session.secret, {
    path: "/",
    httpOnly: true,
    sameSite: "strict",
    secure: true,
  });
}
