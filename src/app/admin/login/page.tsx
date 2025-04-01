import React from "react";
import UsernameLogin from "../_components/Login";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/nextAuth";
import { redirect } from "next/navigation";

const Login = async () => {
  const session = await getServerSession(authOptions);

  if (session?.user && session.user.twoFactorVerified) {
    redirect("/admin/dashboard");
  }

  return (
    <div className="w-full relative h-screen bg-contain dark:bg-slate-950" style={{backgroundImage:'url("/Element.png")'}}>
      <div className="flex items-center justify-center w-full h-full">
        <UsernameLogin />
      </div>
    </div>
  );
};

export default Login;
