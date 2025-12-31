"use server";

import { createAdminClient } from "@/lib/appwrite"; // Optional: verify user exists if needed

export async function submitDataRequest(formData) {
  const name = formData.get("name");
  const email = formData.get("email");
  const message = formData.get("message");

  // Basic Validation
  if (!email || !name) {
    return { error: "Name and Email are required." };
  }

  try {
    // --- TODO: INTEGRATE EMAIL PROVIDER HERE ---
    // Example with Resend/Nodemailer:
    // await sendEmail({
    //   to: "conzyncr@gmail.com",
    //   subject: `Data Request: ${name}`,
    //   text: `User ${email} requested data. Message: ${message}`
    // });

    // For now, we simulate success and log to server console
    console.log("--- NEW DATA REQUEST ---");
    console.log(`From: ${name} <${email}>`);
    console.log(`Message: ${message}`);
    console.log("------------------------");

    return { success: true };
  } catch (error) {
    console.error("Data Request Error:", error);
    return { error: "Failed to submit request. Please try again later." };
  }
}
