"use client";
import SigninForm from "@/components/SigninForm";
import Image from "next/image";

const page = () => {
  return (
    <div className="max-w-7xl w-full mx-auto flex gap-2 my-2">
      <div className="hidden md:flex justify-center md:basis-3/5">
        <Image
          alt="home image"
          height={"100"}
          width={"700"}
          src={"/homeimage2.jpg"}
          className="rounded-lg shadow-xl"
        />
      </div>
      <div className="md:basis-2/5 bg-slate-100 p-4 flex rounded-lg justify-center items-center">
        <SigninForm />
      </div>
    </div>
  );
};

export default page;
