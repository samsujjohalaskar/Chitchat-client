import React from "react";
import logo from "../media/logo.png"

const Logo = () => {
  return (
    <div className="flex items-center gap-3">
      <img className="h-10 w-10" src={logo} alt="logo" />
      <p className="text-xl font-semibold">Chitchat</p>
    </div>
  );
};

export default Logo;
