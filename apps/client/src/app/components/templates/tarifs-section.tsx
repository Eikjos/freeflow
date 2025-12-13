import TarifCard from "./tarif-card";

export default function TarifsSection() {
  return (
    <div className="my-10" id="tarifs">
      <h2 className="text-2xl text-center text-secondary">Tarifications</h2>
      <p className="w-1/2 mx-auto text-center mt-10 text-muted-foreground mb-10">
        <span className="text-2xl font-semibold text-black">Des prix simples et transparent</span>
        <br />
        Choissisez le plan qui vous correspond
      </p>
      <div className="grid grid-cols-3 gap-5 w-2/3 mx-auto">
        <TarifCard price={50} maxUser={-1} title="Basique" description="Pour les entrepreneurs débutants" />
        <TarifCard price={50} maxUser={-1} title="Basique" description="Pour les entrepreneurs débutants" />
        <TarifCard price={50} maxUser={-1} title="Basique" description="Pour les entrepreneurs débutants" />
      </div>
    </div>
  )
}