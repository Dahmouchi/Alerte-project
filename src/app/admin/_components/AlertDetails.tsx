/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { admin_alert_status_options } from "@/components/filters";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  Calendar,
  ChevronLeft,
  Eye,
  FileAudio,
  FileVideo,
  MapPin,
  MessageCircle,
  MessageCircleMore,
  Paperclip,
  Printer,
  User,
  UserCheck,
  UserRound,
  Users,
  X,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { GetAnalyste, GetResponsable } from "@/actions/user";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { format, toZonedTime } from "date-fns-tz";
import { fr } from "date-fns/locale";
import { CriticalityBadge } from "@/components/CritiqueBadg";
import { AlertChat } from "@/components/alert-chat";
import { useUnreadMessages } from "@/hooks/useUnreadMessages";
import { markMessagesAsRead } from "@/hooks/markMessagesAsRead";
import { AssignAlertAdmin } from "@/actions/alertActions";
import { useSession } from "next-auth/react";
import JustifCard from "@/app/user/_components/justifCard";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { categories } from "@/constants/data";

const AlertDetails = (alert: any) => {
  const al = alert.alert;
  const [analysts, setAnalysts] = useState<any[]>([]);
  const [selectedAnalyst, setSelectedAnalyst] = useState<string>(
    al.assignedAnalyst?.id || ""
  );
  const [responsable, setResponsable] = useState<any[]>([]);
  const [selectedResponsable, setSelectedResponsable] = useState<string>(
    al.assignedResponsable?.id || ""
  );
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenChat, setIsOpenChat] = useState(false);
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleFileClick = (file: any) => {
    setSelectedFile(file);
    setIsModalOpen(true);
  };
  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef });
  const router = useRouter();
  const session = useSession();
  const status = admin_alert_status_options.find(
    (status) => status.value === al?.adminStatus
  );
  // Fetch analysts from API
  useEffect(() => {
    const fetchAnalysts = async () => {
      try {
        const response = await GetAnalyste(); // Adjust API route
        const responses = await GetResponsable(); // Adjust API route
        setAnalysts(response);
        setResponsable(responses);
      } catch (error) {
        console.error("Error fetching analysts:", error);
      }
    };
    fetchAnalysts();
  }, [al]);
  const formatFrenchDate = (isoString: any) => {
    const parisTime = toZonedTime(isoString, "Europe/Paris");
    return format(parisTime, "dd/MM/yyyy à HH:mm", {
      timeZone: "Europe/Paris",
      locale: fr,
    });
  };
  const unreadCount = useUnreadMessages(al.id);

  const handleOpenChat = async () => {
    if (unreadCount > 0) {
      await markMessagesAsRead(al.id);
    }
    setIsOpenChat(true);
  };
  const getStatusStyles = (status: any) => {
    switch (status) {
      case "APPROVED":
        return {
          className:
            "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
          label: "Approuvé",
        };
      case "DECLINED":
        return {
          className:
            "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
          label: "Rejeté",
        };
      case "INFORMATIONS_MANQUANTES":
        return {
          className:
            "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
          label: "Infos manquantes",
        };
      default: // PENDING
        return {
          className:
            "bg-white shadow-md text-gray-800 dark:bg-gray-700 dark:text-gray-300",
          label: "En attente",
        };
    }
  };
  // Handle assigning alert
  const assignAlert = async () => {
    if (!selectedAnalyst) return toast.error("Please select an analyst");

    if (session.data) {
      try {
        const ocp = await AssignAlertAdmin(
          selectedAnalyst,
          selectedResponsable,
          al.id,
          session.data.user.id
        );
        if (ocp) {
          toast.success("Alert assigned successfully!");
          setIsOpen(false);
          router.refresh();
        }
      } catch (error) {
        console.error("Error assigning alert:", error);
      }
    } else {
      toast.error("Error assigning alert");
    }
  };
  return (
    <div>
      <div className="flex items-center gap-4 mb-2 group">
        <button
          onClick={() => router.back()}
          className="flex items-center cursor-pointer gap-2 text-sm font-medium text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
        >
          <ChevronLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
          Retour
        </button>
      </div>
      <div className="space-y-3 mt-4">
        <div
          ref={contentRef}
          className=" relative border pb-12 pt-8 lg:pb-12 lg:p-6 p-2 rounded-lg shadow-md bg-blue-50 dark:bg-slate-900"
        >
          <div className="absolute -top-3 left-4 px-3 py-1 bg-blue-600 rounded-md shadow-sm">
            <h3 className="text-sm font-semibold text-white">
              Détails de l&apos;alerte
            </h3>
          </div>
          <div className="flex items-center lg:justify-start gap-2 px-2  mt-4 justify-between space-y-2">
            <h2 className="lg:text-2xl lg:font-bold font-semibold text-lg tracking-tight">
              Alerte criticité
            </h2>
            <CriticalityBadge level={al.criticite as 1 | 2 | 3 | 4} />
          </div>
          <div className="flex items-center justify-between py-2">
            {status && (
              <div
                className={`flex w-auto items-center px-4 py-1 rounded-md ${status.color}`}
              >
                {status.icon && <status.icon className="mr-2 h-4 w-4" />}
                <span className="font-medium">{status.label}</span>
              </div>
            )}
            <div>
              <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                  <button className="Btn">
                    Assign
                    <svg viewBox="0 0 512 512" className="svg">
                      <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z" />
                    </svg>
                  </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Attribuer une alerte</DialogTitle>
                    <DialogDescription>
                      Sélectionnez un analyste et attribuez-lui cette alerte.
                    </DialogDescription>
                  </DialogHeader>
                  {/* Dropdown for selecting analysts */}
                  <div className="flex flex-col space-y-2">
                    <label htmlFor="analyst">Choisissez un analyste :</label>
                    <select
                      id="analyst"
                      value={selectedAnalyst}
                      onChange={(e) => setSelectedAnalyst(e.target.value)}
                      className="border p-2 rounded-md"
                    >
                      <option value="">Choisissez un analyste :</option>
                      {analysts.map((analyst) => (
                        <option key={analyst.id} value={analyst.id}>
                          {analyst.name} {analyst.prenom}
                        </option>
                      ))}
                    </select>
                    <label htmlFor="analyst">Choisissez un responsable :</label>
                    <select
                      id="analyst"
                      value={selectedResponsable}
                      onChange={(e) => setSelectedResponsable(e.target.value)}
                      className="border p-2 rounded-md"
                    >
                      <option value="">Choisissez un responsable :</option>
                      {responsable.map((responsable) => (
                        <option key={responsable.id} value={responsable.id}>
                          {responsable.name} {responsable.prenom}
                        </option>
                      ))}
                    </select>
                  </div>

                  <DialogFooter className="sm:justify-start">
                    <Button type="button" onClick={assignAlert} className="">
                      Assign Alert
                    </Button>
                    <DialogClose asChild>
                      <Button type="button" variant="secondary">
                        Close
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          {al.adminStatus !== "PANDING" && (
            <div className="grid md:grid-cols-2 gap-4 p-4 bg-white shadow-md dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700">
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Assignation
                </h3>
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Analyste
                    </p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {al.assignedAnalyst?.name}{" "}
                      {al.assignedAnalyst?.prenom || "Non assigné"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Responsable
                </h3>
                <div className="flex items-center gap-3">
                  <UserCheck className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Superviseur
                    </p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {al.assignedResponsable?.name}{" "}
                      {al.assignedResponsable?.prenom || ""}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
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
            <Dialog open={isOpenChat} onOpenChange={setIsOpenChat}>
              <DialogTrigger asChild>
                <div
                  onClick={handleOpenChat}
                  className={`lg:px-10 px-5 absolute bg-blue-700 top-0 right-0 rounded-tr-md rounded-bl-md flex gap-1 font-semibold  py-1 cursor-pointer transition-all duration-300
                    border-t-2 border-l-2 border-blue-600 text-white items-center lg:text-sm text-xs`}
                >
                  Chat Alerte
                  <MessageCircleMore className="w-5 h-5" />
                  {/* Notification badge - only show if unreadCount > 0 */}
                  {unreadCount > 0 && (
                    <span className="absolute -top-2 -left-2">
                      <span className="relative flex size-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full size-4 bg-red-500 items-center justify-center text-white text-xs">
                          {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                      </span>
                    </span>
                  )}
                </div>
              </DialogTrigger>
              <DialogContent className="">
                <DialogHeader>
                  <DialogTitle>Alerte chat</DialogTitle>
                  <DialogDescription>
                    Collaborer à la résolution de cette alerte.
                  </DialogDescription>
                </DialogHeader>
                <div>
                  <AlertChat alertId={al.id} />
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        {al.conlusions &&
          al.conlusions.map((con: any, index: any) => (
            <div key={index}>
              {" "}
              {con.createdBy.role === "ANALYSTE" ? (
                <div>
                  {con.analysteValidation === "APPROVED" ? (
                    <div className="relative">
                      <div className="bg-green-50 dark:bg-slate-850 inverted-radius2 p-6 dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-200 group">
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
                          <div className={``}>
                            {con.valider ? (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="bg-emerald-700 cursor-pointer text-white rounded-full w-6 h-6 font-semibold flex items-center justify-center text-xs">
                                    V
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Valider</p>
                                </TooltipContent>
                              </Tooltip>
                            ) : (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="bg-red-700 cursor-pointer text-white rounded-full w-6 h-6 font-semibold flex items-center justify-center text-xs">
                                    NV
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Attente de validation</p>
                                </TooltipContent>
                              </Tooltip>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : con.analysteValidation === "DECLINED" ? (
                    <div className="relative">
                      <div className="inverted-radius2 z-30 relative p-6 transition-all duration-200 group border bg-red-100 dark:bg-red-600/15 shadow-xl">
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
                          <div className={` flex items-center gap-2`}>
                            {con.valider ? (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="bg-emerald-700 cursor-pointer text-white rounded-full w-6 h-6 font-semibold flex items-center justify-center text-xs">
                                    V
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Valider</p>
                                </TooltipContent>
                              </Tooltip>
                            ) : (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="bg-red-700 cursor-pointer text-white rounded-full w-6 h-6 font-semibold flex items-center justify-center text-xs">
                                    NV
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Attente de validation</p>
                                </TooltipContent>
                              </Tooltip>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="inverted-radius2 z-30 relative p-6 transition-all duration-200 group border dark:bg-blue-600/15 bg-blue-100 shadow-xl">
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
                          <span
                            className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                              getStatusStyles(con.analysteValidation).className
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
                        <div className={``}>
                          {con.valider ? (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="bg-emerald-700 cursor-pointer text-white rounded-full w-6 h-6 font-semibold flex items-center justify-center text-xs">
                                  V
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Valider</p>
                              </TooltipContent>
                            </Tooltip>
                          ) : (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="bg-red-700 cursor-pointer text-white rounded-full w-6 h-6 font-semibold flex items-center justify-center text-xs">
                                  A
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Attente de validation</p>
                              </TooltipContent>
                            </Tooltip>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <JustifCard justif={con} />
              )}
            </div>
          ))}

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
