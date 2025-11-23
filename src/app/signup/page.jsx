"use client";
import SignupForm from "@/components/SignupForm";
import Image from "next/image";
import React from "react";

const page = () => {
  return (
    <div className="max-w-7xl w-full mx-auto flex gap-2 my-2">
      <div className="hidden md:flex justify-center md:basis-3/5">
        <Image
          alt="home image"
          height={"100"}
          width={"700"}
          src={"/homeimage.jpg"}
          className="rounded-lg shadow-xl"
        />
      </div>
      <div className="md:basis-2/5 bg-slate-100 p-4 flex rounded-lg justify-center items-center">
        <SignupForm />
      </div>
    </div>
  );
};

export default page;
