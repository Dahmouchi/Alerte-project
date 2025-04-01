"use client"
import { useRouter } from "next/navigation";
/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/access-denied.js

import {  useEffect, useState } from "react";
enum Role {
    USER = "USER",
    ADMIN = "ADMIN",
    ANALYSTE = "ANALYSTE",
    RESPONSABLE = "RESPONSABLE",
  }

const AccessDenied = (role:any) => {
  const [url,setUrl] = useState("");


  useEffect(()=>{
    switch (role.role) {
        case Role.USER:
          setUrl("/user/dashboard");
          break;
        case Role.ADMIN:
          setUrl("/admin/dashboard");
          break;
        case Role.ANALYSTE:
          setUrl("/analyst/dashboard");
          break;
        case Role.RESPONSABLE:
          setUrl("/responsable/dashboard");
          break;
        default:
          setUrl("/access-denied");
          break;
      }
  },[role])

  const router = useRouter();
  const red = ()=>{
       router.push(url)
  }
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="text-center bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-semibold text-red-600">Access Denied</h1>
        <p className="mt-4 text-lg">
          You do not have the necessary permissions to access this page.
        </p>
        {role && (
          <p className="mt-2 text-gray-700">
            Required Role: <strong>{role.role}</strong>
          </p>
        )}
        <button
         onClick={red}
          className="mt-4 cursor-pointer px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500"
        >
          Go to Login
        </button>
      </div>
    </div>
  );
};

export default AccessDenied;
