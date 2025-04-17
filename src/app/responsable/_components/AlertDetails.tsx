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
import Link from "next/link";
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
} from "@/actions/responsable-function";
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
const predefinedJustifications = [
  "Manque d'informations",
  "Problème technique",
  "Signalement sans preuve",
  "Non concerné",
  "Autre",
];

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
  const [justification1, setJustification1] = useState("");
  const [urgenceLevel, setUrgenceLevel] = useState("1");
  const unreadCount = useUnreadMessages(al.id);
  const [isOpen, setIsOpen] = useState(false);
  const [open, setOpen] = useState(false);

  const [decision, setDecision] = useState<UserAlertStatus>("APPROVED");
  const reactToPrintFn = useReactToPrint({ contentRef });
  const router = useRouter();
  const status = analyste_alert_status_options.find(
    (status) => status.value === al?.analysteValidation
  );

  useEffect(() => {
    console.log(al);
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
          label: "Approuvé",
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
            "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
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

  // Handle assigning alert
  const sendConclusion = async () => {
    if (session) {
      try {
        setSelectedAnalyst(session.user.id);
        const ocp = await responsableValidation(
          session.user.id,
          al.id,
          al.analysteValidation
        );
        if (ocp) {
          toast.success("Alert assigned successfully!");
          router.refresh();
        }
      } catch (error) {
        console.error("Erreur lors de l'attribution de l'alerte:", error);
      }
    } else {
      toast.error("Erreur lors de l'attribution de l'alerte");
    }
  };
  const removeAnalyste = async () => {
    if (session) {
      setSelectedAnalyst(session?.user.id);
      try {
        const ocp = await removeResponsableAssignment(al.id, session?.user.id);
        if (ocp) {
          setSelectedAnalyst("");
          toast.success("Alert assigned successfully!");
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
          toast.success("Alert assigned successfully!");
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
          className=" relative border pb-12 lg:pb-12 lg:p-6 p-2 rounded-lg shadow-md"
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
          <div className="space-y-2">
            {/* Status and Action Bar */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 p-4 bg-gray-100 dark:bg-slate-800 dark:bg-slate-850 rounded-lg border border-gray-200 dark:border-slate-700 shadow-xs">
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
                          Souhaitez-vous céder l&apos;alerte?
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
                ) : selectedAnalyst === "" ? (
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
                          Prendre en charge cette alerte?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Vous serez désigné comme responsable de cette alerte.
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
                    <User className="h-4 w-4" />
                    <span>
                      Attribuée à {al.assignedResponsable?.name}{" "}
                      {al.assignedResponsable?.prenom}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Assignment Details */}
            {al.adminStatus !== "PANDING" && (
              <div className="grid md:grid-cols-2 gap-4 p-4 bg-gray-100 dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700">
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
                        <Link
                          href={file?.url}
                          target="_blank"
                          className="block"
                        >
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
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <div
                  onClick={handleOpenChat}
                  className={`px-10 absolute bottom-0 right-0 rounded-tl-md flex gap-1 font-semibold py-2 cursor-pointer transition-all duration-300
              bg-transparent border-t-2 border-l-2 border-blue-600 text-blue-600 items-center`}
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
                <div className="bg-white dark:bg-slate-850 p-6 dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-200 group">
                  {/* Header with analyst info and actions */}
                  <div className="flex items-start justify-between gap-4 mb-5">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="h-11 w-11 rounded-full bg-green-50 dark:bg-slate-700 flex items-center justify-center ring-2 ring-green-100 dark:ring-slate-600">
                          <User className="h-5 w-5 text-green-600 dark:text-green-400" />
                        </div>
                        {con.createdBy.id === session?.user.id && (
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

                    {con.createdBy.id === session?.user.id && (
                      <UpdateConclusion task={con} alerte={al} />
                    )}
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
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-slate-700 px-2.5 py-1 rounded-full">
                        {al.recevable === "RECEVALBE"
                          ? "Recevable"
                          : "Non Recevable"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div
                        className={`h-2.5 w-2.5 rounded-full ${
                          getStatusStyles(al.analysteValidation).dotColor
                        }`}
                      />
                      <span
                        className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                          getStatusStyles(al.analysteValidation).className
                        }`}
                      >
                        {getStatusStyles(al.analysteValidation).label}
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
              ) : (
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border-l-4 border-blue-500 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="flex flex-col space-y-4">
                    {/* Section Responsable */}
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-slate-700 flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-blue-600 dark:text-blue-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Responsable
                        </p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {con.createdBy.name} {con.createdBy.prenom}
                        </p>
                      </div>
                    </div>

                    {/* Statut de Décision */}
                    <div className="flex items-center space-x-2">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          getStatusStyles(al.responsableValidation).className
                        }`}
                      >
                        {getStatusStyles(al.responsableValidation).label}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Statut
                      </span>
                    </div>
                    {/* Commentaire */}
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                        Commentaire
                      </p>
                      <p className="text-gray-700 dark:text-gray-300">
                        {con?.content}
                      </p>
                    </div>

                    {/* Date de Validation */}
                    <div className="pt-2 border-t border-gray-100 dark:border-slate-700">
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        Validé le: {formatFrenchDate(con.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        {/* Print Button */}
        {selectedAnalyst === session?.user.id && (
          <div className="relative border lg:p-6 p-4 rounded-lg shadow-md mt-6 bg-card">
            {/* Title Badge */}
            <div className="absolute -top-3 left-4 px-3 py-1 bg-blue-600 rounded-md shadow-sm">
              <h3 className="text-sm font-semibold text-white">
                Traitement d&apos;alertes
              </h3>
            </div>

            {/* Status Sticker */}
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

            {/* Content */}
            <div className="mt-4 space-y-4">
              <p className="text-sm text-muted-foreground">
                Cette section vous permet de valider les alertes après analyse.
                Veuillez vérifier toutes les informations avant confirmation.
              </p>

              <div className="flex justify-end">
                {al.responsableValidation !== "PENDING" ? (
                  <Button variant="default" className="gap-2 bg-emerald-600 hover:bg-emerald-600">
                    <CheckCircle2 className="h-4 w-4" />
                    Validée
                  </Button>
                ) : (
                  <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                      <Button variant="default" className="gap-2 bg-blue-600 hover:bg-blue-800">
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
                            sendConclusion();
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
        )}{" "}
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
