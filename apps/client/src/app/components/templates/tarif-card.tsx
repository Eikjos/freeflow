import { Button } from "@components/ui/button";
import { Card, CardContent, CardDescription, CardHeader } from "@components/ui/card";
import { ArrowRight, Check } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { formatPrice } from "../../../lib/utils";

type TarifCardProps = {
  title: string;
  description: string;
  price: number;
  maxUser: number;
}

export default async function TarifCard({ price, title, description, maxUser }: TarifCardProps) {
  const t = await getTranslations();
  return (
    <Card className="hover:shadow-2xl hover:shadow-secondary">
      <CardContent>
        <CardHeader className="p-0 mt-5 text-primary font-bold">
          { title }
        </CardHeader>
        <CardDescription>
          {description }
        </CardDescription>
        <div className="flex flex-row items-baseline mt-5 mb-5 justify-center">
          <span className="text-3xl font-bold">{formatPrice(price, "FR-fr", "EUR")}</span>
          <span className="text-muted-foreground">/ {t("common.months")}</span>
        </div>
        <div>
          <ul className="px-1 text-sm font-extralight">
            <li className="flex flex-row items-center gap-3"><Check className="w-4 h-4 text-primary flex-shrink-0" /> {maxUser == -1 ? t("landing.prices.cards.customerInfinite"): t("landing.prices.cards.customerMax", { nbCutomers : maxUser})}</li>
            <li className="flex flex-row items-center gap-3"><Check className="w-4 h-4 text-primary flex-shrink-0" /> {t("landing.prices.cards.projectInfinite")}</li>
            <li className="flex flex-row items-center gap-3"><Check className="w-4 h-4 text-primary flex-shrink-0" /> {t("landing.prices.cards.manageCallback")}</li>
            <li className="flex flex-row items-center gap-3"><Check className="w-4 h-4 text-primary flex-shrink-0" /> {t("landing.prices.cards.opinionFeature")}</li>
            <li className="flex flex-row items-center gap-3"><Check className="w-4 h-4 text-primary flex-shrink-0" /> {t("landing.prices.cards.mcp")}</li>
          </ul>
        </div>
        <div className="text-center">
          <Button className="w-3/4 mt-10 mb-5 mx-auto rounded-3xl flex flex-row" asChild>
            <Link href="inscription/enterprise">
              {t("common.subscribe")}
              <ArrowRight />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}