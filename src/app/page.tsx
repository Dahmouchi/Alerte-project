import { Hero1 } from "./_components/Hero";
import Header from "./_components/Header"
export default function Home() {
  return (
    <div className="relative min-h-screen bg-cover   flex items-center bg-white dark:bg-slate-900" style={{backgroundImage:'url("/Element.png")'}}>
      <div className="absolute top-0 w-full">
        <Header />
      </div>
      <div className="lg:p-8" >
        <Hero1
          heading={"Soumission/Consultation des "}
          heading2={"Alertes"}
          description={
            "Tout salarié du Groupe, ainsi que toute personne visée par les lois en vigueur (candidat à l’emploi, ancien collaborateur, actionnaire et associé, collaborateur extérieur et occasionnel, fournisseur) a la possibilité de signaler des faits portant sur un crime, un délit, une menace ou un préjudice pour l’intérêt général, une violation d’un engagement international ratifié par la France notamment, en utilisant la plateforme  CompliVOX."
          }
          image={{
            src: "",
            alt: "",
          }}
        />
      </div>
    </div>
  );
}
