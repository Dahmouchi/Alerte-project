/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  AlertTriangle,
  Calendar,
  CheckCircle,
  CopyX,
  Dot,
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
import Record from "./Record";
import { toast } from "react-toastify";
import dynamic from "next/dynamic";
import check from "../../../../../public/checked.json";
import Link from "next/link";
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
export type Category = {
  title: string;
  value: string;
  description: string;
  icon: string;
  exemple: string[];
};
const formSchema = z.object({
  title: z.string().min(1),
  description: z.string(),
  location: z.string().min(1),
  dateLieu: z.coerce.date(),
  file: z.string().optional(),
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
  const [textAudio, setTextAudio] = useState(al.type);
  const [files, setFiles] = useState<File[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [anonyme, setAnonyme] = useState(al.involved);
  const [steps, setSteps] = useState(al.step);
  const [anonymeUser, setAnonymeUser] = useState(al.contactPreference);
  const [success, setSuccess] = useState(false);
  const defaultCategory = categories.find((cat) => cat.value === al.category); // Change to your default category
  const [selectedCategory, setSelectedCategory] = useState<
    Category | undefined
  >(defaultCategory);
  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef });
  
  const [persons, setPersons] = useState<
    { nom: string; prenom: string; fonction: string }[]
  >(al.persons || []);
  const [personData, setPersonData] = useState({
    nom: "",
    prenom: "",
    fonction: "",
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: al.title || "",
      description: al.description || "",
      location: al.location || "",
      nom: al.nom || "",
      prenom: al.prenom || "",
      fonction: al.fonction || "",
      dateLieu: al.dateLieu || new Date(),
    },
  });
  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPersonData({ ...personData, [e.target.name]: e.target.value });
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

  useEffect(() => {
    console.log("files : ", files);
  }, [files]);
  const dropZoneConfig = {
    maxFiles: 5,
    maxSize: 1024 * 1024 * 4,
    multiple: true,
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // Check if anonyme is true and persons array is empty
      if (anonyme && persons.length === 0) {
        toast.error("Vous devez ajouter au moins une personne !");
        return; // Stop function execution
      }

      console.log(values);
      const filesToPass = files ?? [];
      setLoading(true);

      if (selectedCategory) {
        const res = await updateAlert(
          al.id,
          values,
          2,
          persons,
          filesToPass,
          anonymeUser,
          textAudio,
          anonyme,
          selectedCategory.value
        );
        if(res) {
          setAl(res);
          toast.success("Success");
          setSteps(2);
          setLoading(false);
          setTimeout(() => setSuccess(false), 3000);
        }
      }
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Please try again.");
    }
  }

  const retour = () => {
    setSteps(steps - 1);
  };
  if (loading) {
    return <Loading />;
  }
  return (
    <div>
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
                      <div className="flex itce justify-center p-1 bg-blue-700 text-white rounded-md">
                        <Pencil />
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
                        <SelectTrigger className="lg:w-[180px] w-full bg-white">
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
                className="space-y-8  lg:py-10 py-3 "
              >
                <div className="grid grid-cols-1 gap-4  ">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-9 border-[1px] p-4 rounded-xl shadow dark:bg-slate-700">
                    <div className="space-y-3">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                              <Input placeholder="shadcn" type="" {...field} />
                            </FormControl>
                            <FormDescription>
                              This is your public display name.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid lg:grid-cols-12 grid-cols-1 gap-4">
                        <div className="col-span-6">
                          <FormField
                            control={form.control}
                            name="location"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  Location
                                  <span className="text-sm text-slate-500 font-light dark:text-slate-300">
                                    (optional)
                                  </span>
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="shadcn"
                                    type="text"
                                    {...field}
                                  />
                                </FormControl>
                                <FormDescription>
                                  This is your public display name.
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
                                    (optional)
                                  </span>
                                </FormLabel>
                                <DatetimePicker
                                  {...field}
                                  format={[
                                    ["months", "days", "years"],
                                    ["hours", "minutes", "am/pm"],
                                  ]}
                                />
                                <FormDescription>
                                  Add the date of submission with detailly.
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                      <div className="py-2 space-y-2 flex lg:items-center justify-between lg:flex-row flex-col">
                        <div>
                          <h1
                            className={`${
                              anonyme && persons.length === 0 && "text-red-500"
                            } font-semibold text-sm`}
                          >
                            Personne(s) impliquée(s){" "}
                          </h1>
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
                                className="flex relative justify-between shadow items-center bg-slate-100 dark:bg-slate-900 rounded-xl p-2"
                              >
                                <div className="flex items-center gap-4 ">
                                  <div className="p-4 border-[1px] shadow-sm rounded-full bg-white dark:bg-slate-800">
                                    <UserRound />
                                  </div>
                                  <div className=" w-full gap-3">
                                    <div className=" text-gray-600 dark:text-slate-100 font-semibold text-sm flex items-center gap-1">
                                      <h1>{person?.nom}</h1>
                                      <h1>{person?.prenom} </h1>
                                    </div>
                                    <Badge className="text-sm mr-6 bg-blue-500 w-full  text-white">
                                  {person?.fonction}
                                </Badge>
                                  </div>
                                </div>
                               <div className="flex items-center gap-2">
                             
                                <div
                                  className=" text-red-600 dark:text-red-400  border-red-300 dark:bg-slate-800 rounded-md cursor-pointer"
                                  onClick={() => removePerson(index)}
                                >
                                  <CopyX  className="w-6 h-6" />
                                </div>
                               </div>
                              </div>
                            ))}
                          </div>
                          <div>
                            <Dialog>
                              <DialogTrigger asChild className="w-full ">
                                <div className="w-12 h-12 rounded-full border-[1px] flex items-center justify-center hover:bg-blue-400 text-white cursor-pointer bg-blue-600">
                                  <Plus />
                                </div>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                  <DialogTitle>Edit profile</DialogTitle>
                                  <DialogDescription>
                                    Make changes to your profile here. Click
                                    save when you&apos;re done.
                                  </DialogDescription>
                                </DialogHeader>

                                <div className="grid gap-4 py-4">
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <Label
                                      htmlFor="name"
                                      className="text-right"
                                    >
                                      Nom
                                    </Label>
                                    <Input
                                      id="name"
                                      name="nom"
                                      value={personData.nom}
                                      onChange={handleChange}
                                      className="col-span-3"
                                    />
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <Label
                                      htmlFor="username"
                                      className="text-right"
                                    >
                                      Prénom
                                    </Label>
                                    <Input
                                      id="username"
                                      name="prenom"
                                      value={personData.prenom}
                                      onChange={handleChange}
                                      className="col-span-3"
                                    />
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <Label
                                      htmlFor="username"
                                      className="text-right"
                                    >
                                      Fonction
                                    </Label>
                                    <Input
                                      id="username"
                                      name="fonction"
                                      className="col-span-3"
                                      value={personData.fonction}
                                      onChange={handleChange}
                                    />
                                  </div>
                                </div>
                                <DialogFooter>
                                  <DialogClose asChild>
                                    <Button onClick={addPerson}>
                                      Save changes
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

                    <div className="space-y-4">
                      <div className="py-2 space-y-2 flex lg:items-center justify-between lg:flex-row flex-col">
                        <div>
                          <h1 className="font-semibold text-sm">
                            Personne(s) impliquée(s){" "}
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
                              <FormItem className="w-full ">
                                <FormLabel>
                                  Description{" "}
                                  <span className="text-red-600">*</span>
                                </FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="Placeholder"
                                    className="h-full bg-transparent"
                                    {...field}
                                  />
                                </FormControl>
                                <FormDescription>
                                  You can @mention other users and
                                  organizations.
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      ) : (
                        <div>
                          <Record />
                        </div>
                      )}
                      <FormField
                        control={form.control}
                        name="file"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Attachments
                              <span className="text-sm text-slate-500 font-light dark:text-slate-300">
                                (optional)
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
                                        Click to upload
                                      </span>
                                      &nbsp; or drag and drop
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
                              Select a file to upload.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-4  border-[1px] p-4 rounded-xl shadow dark:bg-slate-700">
                  <div className="flex items-center gap-6 justify-between">
                    <h1 className="font-semibold lg:text-lg text-md">
                      Souhaitez vous révéler votre identité pour cette Alerte :
                    </h1>
                    <div className="radio-inputs">
                      <label className="radio">
                        <input
                          type="radio"
                          name="radios"
                          value="asdf"
                          checked={anonymeUser === "YES"}
                          onChange={(e) => setAnonymeUser("YES")}
                        />
                        <span className={`name `}>Oui</span>
                      </label>
                      <label className="radio">
                        <input
                          type="radio"
                          name="radios"
                          value="asdf"
                          checked={anonymeUser === "ANONYMOUS"}
                          onChange={(e) => setAnonymeUser("ANONYMOUS")}
                        />
                        <span className="name">Anonyme</span>
                      </label>
                    </div>
                  </div>
                  {anonymeUser === "YES" && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 ">
                      <FormField
                        control={form.control}
                        name="nom"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nom</FormLabel>
                            <FormControl>
                              <Input placeholder="shadcn" type="" {...field} />
                            </FormControl>

                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="prenom"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Prenom</FormLabel>
                            <FormControl>
                              <Input placeholder="shadcn" type="" {...field} />
                            </FormControl>

                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="fonction"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Fonction</FormLabel>
                            <FormControl>
                              <Input placeholder="shadcn" type="" {...field} />
                            </FormControl>

                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                  <div className="flex items-center space-x-2">
                    <Checkbox id="terms" />
                    <label
                      htmlFor="terms"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Accept terms and conditions
                    </label>
                  </div>
                </div>
                <div className="w-full flex items-center justify-end ">
                  <button
                    type="submit"
                    className="bg-blue-700 px-8 py-2 rounded-full text-white hover:bg-blue-500 cursor-pointer"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </Form>
          </div>
        )}
        {steps === 2 && (
         <div className="lg:p-4 space-y-3">
         {/* Success Banner */}
         <section className="bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl">
           <div className="grid max-w-screen-xl px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-8 lg:grid-cols-12">
             <div className="mr-auto place-self-center lg:col-span-7">
               <h1 className="max-w-2xl mb-4 text-4xl font-extrabold tracking-tight text-white">
                 Félicitations ! Alerte créée avec succès !
               </h1>
               <p className="max-w-2xl mb-6 font-light text-gray-100">
                 Vous avez maintenant accès à votre contenu.
               </p>
               <div className="flex items-center justify-between">
                 <Link
                   href={"/user/dashboard"}
                   className="inline-flex items-center px-5 py-3 text-base font-medium text-green-900 bg-green-200 rounded-lg hover:text-white hover:bg-green-900"
                 >
                   retour à l&apos;accueil
                   <svg className="w-5 h-5 ml-2 -mr-1" fill="currentColor" viewBox="0 0 20 20">
                     <path
                       fillRule="evenodd"
                       d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                       clipRule="evenodd"
                     ></path>
                   </svg>
                 </Link>
                 <LottiePlayer loop animationData={check} play className="h-32 w-auto lg:hidden" />
               </div>
             </div>
             <div className="hidden lg:mt-0 lg:col-span-5 lg:flex justify-center items-center">
               <LottiePlayer loop animationData={check} play />
             </div>
           </div>
         </section>
   
         {/* Printable Alert Information */}
         <div ref={contentRef} className="bg-white border border-green-500 dark:bg-slate-800 p-6 rounded-lg shadow-md">
           <div className="mt-4 space-y-4">
             {/* Title & Code */}
           <div className="flex items-center justify-between">
           <div>
            <h3 className="text-lg font-semibold">Title : {al.title}</h3>
            <h3 className="text-lg font-semibold">Code d&apos;alerte : #{al.code}</h3>
            </div>
            <img src="/logo.png" alt="" className="max-w-sm h-auto" />
           </div>
   
             {/* Date & Category */}
             <div className="text-lg font-semibold flex items-center gap-2">
               <Calendar size={20} />
               <span>Date de création : {new Date(al.createdAt!).toLocaleDateString()}</span>
             </div>
             <p className="text-gray-500 dark:text-gray-300">
               <span className="font-semibold text-slate-800">Category</span>:{" "}
               {categories.find((cat) => cat.value === al.category)?.title || "Unknown"}
             </p>
   
             {/* Description */}
             <p className="text-gray-500 dark:text-gray-300">{al.description}</p>
   
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
                   <h3 className="font-semibold">Persons Involved:</h3>
                 </div>
                 {al.persons?.map((person:any, index:any) => (
                   <div key={index} className="flex justify-between shadow items-center bg-slate-100 dark:bg-slate-900 rounded-xl p-2">
                     <div className="flex items-center gap-4">
                       <div className="p-4 border shadow-sm rounded-full bg-white dark:bg-slate-800">
                         <UserRound />
                       </div>
                       <div className="text-gray-600 dark:text-slate-100 font-semibold text-sm">
                         <h1>{person?.nom}</h1>
                         <h1>{person?.prenom}</h1>
                       </div>
                     </div>
                     <Badge className="text-md mr-6 bg-blue-500 text-white">{person?.fonction}</Badge>
                   </div>
                 ))}
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
        )}
      </div>
    </div>
  );
};

export default Step2;
