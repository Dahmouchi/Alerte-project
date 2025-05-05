import React from "react";
import UsernameLogin from "../_components/Login";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/nextAuth";
import { redirect } from "next/navigation";
import Header from "../_components/Header";

const Login = async () => {
  const session = await getServerSession(authOptions);

  if (session?.user && session.user.twoFactorVerified) {
    redirect("/analyste/dashboard");
  }

  return (
    <div
      className="w-full relative min-h-screen bg-cover dark:bg-slate-900"
      style={{ backgroundImage: 'url("/bg7.jpg")' }}
    >
      <div className="w-full absolute top-0 z-40">
        <Header session={session} />
      </div>
      <div className="flex items-center justify-center w-full h-full">
        <UsernameLogin />
      </div>
    </div>
  );
};

export default Login;
