import { getTranslations } from "next-intl/server";
import TarifCard from "./tarif-card";

export default async function TarifsSection() {
  const t = await getTranslations();
  return (
    <div className="my-10" id="tarifs">
      <h2 className="text-2xl text-center text-secondary">{t("landing.prices.title")}</h2>
      <p className="w-1/2 mx-auto text-center mt-10 text-muted-foreground mb-10">
        <span className="text-2xl font-semibold text-black">{t("landing.prices.description1")}</span>
        <br />
        {t("landing.prices.description2")}
      </p>
      <div className="grid grid-cols-3 gap-5 w-2/3 mx-auto">
        <TarifCard price={50} maxUser={-1} title={t("landing.prices.cards.basic.title")} description={t("landing.prices.cards.basic.description")} />
        <TarifCard price={50} maxUser={-1} title={t("landing.prices.cards.basic.title")} description={t("landing.prices.cards.basic.description")} />
        <TarifCard price={50} maxUser={-1} title={t("landing.prices.cards.basic.title")} description={t("landing.prices.cards.basic.description")} />
      </div>
    </div>
  )
}