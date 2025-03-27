import Link from "next/link";
import VideoPlayer from "./VideoPlayer";

interface Hero1Props {
  badge?: string;
  heading: string;
  heading2: string;
  description: string;
  buttons?: {
    primary?: {
      text: string;
      url: string;
    };
    secondary?: {
      text: string;
      url: string;
    };
  };
  image: {
    src: string;
    alt: string;
  };
}

const Hero1 = ({
  heading = "Soumission/Consultation des ",
  heading2 = "Alertes",
  description = "Tout salarié du Groupe, ainsi que toute personne visée par les lois en vigueur (candidat à l’emploi, ancien collaborateur, actionnaire et associé, collaborateur extérieur et occasionnel, fournisseur) a la possibilité de signaler des faits portant sur un crime, un délit, une menace ou un préjudice pour l’intérêt général, une violation d’un engagement international ratifié par la France notamment, en utilisant la plateforme  CompliVOX.",
  buttons = {
    primary: {
      text: "Crée un Profil",
      url: "/user",
    },
    secondary: {
      text: "S'identifier",
      url: "/user/dashboard",
    },
  },

}: Hero1Props) => {
  return (
    <section className=" p-4">
      <div className="container">
        <div className="lg:grid flex flex-col-reverse items-center gap-8 lg:grid-cols-2">
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <h1 className="my-6 text-pretty text-3xl font-bold lg:text-6xl">
              {heading}
              <span className="text-red-600">{heading2}</span>
            </h1>
            <p className="mb-8 max-w-xl text-muted-foreground lg:text-xl">
              {description}
            </p>
            <div className="flex gap-2 w-full sm:flex-row lg:justify-start flex-col">
              {buttons.primary && (
                <Link href={buttons.primary.url} className="cursor-pointer ">
                  <button
                    type="submit"
                    className="relative bottom-0 lg:w-auto w-full cursor-pointer flex justify-center items-center gap-2 border border-blue-700 text-xl rounded-full text-[#FFF]  bg-blue-700  px-8 py-2 z-10 overflow-hidden ease-in-out duration-700 group hover:text-[#000] hover:bg-[#FFF] active:scale-95 active:duration-0 focus:bg-[#FFF] focus:text-[#000] isolation-auto before:absolute before:w-full before:transition-all before:duration-700 before:hover:w-full before:-left-full before:hover:left-0 before:rounded-full before:bg-[#FFF] before:-z-10 before:aspect-square before:hover:scale-150 before:hover:duration-700"
                  >
                    <span className="truncate eaes-in-out duration-300 group-active:-translate-x-96 group-focus:translate-x-96">
                      {buttons.primary.text}
                    </span>
                    <div className="absolute flex flex-row justify-center items-center gap-2 -translate-x-96 eaes-in-out duration-300 group-active:translate-x-0 group-focus:translate-x-0">
                      <div className="animate-spin size-4 border-2 border-[#000] border-t-transparent rounded-full" />
                      Processing...
                    </div>
                  </button>
                </Link>
              )}
              {buttons.secondary && (
                <Link href={buttons.secondary.url} className="cursor-pointer">
                  <button
                    type="submit"
                    className="relative bottom-0 lg:w-auto w-full flex cursor-pointer justify-center items-center gap-2 border border-[#000] text-xl rounded-full text-[#000]  bg-[#fff]  px-8 py-2 z-10 overflow-hidden ease-in-out duration-700 group hover:text-[#fff] hover:bg-blue-700 active:scale-95 active:duration-0 focus:bg-[#FFF] focus:text-[#000] isolation-auto before:absolute before:w-full before:transition-all before:duration-700 before:hover:w-full before:-left-full before:hover:left-0 before:rounded-full before:bg-[#FFF] before:-z-10 before:aspect-square before:hover:scale-150 before:hover:duration-700"
                  >
                    <span className="truncate eaes-in-out duration-300 group-active:-translate-x-96 group-focus:translate-x-96">
                      {buttons.secondary.text}
                    </span>
                    <div className="absolute flex flex-row justify-center items-center gap-2 -translate-x-96 eaes-in-out duration-300 group-active:translate-x-0 group-focus:translate-x-0">
                      <div className="animate-spin size-4 border-2 border-[#000] border-t-transparent rounded-full" />
                      Processing...
                    </div>
                  </button>
                </Link>
              )}
            </div>
          </div>
         <VideoPlayer />
        </div>
      </div>
    </section>
  );
};

export { Hero1 };
