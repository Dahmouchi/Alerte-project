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
import { useEffect, useState } from "react";
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
import { CloudLightningIcon, Eye, EyeOff, QrCodeIcon, SendHorizontal } from "lucide-react";
import Image from "next/image";
import { UserInfo } from "@/actions/user";
const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  password: z.string().min(6, {
    message: "password must be at least 6 characters.",
  }),
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
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      username: "",
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
  }, [session]); // Add session as a dependency

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
  const handleOtpChange = async () => {
    if (value.length === 6) {
      try {
        const token = value;
        const userId = session?.user?.id;
        console.log("sec", secret);
        console.log("sec", token);
        console.log("sec", userId);
        if (!userId) return;

        const response = await axios.post(`/api/2fa/verify`, {
          secret,
          token,
          userId,
        });

        if (response.data.success) {
          toast.success("Code vérifié");

          // Update session after verification
          await update({
            twoFactorVerified: true,
          }); // Refresh session data

          setIsTwoFactor(true);
          console.log(session);
          router.push("/user/dashboard");
        } else {
          console.log(response.data);
          toast.error("Code non vérifié");
          setInvalidOtp(true);
        }
      } catch (error) {
        console.error("Verification error:", error);
        toast.error("Une erreur est survenue");
      }
    }
  };

  /* Handle Login */
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
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
        redirect("/user/dashboard");
      }
      setLoading(false);
    }
  }

  if (loading) {
    return <Loading />;
  }
  return (
    <div className="w-full h-full flex items-center justify-center p-2">
      {isTwoFactor && !loading ? (
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
                  onChange={(value) => setValue(value)}
                >
                  <InputOTPGroup >
                    <InputOTPSlot index={0} className="bg-white dark:bg-slate-900"/>
                    <InputOTPSlot index={1} className="bg-white dark:bg-slate-900"/>
                    <InputOTPSlot index={2} className="bg-white dark:bg-slate-900"/>
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup >
                    <InputOTPSlot index={3} className="bg-white dark:bg-slate-900"/>
                    <InputOTPSlot index={4} className="bg-white dark:bg-slate-900"/>
                    <InputOTPSlot index={5} className="bg-white dark:bg-slate-900"/>
                  </InputOTPGroup>
                </InputOTP>
                {/* OTP Input */}
                <button
                  onClick={handleOtpChange}
                  className="relative bottom-0 mt-4 flex justify-center items-center gap-2 border border-[#000] rounded-xl text-[#FFF] font-bold cursor-pointer bg-[#000] uppercase px-8 py-2 z-10 overflow-hidden ease-in-out duration-700 group hover:text-[#000] hover:bg-[#FFF] active:scale-95 active:duration-0 focus:bg-[#FFF] focus:text-[#000] isolation-auto before:absolute before:w-full before:transition-all before:duration-700 before:hover:w-full before:-left-full before:hover:left-0 before:rounded-full before:bg-[#FFF] before:-z-10 before:aspect-square before:hover:scale-150 before:hover:duration-700"
                >
                  <span className="truncate eaes-in-out duration-300 group-active:-translate-x-96 group-focus:translate-x-96">
                    validate Code
                  </span>
                  <div className="absolute flex flex-row justify-center items-center gap-2 -translate-x-96 eaes-in-out duration-300 group-active:translate-x-0 group-focus:translate-x-0">
                    <div className="animate-spin size-4 border-2 border-[#000] border-t-transparent rounded-full" />
                    Processing...
                  </div>
                  <svg
                    className="fill-[#FFF] group-hover:fill-[#000] group-hover:-translate-x-0 group-active:translate-x-96 group-active:duration-0 group-focus:translate-x-96 group-focus:fill-[#000] ease-in-out duration-700"
                    stroke="currentColor"
                    fill="currentColor"
                    strokeWidth={0}
                    viewBox="0 0 512 512"
                    height={16}
                    width={16}
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="m476.59 227.05-.16-.07L49.35 49.84A23.56 23.56 0 0 0 27.14 52 24.65 24.65 0 0 0 16 72.59v113.29a24 24 0 0 0 19.52 23.57l232.93 43.07a4 4 0 0 1 0 7.86L35.53 303.45A24 24 0 0 0 16 327v113.31A23.57 23.57 0 0 0 26.59 460a23.94 23.94 0 0 0 13.22 4 24.55 24.55 0 0 0 9.52-1.93L476.4 285.94l.19-.09a32 32 0 0 0 0-58.8z" />
                  </svg>
                </button>
              </div>
            </Card>
          ) : (
            <div className="container mx-auto  flex justify-center w-full">
              <Card className=" bg-white p-8 shadow-lg rounded-lg dark:bg-slate-800 ">
                <div className="flex items-center justify-center ">
                  <div className="flex items-center gap-4">
                    <Image
                      src={"/logo.png"}
                      alt="logo"
                      width={300}
                      height={50}
                    />
                  </div>
                </div>
                <div className="flex lg:flex-row flex-col items-center gap-4">
                  {qrImage && (
                    <img
                      src={qrImage}
                      alt="2FA QR Code"
                      className="rounded-lg border-2"
                    />
                  )}
                  <div>
                    <ul className="list-none list-inside mb-4 text-gray-700 dark:text-slate-100">
                      <li className="mb-2">
                        <span className="font-bold">Step 1:</span> Scan the QR
                        Code with your Authenticator app.
                      </li>
                      <li className="mb-2">
                        <span className="font-bold">Step 2:</span> Enter the
                        code below from your app.
                      </li>
                    </ul>
                    <div className="flex items-center justify-center flex-col lg:items-start">
                      <InputOTP
                        maxLength={6}
                        value={value}
                        onChange={(value) => setValue(value)}
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
                      <button
                        onClick={handleOtpChange}
                        className="bg-blue-700 cursor-pointer text-white font-semibold py-2 px-10 rounded-sm my-3"
                      >
                        validate
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>
      ) : (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 lg:w-1/3 bg-white w-full border shadow-lg p-8 rounded-2xl dark:bg-slate-800"
          >
             <div className="text-center">
                    <div className="">
                      <h3 className="text-gray-800 dark:text-white text-xl font-semibold sm:text-3xl">
                        S&apos;identifier
                      </h3>
                    </div>
                  </div>
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Entrer votre username" {...field} className="dark:bg-slate-900"/>
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
                  <FormLabel>Password</FormLabel>
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
                            setIsView(!isView)
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
            <div className="mt-4 text-sm text-slate-600 dark:text-slate-300 text-center">
              <p>
                Vous n&apos;avez pas encore de compte ?{" "}
                <Link
                  href={"/user"}
                  className="text-blue-700 dark:text-white hover:underline font-semibold"
                >
                  Inscrivez-vous
                </Link>
              </p>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
}
