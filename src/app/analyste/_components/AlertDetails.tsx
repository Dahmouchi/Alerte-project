/* eslint-disable react-hooks/exhaustive-deps */
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
  ChevronDown,
  ChevronLeft,
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
  PlusIcon,
  Printer,
  Save,
  ScanBarcode,
  Timer,
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
  saveConclusion,
  saveDemande,
  saveReponse,
} from "@/actions/alertActions";
import { AlertChat } from "@/components/alert-chat";
import { useUnreadMessages } from "@/hooks/useUnreadMessages";
import { markMessagesAsRead } from "@/hooks/markMessagesAsRead";

import UpdateConclusion from "./conclusion";
import { UserAlertStatus } from "@prisma/client";
import { CriticalityBadge } from "@/components/CritiqueBadg";
import {
  analysteAssign,
  removeAnalysteAssignment,
} from "@/actions/analyste-function";
import JustifCard from "@/app/user/_components/justifCard";
import { AnalystResponseForm } from "./sendConclusion";
import AdditionalModalComponent from "./conclusionTwo";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import AnnulerCloture from "./anullerCloture";
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
const JUSTIFICATIONS = [
  {
    label: "Alerte manifestement infondée",
    description:
      "L’alerte repose sur des faits manifestement faux, incohérents ou intentionnellement mensongers.",
  },
  {
    label: "Hors du périmètre du dispositif",
    description:
      "L’alerte concerne un sujet non couvert par le dispositif d’alerte (ex. : demande RH individuelle, réclamation client...).",
  },
  {
    label: "Absence totale de faits précis",
    description:
      "L’alerte ne fournit aucun élément factuel exploitable (ni faits, ni dates, ni personnes impliquées).",
  },
  {
    label: "Alerte diffamatoire ou calomnieuse",
    description:
      "L’alerte contient des accusations sans fondement avec une intention manifeste de nuire.",
  },
  {
    label: "Faits déjà traités ou prescrits",
    description:
      "L’alerte concerne une situation ayant déjà fait l'objet d'une enquête ou de mesures correctives, ou trop ancienne pour être instruite.",
  },
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
  const [justification1, setJustification1] = useState("");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [urgenceLevel, setUrgenceLevel] = useState("0");
  const unreadCount = useUnreadMessages(al.id);
  const [isOpen, setIsOpen] = useState(false);
  const [decision, setDecision] = useState<UserAlertStatus>(
    "INFORMATIONS_MANQUANTES"
  );
  const reactToPrintFn = useReactToPrint({ contentRef });
  const router = useRouter();
  const status = al?.assignedAnalystId;
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleFileClick = (file: any) => {
    setSelectedFile(file);
    setIsModalOpen(true);
  };
  const handleSubmitResponse = async (response: string) => {
    if (session) {
      try {
        setSelectedAnalyst(session.user.id);
        const ocp = await saveReponse(session.user.id, response, al.id, true);
        if (ocp) {
          toast.success("Reponse enregister");
          router.refresh();
        }
      } catch (error) {
        console.error("Erreur lors de l'attribution de l'alerte:", error);
      }
    } else {
      toast.error("Erreur lors de l'attribution de l'alerte");
    }
  };

  const handleJustificationChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedLabel = e.target.value;
    setJustification(selectedLabel);

    // Find the matching description
    const selectedJustification = JUSTIFICATIONS.find(
      (j) => j.label === selectedLabel
    );
    setJustification1(selectedJustification?.description || "");
  };
  useEffect(() => {}, [recevable]); // Trigger when recevable changes
  const [isAdditionalModalOpen, setIsAdditionalModalOpen] = useState(false);

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
  }, [isAdditionalModalOpen]);
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
            "bg-white shadow-xs border text-gray-800 dark:bg-gray-700 dark:text-gray-300",
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
        const ocp = await saveConclusion(
          session.user.id,
          justification,
          justification1,
          al.id,
          recevable,
          urgenceLevel,
          decision
        );
        if (ocp) {
          setJustification("");
          setJustification1("");
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
  const sendDemande = async () => {
    if (session) {
      try {
        if (decision === "APPROVED") {
          setSelectedAnalyst(session.user.id);
          const ocp = await saveDemande(session.user.id, al.id);
          if (ocp) {
            setJustification("");
            setJustification1("");
            toast.success("demande envoyer successfully!");
            router.refresh();
          }
        } else {
          toast.info("check the cloture");
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
        const ocp = await removeAnalysteAssignment(al.id, session?.user.id);
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
  const allConclusionsApproved = al?.conlusions?.every(
    (conclusion: any) => conclusion.valider === true
  );

  const canRequestClosure =
    al.analysteValidation === "INFORMATIONS_MANQUANTES" &&
    allConclusionsApproved;
  const handleToggleApproval = () => {
    if (decision !== "APPROVED") {
      setShowConfirmDialog(true);
    } else {
      setDecision("INFORMATIONS_MANQUANTES"); // Reset if already approved
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
      <div className="space-y-3 mt-4 p-2">
        <div
          ref={contentRef}
          className=" relative border pb-12 lg:pb-12 lg:p-6 p-2 rounded-lg shadow-md bg-blue-50"
        >
          <div className="absolute -top-3 left-4 px-3 py-1 bg-blue-600 rounded-md shadow-sm">
            <h3 className="text-sm font-semibold text-white">
              Détails de l&apos;alerte
            </h3>
          </div>

          <div className="space-y-2">
            {/* Status and Action Bar */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 p-4 bg-white dark:bg-slate-800 dark:bg-slate-850 rounded-lg border border-gray-200 dark:border-slate-700 shadow-xs">
              {/* Status Badge */}
              <div>
                {status ? (
                  <div
                    className={`flex w-[150px] items-center px-2 py-1 rounded-full text-blue-500 bg-blue-100 dark:bg-blue-900`}
                  >
                    <UserCheck className="mr-2 h-4 w-4" />
                    <span className="font-medium text-xs">Assignée</span>
                  </div>
                ) : (
                  <div
                    className={`flex w-[150px] items-center px-2 py-1 rounded-full text-yellow-500 bg-yellow-100 dark:bg-yellow-900`}
                  >
                    <Timer className="mr-2 h-4 w-4" />
                    <span className="font-medium text-xs">Non Assignée</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
                {selectedAnalyst === session?.user.id ? (
                  // Check if the user has created any conclusion
                  al.conlusions.some(
                    (conclusion: { createdById: string }) =>
                      conclusion.createdById === session?.user.id
                  ) ? (
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                      <Lock className="h-4 w-4" />
                      <span className="text-xs">
                        Vous ne pouvez pas céder cette alerte après avoir ajouté
                        une conclusion
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
                  )
                ) : selectedAnalyst === "" ? (
                  // Only show "Take charge" button if no conclusions exist OR if user created a conclusion
                  !al.conlusions.length ||
                  al.conlusions.some(
                    (conclusion: { createdById: string | undefined }) =>
                      conclusion.createdById === session?.user.id
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
                            Prendre en charge cette alerte?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Vous serez désigné comme responsable de cette
                            alerte.
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
                        Cette alerte ne peut pas être reprise car elle a déjà
                        une conclusion
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
          </div>
          <div className="mt-6 space-y-4">
            {/* Header Section */}
            <div className="grid md:grid-cols-2 gap-6 p-4 bg-white shadow-xs border  dark:bg-slate-800 rounded-xl">
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
            <div className="p-4 bg-white shadow-xs border  dark:bg-slate-800 rounded-xl">
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
              <div className="p-4 bg-white shadow-xs border  dark:bg-slate-800 rounded-xl">
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

              <div className="p-4 bg-white shadow-xs border  dark:bg-slate-800 rounded-xl">
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
            <div className="lg:p-4 p-2 bg-white shadow-xs border  dark:bg-slate-800 rounded-xl">
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
            <div className="p-4 bg-white shadow-xs border  dark:bg-slate-800 rounded-xl">
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
            {isModalOpen && selectedFile && (
              <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
                <div className="bg-white dark:bg-slate-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto relative">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="absolute top-4 right-4 p-2 rounded-full bg-white shadow-xs border dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600"
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
              <div className="p-4 bg-white shadow-xs border dark:bg-slate-800 rounded-xl">
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
                          <div className="aspect-square bg-white shadow-xs border dark:bg-slate-700 rounded-lg overflow-hidden border border-gray-200 dark:border-slate-600">
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
                  className={`px-10 absolute bg-blue-700 bottom-0 right-0 rounded-br-md rounded-tl-md flex gap-1 font-semibold py-2 cursor-pointer transition-all duration-300
               border-t-2 border-l-2 border-blue-600 text-white items-center`}
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
          <div className=" relative border  lg:p-6 p-2 rounded-lg shadow-md mt-6">
            <div className="absolute -top-3 left-4 px-3 py-1 bg-blue-600 rounded-md shadow-sm">
              <h3 className="text-sm font-semibold text-white">
                Traitement d&apos;alertes
              </h3>
            </div>
            {al.recevable === "NON_DECIDE" ? (
              <div className="mt-6">
                <div className="grid grid-cols-2 gap-3   dark:bg-slate-800 rounded-t-xl">
                  {/* Recevable Button */}
                  <button
                    onClick={() => {
                      setRecevable("RECEVALBE");
                      messagesEndRef.current?.scrollIntoView({
                        behavior: "smooth",
                      });
                      setJustification("");
                      setJustification1("");
                    }}
                    className={`relative py-2 px-4 rounded-t-lg text-sm font-medium  transition-all duration-200 ${
                      recevable === "RECEVALBE"
                        ? "bg-blue-600 text-white shadow-sm  border-2  border-blue-600"
                        : "bg-white dark:bg-slate-700 text-gray-700 border-2  dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                    }`}
                  >
                    {recevable === "RECEVALBE" && (
                      <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-green-400 border-2 border-white dark:border-slate-800"></span>
                    )}
                    <span className="flex items-center justify-center gap-1">
                      <CheckCircle2
                        className={`h-4 w-4 ${
                          recevable === "RECEVALBE"
                            ? "text-white"
                            : "text-blue-600 dark:text-blue-400"
                        }`}
                      />
                      Recevable
                    </span>
                  </button>

                  {/* Non Recevable Button */}
                  <button
                    onClick={() => {
                      setRecevable("NON_RECEVABLE");
                      setJustification("");
                      setJustification1("");
                    }}
                    className={`relative py-2 px-4 rounded-t-lg    text-sm font-medium transition-all duration-200 ${
                      recevable === "NON_RECEVABLE"
                        ? "bg-red-600 text-white shadow-sm  border-2 border-red-600"
                        : "bg-white  dark:bg-slate-700  border-2  text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20"
                    }`}
                  >
                    {recevable === "NON_RECEVABLE" && (
                      <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-400 border-2 border-white dark:border-slate-800"></span>
                    )}
                    <span className="flex items-center justify-center gap-1">
                      <XCircle
                        className={`h-4 w-4 ${
                          recevable === "NON_RECEVABLE"
                            ? "text-white"
                            : "text-red-600 dark:text-red-400"
                        }`}
                      />
                      Non Recevable
                    </span>
                  </button>
                </div>
                <div
                  className={`bg-white dark:bg-slate-800 p-6 rounded-b-xl   transition-shadow duration-300 ${
                    recevable === "RECEVALBE"
                      ? "border-blue-500 border-2  shadow-lg hover:shadow-xl"
                      : recevable === "NON_RECEVABLE"
                      ? "border-red-500 border-2 shadow-lg hover:shadow-xl"
                      : ""
                  }`}
                >
                  {recevable === "NON_RECEVABLE" ? (
                    <div className="flex flex-col space-y-4">
                      {/* Header: Analyste Info */}

                      <div>
                        <label className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                          Justification{" "}
                          <span className="ml-1 text-xs text-red-500 dark:text-red-400">
                            (requis)
                          </span>
                          :
                        </label>
                        <select
                          className="w-full mt-1 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-800 dark:text-white px-3 py-2 text-sm"
                          value={justification}
                          onChange={handleJustificationChange}
                        >
                          <option value="" disabled>
                            -- Choisissez une justification --
                          </option>
                          {JUSTIFICATIONS.map((j, index) => (
                            <option key={index} value={j.label}>
                              {j.label}
                            </option>
                          ))}
                        </select>
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Commentaire :
                          </label>
                          <textarea
                            required
                            className="block w-full px-4 py-3 text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            rows={4}
                            placeholder="Ajouter un commentaire..."
                            value={justification1}
                            onChange={(e) => setJustification1(e.target.value)}
                          />
                        </div>
                        {/* Input for "Autre" */}
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
                    <div className="space-y-6  bg-white dark:bg-gray-800 rounded-b-lg ">
                      {/* Decision Section */}

                      {/* Criticity Dropdown - Modern Version */}

                      {/* Justification Textarea */}

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Niveau de criticité
                        </label>
                        <div className="relative">
                          <select
                            required
                            className="block w-full px-4 py-2.5 text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={urgenceLevel}
                            onChange={(e) => setUrgenceLevel(e.target.value)}
                          >
                            <option value="0">Sélectionner un niveau</option>
                            <option value="1">Faible</option>
                            <option value="2">Modérée</option>
                            <option value="3">Élevée</option>
                            <option value="4">Critique</option>
                          </select>
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <ChevronDown className="w-5 h-5 text-gray-400" />
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Réponse
                        </label>
                        <textarea
                          required
                          className="block w-full px-4 py-3 text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          rows={4}
                          placeholder="Ajouter un commentaire..."
                          value={justification}
                          onChange={(e) => setJustification(e.target.value)}
                        />
                      </div>
                      {/* Submit Button */}
                      <div className="flex justify-end">
                        <button
                          onClick={sendConclusion}
                          className="inline-flex items-center px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                          <Save className="w-5 h-5 mr-2" />
                          Enregistrer la conclusion
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div></div>
                  )}
                </div>
              </div>
            ) : (
              <div className="mt-6">
                <div className="flex items-center justify-between text-center gap-4 py-2 px-5">
                  <div
                    className={`w-full py-2 border-green-500 font-semibold rounded-lg border text-sm transition-all duration-300 ease-in-out transform ${
                      recevable === "RECEVALBE"
                        ? "bg-blue-600 text-white scale-105 shadow-md"
                        : "bg-white text-gray-700 "
                    }`}
                  >
                    <span className="flex items-center justify-center gap-1">
                      <CheckCircle2
                        className={`h-4 w-4 ${
                          recevable === "RECEVALBE"
                            ? "text-white"
                            : "text-blue-600 dark:text-blue-400"
                        }`}
                      />
                      Recevable
                    </span>
                  </div>

                  <div
                    className={`w-full py-2 font-semibold  border-red-600 rounded-lg  border text-sm transition-all duration-300 ease-in-out transform ${
                      recevable === "NON_RECEVABLE"
                        ? "bg-red-600 text-white scale-105 shadow-md"
                        : "bg-white text-gray-700 "
                    }`}
                  >
                    <span className="flex items-center justify-center gap-1">
                      <XCircle
                        className={`h-4 w-4 ${
                          recevable === "NON_RECEVABLE"
                            ? "text-white"
                            : "text-red-600 dark:text-red-400"
                        }`}
                      />
                      Non Recevable
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}{" "}
        {al.conlusions &&
          al.conlusions.map((con: any, index: any) => (
            <div key={index}>
              {" "}
              {con.createdBy.role === "ANALYSTE" ? (
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
                  {con.analysteValidation === "APPROVED" ? (
                    <div>
                    <div className="bg-green-50 dark:bg-slate-850 inverted-radius2 p-6 dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-200 group">
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
                          <span className="text-xs font-medium text-gray-600 dark:text-gray-300 bg-white shadow-xs border dark:bg-slate-700 px-2.5 py-1 rounded-full">
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
                        <div className={``}>
                          {con.valider ? (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="bg-emerald-700 cursor-pointer text-white rounded-full w-6 h-6 font-semibold flex items-center justify-center text-xs">
                                  V
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Validée</p>
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
                    </div>
                  ) : (
                    <div className="relative">
                      {con.createdBy.id === session?.user.id &&
                        !con.valider && (
                          <>
                            <div className="absolute top-2 right-2 z-50">
                              <div className="bg-slate-200  rounded-full p-1 flex items-center justify-center shadow-md cursor-pointer">
                                {index === 0 ? (
                                  // Add your additional modal component here for the first conclusion
                                  <>
                                    <AdditionalModalComponent
                                      task={con}
                                      alerte={al}
                                      onClose={() =>
                                        setIsAdditionalModalOpen(
                                          !isAdditionalModalOpen
                                        )
                                      }
                                    />
                                  </>
                                ) : (
                                  <UpdateConclusion task={con} alerte={al} />
                                )}
                              </div>
                            </div>
                          </>
                        )}

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
                            <span className="text-xs font-medium text-gray-600 dark:text-gray-300 bg-white shadow-xs border dark:bg-slate-700 px-2.5 py-1 rounded-full">
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
                    </div>
                  )}
                </div>
              ) : (
                <JustifCard justif={con} />
              )}
            </div>
          ))}
        {!al.involved && al.responsableValidation !== "PENDING" && (
          <div className="w-full mx-auto">
            <div className="space-y-6  bg-white shadow-lg dark:bg-gray-800 rounded-lg p-4 border">
              {/* Decision Section */}

              {/* Criticity Dropdown - Modern Version */}

              {/* Justification Textarea */}
              <div className="space-y-2">
                <AnalystResponseForm onSubmit={handleSubmitResponse} />
              </div>
            </div>
          </div>
        )}
        {al.analysteValidation === "INFORMATIONS_MANQUANTES" && (
          <div
            className={`space-y-4 p-6 mt-4 shadow-lg hover:shadow-xl rounded-xl ${
              canRequestClosure
                ? "border-blue-500 bg-blue-50 border-2"
                : "border-gray-300 bg-white shadow-xs border border"
            }`}
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Clôture
            </h3>

            {!allConclusionsApproved && (
              <p className="text-red-600 text-sm">
                Toutes les validations doivent être approuvées avant de demander
                la clôture.
              </p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 opacity-100">
              <div
                className={`${
                  decision === "APPROVED"
                    ? "border-green-500 border-2"
                    : "border"
                } flex items-start space-x-4 p-4 rounded-lg bg-white dark:bg-gray-900`}
              >
                <div className="flex items-center h-5">
                  <input
                    type="checkbox"
                    checked={decision === "APPROVED"}
                    onChange={handleToggleApproval}
                    className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                    disabled={!canRequestClosure}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <label
                    htmlFor="approval-checkbox"
                    className="flex items-center cursor-pointer"
                  >
                    <div className="ml-3 text-sm">
                      <div className="font-medium text-gray-900 dark:text-white flex items-center">
                        <CheckCircle2 className="w-5 h-5 text-green-500 mr-2" />
                        Demande de clôture
                      </div>
                      <p className="text-gray-500 dark:text-gray-400 mt-1">
                        {decision === "APPROVED"
                          ? "Clôture approuvée (cliquez pour annuler)"
                          : "Cochez pour demander la clôture"}
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Confirmation Dialog */}
              <AlertDialog
                open={showConfirmDialog}
                onOpenChange={setShowConfirmDialog}
              >
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Confirmer la demande de clôture
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Êtes-vous sûr de vouloir effectuer cette demande de
                      clôture ?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => {
                        setDecision("APPROVED");
                        setShowConfirmDialog(false);
                      }}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Confirmer
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>

            <div className="flex justify-end">
              <button
                onClick={sendDemande}
                disabled={!canRequestClosure}
                className={`inline-flex items-center px-4 py-2.5 text-white font-medium rounded-lg shadow-sm transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  canRequestClosure
                    ? "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                <Save className="w-5 h-5 mr-2" />
                Envoyer la demande
              </button>
            </div>
          </div>
        )}
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
