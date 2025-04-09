/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * v0 by Vercel.
 * @see https://v0.dev/t/jIjTsxvV0Nt
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function PasswordInput() {
  const [showPassword, setShowPassword] = useState(false)
  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="password">Password</Label>
      <div className="relative">
        <Input
          id="password"
          type={showPassword ? "text" : "password"}
          placeholder="Enter your password"
          className="pr-10"
        />
        <Button
          variant="ghost"
          size="icon"
          className="absolute bottom-1 right-1 h-7 w-7"
          onClick={() => setShowPassword(!showPassword)}
        >
          <EyeOffIcon className="h-4 w-4" />
          <span className="sr-only">Toggle password visibility</span>
        </Button>
      </div>
    </div>
  )
}

function EyeOffIcon(props:any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
      <line x1="2" x2="22" y1="2" y2="22" />
    </svg>
  )
}