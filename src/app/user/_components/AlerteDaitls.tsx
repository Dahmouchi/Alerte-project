/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Badge } from "@/components/ui/badge";
import {
  AlertCircle,
  Calendar,
  Eye,
  FileAudio,
  FileVideo,
  MapPin,
  MessageCircle,
  Paperclip,
  User,
  UserCheck,
  UserRound,
  Users,
} from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
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
const AlerteDaitls = (alert: { alert: any }) => {
  const [al, setAl] = useState(alert.alert);
  return (
    <div>
      <div className=" relative border pb-12 lg:pb-12 lg:p-6 p-2 rounded-lg shadow-md">
        <div className="absolute -top-3 left-4 px-3 py-1 bg-blue-600 rounded-md shadow-sm">
          <h3 className="text-sm font-semibold text-white">
            Détails de l&apos;alerte
          </h3>
        </div>

        
        <div className="mt-4 space-y-4">
          {/* Title & Code */}
          {/* Header Section */}
          <div className="grid md:grid-cols-2 gap-6 p-4 bg-gray-100  dark:bg-slate-800 rounded-xl">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="min-w-[120px]">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Titre
                  </span>
                </div>
                <p className="text-gray-900 dark:text-white font-medium">
                  {al.title}
                </p>
              </div>

              <div className="flex items-start gap-3">
                <div className="min-w-[120px]">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Catégorie
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-900 dark:text-white font-medium">
                    {categories.find((cat) => cat.value === al.category)
                      ?.title || "Unknown"}
                  </span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="min-w-[120px]">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Date de création
                  </span>
                </div>
                <p className="text-gray-900 dark:text-white font-medium">
                  {new Date(al.createdAt!).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="min-w-[120px]">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Code d&apos;alerte
                  </span>
                </div>
                <p className="text-gray-900 dark:text-white font-medium">
                  #{al.code}
                </p>
              </div>
            </div>
          </div>

          {/* Sender Information */}
          <div className="p-4 bg-gray-100  dark:bg-slate-800 rounded-xl">
            <div className="flex items-center gap-3 mb-3">
              <MessageCircle className="h-5 w-5 text-blue-500 dark:text-blue-400" />
              <h3 className="font-medium text-gray-900 dark:text-white">
                Expéditeur
              </h3>
            </div>

            {al.nom ? (
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Nom
                  </span>
                  <p className="font-medium">{al.nom}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Prénom
                  </span>
                  <p className="font-medium">{al.prenom}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Fonction
                  </span>
                  <p className="font-medium">{al.fonction}</p>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">Inconnu</p>
            )}
          </div>

          {/* Date & Location */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-100  dark:bg-slate-800 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <Calendar className="h-5 w-5 text-blue-500 dark:text-blue-400" />
                <h3 className="font-medium text-gray-900 dark:text-white">
                  Date
                </h3>
              </div>
              <p>
                {new Date(al.dateLieu!).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>

            <div className="p-4 bg-gray-100  dark:bg-slate-800 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <MapPin className="h-5 w-5 text-blue-500 dark:text-blue-400" />
                <h3 className="font-medium text-gray-900 dark:text-white">
                  Lieu
                </h3>
              </div>
              <p>{al.location}</p>
            </div>
          </div>

          {/* Involved Persons */}
          <div className="lg:p-4 p-2 bg-gray-100  dark:bg-slate-800 rounded-xl">
            <div className="flex items-center gap-3 mb-4">
              <Users className="h-5 w-5 text-blue-500 dark:text-blue-400" />
              <h3 className="font-medium text-gray-900 dark:text-white">
                Personnes impliquées
              </h3>
            </div>

            <div className="grid md:grid-cols-2 gap-3">
              {al.persons?.map((person: any, index: any) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 bg-white dark:bg-slate-700 rounded-lg border border-gray-200 dark:border-slate-600"
                >
                  {/* Avatar - Always visible */}
                  <div className="flex-shrink-0 mt-1">
                    <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <UserRound className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>

                  {/* Main content - Flex column on mobile */}
                  <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    {/* Name and function - Column layout */}
                    <div className="min-w-0">
                      <h4 className="font-medium text-gray-900 dark:text-white break-words">
                        {person?.prenom} {person?.nom}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400 break-words">
                        {person?.fonction}
                      </p>
                    </div>

                    {/* Badge - Right aligned on desktop, left aligned on mobile */}
                    <div className="sm:self-center">
                      <Badge
                        variant="outline"
                        className="border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 whitespace-normal text-left sm:text-center"
                      >
                        {person?.fonction}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Alert Content */}
          <div className="p-4 bg-gray-100  dark:bg-slate-800 rounded-xl">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="h-5 w-5 text-blue-500 dark:text-blue-400" />
              <h3 className="font-medium text-gray-900 dark:text-white">
                {al.type === "text"
                  ? "Contenu d'alerte"
                  : "Enregistrement audio"}
              </h3>
            </div>

            {al.type === "text" ? (
              <div className="prose prose-sm dark:prose-invert max-w-none bg-white dark:bg-slate-700 p-4 rounded-lg">
                {al.description}
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-700 p-4 rounded-lg">
                <audio controls className="w-full">
                  <source src={al.audioUrl} type="audio/webm" />
                  Votre navigateur ne supporte pas l&Apos;élément audio.
                </audio>
              </div>
            )}
          </div>

          {/* Attachments */}
          {al.files && al.files.length > 0 && (
            <div className="p-4 bg-gray-100  dark:bg-slate-800 rounded-xl">
              <div className="flex items-center gap-3 mb-4">
                <Paperclip className="h-5 w-5 text-blue-500 dark:text-blue-400" />
                <h3 className="font-medium text-gray-900 dark:text-white">
                  Pièces jointes
                </h3>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {al.files.map((file: any, key: any) => {
                  const isImage =
                    file?.mimeType?.startsWith("image") ||
                    /\.(jpg|jpeg|png|gif|webp)$/i.test(file?.url);
                  const isVideo =
                    file?.mimeType?.startsWith("video") ||
                    /\.(mp4|webm|ogg)$/i.test(file?.url);
                  const isAudio =
                    file?.mimeType?.startsWith("audio") ||
                    /\.(mp3|wav|ogg)$/i.test(file?.url);

                  return (
                    <div key={key} className="relative group">
                      <Link href={file?.url} target="_blank" className="block">
                        <div className="aspect-square bg-gray-100 dark:bg-slate-700 rounded-lg overflow-hidden border border-gray-200 dark:border-slate-600">
                          {/* Image Preview */}
                          {isImage && (
                            <div
                              className="w-full h-full bg-cover bg-center"
                              style={{
                                backgroundImage: `url(${
                                  isImage ===
                                    file?.mimeType?.startsWith("image") ||
                                  /\.(png)$/i.test(file?.url)
                                    ? "/document.jpg"
                                    : file?.url
                                })`,
                              }}
                            />
                          )}

                          {/* Video Preview */}
                          {isVideo && (
                            <div className="w-full h-full flex items-center justify-center bg-gray-800">
                              <FileVideo className="h-8 w-8 text-white" />
                            </div>
                          )}

                          {/* Audio Preview */}
                          {isAudio && (
                            <div className="w-full h-full flex items-center justify-center bg-gray-800">
                              <FileAudio className="h-8 w-8 text-white" />
                            </div>
                          )}

                          {/* Overlay */}
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Eye className="h-6 w-6 text-white" />
                          </div>
                        </div>

                        <div className="mt-1 text-xs text-gray-500 dark:text-gray-400 truncate">
                          {file?.name || "Fichier joint"}
                        </div>
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlerteDaitls;
