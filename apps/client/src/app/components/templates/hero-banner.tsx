import { Button } from "@components/ui/button";
import { ArrowRight, PlayIcon } from "lucide-react";

export default function HeroBanner() {
  return (
    <div className="mt-10 mb-10">
      <h1
        className="text-4xl sm:text-5xl lg:text-6xl mb-6 text-center"
      >
        Gérez votre entreprise{" "}
        <span className="text-secondary">simplement</span>
        <br />
        et efficacement
      </h1>
      <p className="text-center w-1/2 mx-auto text-xl font-extralight">
        Facturation, dépenses, clients et projets réunis dans une seule application.
        Concentrez-vous sur votre métier, on s'occupe du reste.
      </p>
      <div className="w-1/2 mx-auto flex flex-row items-center gap-6 mt-10 justify-center">
        <Button className="w-1/3">
          Commencer <ArrowRight />
        </Button>
        <Button className="w-1/3"  variant="outline">
          Voir la démo <PlayIcon />
        </Button>
      </div>
    </div>
  
  )

}