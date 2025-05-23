"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
      setIsCaptchaVerified(true);
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
      <div className="flex flex-col-reverse lg:flex-col">
        <Card className="mb-6 dark:bg-slate-700">
          <CardContent className="p-6 ">
            <h2 className="text-2xl font-bold mb-3">Consignes de sécurité</h2>
            <p className="text-gray-700 mb-2">
              <span className="font-bold">CompliVox</span> est une plateforme de signalement confidentielle conçue
              pour garantir votre anonymat et la protection de vos données,
              conformément à la loi 09-08 relative à la protection des données à
              caractère personnel et aux lois internationales.
            </p>
             <p className="text-gray-700 mb-2">
                Pour renforcer la sécurité de votre démarche, nous vous
                recommandons de suivre ces quelques conseils simples :{" "}
              </p>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-100">
             
              <li>
               Naviguez en toute sécurité : vérifiez que l&apos;icône 🔒 de connexion sécurisée est visible dans votre navigateur.
              </li>
              <li>
               Protégez votre anonymat : si vous souhaitez rester anonyme, ne mentionnez pas d&apos;éléments permettant de vous identifier (nom, adresse, e-mail personnel, etc.).
              </li>
              <li>Utilisez un accès privé : privilégiez une connexion Internet personnelle et un appareil non partagé pour éviter toute trace.</li>
              <li>
                Accédez à CompliVox directement : enregistrez le lien de la plateforme dans vos favoris afin d&apos;éviter les redirections non fiables.
              </li>
             
            </ul>
             <p className="text-gray-700 mt-6">
                 <span className="font-bold">CompliVox</span> est conçu pour vous offrir un espace d&apos;expression fiable, confidentiel et sécurisé. Chaque alerte transmise est traitée dans le strict respect de la réglementation en vigueur.
              </p>
          </CardContent>
        </Card>
     
      <Card className="w-full  dark:bg-slate-700">
        <CardContent className="lg:grid-cols-3 grid-cols-1 grid  gap-4">
          <div className="col-span-2">
             <h2 className="text-2xl font-bold mb-4">Question de sécurité</h2>
            <p className="text-gray-600 mb-2 dark:text-gray-100 ">
              Afin de protéger la plateforme contre toute tentative d&apos;accès
              automatisé ou malveillant,
            </p>
             <p className="text-gray-600 mb-4 dark:text-gray-100 ">
              Merci de saisir la suite de caractères
              affichée dans la zone ci-dessous.
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
                  className="w-full bg-blue-700 text-white hover:bg-blue-800 cursor-pointer"
                >
                  Soumettre
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
       </div>
    </div>
  );
};

export default Captcha;
