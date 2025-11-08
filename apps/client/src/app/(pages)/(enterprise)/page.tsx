import ObjectiveCard from "@components/templates/objective-card";

export default function Home() {
  return (
    <div className="px-4 py-2">
      <h1 className="font-amica text-4xl">Tableau de bord</h1>
      <ObjectiveCard className="w-1/4 h-[400px]" />
      {/* <PrevisionCAChart /> */}
    </div>
  );
}
