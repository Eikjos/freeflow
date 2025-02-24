import { Button } from "@components/ui/button";
import { Card, CardContent, CardFooter } from "@components/ui/card";
import { Input } from "@components/ui/input";
import { useTranslations } from "next-intl";

type CustomerFormProps = {
  className?: string;
};

export default function CustomerForm({ className }: CustomerFormProps) {
  const t = useTranslations();
  return (
    <Card className={className}>
      <CardContent>
        <div className="flex flew-row gap-4 pt-4">
          <div className="border-r-2 border-secondary h-full py-4 pr-5 w-1/3 flex flex-col items-center">
            <h4 className="text-lg font-bold w-full">
              {t("common.informations")}
            </h4>
            <Input
              type="text"
              label={t("enterprise.siret")}
              placeholder={t("enterprise.siret")}
              className="mt-4 w-full"
              description={t("enterprise.fillForm")}
            />
            <Button className="mt-2" type="button">
              {t("common.fill")}
            </Button>
            <Input
              type="text"
              label={t("enterprise.name")}
              placeholder={t("enterprise.name")}
              className="mt-[1.8rem] w-full"
            />
            <Input
              type="text"
              label={t("enterprise.tvaNumber")}
              placeholder={t("enterprise.tvaNumber")}
              className="mt-3 w-full"
            />
          </div>
          <div className="border-r-2 border-secondary h-full py-4 w-1/3 pr-5 flex flex-col items-center">
            <h4 className="text-lg font-bold w-full">
              {t("common.localisation")}
            </h4>
            <Input
              type="text"
              label={t("enterprise.siret")}
              placeholder={t("enterprise.siret")}
              className="mt-4 w-full"
              description={t("enterprise.fillForm")}
            />
            <Button className="mt-2" type="button">
              {t("common.fill")}
            </Button>
            <Input
              type="text"
              label={t("enterprise.name")}
              placeholder={t("enterprise.name")}
              className="mt-[1.8rem] w-full"
            />
            <Input
              type="text"
              label={t("enterprise.tvaNumber")}
              placeholder={t("enterprise.tvaNumber")}
              className="mt-3 w-full"
            />
          </div>
          <div className="h-full py-4 w-1/3 flex flex-col items-center">
            <h4 className="text-lg font-bold w-full">{t("common.contact")}</h4>
            <Input
              type="text"
              label={t("enterprise.siret")}
              placeholder={t("enterprise.siret")}
              className="mt-4 w-full"
              description={t("enterprise.fillForm")}
            />
            <Button className="mt-2" type="button">
              {t("common.fill")}
            </Button>
            <Input
              type="text"
              label={t("enterprise.name")}
              placeholder={t("enterprise.name")}
              className="mt-[1.8rem] w-full"
            />
            <Input
              type="text"
              label={t("enterprise.tvaNumber")}
              placeholder={t("enterprise.tvaNumber")}
              className="mt-3 w-full"
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-row justify-end">
        <Button>Créer</Button>
      </CardFooter>
    </Card>
  );
}
