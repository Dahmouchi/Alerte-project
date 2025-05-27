/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  AlertTriangle,
  ArrowRight,
  BriefcaseBusiness,
  Calendar,
  CheckCircle,
  CopyX,
  Dot,
  Eye,
  FileText,
  FileType,
  FileVolume,
  MapPin,
  Pencil,
  Plus,
  Printer,
  Trash,
  User,
  UserRound,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CloudUpload, Paperclip } from "lucide-react";
import {
  FileInput,
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
} from "@/components/ui/file-upload";

import { DatetimePicker } from "@/components/ui/datetime-picker";
import { Card, CardContent } from "@/components/ui/card";
import Loading from "@/components/Loading";
import { Badge } from "@/components/ui/badge";
import { updateAlert } from "@/actions/alertActions";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "react-toastify";
import dynamic from "next/dynamic";
import check from "../../../../public/checked.json";
import Link from "next/link";
import { useReactToPrint } from "react-to-print";
import { AudioRecorder } from "./Record";
import { categories } from "@/constants/data";


export type Category = {
  title: string;
  value: string;
  description: string;
  icon: string;
  exemple: string[];
};
const formSchema = z.object({
  title: z.string().min(1),
  description: z.string().max(2000, "Maximum 2000 caractères.").optional(),
  location: z.string().min(1).optional(),
  dateLieu: z.coerce.date().optional(),
  file: z.string().optional(),
  audioUrl: z.string().optional(),
  type: z.string().optional(),
  nom: z.string().optional(),
  prenom: z.string().optional(),
  fonction: z.string().optional(),
});

const LottiePlayer = dynamic(() => import("react-lottie-player"), {
  ssr: false,
});

const Step2 = (alert: { alert: any }) => {
  const [al, setAl] = useState(alert.alert);
  const [textAudio, setTextAudio] = useState(al?.type);
  const [files, setFiles] = useState<File[] | null>(null);
  const [audio, setAudio] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [anonyme, setAnonyme] = useState(al?.involved);
  const [steps, setSteps] = useState(al?.step);
  const [anonymeUser, setAnonymeUser] = useState(al?.contactPreference);
  const [success, setSuccess] = useState(false);
  const [terms, setTerms] = useState(false);
  const [error, setError] = useState("");

  const defaultCategory = categories.find((cat) => cat.value === al?.category); // Change to your default category
  const [selectedCategory, setSelectedCategory] = useState<
    Category | undefined
  >(defaultCategory);
  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef });

  const [persons, setPersons] = useState<
    { nom: string; prenom: string; fonction: string }[]
  >(al?.persons || []);
  const [personData, setPersonData] = useState({
    nom: "",
    prenom: "",
    fonction: "",
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: al?.title || "",
      description: al?.description || "",
      location: al?.location || "",
      nom: al?.nom || "",
      prenom: al?.prenom || "",
      fonction: al?.fonction || "",
      dateLieu: al?.dateLieu || new Date(),
    },
  });
  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPersonData({ ...personData, [e.target.name]: e.target.value });
  };
  const handleAudioUpload = (file: File) => {
    setAudio(file);
  };
  // Add person to array
  const addPerson = () => {
    if (!personData.nom) return toast.error("Nom is required!");
    setPersons([...persons, personData]);
    setPersonData({ nom: "", prenom: "", fonction: "" }); // Reset input fields
  };

  // Remove person
  const removePerson = (index: number) => {
    setPersons(persons.filter((_, i) => i !== index));
  };

  const dropZoneConfig = {
    maxFiles: 5,
    maxSize: 1024 * 1024 * 6, // Now allows files up to 6MB
    multiple: true,
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (terms) {
      try {
        // Check if anonyme is true and persons array is empty
        if (anonyme && persons.length === 0) {
          toast.error("Vous devez ajouter au moins une personne !");
          return; // Stop function execution
        }
        const filesToPass = files ?? [];
        const audioPass = audio;
        setLoading(true);

        if (selectedCategory) {
          const res = await updateAlert(
            al.id,
            values,
            2,
            persons,
            filesToPass,
            values.audioUrl || null, // Pass the audio file here
            anonymeUser,
            textAudio,
            anonyme,
            selectedCategory.value
          );
          if (res) {
            setAl(res);
            toast.success("Success");
            setError("");
            setSteps(2);
            setLoading(false);
            setTimeout(() => setSuccess(false), 3000);
          }
        }
      } catch (error) {
        console.error("Form submission error", error);
        toast.error("Failed to submit the form. Please try again.");
        setLoading(false);
      } finally {
        setLoading(false);
      }
    } else {
      setError("il doit accepter les termes et les condition!");
      toast.error("il doit accepter les termes et les condition!");
    }
  }

  if (loading) {
    return <Loading />;
  }
  return (
    <div className="px-2">
      <div>
        {steps === 1 && (
          <div>
            <div className="w-full flex items-center justify-between  mt-4">
              {selectedCategory && (
                <Card
                  className={` dark:bg-slate-700 transition lg:p-4 bg-blue-50 w-full`}
                >
                  <CardContent className="w-full">
                    <div className="flex items-center gap-3 h-full">
                      <div>
                        <div className="flex items-center justify-between w-full">
                          <h3 className="font-semibold text-xl">
                            {selectedCategory.title}
                          </h3>
                        </div>
                        <p
                          className={`text-sm text-gray-500 dark:text-slate-300 transition-all`}
                        >
                          {selectedCategory.description}
                        </p>
                        <div>
                          <h1 className="text-md font-light">Exemples:</h1>
                          {selectedCategory.exemple.map(
                            (ex: any, index: any) => (
                              <div
                                key={index}
                                className=" text-[14px] font-light text-gray-500 dark:text-gray-300 flex gap-1"
                              >
                                <Dot />
                                {ex}
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex w-full lg:items-center lg:justify-end gap-2 mt-2">
                      <div className="lg:flex hidden items-center justify-center p-2 bg-blue-700 text-white rounded-md">
                        <Pencil className="w-4 h-4" />
                      </div>
                      <Select
                        value={selectedCategory?.value} // ✅ Ensure selected value is always defined
                        onValueChange={(value) => {
                          const newCategory = categories.find(
                            (cat) => cat.value === value
                          );
                          setSelectedCategory(newCategory);
                        }}
                      >
                        <SelectTrigger className="lg:w-auto w-full bg-white">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent className="bg-white dark:bg-slate-900">
                          <SelectGroup>
                            <SelectLabel>Categories</SelectLabel>
                            {categories.map((category) => (
                              <SelectItem
                                key={category.value}
                                value={category.value}
                              >
                                {category.icon} {category.title}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4   py-3 "
              >
                <div className="grid grid-cols-1 gap-4  ">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="space-y-3  border-[1px] p-4 rounded-xl shadow dark:bg-slate-700">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Titre</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Entrez un titre descriptif"
                                type=""
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Ceci est votre nom d&apos;affichage public.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 gap-4">
                        <div className="col-span-6">
                          <FormField
                            control={form.control}
                            name="location"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  Emplacement
                                  <span className="text-sm text-slate-500 font-light dark:text-slate-300">
                                    (facultative)
                                  </span>
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Entrez l'emplacement"
                                    type="text"
                                    {...field}
                                  />
                                </FormControl>
                                <FormDescription>
                                  Où cela s&apos;est-il produit ?
                                </FormDescription>

                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="col-span-6">
                          <FormField
                            control={form.control}
                            name="dateLieu"
                            render={({ field }) => (
                              <FormItem className="flex flex-col">
                                <FormLabel>
                                  Date{" "}
                                  <span className="text-sm text-slate-500 font-light dark:text-slate-300">
                                    (facultative)
                                  </span>
                                </FormLabel>
                                <DatetimePicker
                                  {...field}
                                  format={[
                                    ["days", "months", "years"],
                                    ["hours", "minutes", "am/pm"],
                                  ]}
                                />
                                <FormDescription>
                                  Ajoutez la date de soumission avec détails.
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                      <div className="py-2 space-y-2 flex justify-between [@media(min-width:1250px)]:flex-row [@media(max-width:1250px)]:flex-col [@media(max-width:729px)]:flex-col">
                        <div>
                          <h2
                            className={`text-sm font-medium ${
                              anonyme && persons.length === 0
                                ? "text-red-600 dark:text-red-400"
                                : "text-slate-700 dark:text-slate-300"
                            }`}
                          >
                            Personne(s) impliquée(s){" "}
                          </h2>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            {anonyme && persons.length === 0
                              ? "At least one person is required"
                              : "Add all relevant individuals"}
                          </p>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="radio-inputs">
                            <label className="radio">
                              <input
                                type="radio"
                                name="radio"
                                value="connu"
                                checked={anonyme === true}
                                onChange={(e) => setAnonyme(true)}
                              />
                              <span className={`name `}>Connu</span>
                            </label>
                            <label className="radio">
                              <input
                                type="radio"
                                name="radio"
                                value="anonyme"
                                checked={anonyme === false}
                                onChange={(e) => setAnonyme(false)}
                              />
                              <span className="name">Inconnu</span>
                            </label>
                          </div>
                        </div>
                      </div>
                      {anonyme && (
                        <div className=" space-y-2">
                          <div className="space-y-2 ">
                            {persons.map((person, index) => (
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
                                    <Badge
                                      variant="outline"
                                      className="border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 whitespace-normal text-left sm:text-center"
                                    >
                                      {person?.fonction}
                                    </Badge>
                                  </div>

                                  {/* Badge - Right aligned on desktop, left aligned on mobile */}
                                  <div className="sm:self-center">
                                    <div
                                      className="p-2 rounded-sm bg-gray-100 text-red-600 cursor-pointer"
                                      onClick={() => removePerson(index)}
                                    >
                                      <Trash className="w-4 h-4 " />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div>
                            <Dialog>
                              <DialogTrigger asChild>
                                <button className="w-full flex items-center justify-center gap-2 p-3 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-blue-400 dark:hover:border-blue-500 transition-all">
                                  <Plus className="h-4 w-4" />
                                  Ajouter une personne
                                </button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[425px] rounded-lg">
                                <DialogHeader>
                                  <DialogTitle className="text-slate-800 dark:text-slate-200">
                                    Ajouter une personne impliquée
                                  </DialogTitle>
                                  <DialogDescription className="text-slate-600 dark:text-slate-400">
                                    Fournissez des détails sur la personne
                                    concernée.
                                  </DialogDescription>
                                </DialogHeader>

                                <div className="space-y-4 py-4">
                                  <div className="space-y-2">
                                    <Label
                                      htmlFor="nom"
                                      className="text-sm font-medium text-slate-700 dark:text-slate-300"
                                    >
                                      Nom
                                    </Label>
                                    <Input
                                      id="nom"
                                      name="nom"
                                      value={personData.nom}
                                      onChange={handleChange}
                                      className="w-full"
                                      placeholder="Entrez le nom"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label
                                      htmlFor="prenom"
                                      className="text-sm font-medium text-slate-700 dark:text-slate-300"
                                    >
                                      Prénom
                                    </Label>
                                    <Input
                                      id="prenom"
                                      name="prenom"
                                      value={personData.prenom}
                                      onChange={handleChange}
                                      className="w-full"
                                      placeholder="Entrez le prénom"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label
                                      htmlFor="fonction"
                                      className="text-sm font-medium text-slate-700 dark:text-slate-300"
                                    >
                                      Rôle/Fonction
                                    </Label>
                                    <Input
                                      id="fonction"
                                      name="fonction"
                                      value={personData.fonction}
                                      onChange={handleChange}
                                      className="w-full"
                                      placeholder="Entrez le rôle ou la fonction"
                                    />
                                  </div>
                                </div>
                                <DialogFooter>
                                  <DialogClose asChild>
                                    <Button
                                      onClick={addPerson}
                                      className="bg-blue-600 hover:bg-blue-700 text-white"
                                    >
                                      Ajouter une personne
                                    </Button>
                                  </DialogClose>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>
                      )}

                      <div className="w-full"></div>
                    </div>

                    <div className="space-y-4  border-[1px] p-4 rounded-xl shadow dark:bg-slate-700">
                      <div className="py-2 space-y-2 flex justify-between [@media(min-width:1250px)]:flex-row [@media(max-width:1250px)]:flex-col [@media(max-width:729px)]:flex-col">
                        <div>
                          <h1 className="font-semibold text-sm">
                            Mode de Signalement{" "}
                          </h1>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="radio-inputs">
                            <label className="radio">
                              <input
                                type="radio"
                                name="radioa"
                                value="text"
                                checked={textAudio === "text"}
                                onChange={(e) => setTextAudio("text")}
                              />

                              <span className={`name `}>
                                <FileType /> Text
                              </span>
                            </label>
                            <label className="radio">
                              <input
                                type="radio"
                                name="radioa"
                                value="audio"
                                checked={textAudio === "audio"}
                                onChange={(e) => setTextAudio("audio")}
                              />

                              <span className="name">
                                <FileVolume /> Audio
                              </span>
                            </label>
                          </div>
                        </div>
                      </div>

                      {textAudio === "text" ? (
                        <div className="flex flex-col items-start justify-start w-full ">
                          <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                              <FormItem className="w-full">
                                <FormLabel>
                                  Description{" "}
                                  <span className="text-red-600">*</span>
                                </FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="Entrez la description"
                                    className="h-full bg-transparent"
                                    {...field}
                                    maxLength={2000} // Empêche l'utilisateur de taper plus de 2000 caractères
                                  />
                                </FormControl>
                                <div className="text-right text-sm text-gray-500">
                                  {field.value?.length || 0} / 2000 caractères
                                </div>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      ) : (
                        <div>
                          <FormField
                            control={form.control}
                            name="audioUrl"
                            render={({ field }) => (
                              <FormItem className="w-full">
                                <FormLabel>
                                  Enregistrer un audio{" "}
                                  <span className="text-red-600">*</span>
                                </FormLabel>
                                <AudioRecorder
                                  onUpload={(audioUrl) =>
                                    field.onChange(audioUrl)
                                  }
                                />
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      )}
                      <FormField
                        control={form.control}
                        name="file"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              pièces jointes
                              <span className="text-sm text-slate-500 font-light dark:text-slate-300">
                                (facultative)
                              </span>
                            </FormLabel>
                            <FormControl>
                              <FileUploader
                                value={files}
                                onValueChange={setFiles}
                                dropzoneOptions={dropZoneConfig}
                                className="relative rounded-lg p-2 dark:bg-slate-800 "
                              >
                                <FileInput
                                  id="fileInput"
                                  className="outline-dashed outline-1 outline-slate-500 dark:outline-gray-200"
                                >
                                  <div className="flex items-center justify-center flex-col p-8 w-full ">
                                    <CloudUpload className="text-gray-500 dark:text-gray-200 w-10 h-10" />
                                    <p className="mb-1 text-sm text-gray-500 dark:text-gray-200 ">
                                      <span className="font-semibold">
                                        Cliquez pour télécharger
                                      </span>
                                      &nbsp; ou glisser-déposer
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                      SVG, PNG, JPG or GIF
                                    </p>
                                  </div>
                                </FileInput>
                                <FileUploaderContent>
                                  {files &&
                                    files.length > 0 &&
                                    files.map((file, i) => (
                                      <FileUploaderItem key={i} index={i}>
                                        <Paperclip className="h-4 w-4 stroke-current" />
                                        <span>{file.name}</span>
                                      </FileUploaderItem>
                                    ))}
                                </FileUploaderContent>
                              </FileUploader>
                            </FormControl>
                            <FormDescription>
                              Sélectionnez un fichier à télécharger.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-4 p-6 border-[1px] rounded-xl bg-white dark:bg-slate-700 shadow-lg   dark:border-slate-700">
                  {/* Identity Section */}
                  <div className="flex flex-col border-[1px] lg:flex-row lg:items-center justify-between gap-4 p-4 bg-slate-50 dark:bg-slate-700/30 rounded-lg">
                    <div>
                      <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                        Souhaitez-vous révéler votre identité pour cette alerte
                        ?
                      </h2>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Choisissez comment vous souhaitez vous identifier
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <div
                        className="inline-flex rounded-md shadow-sm"
                        role="group"
                      >
                        <button
                          type="button"
                          onClick={() => setAnonymeUser("YES")}
                          className={`px-4 py-2 text-sm font-medium rounded-l-lg border ${
                            anonymeUser === "YES"
                              ? "bg-blue-600 text-white border-blue-600"
                              : "bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600"
                          }`}
                        >
                          Oui
                        </button>
                        <button
                          type="button"
                          onClick={() => setAnonymeUser("ANONYMOUS")}
                          className={`px-4 py-2 text-sm font-medium rounded-r-lg border ${
                            anonymeUser === "ANONYMOUS"
                              ? "bg-blue-600 text-white border-blue-600"
                              : "bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600"
                          }`}
                        >
                          Anonyme
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Identity Fields (shown when "Oui" is selected) */}
                  {anonymeUser === "YES" && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4 bg-slate-50 dark:bg-slate-700/30 rounded-lg">
                      <FormField
                        control={form.control}
                        name="nom"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-300">
                              Nom
                              <span className="ml-1 text-xs text-red-500 dark:text-red-400">
                                (requis)
                              </span>
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input
                                  placeholder="Entrez votre nom"
                                  className="pl-10 pr-4 py-2 w-full rounded-lg border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-white"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage className="text-xs text-red-600 dark:text-red-400" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="prenom"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-300">
                              Prénom
                              <span className="ml-1 text-xs text-red-500 dark:text-red-400">
                                (requis)
                              </span>
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input
                                  placeholder="Entrez votre prénom"
                                  className="pl-10 pr-4 py-2 w-full rounded-lg border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-white"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage className="text-xs text-red-600 dark:text-red-400" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="fonction"
                        render={({ field }) => (
                          <FormItem className="lg:col-span-2">
                            <FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-300">
                              Rôle/Fonction
                              <span className="ml-1 text-xs text-slate-500 dark:text-slate-400">
                                (optionnel)
                              </span>
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <BriefcaseBusiness className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input
                                  placeholder="Entrez votre rôle ou fonction"
                                  className="pl-10 pr-4 py-2 w-full rounded-lg border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-white"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage className="text-xs text-red-600 dark:text-red-400" />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {/* Terms and Conditions */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3 pt-6  bg-slate-50 dark:bg-slate-700/30 rounded-lg">
                      <Checkbox
                        onClick={() => setTerms(true)}
                        id="terms"
                        className="h-5 w-5 rounded border-slate-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500 mt-0.5"
                      />
                      <label
                        htmlFor="terms"
                        className="text-sm font-medium leading-snug text-slate-700 dark:text-slate-300"
                      >
                        J&apos;accepte les termes et conditions
                        d&apos;utilisation
                        <span className="ml-1 text-xs text-red-500 dark:text-red-400">
                          (requis)
                        </span>
                      </label>
                    </div>
                    {error && (
                      <div className="text-red-500 text-sm">
                        il doit accepter les termes et les condition!
                      </div>
                    )}
                  </div>
                  {/* Submit Button */}
                  <div className="w-full flex items-center justify-end pt-2">
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-full transition-colors duration-200"
                    >
                      Envoyer l&apos;alerte
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </button>
                  </div>
                </div>
              </form>
            </Form>
          </div>
        )}
        {steps === 2 && (
          <div className="p-4 space-y-6">
            {/* Success Banner - Improved Design */}
            <section className="bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl shadow-lg overflow-hidden">
              <div className="max-w-screen-xl px-6 py-8 mx-auto lg:py-12">
                <div className="flex flex-col lg:flex-row items-center justify-between">
                  <div className="lg:w-1/2 mb-8 lg:mb-0">
                    <div className="flex items-center mb-4">
                      <div className="p-3 bg-white bg-opacity-20 rounded-full mr-4">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                      </div>
                      <h1 className="text-3xl md:text-4xl font-bold text-white">
                        Alerte envoyée avec succès !
                      </h1>
                    </div>

                    <p className="text-lg text-white text-opacity-90 mb-6">
                      Votre alerte a été correctement enregistrée dans notre
                      système. Vous pouvez suivre son traitement dans votre
                      tableau de bord.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4"></div>
                  </div>

                  <div className="lg:w-1/6  justify-center lg:flex hidden">
                    <LottiePlayer
                      loop={false}
                      animationData={check}
                      play
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Alert Summary Card - Improved Layout */}
            <div className="bg-white border border-emerald-100 rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 md:p-8" ref={contentRef}>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Récapitulatif de l&apos;alerte
                    </h2>
                    <p className="text-emerald-600 font-medium">
                      Code: #{al.code}
                    </p>
                  </div>
                  <img
                    src="/logo.png"
                    alt="Logo"
                    className="h-12 mt-4 md:mt-0"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-gray-900 mb-2">
                        Titre
                      </h3>
                      <p className="text-gray-700">{al.title}</p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-gray-900 mb-2">
                        Description
                      </h3>
                      <p className="text-gray-700">{al.description}</p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-gray-900 mb-2">
                        Catégorie
                      </h3>
                      <p className="text-gray-700">
                        {categories.find((cat) => cat.value === al.category)
                          ?.title || "Non spécifiée"}
                      </p>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-gray-900 mb-2">
                        Date de création
                      </h3>
                      <div className="flex items-center text-gray-700">
                        <Calendar className="mr-2 w-5 h-5" />
                        {new Date(al.createdAt!).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-gray-900 mb-2">
                        Date et lieu de l&apos;incident
                      </h3>
                      <div className="space-y-2">
                        <div className="flex items-center text-gray-700">
                          <Calendar className="mr-2 w-5 h-5" />
                          {new Date(al.dateLieu!).toLocaleDateString("fr-FR")}
                        </div>
                        <div className="flex items-center text-gray-700">
                          <MapPin className="mr-2 w-5 h-5" />
                          {al.location || "Non spécifié"}
                        </div>
                      </div>
                    </div>

                    {al.persons?.length > 0 && (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-gray-900 mb-3">
                          Personnes impliquées
                        </h3>
                        <div className="space-y-3">
                          {al.persons?.map((person: any, index: any) => (
                            <div
                              key={index}
                              className="flex items-center p-3 bg-white rounded-lg shadow-xs"
                            >
                              <div className="flex-shrink-0 p-2 bg-emerald-100 text-emerald-600 rounded-full">
                                <UserRound className="w-5 h-5" />
                              </div>
                              <div className="ml-3">
                                <p className="font-medium text-gray-900">
                                  {person?.prenom} {person?.nom}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {person?.fonction}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="bg-gray-50 px-6 py-4 border-t flex justify-between items-center lg:flex-row flex-col">
                <div className="text-sm text-gray-500">
                  Vous pouvez modifier cette alerte depuis votre tableau de
                  bord.
                </div>
                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => reactToPrintFn()}
                    className="flex items-center gap-2"
                  >
                    <Printer className="w-5 h-5" />
                    Imprimer
                  </Button>
                  <Link href={`/user/dashboard/alerte/${al.code}`}>
                    <Button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700">
                      <Eye className="w-5 h-5" />
                      Voir détails
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Step2;
