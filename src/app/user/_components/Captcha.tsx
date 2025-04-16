"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { RefreshCwIcon, Volume2 } from "lucide-react";
import React, { useState } from "react";
import { toast } from "react-toastify";

type CaptchaProps = {
  setIsCaptchaVerified: (value: boolean) => void;
};

const Captcha = ({ setIsCaptchaVerified }: CaptchaProps) => {
  const [captcha, setCaptcha] = useState(generateCaptcha);
  const [userInput, setUserInput] = useState("");
  const [valid, setValid] = useState(false);

  function generateCaptcha() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  function refreshCaptcha() {
    setCaptcha(generateCaptcha());
    setUserInput("");
  }

  function handleCaptchaCheck() {
    if (userInput === captcha) {
      setValid(true);
      toast.success("CAPTCHA vérifié ✅");
    } else {
      toast.error("Code incorrect. Veuillez réessayer.");
      setUserInput("");
    }
  }

  function playCaptchaAudio() {
    const speech = new SpeechSynthesisUtterance(captcha);
    speech.lang = "fr-FR";
    window.speechSynthesis.speak(speech);
  }

  return (
    <div className="">
      <div>
        <Card className="mb-6 dark:bg-slate-700">
          <CardContent className="p-6 ">
            <h2 className="text-lg font-semibold mb-3">Consigne de sécurité</h2>
            <p className="text-gray-700 mb-2">
              Préserver la confidentialité de votre identité et des informations
              contenues dans votre alerte est d&aposune importance capitale.
            </p>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-100 text-sm">
              <li>
                N&apos;indiquez aucune information personnelle si vous souhaitez
                rester anonyme.
              </li>
              <li>
                Vérifiez que vous utilisez une connexion sécurisée (cadenas
                visible).
              </li>
              <li>Ajoutez le lien vers le serveur BKMS® dans vos favoris.</li>
              <li>
                Évitez d&pos;utiliser un réseau d&pos;entreprise car il peut
                être tracé.
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
      <Card className="w-full  dark:bg-slate-700">
        <CardHeader>       
          <h2 className="text-lg font-semibold mb-4">Question de sécurité</h2>
        </CardHeader>
        <CardContent className="lg:grid-cols-3 grid-cols-1 grid  gap-4">
          <div className="col-span-2">
            <p className="text-gray-600 mb-4 dark:text-gray-100 ">
              Afin de protéger le système contre toute attaque électronique,
              veuillez saisir dans la zone de texte la suite de caractères.
            </p>
          </div>
          <div>
            {valid ? (
              <div className="flex items-center flex-col gap-4">
                <p className="text-green-600 font-semibold">
                  CAPTCHA vérifié ✅
                </p>
                <Button
                  className="mt-4 rounded-full bg-green-500 text-white cursor-pointer"
                  onClick={() => setIsCaptchaVerified(true)}
                >
                  Continuer
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 lg:flex-row flex-col">
                  <div className="text-xl font-bold bg-gray-100 dark:bg-slate-900 px-4 py-2 w-full text-center rounded-md h3a">
                    {captcha}
                  </div>
                  <div className="flex gap-2 w-full">
                    
                  <Button onClick={refreshCaptcha} variant="outline">
                    <RefreshCwIcon className="mr-2 h-4 w-4" /> Refresh
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={playCaptchaAudio}
                  >
                    <Volume2 />
                    Écouter le code
                  </Button>
                  </div>
                </div>
                <div>
                  <Input
                    className={`border ${
                      valid ? "border-red-500" : "border-gray-300"
                    }`}
                    type="text"
                    placeholder="Entrez le code"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                  />
                </div>
                <Button
                  onClick={handleCaptchaCheck}
                  className="w-full bg-blue-700 text-white cursor-pointer"
                >
                  Submit
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Captcha;
