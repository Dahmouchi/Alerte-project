/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  MapPin,
  Printer,
  ScanBarcode,
  User,
  UserRound,
} from "lucide-react";
import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
const categories = [
  {
    title: "Corruption et atteintes à la probité",
    value: "corruption",
    description:
      "Actes de corruption impliquant des pots-de-vin, des abus de pouvoir ou des relations inappropriées avec des fournisseurs.",
    icon: "🔒",
    exemple: [
      "Un fonctionnaire acceptant un pot-de-vin pour accorder un marché public.",
      "Un employé détournant des fonds en échange d’un traitement de faveur.",
    ],
  },
  {
    title: "Vol, fraude fiscale",
    value: "fraude",
    description:
      "Infractions financières impliquant des fraudes fiscales, abus de confiance et détournement de fonds.",
    icon: "💰",
    exemple: [
      "Une entreprise dissimulant des revenus pour éviter de payer des impôts.",
      "Un employé détournant de l'argent de la caisse de l'entreprise.",
    ],
  },
  {
    title: "Abus de bien social",
    value: "abus",
    description:
      "Utilisation abusive des ressources d'une entreprise à des fins personnelles, conflits d'intérêts et prises illégales d'intérêts.",
    icon: "⚖️",
    exemple: [
      "Un dirigeant utilisant les fonds de l’entreprise pour des dépenses personnelles.",
      "Un employé favorisant une entreprise appartenant à un proche dans un appel d’offres.",
    ],
  },
  {
    title: "Blanchiment d’argent",
    value: "blanchiment",
    description:
      "Processus visant à dissimuler l'origine illicite de fonds en les intégrant dans l'économie légale.",
    icon: "💸",
    exemple: [
      "Un commerçant déclarant de faux revenus pour justifier des fonds d’origine criminelle.",
      "Une entreprise servant de façade pour dissimuler de l'argent provenant d'activités illégales.",
    ],
  },
  {
    title: "Manipulation de cours",
    value: "manipulation",
    description:
      "Pratiques illégales influençant artificiellement le prix des actions ou des actifs financiers.",
    icon: "📉",
    exemple: [
      "Un investisseur diffusant de fausses informations pour faire grimper le prix d’une action.",
      "Une entreprise annonçant de faux résultats financiers pour attirer des investisseurs.",
    ],
  },
  {
    title: "Discrimination et harcèlement",
    value: "discrimination",
    description:
      "Actes de discrimination fondés sur le sexe, l'origine, la religion, ainsi que les comportements de harcèlement moral ou sexuel.",
    icon: "🚫",
    exemple: [
      "Un employeur refusant d’embaucher une personne en raison de son origine.",
      "Un supérieur harcelant un employé avec des remarques déplacées.",
    ],
  },
  {
    title: "Environnement et droits humains",
    value: "environnement",
    description:
      "Infractions environnementales et violations des droits humains telles que la pollution et l'exploitation abusive.",
    icon: "🌍",
    exemple: [
      "Une usine rejetant des déchets toxiques dans une rivière sans respecter les normes.",
      "Une entreprise exploitant illégalement des travailleurs sans respecter leurs droits.",
    ],
  },
  {
    title: "Autre crime",
    value: "autre",
    description:
      "Toutes autres infractions criminelles ne relevant pas des catégories précédentes.",
    icon: "⚠️",
    exemple: [
      "Une organisation impliquée dans un trafic illégal d’objets volés.",
      "Une fraude aux assurances où une personne simule un accident pour obtenir un remboursement.",
    ],
  },
];
const AlertDetails = (alert: any) => {
  const al = alert.alert;

  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef });

  return (
    <div>
      <div className="lg:p-4 space-y-3">
        <div
          ref={contentRef}
          className="bg-white border border-green-500 dark:bg-slate-800 p-6 rounded-lg shadow-md"
        >
          <div className="mt-4 space-y-4">
            {/* Title & Code */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-300">
                  <span className="font-semibold text-slate-800">
                  Titre 
                  </span>
                  :{" "}
                  {al.title}
                </p>
                <p className="text-gray-500 dark:text-gray-300">
                  <span className="font-semibold text-slate-800">
                    Catégorie
                  </span>
                  :{" "}
                  {categories.find((cat) => cat.value === al.category)?.title ||
                    "Unknown"}
                </p>
              </div>
              <div>
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-300">
                  <Calendar size={20} />
                  <span className="font-semibold text-slate-800">
                    {" "}
                    Date de création :{" "}
                  </span>{" "}
                  {new Date(al.createdAt!).toLocaleDateString()}
                </div>
                <div className=" flex items-center gap-2 text-gray-500 dark:text-gray-300">
                  <ScanBarcode size={20} />
                  <span className="font-semibold text-slate-800">
                    Code d&apos;alerte :
                  </span>
                  <span>#{al.code}</span>
                </div>
              </div>
            </div>

            {/* Date & Category */}

            {/* Description */}

            {/* Additional Info */}
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <Calendar size={20} />
                <span>{new Date(al.dateLieu!).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <MapPin size={20} />
                <span>{al.location}</span>
              </div>

              {/* Involved Persons */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <User size={20} />
                  <h3 className="font-semibold">Personnes impliquées:</h3>
                </div>
                {al.persons?.map((person: any, index: any) => (
                  <div
                    key={index}
                    className="flex justify-between shadow items-center bg-slate-100 dark:bg-slate-900 rounded-xl p-2"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-4 border shadow-sm rounded-full bg-white dark:bg-slate-800">
                        <UserRound />
                      </div>
                      <div className="text-gray-600 dark:text-slate-100 font-semibold text-sm">
                        <h1>{person?.nom}</h1>
                        <h1>{person?.prenom}</h1>
                      </div>
                    </div>
                    <Badge className="text-md mr-6 bg-blue-500 text-white">
                      {person?.fonction}
                    </Badge>
                  </div>
                ))}
              </div>
              <div>
                <h1>Type d&apos;alerte</h1>
              </div>
            </div>
          </div>
        </div>

        {/* Print Button */}
        <div className="flex justify-end mt-4">
          <Button
            onClick={() => reactToPrintFn()}
            className="px-5 py-3 text-white bg-green-500 rounded-sm shadow cursor-pointer hover:bg-green-700 focus:ring-4 focus:ring-green-300"
          >
            <Printer />
            Imprimer
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AlertDetails;
