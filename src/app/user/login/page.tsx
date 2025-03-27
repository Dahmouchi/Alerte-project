import React from "react";
import UsernameLogin from "../_components/Login";
import Header from "../_components/Header";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/nextAuth";
import { redirect } from "next/navigation";

const Login = async () => {
  const session = await getServerSession(authOptions);

  if (session?.user && session.user.twoFactorVerified) {
    redirect("/user/dashboard");
  }

  return (
    <div className="w-full relative min-h-screen bg-contain dark:bg-slate-950" style={{backgroundImage:'url("/Element.png")'}}>
      <div className="w-full absolute top-0">
        <Header session={session}/>
      </div>
      <div className="flex items-center justify-center w-full h-full">
        <UsernameLogin />
      </div>
    </div>
  );
};

export default Login;
