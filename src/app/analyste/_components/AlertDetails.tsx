/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { admin_alert_status_options } from "@/components/filters";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  AlertOctagon,
  AlertTriangle,
  Calendar,
  CheckCheck,
  CheckCircle2,
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
  Printer,
  ScanBarcode,
  Trash2,
  User,
  UserRound,
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
import {
  analysteAssign,
  removeAnalysteAssignment,
  saveConclusion,
} from "@/actions/alertActions";
import { AlertChat } from "@/components/alert-chat";
import { useUnreadMessages } from "@/hooks/useUnreadMessages";
import { markMessagesAsRead } from "@/hooks/markMessagesAsRead";
import { CriticalityBadge } from "@/components/CritiqueBadg";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import DeleteConclusion from "./delete-conclusion";
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
    al.assignedAnalyst?.id || ""
  );
  const [recevable, setRecevable] = useState<any>(al.recevable);
  const contentRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [justification, setJustification] = useState("");
  const [urgenceLevel, setUrgenceLevel] = useState("1");
  const unreadCount = useUnreadMessages(al.id);
  const [isOpen, setIsOpen] = useState(false);
 const [showDeleteDialog, setShowDeleteDialog] =
    React.useState<boolean>(false);
  const reactToPrintFn = useReactToPrint({ contentRef });
  const router = useRouter();
  const status = admin_alert_status_options.find(
    (status) => status.value === al?.adminStatus
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
  }, [showDeleteDialog]);
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
            "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
          label: "En attente",
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
        setSelectedAnalyst(session.user.id)
        const ocp = await saveConclusion(session.user.id, justification,al.id,recevable,urgenceLevel);
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
    try {
      const ocp = await removeAnalysteAssignment(al.id);
      if (ocp) {
        setSelectedAnalyst("");
        toast.success("Alert assigned successfully!");
        router.refresh();
      }
    } catch (error) {
      console.error("Error assigning alert:", error);
    }
  };
  const assignAlert = async () => {
    if (!selectedAnalyst && session) {
      setSelectedAnalyst(session?.user.id);
      try {
        const ocp = await analysteAssign(session.user.id, al.id);
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
      <div className="space-y-3 mt-2">
        <div
          ref={contentRef}
          className="bg-white relative border border-blue-600 dark:bg-slate-800 p-6 rounded-lg shadow-md"
        >
         
          <div className="flex items-center justify-between py-2 flex-col lg:flex-row gap-2">
            {status && (
              <div
                className={`flex w-full lg:w-auto items-center px-4 py-1 rounded-md ${status.color}`}
              >
                {status.icon && <status.icon className="mr-2 h-4 w-4" />}
                <span className="font-medium">{status.label}</span>
              </div>
            )}
            {selectedAnalyst === session?.user.id ? (
              <div className="">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <div
                      className={`px-10 rounded-md w-full flex gap-1 font-semibold py-2 cursor-pointer transition-all duration-300
                                  bg-transparent  border-2 border-blue-600 text-blue-600 `}
                    >
                      Attribuée
                      <CheckCheck />
                    </div>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Souhaitez-vous céder l&pos;alerte?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Êtes-vous absolument sûr ?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Non</AlertDialogCancel>
                      <AlertDialogAction
                        className="cursor-pointer bg-blue-700 hover:bg-blue-900"
                        onClick={removeAnalyste}
                      >
                        Oui
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            ) : selectedAnalyst === "" ? (
              <div className="">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <div
                      className={`px-10 rounded-md flex gap-1 font-semibold py-2 cursor-pointer transition-all duration-300
                  bg-blue-600 text-white`}
                    >
                      Prendre en charge
                    </div>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Souhaitez-vous prendre en charge l&apos;alerte?
                      </AlertDialogTitle>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Non</AlertDialogCancel>
                      <AlertDialogAction
                        className="cursor-pointer bg-blue-700 hover:bg-blue-900"
                        onClick={assignAlert}
                      >
                        Oui
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            ) : (
              <div
                className={`px-10 rounded-md flex gap-1 font-semibold py-2 cursor-no-drop transition-all duration-300 bg-transparent  border-2 border-blue-600 text-blue-600 `}
              >
                Attribuée à M.{al.assignedAnalyst.name}
                <CheckCheck />
              </div>
            )}
          </div>
          {al.adminStatus !== "PANDING" && (
            <div>
              <p className="text-gray-500 dark:text-gray-300">
                <span className="font-semibold text-slate-800">
                  Attribuer à
                </span>
                :{" "}
              </p>
              <p className="text-gray-500 dark:text-gray-300">
                <span className="font-semibold text-slate-800">Analiste</span>:{" "}
                {al.assignedAnalyst && al.assignedAnalyst.name}{" "}
                {al.assignedAnalyst && al.assignedAnalyst.prenom}
              </p>
              <p className="text-gray-500 dark:text-gray-300">
                <span className="font-semibold text-slate-800">
                  Responsalbe
                </span>
                : {al.assignedResponsable && al.assignedResponsable.name}{" "}
                {al.assignedResponsable && al.assignedResponsable.prenom}
              </p>
            </div>
          )}
          <div className="mt-4  space-y-4">
            {/* Title & Code */}
            <div className="flex lg:items-center lg:justify-between lg:flex-row flex-col">
              <div>
                <p className="text-gray-500 dark:text-gray-300">
                  <span className="font-semibold text-slate-800">Titre</span>:{" "}
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
            <div>
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 mb-2">
                <MessageCircle size={20} />
                Expéditeur :
              </div>
              {al.nom ? (
                <div className="ml-8 space-y-1">
                  <p>Nom : {al.nom}</p>
                  <p>Prènom : {al.prenom}</p>
                  <p>Fonction : {al.fonction}</p>
                </div>
              ) : (
                <p>Inconnu</p>
              )}
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <Calendar size={20} />
                La date :
                <span>{new Date(al.dateLieu!).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <MapPin size={20} />
                Lieu :<span>{al.location}</span>
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
                    className="flex justify-between lg:flex-row flex-col shadow gap-1 items-center bg-slate-100 dark:bg-slate-900 rounded-xl p-2"
                  >
                    <div className="flex items-center lg:flex-row flex-col gap-2 lg:gap-4">
                      <div className="p-4 border shadow-sm rounded-full bg-white dark:bg-slate-800">
                        <UserRound />
                      </div>
                      <div className="text-gray-600 dark:text-slate-100 font-semibold text-sm">
                        <h1>{person?.nom}</h1>
                        <h1>{person?.prenom}</h1>
                      </div>
                    </div>
                    <Badge className="text-md lg:mr-6 bg-blue-500 text-white">
                      {person?.fonction}
                    </Badge>
                  </div>
                ))}
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-300">
                  <span className="font-semibold text-slate-800">
                    Type d&apos;alerte
                  </span>
                  : {al.type === "text" ? "Text" : "Audio"}
                </p>
              </div>
              <div>
                <div className="text-gray-500 dark:text-gray-300">
                  <span className="font-semibold text-slate-800">
                    Contenu d&apos;alerte
                  </span>
                  :{" "}
                  {al.type === "text" ? (
                    al.description
                  ) : (
                    <audio controls className="mt-2">
                      <source src={al.audioUrl} type="audio/webm" />
                      Your browser does not support the audio element.
                    </audio>
                  )}
                </div>
              </div>
              <p className="text-gray-500 dark:text-gray-300">
                <span className="font-semibold text-slate-800">
                  Pièces jointes
                </span>
                :{" "}
              </p>
              {al.files && (
                <div className="flex flex-wrap gap-2 py-2">
                  {al.files.map((file: any, key: any) => {
                    // Determine file type from its URL or MIME type
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
                      <div
                        key={key}
                        className="relative w-20 h-20 rounded-md border-[1px] overflow-hidden shadow-md"
                      >
                        <Link href={file?.url} target="_blank">
                          {/* Render Image */}
                          {isImage && (
                            <div
                              className="w-full h-full bg-cover bg-center "
                              style={{ backgroundImage: `url(${file?.url})` }}
                            />
                          )}

                          {/* Render Video */}
                          {isVideo && (
                            <video
                              className="w-full h-full object-cover"
                              controls
                            >
                              <source
                                src={file?.url}
                                type={file?.mimeType || "video/mp4"}
                              />
                            </video>
                          )}

                          {/* Render Audio */}
                          {isAudio && (
                            <div className="flex items-center justify-center w-full h-full bg-gray-800">
                              <FileAudio className="text-white w-8 h-8" />
                            </div>
                          )}

                          {/* Overlay with Eye Icon */}
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                            {isImage ? (
                              <Eye className="text-white w-6 h-6" />
                            ) : isVideo ? (
                              <FileVideo className="text-white w-6 h-6" />
                            ) : (
                              <FileAudio className="text-white w-6 h-6" />
                            )}
                          </div>
                        </Link>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
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
        {selectedAnalyst === session?.user.id && (
          <div>
           
           {al.recevable === "NON_DECIDE" ?
            <div>
              <div className="flex items-center justify-between text-center gap-4 py-2 px-5">
              <div
                className={`w-full py-2 border-green-500 font-semibold rounded-lg cursor-pointer border text-sm transition-all duration-300 ease-in-out transform ${
                  recevable === "RECEVALBE"
                    ? "bg-blue-600 text-white scale-105 shadow-md"
                    : "bg-white text-gray-700 hover:bg-blue-50"
                }`}
                onClick={() => setRecevable("RECEVALBE")}
              >
                Recevable
              </div>

              <div
                className={`w-full py-2 font-semibold border-red-600 rounded-lg cursor-pointer border text-sm transition-all duration-300 ease-in-out transform ${
                  recevable === "NON_RECEVABLE"
                    ? "bg-red-600 text-white scale-105 shadow-md"
                    : "bg-white text-gray-700 hover:bg-red-50"
                }`}
                onClick={() => setRecevable("NON_RECEVABLE")}
              >
                Non Recevable
              </div>
            </div>
            <div
              className={`bg-white dark:bg-slate-800 p-6 rounded-xl   transition-shadow duration-300 ${
                recevable === "RECEVALBE"
                  ? "border-blue-500 border-2 border-l-4 shadow-lg hover:shadow-xl"
                  : recevable === "NON_RECEVABLE"
                  ? "border-red-500 border-2 border-l-4 shadow-lg hover:shadow-xl"
                  : ""
              }`}
            >
              {recevable === "NON_RECEVABLE" ? (
                <div className="flex flex-col space-y-4">
                  {/* Header: Analyste Info */}

                  <div>
                    <label className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                      Justification
                    </label>
                    <select
                      className="w-full mt-1 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-800 dark:text-white px-3 py-2 text-sm"
                      value={justification}
                      onChange={(e) => setJustification(e.target.value)}
                    >
                      <option value="" disabled>
                        -- Choisissez une justification --
                      </option>
                      {predefinedJustifications.map((j, index) => (
                        <option key={index} value={j}>
                          {j}
                        </option>
                      ))}
                    </select>

                    {/* Input for "Autre" */}
                    {justification === "Autre" && (
                      <textarea
                        onChange={(e) => setJustification(e.target.value)}
                        rows={3}
                        className="w-full mt-1 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-800 dark:text-white px-3 py-2 text-sm"
                        placeholder="Expliquez la décision..."
                      />
                    )}
                  </div>
                  <div className="flex items-center justify-end">
                    <button
                      onClick={sendConclusion}
                      className="cursor-pointer flex items-center fill-white bg-blue-600 hover:bg-lime-900 active:border active:border-lime-400 rounded-md duration-100 p-2"
                      title="Save"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20px"
                        height="20px"
                        viewBox="0 -0.5 25 25"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M18.507 19.853V6.034C18.5116 5.49905 18.3034 4.98422 17.9283 4.60277C17.5532 4.22131 17.042 4.00449 16.507 4H8.50705C7.9721 4.00449 7.46085 4.22131 7.08577 4.60277C6.7107 4.98422 6.50252 5.49905 6.50705 6.034V19.853C6.45951 20.252 6.65541 20.6407 7.00441 20.8399C7.35342 21.039 7.78773 21.0099 8.10705 20.766L11.907 17.485C12.2496 17.1758 12.7705 17.1758 13.113 17.485L16.9071 20.767C17.2265 21.0111 17.6611 21.0402 18.0102 20.8407C18.3593 20.6413 18.5551 20.2522 18.507 19.853Z"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></path>
                      </svg>
                      <span className="text-sm text-white font-bold pr-1">
                        enregistrer la conclusion
                      </span>
                    </button>
                  </div>
                </div>
              ) : recevable === "RECEVALBE" ? (
                <div className="flex flex-col space-y-4">
                  {/* Analyst Info */}

                  {/* Dropdown for Alertes Urgentes */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Niveau de criticité
                    </label>
                    <select
                      required
                      className="w-full mt-1 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-800 dark:text-white px-3 py-2 text-sm"
                      value={urgenceLevel}
                      onChange={(e) => setUrgenceLevel(e.target.value)}
                    >
                      <option value="">Sélectionner un niveau</option>
                      <option value="1">Faible</option>
                      <option value="2">Modérée</option>
                      <option value="3">Èlevée </option>
                      <option value="4">Critique</option>
                    </select>
                  </div>

                  {/* Justification Textarea */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Commentaire de justification
                    </label>
                    <textarea

                    required
                      className="w-full mt-1 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-800 dark:text-white px-3 py-2 text-sm"
                      rows={4}
                      placeholder="Ajouter un commentaire..."
                      value={justification}
                      onChange={(e) => setJustification(e.target.value)}
                    ></textarea>
                  </div>
                  <div className="flex items-center justify-end">
                    <button
                    onClick={sendConclusion}
                      className="cursor-pointer flex items-center fill-white bg-blue-600 hover:bg-lime-900 active:border active:border-lime-400 rounded-md duration-100 p-2"
                      title="Save"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20px"
                        height="20px"
                        viewBox="0 -0.5 25 25"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M18.507 19.853V6.034C18.5116 5.49905 18.3034 4.98422 17.9283 4.60277C17.5532 4.22131 17.042 4.00449 16.507 4H8.50705C7.9721 4.00449 7.46085 4.22131 7.08577 4.60277C6.7107 4.98422 6.50252 5.49905 6.50705 6.034V19.853C6.45951 20.252 6.65541 20.6407 7.00441 20.8399C7.35342 21.039 7.78773 21.0099 8.10705 20.766L11.907 17.485C12.2496 17.1758 12.7705 17.1758 13.113 17.485L16.9071 20.767C17.2265 21.0111 17.6611 21.0402 18.0102 20.8407C18.3593 20.6413 18.5551 20.2522 18.507 19.853Z"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></path>
                      </svg>
                      <span className="text-sm text-white font-bold pr-1">
                        enregistrer la conclusion
                      </span>
                    </button>
                  </div>
                </div>
              ) : (
                <div></div>
              )}
            </div>
          </div>:
           <div className="flex items-center justify-between text-center gap-4 py-2 px-5">
           <div
             className={`w-full py-2 border-green-500 font-semibold rounded-lg border text-sm transition-all duration-300 ease-in-out transform ${
               recevable === "RECEVALBE"
                 ? "bg-blue-600 text-white scale-105 shadow-md"
                 : "bg-white text-gray-700 "
             }`}
           >
             Recevable
           </div>

           <div
             className={`w-full py-2 font-semibold  border-red-600 rounded-lg  border text-sm transition-all duration-300 ease-in-out transform ${
               recevable === "NON_RECEVABLE"
                 ? "bg-red-600 text-white scale-105 shadow-md"
                 : "bg-white text-gray-700 "
             }`}           >
             Non Recevable
           </div>
         </div>
          }
          </div>
        )}{" "}
        {al.conlusions &&
          al.conlusions.map((con: any, index: any) => (
            <div key={index}>
              {" "}
              {con.createdBy.role === "ANALYSTE" ? (
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border-l-4 border-[1px] border-green-500 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="flex flex-col space-y-4">
                    {/* Analyst Info */}
                    <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-slate-700 flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-green-600 dark:text-green-400"
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
                          Analyste
                        </p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {con.createdBy.name} {con.createdBy.prenom}
                        </p>
                      </div>
                    </div>
                    {
                      con.createdBy.id === session?.user.id && 
                      <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant='ghost'
            className='flex h-8 w-8 p-0 data-[state=open]:bg-muted'
          >
            <MoreHorizontal className='h-4 w-4' />
            <span className='sr-only'>Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='w-[200px]'>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DialogTrigger asChild onClick={() => {router.push(`/analyste/dashboard/alertes/${con.id}`)}}>
            <DropdownMenuItem>
              {" "}
              <FilePenLine className='mr-2 h-4 w-4' />
              mettre à jour
            </DropdownMenuItem>
          </DialogTrigger>
          <DropdownMenuItem
            onSelect={() => setShowDeleteDialog(true)}
            className='text-red-600'
          >
            <Trash2 className='mr-2 h-4 w-4' />
            supprimer
          </DropdownMenuItem>          
        </DropdownMenuContent>
      </DropdownMenu>
      <DeleteConclusion
        task={con}
        isOpen={showDeleteDialog}
        showActionToggle={setShowDeleteDialog}
      />
    </Dialog>
                    }
                    </div>

                    {/* Decision Status */}
                    <div className="flex items-center space-x-2">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          getStatusStyles(al.analysteValidation).className
                        }`}
                      >
                        {getStatusStyles(al.analysteValidation).label}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Statut
                      </span>
                    </div>

                    {/* Conclusion */}
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                        Commentaire
                      </p>
                      <p className="text-gray-700 dark:text-gray-300">
                        {con?.content}
                      </p>
                    </div>
                    <div className="pt-2 border-t border-gray-100 dark:border-slate-700">
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        Validé le: {formatFrenchDate(con.createdAt)}
                      </p>
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
