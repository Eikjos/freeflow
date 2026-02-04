"use client";

import { Button } from "@components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@components/ui/card";
import { Input } from "@components/ui/input";
import { EnterpriseCreateModel } from "@repo/shared-types";
import { useQuery } from "@tanstack/react-query";
import { createEnterprise } from "actions/enterprise";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useFormContext } from "react-hook-form";
import { toast } from "sonner";
import { getCountryByIdQueryOptions } from "../../../lib/api/countries";
import { getAllJuridicShapesByCodeQueryOptions } from "../../../lib/api/juridic-shapes";

export default function RecapEnterpriseForm() {
  const t = useTranslations();
  const form = useFormContext<EnterpriseCreateModel>();
  const router = useRouter();
  const data = form.getValues();
  const onCreateEnterprise = () => {
    const { logo, ...enterprise } = form.getValues();
    createEnterprise(enterprise, logo)
      .then((res) => {
        if (res) {
          router.replace("/dashboard");
        }
      })
      .catch((e: Error) => {
        toast.error(e.message);
      });
  };

  const { data: countryData } = useQuery(
    getCountryByIdQueryOptions(parseInt(data.countryId))
  );

  const { data: juridicShapeData } = useQuery(
    getAllJuridicShapesByCodeQueryOptions(data.juridicShape)
  );

  return (
    <Card className="w-1/2 mx-auto">
      <CardHeader>
        <h2 className="text-3xl font-bold">{t("enterprise.recap")}</h2>
      </CardHeader>
      <CardContent>
        {data.logo && (
          <Image
            src={URL.createObjectURL(data.logo)}
            width={300}
            height={150}
            className="object-contain w-96 h-32 mb-10 mx-auto"
            alt="Logo de votre entreprise"
          />
        )}
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
            value={juridicShapeData?.data?.designation ?? ""}
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
            value={countryData?.data?.name ? t(countryData.data.name) : ""}
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
      </CardContent>
      <CardFooter>
        <Button className="mx-auto" onClick={onCreateEnterprise}>
          {t("enterprise.createMyEnterprise")}
        </Button>
      </CardFooter>
    </Card>
  );
}
