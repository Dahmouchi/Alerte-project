/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Badge } from "@/components/ui/badge";
import {
  AlertCircle,
  Calendar,
  ChevronLeft,
  Eye,
  FileAudio,
  FileVideo,
  MapPin,
  MessageCircle,
  Paperclip,
  User,
  UserRound,
  Users,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { format, toZonedTime } from "date-fns-tz";
import { fr } from "date-fns/locale";
import MissingInformationSection from "./messing-info";
import JustifCard from "./justifCard";
import { categories } from "@/constants/data";

const AlerteDaitls = (alert: { alert: any }) => {
  const [al, setAl] = useState(alert.alert);
  const router = useRouter();

  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleReload = () => {
    router.refresh();
  };
  const handleFileClick = (file: any) => {
    setSelectedFile(file);
    setIsModalOpen(true);
  };
  const formatFrenchDate = (isoString: any) => {
    const parisTime = toZonedTime(isoString, "Europe/Paris");
    return format(parisTime, "dd/MM/yyyy à HH:mm", {
      timeZone: "Europe/Paris",
      locale: fr,
    });
  };

  const getStatusStyles = (status: any) => {
    switch (status) {
      case "APPROVED":
        return {
          className:
            "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
          label: "Clôturée",
          dotColor: "bg-green-500 ",
        };
      case "DECLINED":
        return {
          className:
            "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
          label: "Rejeté",
          dotColor: "bg-red-500",
        };
      case "INFORMATIONS_MANQUANTES":
        return {
          className:
            "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
          label: "Infos manquantes",
          dotColor: "bg-yellow-500 ",
        };
      default: // PENDING
        return {
          className:
            "bg-white shadow-md text-gray-800 dark:bg-gray-700 dark:text-gray-300",
          label: "En attente",
          dotColor: "bg-gray-500",
        };
    }
  };
  return (
    <div>
      <div className="flex items-center gap-4 mb-8 group">
        <button
          onClick={() => router.back()}
          className="flex items-center cursor-pointer gap-2 text-sm font-medium text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
        >
          <ChevronLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
          Retour
        </button>
      </div>

      <div className=" relative border pb-12 lg:pb-12 lg:p-6 p-2 rounded-lg shadow-md mb-4 bg-blue-50 dark:bg-slate-900">
        <div className="absolute -top-3 left-4 px-3 py-1 bg-blue-600 rounded-md shadow-sm">
          <h3 className="text-sm font-semibold text-white">
            Détails de l&apos;alerte
          </h3>
        </div>

        <div className="mt-4 space-y-4">
          {/* Title & Code */}
          {/* Header Section */}
          <div className="grid md:grid-cols-2 gap-6 p-4 bg-white shadow-md  dark:bg-slate-800 rounded-xl">
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
          <div className="p-4 bg-white shadow-md  dark:bg-slate-800 rounded-xl">
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
            <div className="p-4 bg-white shadow-md  dark:bg-slate-800 rounded-xl">
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

            <div className="p-4 bg-white shadow-md  dark:bg-slate-800 rounded-xl">
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
          <div className="lg:p-4 p-2 bg-white shadow-md  dark:bg-slate-800 rounded-xl">
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
          <div className="p-4 bg-white shadow-md  dark:bg-slate-800 rounded-xl">
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
          {isModalOpen && selectedFile && (
            <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
              <div className="bg-white dark:bg-slate-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto relative">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-white shadow-md dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600"
                >
                  <X className="h-5 w-5" />
                </button>

                <div className="p-6">
                  <h3 className="text-lg font-medium mb-4 dark:text-white">
                    {selectedFile.name || "Fichier joint"}
                  </h3>

                  {selectedFile?.mimeType?.startsWith("image") ||
                  /\.(jpg|jpeg|png|gif|webp)$/i.test(selectedFile?.url) ? (
                    <img
                      src={selectedFile.url}
                      alt={selectedFile.name}
                      className="max-w-full max-h-[70vh] mx-auto"
                    />
                  ) : selectedFile?.mimeType?.startsWith("video") ||
                    /\.(mp4|webm|ogg)$/i.test(selectedFile?.url) ? (
                    <video controls className="w-full">
                      <source
                        src={selectedFile.url}
                        type={selectedFile.mimeType}
                      />
                      Your browser does not support the video tag.
                    </video>
                  ) : selectedFile?.mimeType?.startsWith("audio") ||
                    /\.(mp3|wav|ogg)$/i.test(selectedFile?.url) ? (
                    <audio controls className="w-full">
                      <source
                        src={selectedFile.url}
                        type={selectedFile.mimeType}
                      />
                      Your browser does not support the audio element.
                    </audio>
                  ) : (
                    <div className="flex flex-col items-center justify-center p-8">
                      <Paperclip className="h-16 w-16 text-gray-400 mb-4" />
                      <p className="text-gray-500 dark:text-gray-400">
                        This file type cannot be previewed
                      </p>
                      <a
                        href={selectedFile.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 text-blue-500 hover:underline"
                      >
                        Download file
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          {/* Attachments */}
          {al.files && al.files.length > 0 && (
            <div className="p-4 bg-white shadow-md dark:bg-slate-800 rounded-xl">
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
                      <div
                        onClick={() => handleFileClick(file)}
                        className="block cursor-pointer"
                      >
                        <div className="aspect-square bg-white shadow-md dark:bg-slate-700 rounded-lg overflow-hidden border border-gray-200 dark:border-slate-600">
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
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
      {al.conlusions &&
        al.responsableValidation !== "PENDING" &&
        al.conlusions.map(
          (con: any, index: any) =>
            con.valider && (
              <div key={index}>
                {" "}
                {con.createdBy.role === "ANALYSTE" ? (
                  <div>
                    {con.analysteValidation === "APPROVED" ? (
                      <div className="bg-green-50 inverted-radius2 my-2 dark:bg-slate-850 p-6 dark:bg-green-600/15 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-200 group">
                        {/* Header with analyst info and actions */}
                        <div className="flex items-start justify-between gap-4 mb-5">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <div className="h-11 w-11 rounded-full bg-green-50 dark:bg-slate-700 flex items-center justify-center ring-2 ring-green-100 dark:ring-slate-600">
                                <User className="h-5 w-5 text-green-600 dark:text-green-400" />
                              </div>
                            </div>
                            <div>
                              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Analyste
                              </p>
                              <p className="font-semibold text-gray-900 dark:text-white">
                                {con.createdBy.name} {con.createdBy.prenom}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Status badges */}
                        <div className="flex flex-wrap items-center gap-3 mb-5">
                          <div className="flex items-center gap-2">
                            <div
                              className={`h-2.5 w-2.5 rounded-full ${
                                getStatusStyles(con.analysteValidation).dotColor
                              }`}
                            />
                            <span
                              className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                                getStatusStyles(con.analysteValidation)
                                  .className
                              }`}
                            >
                              {getStatusStyles(con.analysteValidation).label}
                            </span>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="mb-5">
                          <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                            Commentaire
                          </h3>
                          <div className="prose prose-sm dark:prose-invert max-w-none">
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                              {con?.content}
                            </p>
                          </div>
                        </div>

                        {/* Footer */}
                        <div className="pt-4 border-t border-gray-100 dark:border-slate-700 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              Validé le {formatFrenchDate(con.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : con.analysteValidation === "DECLINED" ? (
                      <div className="relative">
                        <div className="inverted-radius2 z-30 relative p-6 transition-all duration-200 group border bg-red-100 dark:bg-red-600/15  shadow-xl">
                          {/* Header with analyst info and actions */}
                          <div className="flex items-start justify-between gap-4 mb-5">
                            <div className="flex items-center gap-3">
                              <div className="relative">
                                <div className="h-11 w-11 rounded-full bg-red-50 dark:bg-slate-700 flex items-center justify-center ring-2 ring-red-100 dark:ring-slate-600">
                                  <User className="h-5 w-5 text-red-600 dark:text-red-400" />
                                </div>
                              </div>
                              <div>
                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                  Analyste
                                </p>
                                <p className="font-semibold text-gray-900 dark:text-white">
                                  #{con.createdBy.id.substring(0, 4)}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Status badges */}
                          <div className="flex flex-wrap items-center gap-3 mb-5">
                            <div className="flex items-center gap-2">
                              <div
                                className={`h-2.5 w-2.5 rounded-full ${
                                  al.recevable === "RECEVALBE"
                                    ? "bg-green-500"
                                    : "bg-red-400"
                                }`}
                              />
                              <span className="text-xs font-medium text-gray-600 dark:text-gray-300 bg-white shadow-xs border dark:bg-slate-700 px-2.5 py-1 rounded-full">
                                {al.recevable === "RECEVALBE"
                                  ? "Recevable"
                                  : "Non Recevable"}
                              </span>
                            </div>
                          </div>
                          {/* Content */}
                          <div className="mb-5">
                            <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                              Commentaire
                            </h3>
                            <div className="prose prose-sm dark:prose-invert max-w-none">
                              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                {con?.content || "Aucun commentaire fourni"}
                              </p>
                            </div>
                            <div className="prose prose-sm dark:prose-invert max-w-none">
                              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                {con?.content1}
                              </p>
                            </div>
                          </div>

                          {/* Footer */}
                          <div className="pt-4 border-t border-gray-100 dark:border-slate-700 flex items-center justify-between w-full">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                Validé le {formatFrenchDate(con.createdAt)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="inverted-radius2 z-30 my-3 relative p-6 transition-all duration-200 group border bg-blue-100 shadow-xl">
                        {/* Header with analyst info and actions */}
                        <div className="flex items-start justify-between gap-4 mb-5">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <div className="h-11 w-11 rounded-full bg-green-50 dark:bg-slate-700 flex items-center justify-center ring-2 ring-green-100 dark:ring-slate-600">
                                <User className="h-5 w-5 text-green-600 dark:text-green-400" />
                              </div>
                            </div>
                            <div>
                              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Analyste
                              </p>
                              <p className="font-semibold text-gray-900 dark:text-white">
                                {con.createdBy.name} {con.createdBy.prenom}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Status badges */}
                        <div className="flex flex-wrap items-center gap-3 mb-5">
                          <div className="flex items-center gap-2">
                            <div
                              className={`h-2.5 w-2.5 rounded-full ${
                                al.recevable === "RECEVALBE"
                                  ? "bg-green-500"
                                  : "bg-gray-400"
                              }`}
                            />
                            <span className="text-xs font-medium text-gray-600 dark:text-gray-300 bg-white shadow-md dark:bg-slate-700 px-2.5 py-1 rounded-full">
                              {al.recevable === "RECEVALBE"
                                ? "Recevable"
                                : "Non Recevable"}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <div
                              className={`h-2.5 w-2.5 rounded-full ${
                                getStatusStyles(con.analysteValidation).dotColor
                              }`}
                            />
                            <span
                              className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                                getStatusStyles(con.analysteValidation)
                                  .className
                              }`}
                            >
                              {getStatusStyles(con.analysteValidation).label}
                            </span>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="mb-5">
                          <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                            Commentaire
                          </h3>
                          <div className="prose prose-sm dark:prose-invert max-w-none">
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                              {con?.content || "Aucun commentaire fourni"}
                            </p>
                          </div>
                        </div>

                        {/* Footer */}
                        <div className="pt-4 border-t border-gray-100 dark:border-slate-700 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              Validé le {formatFrenchDate(con.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <JustifCard justif={con} />
                )}
              </div>
            )
        )}

      {al.status === "INFORMATIONS_MANQUANTES" && al.involved && (
        <MissingInformationSection al={al} onReload={handleReload} />
      )}
    </div>
  );
};

export default AlerteDaitls;
