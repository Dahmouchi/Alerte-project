/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Header from "@/app/analyste/_components/Header";
import { authOptions } from "@/lib/nextAuth";
import { getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import React from "react";
enum Role {
  USER = "USER",
  ADMIN = "ADMIN",
  ANALYSTE = "ANALYSTE",
  RESPONSABLE = "RESPONSABLE",
}
const SusponsionPage = async (role: any) => {
  const session = await getServerSession(authOptions);
  return (
    <div>
      <Header session={session} />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-700">
          {/* Header with warning icon */}
          <div className="bg-red-50 dark:bg-red-900/30 p-6 flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-red-600 dark:text-red-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 text-center">
              Compte Suspendu
            </h1>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            <p className="text-slate-600 dark:text-slate-300 text-center">
              Votre compte a été temporairement suspendu en raison
              d&apos;activités inhabituelles ou d&apos;une violation de nos
              conditions d&apos;utilisation.
            </p>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 dark:border-yellow-600 p-4 rounded-r">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-yellow-500 dark:text-yellow-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    <span className="font-medium">Raison possible :</span>{" "}
                    Activité suspecte détectée le{" "}
                    {new Date().toLocaleDateString("fr-FR")}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium text-slate-800 dark:text-slate-200">
                Prochaines étapes :
              </h3>
              <ul className="list-disc pl-5 space-y-1 text-slate-600 dark:text-slate-400">
                <li>Contactez notre support pour plus d&apos;informations</li>
                <li>Vérifiez vos emails pour des instructions</li>
                <li>Ne tentez pas de créer un nouveau compte</li>
              </ul>
            </div>
          </div>

          {/* Actions */}
          <div className="px-6 py-4 bg-slate-50 dark:bg-slate-700/50 flex flex-col sm:flex-row justify-between gap-3">
            <button className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
              Comprendre les raisons
            </button>
            <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              Contacter le support
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-slate-500 dark:text-slate-400 text-sm">
          <p>© {new Date().getFullYear()} Complirisk. Tous droits réservés.</p>
        </div>
      </div>
    </div>
  );
};

export default SusponsionPage;
