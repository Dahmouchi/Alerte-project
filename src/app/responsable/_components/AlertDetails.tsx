/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import {
  admin_alert_status_options,
  analyste_alert_status_options,
} from "@/components/filters";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  AlertOctagon,
  AlertTriangle,
  Calendar,
  CheckCheck,
  CheckCircle2,
  ChevronDown,
  Copy,
  EllipsisVertical,
  Eye,
  FileAudio,
  FilePenLine,
  FileVideo,
  Lock,
  MapPin,
  MessageCircle,
  MessageCircleMore,
  MoreHorizontal,
  Paperclip,
  Pencil,
  Printer,
  Save,
  ScanBarcode,
  Trash2,
  User,
  UserCheck,
  UserPlus,
  UserRound,
  Users,
  X,
  XCircle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React, { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { format, toZonedTime } from "date-fns-tz";
import { fr } from "date-fns/locale";
import { useSession } from "next-auth/react";
import { saveConclusion } from "@/actions/alertActions";
import { AlertChat } from "@/components/alert-chat";
import { useUnreadMessages } from "@/hooks/useUnreadMessages";
import { markMessagesAsRead } from "@/hooks/markMessagesAsRead";

import UpdateConclusion from "./conclusion";
import { UserAlertStatus } from "@prisma/client";
import { CriticalityBadge } from "@/components/CritiqueBadg";
import {
  removeResponsableAssignment,
  ResponsableAssign,
  responsableValidation,
  valideCon,
} from "@/actions/responsable-function";
import JustifCard from "@/app/user/_components/justifCard";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import AnnulerCloture from "@/app/analyste/_components/anullerCloture";
import AdditionalModalComponent from "@/app/analyste/_components/conclusionTwo";
import ValidateButton from "./ValidateButton";
import { categories } from "@/constants/data";


const AlertDetails = (alert: any) => {
  const al = alert.alert;
  const { data: session } = useSession();
  const [selectedAnalyst, setSelectedAnalyst] = useState<string>(
    al.assignedResponsable?.id || ""
  );
  const [recevable, setRecevable] = useState<any>(al.recevable);
  const contentRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [justification, setJustification] = useState("");
  const unreadCount = useUnreadMessages(al.id);
  const [isOpen, setIsOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [isAdditionalModalOpen, setIsAdditionalModalOpen] = useState(false);

  const [decision, setDecision] = useState<UserAlertStatus>("APPROVED");
  const reactToPrintFn = useReactToPrint({ contentRef });
  const router = useRouter();
  const status = analyste_alert_status_options.find(
    (status) => status.value === al?.analysteValidation
  );
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleFileClick = (file: any) => {
    setSelectedFile(file);
    setIsModalOpen(true);
  };
  useEffect(() => {
    const fetchAnalysts = async () => {
      try {
        router.refresh();
        setJustification("");
        setRecevable(al.recevable);
      } catch (error) {
        console.error("Error fetching analysts:", error);
      }
    };
    fetchAnalysts();
  }, []);
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

  const handleOpenChat = async () => {
    if (unreadCount > 0) {
      await markMessagesAsRead(al.id);
    }
    setIsOpen(true);
  };

  const validerConclusion = async (id: any) => {
    if (!session) {
      toast.error("Vous devez être connecté pour cette action");
      return;
    }

    if (!al.conlusions || al.conlusions.length === 0) {
      toast.error("Aucune conclusion trouvée");
      return;
    }

    try {
      // Get the most recent conclusion by creation date
      const latestConclusion = al.conlusions.reduce(
        (prev: any, current: any) => {
          return new Date(prev.createdAt) > new Date(current.createdAt)
            ? prev
            : current;
        }
      );

      if (!latestConclusion.content) {
        toast.error("La conclusion la plus récente n'a pas de contenu");
        return;
      }

      setSelectedAnalyst(session.user.id);

      toast.info(id);
    } catch (error) {
      console.error("Erreur lors de la validation de l'alerte:", error);
      toast.error("Erreur lors de la validation de l'alerte");
    }
  };
  const removeAnalyste = async () => {
    if (session) {
      setSelectedAnalyst(session?.user.id);
      try {
        const ocp = await removeResponsableAssignment(al.id, session?.user.id);
        if (ocp) {
          setSelectedAnalyst("");
          toast.success("Alerte attribuée avec succès !");
          router.refresh();
        }
      } catch (error) {
        console.error("Error assigning alert:", error);
      }
    } else {
      toast.error("Erreur lors de l'attribution de l'alerte");
    }
  };
  const assignAlert = async () => {
    if (!selectedAnalyst && session) {
      setSelectedAnalyst(session?.user.id);
      try {
        const ocp = await ResponsableAssign(session.user.id, al.id);
        if (ocp) {
          messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
          });
          toast.success("Alerte attribuée avec succès !");
          router.refresh();
        }
      } catch (error) {
        console.error("Erreur lors de l'attribution de l'alerte:", error);
      }
    } else {
      toast.error("Erreur lors de l'attribution de l'alerte");
    }
  };
  return (
    <div>
      <div className="space-y-3 mt-4 p-2">
        <div
          ref={contentRef}
          className=" relative border pb-12 pt-8 lg:pb-12 lg:p-6 p-2 rounded-lg shadow-md bg-blue-50  dark:bg-slate-900"
        >
          <div className="absolute -top-3 left-4 px-3 py-1 bg-blue-600 rounded-md shadow-sm">
            <h3 className="text-sm font-semibold text-white">
              Détails de l&apos;alerte
            </h3>
          </div>
          {al.criticite > 0 && (
            <div className="flex items-center lg:justify-start gap-2 px-2  mt-4 justify-between space-y-2">
              <h2 className="lg:text-2xl lg:font-bold font-semibold text-lg tracking-tight">
                Alerte criticité
              </h2>
              <CriticalityBadge level={al.criticite as 1 | 2 | 3 | 4} />
            </div>
          )}
          <div className="space-y-2 mt-4">
            {/* Status and Action Bar */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 p-4 bg-white shadow-md dark:bg-slate-800 dark:bg-slate-850 rounded-lg border border-gray-200 dark:border-slate-700 ">
              {/* Status Badge */}
              {status && (
                <div
                  className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${
                    status.color
                  } ${status.color || "text-white"}`}
                >
                  {status.icon && <status.icon className="mr-2 h-4 w-4" />}
                  {status.label}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
                {selectedAnalyst === session?.user.id ? (
                  // Check if one of the conclusions is validated
                  al.conlusions.some(
                    (conclusion: { valider: boolean }) =>
                      conclusion.valider === true
                  ) ? (
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                      <Lock className="h-4 w-4" />
                      <span className="text-xs">
                        Vous ne pouvez pas céder cette alerte après validation
                        d&apos;une conclusion
                      </span>
                    </div>
                  ) : (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          className="gap-2 border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-800/20"
                        >
                          <CheckCheck className="h-4 w-4" />
                          <span>Attribuée à moi</span>
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Souhaitez-vous céder l&apos;alerte ?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Cette action transférera la responsabilité de cette
                            alerte à un autre analyste.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={removeAnalyste}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            Confirmer
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )
                ) : selectedAnalyst === "" ? (
                  // Only allow assignment if no validated conclusion exists
                  !al.conlusions.some(
                    (conclusion: { valider: boolean }) =>
                      conclusion.valider === true
                  ) ? (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
                          <UserPlus className="h-4 w-4" />
                          <span>Prendre en charge</span>
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Prendre en charge cette alerte ?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                              Vous serez désigné comme responsable du traitement de cette alerte
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={assignAlert}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            Confirmer
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  ) : (
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                      <Lock className="h-4 w-4" />
                      <span>
                        Cette alerte ne peut pas être reprise car une conclusion
                        a été validée
                      </span>
                    </div>
                  )
                ) : (
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                    <User className="h-4 w-4" />
                    <span>
                      Attribuée à {al.assignedAnalyst?.name}{" "}
                      {al.assignedAnalyst?.prenom}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Assignment Details */}
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
          </div>
          <div className="mt-6 space-y-4">
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
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
                      {!con.valider && (
                        <>
                          <div className="absolute top-2 right-2 z-50 rounded-full bg-green-100 p-1">
                            <AnnulerCloture
                              task={con}
                              alerte={al}
                              onClose={() =>
                                setIsAdditionalModalOpen(!isAdditionalModalOpen)
                              }
                            />
                          </div>
                        </>
                      )}
                      <div className="bg-green-50  inverted-radius2 p-6 dark:bg-green-600/15 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-200 group">
                        {/* Header with analyst info and actions */}
                        <div className="flex items-start justify-between gap-4 mb-5">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <div className="h-11 w-11 rounded-full bg-green-50 dark:bg-slate-700 flex items-center justify-center ring-2 ring-green-100 dark:ring-slate-600">
                                <User className="h-5 w-5 text-green-600 dark:text-green-400" />
                              </div>
                              {con.createdBy.id === session?.user.id &&
                                !con.valider && (
                                  <div className="absolute -bottom-1 -right-1 bg-white dark:bg-slate-800 p-1 rounded-full shadow-xs border border-gray-100 dark:border-slate-700">
                                    <Pencil className="h-3 w-3 text-gray-500 dark:text-gray-400" />
                                  </div>
                                )}
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
                          <div className={`flex items-center gap-2`}>
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
                            {selectedAnalyst === session?.user.id &&
                            con.valider ? (
                              <Button
                                variant="default"
                                onClick={() => toast(con.conen)}
                                className="gap-2 bg-emerald-600 hover:bg-emerald-600"
                              >
                                <CheckCircle2 className="h-4 w-4" />
                                Validée
                              </Button>
                            ) : (
                              <ValidateButton con={con} al={al} />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : con.analysteValidation === "DECLINED" ? (
                    <div className="relative">
                      <div className="inverted-radius2 z-30 relative p-6 transition-all duration-200 group border dark:bg-red-600/15 bg-red-100 shadow-xl">
                        {/* Header with analyst info and actions */}
                        <div className="flex items-start justify-between gap-4 mb-5">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <div className="h-11 w-11 rounded-full bg-red-50 dark:bg-slate-700 flex items-center justify-center ring-2 ring-red-100 dark:ring-slate-600">
                                <User className="h-5 w-5 text-red-600 dark:text-red-400" />
                              </div>
                              {con.createdBy.id === session?.user.id &&
                                !con.valider && (
                                  <div className="absolute -bottom-1 -right-1 bg-white dark:bg-slate-800 p-1 rounded-full shadow-xs border border-gray-100 dark:border-slate-700">
                                    <Pencil className="h-3 w-3 text-gray-500 dark:text-gray-400" />
                                  </div>
                                )}
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
                            {selectedAnalyst === session?.user.id &&
                              al.status !== "TRAITE" && (
                                <div className="flex justify-end">
                                  {con.valider ? (
                                    <Button
                                      variant="default"
                                      className="gap-2 bg-emerald-600 hover:bg-emerald-600"
                                    >
                                      <CheckCircle2 className="h-4 w-4" />
                                      Validée
                                    </Button>
                                  ) : (
                                    <ValidateButton con={con} al={al} />
                                  )}
                                </div>
                              )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="inverted-radius2 z-30 relative p-6 transition-all duration-200 group border bg-blue-100 shadow-xl">
                      {/* Header with analyst info and actions */}
                      <div className="flex items-start justify-between gap-4 mb-5">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className="h-11 w-11 rounded-full bg-green-50 dark:bg-slate-700 flex items-center justify-center ring-2 ring-green-100 dark:ring-slate-600">
                              <User className="h-5 w-5 text-green-600 dark:text-green-400" />
                            </div>
                            {con.createdBy.id === session?.user.id &&
                              !con.valider && (
                                <div className="absolute -bottom-1 -right-1 bg-white dark:bg-slate-800 p-1 rounded-full shadow-xs border border-gray-100 dark:border-slate-700">
                                  <Pencil className="h-3 w-3 text-gray-500 dark:text-gray-400" />
                                </div>
                              )}
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
                        <div className={`flex items-center gap-2`}>
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
                          {selectedAnalyst === session?.user.id &&
                            al.status !== "TRAITE" && (
                              <div className="flex justify-end">
                                {con.valider ? (
                                  <Button
                                    variant="default"
                                    className="gap-2 bg-emerald-600 hover:bg-emerald-600"
                                  >
                                    <CheckCircle2 className="h-4 w-4" />
                                    Validée
                                  </Button>
                                ) : (
                                  <ValidateButton con={con} al={al} />
                                )}
                              </div>
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
        {/* Print Button 
        {selectedAnalyst === session?.user.id && al.conlusions.length > 0 && (
          <div className="relative border lg:p-6 p-4 rounded-lg shadow-md mt-6 bg-card">
            <div className="absolute -top-3 left-4 px-3 py-1 bg-blue-600 rounded-md shadow-sm">
              <h3 className="text-sm font-semibold text-white">
                Traitement d&apos;alertes
              </h3>
            </div>

            {al.responsableValidation === "PENDING" ? (
              <Badge
                variant="outline"
                className="absolute -top-3 right-4 gap-1 bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300"
              >
                <AlertCircle className="h-3 w-3" />
                <span>En attente de validation</span>
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="absolute -top-3 right-4 gap-1 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300"
              >
                <CheckCircle2 className="h-3 w-3" />
                <span>Validée</span>
              </Badge>
            )}

            <div className="mt-4 space-y-4">
              <p className="text-sm text-muted-foreground">
                Cette section vous permet de valider les alertes après analyse.
                Veuillez vérifier toutes les informations avant confirmation.
              </p>

              <div className="flex justify-end">
                {al.responsableValidation !== "PENDING" ? (
                  <Button
                    variant="default"
                    className="gap-2 bg-emerald-600 hover:bg-emerald-600"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Validée
                  </Button>
                ) : (
                  <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="default"
                        className="gap-2 bg-blue-600 hover:bg-blue-800"
                      >
                        <CheckCircle2 className="h-4 w-4 " />
                        Valider
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Confirmer la validation</DialogTitle>
                        <DialogDescription>
                          Êtes-vous sûr de vouloir valider ces alertes? Cette
                          action enverra les alertes au responsable final.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => setOpen(false)}
                        >
                          Annuler
                        </Button>
                        <Button
                          variant="default"
                          className="bg-blue-600 hover:bg-blue-800"
                          onClick={() => {
                            // Add your validation logic here
                            validerConclusion(123);
                            setOpen(false);
                          }}
                        >
                          Confirmer
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </div>
          </div>
        )}*/}
        <div className="flex justify-end mt-4" ref={messagesEndRef}>
          <Button
            onClick={() => reactToPrintFn()}
            className="px-5 py-3 text-white bg-green-500 rounded-sm shadow cursor-pointer hover:bg-green-700 focus:ring-4 focus:ring-green-300"
          >
            <Printer />
            Imprimer
          </Button>
        </div>
      </div>
      <div ref={messagesEndRef}></div>
    </div>
  );
};

export default AlertDetails;
