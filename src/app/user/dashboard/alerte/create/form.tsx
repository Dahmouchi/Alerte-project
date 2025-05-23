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
import { categories } from "@/constants/data";


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
                            {step < 4 ? "Suivant" : "Soumettre"}
                          </div>
                     
                    </div> )}
                    </div>
                    <div className="w-full  items-center justify-end lg:hidden  mt-3 ">
                    {formData.category === category.value && (
                      <div
                            onClick={handleNext}
                            className=" text-white shadow-lg rounded-full bg-blue-700 py-3 lg:px-14 cursor-pointer flex items-center justify-center font-semibold"
                          >
                            {step < 4 ? "Suivant" : "Soumettre"}
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
