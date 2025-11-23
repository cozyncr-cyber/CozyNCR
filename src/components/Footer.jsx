import { Instagram, Mail } from "lucide-react";
import React from "react";

const Footer = () => {
  return (
    <div className="flex bg-slate-100 justify-between px-4 md:px-8 py-4 rounded-t-md text-xs md:text-sm">
      <div className="flex gap-2">
        <p className="text-slate-600">&copy; 2025 Cozy NCR</p>
        <p className="text-slate-600">Privacy</p>
        <p className="text-slate-600">Terms</p>
        <p className="text-slate-600">Company Details</p>
      </div>

      <div className="flex gap-2 ">
        <p className="text-slate-600">
          <Instagram className="h-5 flex justify-center items-center" />
        </p>
        <p className="text-slate-600">
          <Mail className="h-5 flex justify-center items-center" />
        </p>
      </div>
    </div>
  );
};

export default Footer;
