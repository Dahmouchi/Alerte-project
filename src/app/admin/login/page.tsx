/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import Loading from "@/components/Loading";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import DarkModeSwitcher from "@/components/DarkModeSwitcher";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
     
    } catch (err) {
      setError("An error occurred during sign-in.");
    }
  };
  const login = async () => {
    try {
      const res = await signIn("google");
      console.log(res);
    } catch (error) {}
  };
  const { data: session } = useSession();
  console.log(session);

if(session?.user != null){
  redirect("/admin/dashboard")
}

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="h-screen overflow-hidden flex items-center justify-center bg-slate-100">
      <div className="flex h-screen w-full">
        {/* Left Pane */}
        <div className="hidden lg:flex items-center justify-center flex-1 bg-white text-black">
          <div
            className="w-full text-center h-full bg-cover"
            style={{
              backgroundImage: 'url("/login.jpg")',
            }}
          >
            {/* SVG Paths here */}
          </div>
        </div>

        {/* Right Pane */}
        <div className="w-full relative bg-slate-100 dark:bg-slate-700 lg:w-1/2 flex items-center justify-center ">
      
          <div className="max-w-md w-full p-6">
          
            {/* Sign Up Form */}
            <div className="bg-white dark:bg-slate-900 p-10 rounded-lg shadow-lg">
              <div className="text-center pb-8">
                <div className="mt-5">
                  <h3 className="text-gray-800 dark:text-white text-xl font-semibold sm:text-3xl">
                    S&apos;identifier
                  </h3>
                </div>
              </div>
              <form onSubmit={handleSubmit} className="space-y-2 ">
                <div>
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-100"
                  >
                    Email
                  </label>
                  <input
                    type="text"
                    id="email"
                    name="email"
                    required
                    placeholder="entrer votre email"
                    onChange={handleChange}
                    className="w-full mt-2 px-3 text-sm py-3 dark:text-gray-200  text-slate-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-100"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    required
                    name="password"
                    placeholder="entrer votre mot de pass..."
                    onChange={handleChange}
                    className="w-full mt-2 px-3  text-sm py-3 dark:text-gray-200 text-slate-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                  />
                </div>
                <div>
                  <button
                    type="submit"
                    className="w-full px-4 py-2 mt-4 text-white cursor-pointer font-medium bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-600 rounded-lg duration-150"
                  >
                    Log In
                  </button>
                </div>
              </form>
              <button
                onClick={login}
                className="w-full cursor-pointer shadow-sm dark:bg-slate-800 dark:hover:bg-slate-950 my-4 flex items-center justify-center gap-x-3 py-2.5 border rounded-lg text-sm font-medium hover:bg-gray-50 duration-150 active:bg-gray-100"
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 48 48"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clipPath="url(#clip0_17_40)">
                    <path
                      d="M47.532 24.5528C47.532 22.9214 47.3997 21.2811 47.1175 19.6761H24.48V28.9181H37.4434C36.9055 31.8988 35.177 34.5356 32.6461 36.2111V42.2078H40.3801C44.9217 38.0278 47.532 31.8547 47.532 24.5528Z"
                      fill="#4285F4"
                    />
                    <path
                      d="M24.48 48.0016C30.9529 48.0016 36.4116 45.8764 40.3888 42.2078L32.6549 36.2111C30.5031 37.675 27.7252 38.5039 24.4888 38.5039C18.2275 38.5039 12.9187 34.2798 11.0139 28.6006H3.03296V34.7825C7.10718 42.8868 15.4056 48.0016 24.48 48.0016Z"
                      fill="#34A853"
                    />
                    <path
                      d="M11.0051 28.6006C9.99973 25.6199 9.99973 22.3922 11.0051 19.4115V13.2296H3.03298C-0.371021 20.0112 -0.371021 28.0009 3.03298 34.7825L11.0051 28.6006Z"
                      fill="#FBBC04"
                    />
                    <path
                      d="M24.48 9.49932C27.9016 9.44641 31.2086 10.7339 33.6866 13.0973L40.5387 6.24523C36.2 2.17101 30.4414 -0.068932 24.48 0.00161733C15.4055 0.00161733 7.10718 5.11644 3.03296 13.2296L11.005 19.4115C12.901 13.7235 18.2187 9.49932 24.48 9.49932Z"
                      fill="#EA4335"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_17_40">
                      <rect width="48" height="48" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
                Continue with Google
              </button>
              
              <div className="mt-4 text-sm text-gray-600 text-center dark:text-gray-100">
                <p>
                  You don&apos;t have an account?{" "}
                  <Link
                    href={"/affiliate/register"}
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    Register here
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
