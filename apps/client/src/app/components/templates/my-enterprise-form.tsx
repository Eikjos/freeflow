"use client";

import { Card, CardContent } from "@components/ui/card";
import { Input } from "@components/ui/input";
import InputFile from "@components/ui/input-file";
import Loading from "@components/ui/loading";
import { Select } from "@components/ui/select";
import { Separator } from "@components/ui/separator";
import { EditEnterpriseData, EnterpriseData } from "@repo/shared-types";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useFormContext } from "react-hook-form";
import { getAllCountriesQueryOptions } from "../../../lib/api/countries";
import { getAllJuridicShapesQueryOptions } from "../../../lib/api/juridic-shapes";
import { getMediaUrl } from "../../../lib/utils";

type MyEnterpriseFormProps = {
  className?: string;
  enterprise: EnterpriseData;
};

export default function MyEnterpriseForm({
  className,
  enterprise,
}: MyEnterpriseFormProps) {
  const form = useFormContext<EditEnterpriseData>();
  const t = useTranslations();
  const { logo } = form.watch();

  const handleFileChange = (files: File[]) => {
    var file = files[files.length - 1];
    if (file) {
      form.setValue("logo", file, { shouldValidate: true });
    } else {
      form.setValue("logo", undefined, { shouldValidate: false });
    }
  };

  const { data: countryData, isLoading: isLoadingCountry } = useQuery(
    getAllCountriesQueryOptions()
  );

  const { data: juridicShapeData, isLoading: isLoadingJuridicShape } = useQuery(
    getAllJuridicShapesQueryOptions()
  );

  if (isLoadingCountry || isLoadingJuridicShape) {
    <div className="w-full h-96 flex flex-row justify-center items-center">
      <Loading />
    </div>;
  }

  return (
    <Card className={className}>
      <CardContent className="py-5 px-5 flex flex-row  gap-2 min-h-20">
        <div className="w-3/4 flex flex-col gap-2">
          <h3 className="font-semibold">Information sur l'entreprise</h3>
          <Input
            label={t("common.name")}
            placeholder="Nom de l'enterprise"
            {...form.register("name")}
          />
          <Input label={t("common.siret")} value={enterprise.siret} disabled />
          <Input
            label={t("enterprise.tvaNumber")}
            placeholder={t("enterprise.tvaNumber")}
            {...form.register("tvaNumber")}
          />
          {juridicShapeData && (
            <Select
              label={t("enterprise.juridicShape")}
              placeholder={t("enterprise.juridicShape")}
              values={
                juridicShapeData.data?.map((e) => ({
                  textValue: e.designation,
                  value: e.code,
                })) ?? []
              }
              {...form.register("juridicShapeId")}
            />
          )}

          <h3 className="font-semibold">Localité</h3>
          <Input
            label="Adresse"
            placeholder="Adresse"
            {...form.register("address")}
          />
          <div className="flex flex-row w-full gap-4">
            <Input
              label="Code postale"
              className="w-1/4"
              placeholder="Code Postale"
              {...form.register("zipCode")}
            />
            <Input
              label="Ville"
              className="w-3/4"
              placeholder="Ville"
              {...form.register("city")}
            />
          </div>
          {countryData && (
            <Select
              values={
                countryData.data?.map((c) => ({
                  textValue: t(c.name),
                  value: c.id.toString(),
                })) ?? []
              }
              label={t("common.country")}
              placeholder={t("common.country")}
              {...form.register("countryId")}
            />
          )}

          <h3 className="font-semibold">Contact</h3>
          <div className="flex flex-row w-full gap-4">
            <Input
              label={t("common.phone")}
              className="w-1/2"
              placeholder={t("common.phone")}
              {...form.register("phone")}
            />
            <Input
              label={t("common.email")}
              className="w-1/2"
              placeholder={t("common.email")}
              {...form.register("email")}
            />
          </div>
        </div>
        <Separator orientation="vertical" className="bg-secondary" />
        <div className="w-1/4 flex-col flex justify-center">
          <InputFile
            onFilesSelected={handleFileChange}
            label={"Glissez ici votre logo"}
            multiple={false}
            accept=".png, .jpeg, .jpg"
          />
          <div className="mt-10 mx-auto">
            {enterprise.mediaId && !logo && (
              <img src={getMediaUrl(enterprise.mediaId)} />
            )}
            {logo && <img src={URL.createObjectURL(logo)} />}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
