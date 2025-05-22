"use client";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  ChevronUp,
  Dot,
  GridIcon,
  ListIcon,
  SearchIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Captcha from "../../../_components/Captcha";
import { createAlerte } from "@/actions/alertActions";

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

export default function AlertForm({ userId }: { userId: string }) {
  const [step, setStep] = useState(1);
  const [alertId, setAlertId] = useState<string | null>(null);
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);
  const [formData, setFormData] = useState({
    category: "",
    title: "",
    description: "",
    type: "text",
    dateLieu: null,
    location: "",
    involvedPersons: "",
    contactPreference: "ANONYMOUS",
  });

  const [search, setSearch] = useState("");
  const [view, setView] = useState("grid");
  const router = useRouter();

const filteredCategories = categories.filter((category) =>
  category.title.toLowerCase().includes(search.toLowerCase()) ||
  category.description.toLowerCase().includes(search.toLowerCase()) // Also search in description
);
const highlightMatch = (text: string, search: string) => {
  if (!search) return text;
  const regex = new RegExp(`(${search})`, "gi");
  return text.replace(regex, `<span class="bg-blue-200 font-bold">$1</span>`);
};

  const handleNext = async () => {
    if (step === 1) {
      // Step 1: Create the alert in the backend
      const res = await createAlerte(
        formData.category,
        userId,
      );
      setAlertId(res.id);
      router.push(`/user/dashboard/alerte/create/${res.code}`);
    } else {
      // Step 2-4: Use server action instead of API call
      if (alertId) {
        router.push(`/user/dashboard/alerte/create/${alertId}`);
      }
    }
    setStep(step + 1);
  };
  const sortedCategories = [...filteredCategories].sort((a, b) =>
    a.value === formData.category ? -1 : b.value === formData.category ? 1 : 0
  );

  if (!isCaptchaVerified) {
    return <Captcha setIsCaptchaVerified={setIsCaptchaVerified} />;
  }
  return (
    <div className="mx-auto p-4">
      {step === 1 && (
        <div>
          <div className="lg:p-6  mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 mb-4 max-w-xl">
                <SearchIcon className="w-5 h-5 text-gray-500" />
                <Input
                  placeholder="Rechercher une catégorie..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <Button
                  variant="outline"
                  onClick={() => setView("grid")}
                  className={`${
                    view === "grid" && "bg-blue-700 text-white"
                  } cursor-pointer lg:block hidden`}
                >
                  <GridIcon className="w-5 h-5" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setView("list")}
                  className={`${
                    view === "list" && "bg-blue-700 text-white"
                  } cursor-pointer`}
                >
                  <ListIcon className="w-5 h-5" />
                </Button>
              </div>
            </div>

            <div
              className={
                view === "grid"
                  ? "lg:grid lg:grid-cols-2 grid-cols-1 gap-2 space-y-2"
                  : "flex flex-col gap-2"
              }
            >
              {sortedCategories.map((category, index) => (
                <Card
                  key={index}
                  className={`hover:shadow-lg dark:bg-slate-700 transition lg:p-4 cursor-pointer ${
                    formData.category === category.value
                      ? "border-2 border-blue-500 bg-blue-50 col-span-2"
                      : ""
                  }`}
                  onClick={() => {
                    setFormData({ ...formData, category: category.value });
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  
                >
                  <CardContent className={` h-auto `}>
                    <div className="lg:hidden w-full flex items-center justify-between">
                      <span className="text-2xl lg:hidden">
                        {category.icon}
                      </span>
                      {formData.category === category.value ? (
                        <ChevronUp />
                      ) : (
                        <ChevronDown />
                      )}
                    </div>
                    <div className={`${
                        formData.category === category.value ? "" : "flex"
                      }  items-center gap-3 h-full w-full `}>
                      <span
                        className={`${
                          formData.category === category.value && ""
                        } text-2xl lg:block hidden`}
                      >
                        {category.icon}
                      </span>
                      <div>
                        <h3 className="font-semibold text-xl" dangerouslySetInnerHTML={{ __html: highlightMatch(category.title, search) }}>
                         
                        </h3>
                        <p
                          className={`text-sm text-gray-500 dark:text-slate-300 transition-all ${
                            formData.category === category.value
                              ? "line-clamp-none"
                              : "line-clamp-1"
                          }`}
                          dangerouslySetInnerHTML={{ __html: highlightMatch(category.description, search) }}
                        >
                        
                        </p>
                        {formData.category === category.value && (
                          <div>
                            <h1 className="text-md font-light">Exemples:</h1>
                            {category.exemple.map((ex, index) => (
                              <div
                                key={index}
                                className=" text-[14px] font-light text-gray-500 dark:text-gray-300 flex gap-1"
                              >
                                <Dot />
                                {ex}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      {formData.category === category.value && ( <div
                      className={` lg:flex flex-row w-full items-end justify-end  hidden `}
                    >
                     
                         <div
                            onClick={handleNext}
                            className=" text-white shadow-lg hidden rounded-full bg-blue-700 py-2 lg:px-14 cursor-pointer lg:flex items-center justify-center font-semibold"
                          >
                            {step < 4 ? "Next" : "Submit"}
                          </div>
                     
                    </div> )}
                    </div>
                    <div className="w-full  items-center justify-end lg:hidden  mt-3 ">
                    {formData.category === category.value && (
                      <div
                            onClick={handleNext}
                            className=" text-white shadow-lg rounded-full bg-blue-700 py-3 lg:px-14 cursor-pointer flex items-center justify-center font-semibold"
                          >
                            {step < 4 ? "Next" : "Submit"}
                          </div>
                    )}
                    </div>
                  
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
