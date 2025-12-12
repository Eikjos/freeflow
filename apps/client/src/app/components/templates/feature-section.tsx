import { PenIcon } from "lucide-react";
import FeatureCard from "./feature-card";

export default function FeatureSection() {
  return (
    <div className="mt-10 border-t bg-card px-10 py-5">
      <h1 className="text-center text-2xl text-secondary">Fonctionnalités</h1>
      <p className="text-center text-3xl font-semibold w-1/2 mx-auto">
        Tout ce dont vous avez besoin
        <br />
        <span className="text-xl font-extralight">Une suite complète d'outils de A à Z</span>
      </p>
      <div className="my-10 grid grid-cols-2 gap-4 w-3/4 mx-auto">
        <FeatureCard
          title="Facturation"
          description="Créez et envoyez des factures professionnelles en quelques clics. Suivez les paiements et relancez automatiquement."
          icon={<PenIcon color="white" />}
          color="#3e6450" />
        <FeatureCard
          title="Suivi des dépenses"
          description="Catégorisez vos dépenses, scannez vos reçus et gardez une vue claire sur votre trésorerie en temps réel."
          icon={<PenIcon color="white" />}
          color="rgb(59, 130, 246)" />
        <FeatureCard
          title="Gestion des clients"
          description="Centralisez toutes les informations de vos clients. Historique, documents et communications au même endroit."
          icon={<PenIcon color="white" />}
          color="rgb(139, 92, 246)" />
        <FeatureCard
          title="Projets & Tâches"
          description="Organisez vos projets avec des tableaux Kanban. Assignez des tâches, fixez des échéances et suivez l'avancement."
          icon={<PenIcon color="white" />}
          color="#fea052" />
      </div>
    </div>
  )
}