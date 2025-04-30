/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { getSession, signIn, useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import Loading from "@/components/Loading";
import { Card } from "@/components/ui/card";
import { Eye, EyeOff, QrCodeIcon, SendHorizontal } from "lucide-react";
import Image from "next/image";
import { GetUserByUsername, UpdatePassword, UserInfo } from "@/actions/user";
const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  password: z.string().optional(),
  confirmPassword: z.string().optional(),
});
export default function UsernameLogin() {
  const [isTwoFactor, setIsTwoFactor] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [invalidOtp, setInvalidOtp] = useState(false);
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [qrImage, setQrImage] = useState();
  const [secret, setSecret] = useState<any>();
  const { data: session, update } = useSession(); // Use session and update function
  const router = useRouter();
  const [isView, setIsView] = useState(false);
  const [password, setPassword] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      username: "",
      confirmPassword :"",
    },
  });

  /* Fetch User Info */
  async function fetchUserInfo() {
    if (!session?.user) return;

    setLoading(true);
    try {
      const userData = await UserInfo(session.user.id);
      console.log(userData);
      if (!userData.twoFactorSecret && !userData.qrSecret) {
        await get2faQrCode();
      } else if (!userData.twoFactorSecret && userData.qrSecret) {
        setIsTwoFactor(true);
        const response = await axios.get(`/api/2fa/qrcode/${session.user.id}`);
        if (response.status === 200) {
          setQrImage(response.data.data);
          setSecret(response.data.secret);
        }
      } else {
        setSecret(userData.twoFactorSecret);
        setIsTwoFactor(true);
      }
      setUser(userData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  /* useEffect to Fetch User Data */
  useEffect(() => {
    if (session) {
      console.log(session);
      fetchUserInfo();
    }
  }, [session,secret]); // Add session as a dependency

  /* Generate a QR Code */
  const get2faQrCode = async () => {
    try {
      if (session) {
        const response = await axios.get(`/api/2fa/qrcode/${session.user.id}`);
        if (response.status === 200) {
          setQrImage(response.data.data);
          setSecret(response.data.secret);
        }
      }
    } catch (error) {
      console.error("Error generating QR Code:", error);
    }
  };

  /* Validate OTP Code */
 const handleOtpChange = useCallback(async (value: string) => {
     setValue(value);
     
     // Automatically verify when 6 digits are entered
     if (value.length === 6) {
       setLoading(true);
       try {
         if (!session?.user?.id || !secret) return;
   
         const response = await axios.post(`/api/2fa/verify`, {
           secret,
           token: value,
           userId: session.user.id,
         });
   
         if (response.data.success) {
           toast.success("Code verified");
           await update({ twoFactorVerified: true });
           router.push("/user/dashboard");
         } else {
           toast.error("Invalid verification code");
           setInvalidOtp(true);
           setValue(""); // Clear the input on failure
         }
       } catch (error) {
         console.error("Verification error:", error);
         toast.error("An error occurred during verification");
         setValue(""); // Clear the input on error
       } finally {
         setLoading(false);
       }
     }
   }, [secret, session, update, router]);
 

  /* Handle Login */
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    
    if (password) {
      // This is the new password submission flow
      try {
       if(values.password && values.password === values.confirmPassword){
         // Call your UpdatePassword function
         await UpdatePassword(values.username, values.password);
         toast.success("Password set successfully");
         
         // Now try to sign in with the new password
         const res = await signIn("username-only", {
           username: values.username,
           password: values.password,
           redirect: false,
         });
   
         if (res?.error) {
          toast.error(res.error);
          setLoading(false);
        } else {
          await update(); // Refresh session after login
          const session = await getSession();
    
          if (session?.user.twoFactorEnabled) {
            setIsTwoFactor(true); // Show 2FA modal
            setUser(session.user);
          } else {
            toast.success("Connexion réussie");
            redirect("/responsable/dashboard");
          }
          setLoading(false);
        }
       }else{
        toast.error("Failed to set password");
       }
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to set password");
      } finally {
        setLoading(false);
      }
      return;
    }
  
    if (values.password) {
      // Existing login flow
      const res = await signIn("username-only", {
        username: values.username.toLowerCase(),
        password: values.password,
        redirect: false,
      });
  
      if (res?.error) {
        toast.error(res.error);
        setLoading(false);
      } else {
        await update(); // Refresh session after login
        const session = await getSession();
  
        if (session?.user.twoFactorEnabled) {
          setIsTwoFactor(true); // Show 2FA modal
          setUser(session.user);
        } else {
          toast.success("Connexion réussie");
          redirect("/responsable/dashboard");
        }
        setLoading(false);
      }
    } else {
      try {
        const userN = values.username;
        if (userN) {
          const res = await GetUserByUsername(userN);
          if (res && res.password === null) {
            setPassword(true); // Show password set form
            form.setValue("username", userN);
          } else {
            toast.error("Invalid username or password required");
          }
        }
      } catch (error) {
        console.error("Verification error:", error);
        toast.error("Une erreur est survenue");
      } finally {
        setLoading(false);
      }
    }
  }

  if (loading) {
    return <Loading />;
  }
  return (
    <div className="w-full ">
      {isTwoFactor ? (
        <div className="flex justify-center w-full">
          {user.twoFactorSecret ? (
            <Card className="w-full max-w-md bg-white dark:bg-slate-800 p-8 shadow-lg rounded-lg">
              <div className="flex items-center justify-center ">
                <div className="flex items-center gap-4">
                  <Image src={"/logo.png"} alt="logo" width={300} height={50} />
                </div>
              </div>
              <div className="flex flex-col items-center gap-4">
                <QrCodeIcon className="w-8 h-8 text-muted-foreground" />
                <p className="text-muted-foreground">
                  Enter the code below from your app.
                </p>

                <InputOTP
                  maxLength={6}
                  value={value}
                  onChange={handleOtpChange}  // This will trigger on each change
                  >
                  <InputOTPGroup>
                    <InputOTPSlot
                      index={0}
                      className="bg-white dark:bg-slate-900"
                    />
                    <InputOTPSlot
                      index={1}
                      className="bg-white dark:bg-slate-900"
                    />
                    <InputOTPSlot
                      index={2}
                      className="bg-white dark:bg-slate-900"
                    />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot
                      index={3}
                      className="bg-white dark:bg-slate-900"
                    />
                    <InputOTPSlot
                      index={4}
                      className="bg-white dark:bg-slate-900"
                    />
                    <InputOTPSlot
                      index={5}
                      className="bg-white dark:bg-slate-900"
                    />
                  </InputOTPGroup>
                </InputOTP>
                {/* OTP Input */}
                
              </div>
            </Card>
          ) : (
            <div className="container mx-auto flex justify-center w-full">
            <Card className="bg-white p-8 shadow-lg dark:bg-slate-800 rounded-lg max-w-4xl w-full">
              <div className="flex flex-col items-center space-y-6">
                {/* Logo */}
                <div className="flex items-center gap-4">
                  <Image
                    src={"/logo.png"}
                    alt="logo"
                    width={300}
                    height={50}
                    className="dark:invert"
                  />
                </div>
          
                {/* QR Code and Instructions */}
                <div className="flex lg:flex-row flex-col items-center gap-8 w-full">
                  
                    <div className="flex flex-col items-center">
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-slate-100">Setup Instructions</h3>
                      <ul className="list-none space-y-3 text-gray-700 dark:text-slate-300">
                        <li className="flex items-start">
                          <span className="font-bold mr-2">1.</span>
                          <span>Scan the QR Code with your Authenticator app (Google Authenticator, Authy, etc.)</span>
                        </li>
                        <li className="flex items-start">
                          <span className="font-bold mr-2">2.</span>
                          <span>Or manually enter this secret key into your authenticator app</span>
                        </li>
                        <li className="flex items-start">
                          <span className="font-bold mr-2">3.</span>
                          <span>Enter the 6-digit code from your app below</span>
                        </li>
                      </ul>
                      {secret && (
                        <div className="mt-4 w-full">
                          <p className="text-sm text-gray-600 dark:text-slate-300 mb-1">Secret Key:</p>
                          <div className="flex items-center gap-2">
                            <code className="bg-gray-100 dark:bg-slate-700 px-3 py-2 rounded text-sm font-mono break-all">
                              {secret}
                            </code>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(secret);
                                // Add toast or notification here
                              }}
                              className="p-2 rounded-md bg-gray-200 dark:bg-slate-600 hover:bg-gray-300 dark:hover:bg-slate-500 transition-colors"
                              title="Copy to clipboard"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                              </svg>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  
          
                  {/* Steps and OTP Input */}
                  <div className="flex-1">
                    <div className="space-y-4">
                    {qrImage && (
                      <img
                      src={qrImage}
                      alt="2FA QR Code"
                      className="rounded-lg border-2 border-gray-200 dark:border-slate-600 p-2 w-48 h-48"
                    />
                    )}
          
                      <div className="space-y-4">
                        <div className="flex flex-col items-center lg:items-start">
                          <label htmlFor="otp" className="text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                            Verification Code
                          </label>
                          <InputOTP
                            maxLength={6}
                            value={value}
                            onChange={handleOtpChange}  // This will trigger on each change
                            >
                            <InputOTPGroup>
                              {[...Array(6)].map((_, index) => (
                                <InputOTPSlot
                                  key={index}
                                  index={index}
                                  className="border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 hover:border-gray-400 dark:hover:border-slate-500 transition-colors"
                                />
                              ))}
                            </InputOTPGroup>
                          </InputOTP>
                        </div>
          
                        
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
          )}
        </div>
      ) : (
        <div className="h-screen overflow-hidden flex items-center justify-center ">
          <div className="flex h-screen w-full">
            {/* Left Pane */}
            <div className="hidden lg:flex items-center justify-center flex-1 bg-white text-black">
              <div
                className="w-full text-center h-full bg-cover"
                style={{
                  backgroundImage: 'url("/second.jpg")',
                }}
              >
                {/* SVG Paths here */}
              </div>
            </div>

            {/* Right Pane */}
              <div className="w-full relative lg:w-1/2 flex items-center justify-center">
                {password ? (
                 <div className="max-w-md w-full p-6">
                 <div className="bg-white dark:bg-slate-800 p-10 rounded-lg shadow-lg">
                   <div className="text-center pb-8">
                     <div className="mt-5">
                       <h3 className="text-gray-800 dark:text-white text-xl font-semibold sm:text-2xl">
                         Définir votre mot de passe
                       </h3>
                       <p className="text-gray-600 dark:text-gray-300 mt-2">
                         Veuillez créer un nouveau mot de passe pour votre compte
                       </p>
                     </div>
                   </div>
                   <Form {...form}>
                     <form
                       onSubmit={form.handleSubmit(onSubmit)}
                       className="space-y-8 w-full"
                     >
                       <FormField
                         control={form.control}
                         name="username"
                         render={({ field }) => (
                           <FormItem>
                             <FormLabel>Nom d&apos;utilisateur</FormLabel>
                             <FormControl>
                               <Input
                                 className="dark:bg-slate-900"
                                 disabled
                                 {...field}
                               />
                             </FormControl>
                           </FormItem>
                         )}
                       />
                       <FormField
                         control={form.control}
                         name="password"
                         render={({ field }) => (
                           <FormItem>
                             <FormLabel>Nouveau mot de passe</FormLabel>
                             <FormControl>
                               <div className="relative">
                                 <Input
                                   className="dark:bg-slate-900"
                                   type={isView ? "text" : "password"}
                                   placeholder="Entrez votre nouveau mot de passe"
                                   {...field}
                                 />
                                 {isView ? (
                                   <Eye
                                     className="absolute right-4 top-3 w-4 h-4 z-10 cursor-pointer text-gray-500"
                                     onClick={() => setIsView(!isView)}
                                   />
                                 ) : (
                                   <EyeOff
                                     className="absolute right-4 top-3 w-4 h-4 z-10 cursor-pointer text-gray-500"
                                     onClick={() => setIsView(!isView)}
                                   />
                                 )}
                               </div>
                             </FormControl>
                             <FormMessage />
                           </FormItem>
                         )}
                       />
                       <FormField
                         control={form.control}
                         name="confirmPassword"
                         render={({ field }) => (
                           <FormItem>
                             <FormLabel>Confirmer le mot de passe</FormLabel>
                             <FormControl>
                             <div className="relative">
                                 <Input
                                   className="dark:bg-slate-900"
                                   type={isView ? "text" : "password"}
                                   placeholder="Confirmez votre nouveau mot de passe"
                                   {...field}
                                 />
                                 {isView ? (
                                   <Eye
                                     className="absolute right-4 top-3 w-4 h-4 z-10 cursor-pointer text-gray-500"
                                     onClick={() => setIsView(!isView)}
                                   />
                                 ) : (
                                   <EyeOff
                                     className="absolute right-4 top-3 w-4 h-4 z-10 cursor-pointer text-gray-500"
                                     onClick={() => setIsView(!isView)}
                                   />
                                 )}
                               </div>
                             </FormControl>
                             <FormMessage />
                           </FormItem>
                         )}
                       />
                       <div className="w-full flex items-center justify-start">
                         <Button
                           type="submit"
                           className="w-full rounded-full py-3 bg-blue-700 text-white hover:bg-blue-500 cursor-pointer"
                         >
                           Enregistrer le mot de passe
                         </Button>
                       </div>
                     </form>
                   </Form>
                 </div>
               </div>
                ) : (
                  <div className="max-w-md w-full p-6">
                    {/* Original login form */}
                    <div className="max-w-md w-full p-6">
                      {/* Sign Up Form */}
                      <div className="bg-white dark:bg-slate-800 p-10 rounded-lg shadow-lg">
                        <div className="text-center pb-8">
                          <div className="mt-5">
                            <h3 className="text-gray-800 dark:text-white text-xl font-semibold sm:text-3xl">
                              S&apos;identifier
                            </h3>
                          </div>
                        </div>
                        <Form {...form}>
                          <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-8  w-full "
                          >
                            <FormField
                              control={form.control}
                              name="username"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Username</FormLabel>
                                  <FormControl>
                                    <Input
                                      className="dark:bg-slate-900"
                                      placeholder="Entrer votre username"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="password"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Mot de pass</FormLabel>
                                  <FormControl>
                                    <div className="relative">
                                      <Input
                                        className="dark:bg-slate-900"
                                        type={isView ? "text" : "password"}
                                        id="password"
                                        placeholder="entrer votre mot de pass"
                                        {...field}
                                      />
                                      {isView ? (
                                        <Eye
                                          className="absolute right-4 top-3 w-4 h-4 z-10 cursor-pointer text-gray-500"
                                          onClick={() => {
                                            setIsView(!isView);
                                          }}
                                        />
                                      ) : (
                                        <EyeOff
                                          className="absolute right-4 top-3 w-4 h-4 z-10 cursor-pointer text-gray-500"
                                          onClick={() => setIsView(!isView)}
                                        />
                                      )}
                                    </div>
                                  </FormControl>

                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <div className="w-full flex items-center justify-start">
                              <Button
                                type="submit"
                                className="w-full rounded-full py-3 bg-blue-700 text-white hover:bg-blue-500 cursor-pointer"
                              >
                                Submit
                              </Button>
                            </div>
                          </form>
                        </Form>
                        <div className="w-full flex items-center justify-center mt-4">
                          <div className="border-b-[1px] border border-gray-500 w-full"></div>
                          <div className="text-xs text-gray-500 text-center w-full">
                            Espace Responsable{" "}
                          </div>

                          <div className="border-b-[1px] border border-gray-500 w-full"></div>
                        </div>
                      </div>
                    </div>{" "}
                  </div>
                )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
