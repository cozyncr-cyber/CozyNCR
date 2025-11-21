import React from "react";
import { signIn, signUp } from "@/actions/auth";

const SignupForm = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-900 p-6">
      <div className="w-full max-w-md bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-700">
        <h1 className="text-2xl font-bold text-white mb-6">Create Account</h1>

        <form action={signUp} className="space-y-4">
          <input
            name="name"
            placeholder="Full Name"
            required
            className="w-full bg-gray-700 text-white rounded p-2"
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            className="w-full bg-gray-700 text-white rounded p-2"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            required
            className="w-full bg-gray-700 text-white rounded p-2"
          />

          <input
            name="phone"
            placeholder="Phone Number"
            required
            className="w-full bg-gray-700 text-white rounded p-2"
          />

          <div className="flex gap-4 text-white">
            <label className="flex items-center gap-2">
              <input type="radio" name="role" value="guest" defaultChecked />{" "}
              Guest
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="role" value="host" /> Host
            </label>
          </div>

          <label className="block text-sm text-gray-400">Date of Birth</label>
          <input
            name="dob"
            type="date"
            required
            className="w-full bg-gray-700 text-white rounded p-2"
          />

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-2 rounded mt-4"
          >
            Sign Up
          </button>
        </form>
      </div>
    </main>
  );
};

export default SignupForm;
