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
import {
  CloudLightningIcon,
  Eye,
  EyeOff,
  QrCodeIcon,
  SendHorizontal,
} from "lucide-react";
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
  const { data: session, update } = useSession();
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
  const handleOtpChange = useCallback(
    async (value: string) => {
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
            toast.success("Code est verifié");
            await update({ twoFactorVerified: true });
            router.push("/admin/dashboard/overview");
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
    },
    [secret, session, update, router]
  );

  /* Handle Login */
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    const res = await signIn("username-only", {
      username: values.username.toLowerCase(),
      password: values.password,
      redirect: false,
    });

    if (res?.error) {
      toast.error(res.error);
      setLoading(false);
    } else {
      await update();
      const session = await getSession();

      if (session?.user.twoFactorEnabled) {
        setIsTwoFactor(true); // Show 2FA modal
        setUser(session.user);
      } else {
        toast.success("Connexion réussie");
        redirect("/admin/dashboard/overview");
      }
      setLoading(false);
    }
  }

  if (loading) {
    return <Loading />;
  }
  return (
    <div className="w-full p-2">
      {isTwoFactor ? (
        <div className="flex justify-center w-full items-center min-h-screen">
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
                  onChange={handleOtpChange} // This will trigger on each change
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
              <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-lg max-w-lg w-full">
                <div className="flex flex-col items-center space-y-6">
                  {/* Message de bienvenue */}
                  <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-slate-100 mb-2">
                      Authentification à Deux Facteurs
                    </h1>
                  </div>

                  {/* Étapes pour télécharger Google Authenticator */}
                  <div className="w-full bg-blue-50 dark:bg-slate-700 p-4 rounded-lg">
                    <ol className="list-decimal list-inside text-sm text-gray-700 dark:text-slate-300 space-y-1">
                      <li>
                        Ouvrez l&apos;App Store (iOS) ou le Play Store (Android)
                      </li>
                      <li>Recherchez &quot;Google Authenticator&quot;</li>
                      <li>Téléchargez et installez l&apos;application</li>
                      <li>
                        Ouvrez l&apos;application et appuyez sur &quot;+&quot;
                      </li>
                      <li>Choisissez &quot;Scanner un code QR&quot;</li>
                    </ol>
                  </div>

                  {/* Section QR Code */}
                  <div className="flex flex-col items-center w-full">
                    {qrImage && (
                      <div className="mb-2 p-2 bg-white rounded border border-gray-200 dark:border-slate-600">
                        <img
                          src={qrImage}
                          alt="Code QR pour 2FA"
                          className="w-36 h-36"
                        />
                      </div>
                    )}
                  </div>

                  {/* Clé secrète */}
                  {secret && (
                    <div className="w-full">
                      <p className="text-sm text-gray-600 dark:text-slate-300 mb-1 text-center">
                        Ou entrez cette clé secrète manuellement :
                      </p>
                      <div className="flex items-center gap-2">
                        <code className="bg-gray-100 dark:bg-slate-700 px-4 py-2 rounded text-xs font-mono break-all flex-1">
                          {secret}
                        </code>
                        <button
                          onClick={() => navigator.clipboard.writeText(secret)}
                          className="p-2 rounded-md bg-gray-200 dark:bg-slate-600 hover:bg-gray-300 dark:hover:bg-slate-500 transition-colors"
                          title="Copier dans le presse-papier"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <rect
                              x="9"
                              y="9"
                              width="13"
                              height="13"
                              rx="2"
                              ry="2"
                            ></rect>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Champ de saisie du code de vérification */}
                  <div className="w-full space-y-2">
                    <label
                      htmlFor="otp"
                      className="block text-sm text-center font-medium text-gray-700 dark:text-slate-300"
                    >
                      Code de Vérification
                    </label>
                    <div className="flex justify-center">
                      <InputOTP
                        maxLength={6}
                        value={value}
                        onChange={handleOtpChange}
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

                  {/* Bouton de soumission */}
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="min-h-screen overflow-hidden flex items-center justify-center ">
          <div className="flex min-h-screen w-full">
            {/* Right Pane */}
            <div className="w-full relative flex items-center justify-center ">
              <div className="max-w-md w-full p-6">
                {/* Sign Up Form */}
                <div className="bg-white dark:bg-slate-800 p-10 rounded-lg shadow-lg">
                  <div className="pb-8">
                    <div className="mt-5 w-full flex items-center justify-center ">
                      <Link href="/" className="lg:flex" prefetch={false}>
                        <img src="/logo.png" alt="" className="w-56 h-auto" />
                      </Link>
                    </div>
                    <div className="w-full flex items-center justify-center mt-4">
                      <div className="border-b-[1px] border border-gray-500 w-full"></div>
                      <div className="text-xs text-gray-500 text-center w-full">
                        Espace Administration{" "}
                      </div>

                      <div className="border-b-[1px] border border-gray-500 w-full"></div>
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
                            <FormLabel>Identifiant</FormLabel>
                            <FormControl>
                              <Input
                                className="dark:bg-slate-900"
                                placeholder="Entrez votre identifiant"
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
                            <FormLabel>Mot de passe</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  className="dark:bg-slate-900"
                                  type={isView ? "text" : "password"}
                                  id="password"
                                  placeholder="Entrez votre mot de passe"
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
                          Soumettre
                        </Button>
                      </div>
                    </form>
                  </Form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
