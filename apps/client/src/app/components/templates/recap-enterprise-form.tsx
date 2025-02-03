"use client";

import { Button } from "@components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@components/ui/card";
import { Input } from "@components/ui/input";
import { CountryData, JuridicShapeData } from "@repo/shared-types";
import { getCountryById } from "actions/countries";
import { createEnterprise } from "actions/enterprise";
import { getJuridicShapeById } from "actions/juridic-shape";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useStepper } from "./stepper";

export default function RecapEnterpriseForm() {
  const t = useTranslations();
  const { data } = useStepper();
  const router = useRouter();
  const [country, setCountry] = useState<CountryData>();
  const [juridicShape, setJuridicShape] = useState<JuridicShapeData>();

  const onCreateEnterprise = () => {
    // eslint-disable-next-line no-unused-vars
    const { Logo, logoBlob, ...enterprise } = data;
    createEnterprise(enterprise, logoBlob)
      .then((res) => {
        if (res) {
          router.replace("/");
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    getCountryById(data.countryId).then((res) => {
      setCountry(res);
    });

    getJuridicShapeById(data.juridicShape).then((res) => {
      setJuridicShape(res);
    });
  }, []);

  return (
    <Card className="w-1/2 mx-auto">
      <CardHeader>
        <h2 className="text-3xl font-bold">{t("enterprise.recap")}</h2>
      </CardHeader>
      <CardContent>
        {data.logo && (
          <Image
            src={data.logo}
            width={300}
            height={150}
            className="object-contain w-96 h-32 mb-10 mx-auto"
            alt="Logo de votre entreprise"
          />
        )}
        <form>
          <div>
            <h4 className="text-xl font-bold w-full">
              {t("common.informations")}
            </h4>
            <Input
              type="text"
              label={t("enterprise.siret")}
              placeholder={t("enterprise.siret")}
              className="mt-4"
              value={data.siret}
              disabled
            />
            <Input
              type="text"
              label={t("enterprise.name")}
              placeholder={t("enterprise.name")}
              className="mt-4"
              value={data.name}
              disabled
            />
            <Input
              type="text"
              label={t("enterprise.juridicShape")}
              placeholder={t("enterprise.juridicShape")}
              className="mt-4"
              value={juridicShape?.designation ?? ""}
              disabled
            />
            <Input
              type="text"
              label={t("enterprise.tvaNumber")}
              placeholder={t("enterprise.tvaNumber")}
              className="mt-4"
              value={data.TVANumber}
              disabled
            />
          </div>
          <hr className="border-secondary border-t-2 w-3/4 mx-auto my-5" />
          <div>
            <h4 className="text-xl font-bold w-full">
              {t("common.localisation")}
            </h4>
            <Input
              type="text"
              label={t("common.address")}
              placeholder={t("common.address")}
              className="mt-4"
              value={data.address}
              disabled
            />
            <Input
              type="text"
              label={t("common.city")}
              placeholder={t("common.city")}
              className="mt-4"
              value={data.city}
              disabled
            />
            <Input
              type="text"
              label={t("common.zipCode")}
              placeholder={t("common.zipCode")}
              className="mt-4"
              value={data.zipCode}
              disabled
            />
            <Input
              type="text"
              label={t("common.country")}
              placeholder={t("common.country")}
              className="mt-4"
              value={country?.name ?? ""}
              disabled
            />
          </div>
          <hr className="border-secondary border-t-2 w-3/4 mx-auto my-5" />
          <div>
            <h4 className="text-xl font-bold w-full">{t("common.contact")}</h4>
            <Input
              type="text"
              label={t("common.email")}
              placeholder={t("common.email")}
              className="mt-4"
              value={data.email}
              disabled
            />
            <Input
              type="text"
              label={t("common.phone")}
              placeholder={t("common.phone")}
              className="mt-4"
              value={data.phone}
              disabled
            />
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button className="mx-auto" onClick={onCreateEnterprise}>
          {t("enterprise.createMyEnterprise")}
        </Button>
      </CardFooter>
    </Card>
  );
}
