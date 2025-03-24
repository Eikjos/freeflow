"use client";

import { Button } from "@components/ui/button";
import { Form } from "@components/ui/form";
import { Input } from "@components/ui/input";
import { Select } from "@components/ui/select";
import {
  EnterpriseCreateModel,
  EnterpriseInformation,
} from "@repo/shared-types";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useFormContext } from "react-hook-form";
import { getAllCountriesQueryOptions } from "../../../lib/api/countries";
import { fetchEnterpriseInfoQueryOptions } from "../../../lib/api/enterprise";
import { getAllJuridicShapesQueryOptions } from "../../../lib/api/juridic-shapes";
import { Card, CardContent } from "../ui/card";

const EnterpriseForm = () => {
  const t = useTranslations();
  const form = useFormContext<EnterpriseCreateModel>();

  const updateFormValues = async (
    data: EnterpriseInformation,
    email: string,
    phone: string
  ) => {
    form.reset({ ...data, email, phone });
    form.trigger([
      "siret",
      "name",
      "address",
      "city",
      "TVANumber",
      "zipCode",
      "juridicShape",
      "countryId",
    ]);
  };

  const { data: countries } = useQuery(getAllCountriesQueryOptions());
  const { data: juridicShapes } = useQuery(getAllJuridicShapesQueryOptions());

  const fillFormWithEnterpriseinfo = () => {
    const { data } = useQuery(
      fetchEnterpriseInfoQueryOptions(
        form.getValues().siret.replace(/\s+/g, "")
      )
    );
    if (data && data.ok && data.data) {
      updateFormValues(
        data.data,
        form.getValues().email,
        form.getValues().phone
      );
    }
  };

  return (
    <>
      <Card className="w-3/4 h-auto mx-auto">
        <CardContent className="py-5 px-8">
          <Form {...form}>
            <form className="flex flew-row gap-2 items-start h-auto">
              <div className="w-1/3 border-r-[3px] border-secondary pl-2 pr-5 py-3 flex flex-col items-center h-full">
                <h4 className="text-xl font-bold w-full">
                  {t("common.informations")}
                </h4>
                <Input
                  type="text"
                  label={t("enterprise.siret")}
                  placeholder={t("enterprise.siret")}
                  className="mt-4"
                  description={t("enterprise.fillForm")}
                  {...form.register("siret")}
                />
                <Button
                  className="mt-2"
                  type="button"
                  onClick={fillFormWithEnterpriseinfo}
                >
                  {t("common.fill")}
                </Button>
                <Input
                  type="text"
                  label={t("enterprise.name")}
                  placeholder={t("enterprise.name")}
                  className="mt-[1.8rem]"
                  {...form.register("name")}
                />
                <Select
                  label={t("enterprise.juridicShape")}
                  className="mt-3"
                  placeholder={t("enterprise.juridicShape")}
                  values={(juridicShapes?.data ?? []).map((item) => ({
                    value: item.code,
                    textValue: item.designation,
                  }))}
                  {...form.register("juridicShape")}
                />
                <Input
                  type="text"
                  label={t("enterprise.tvaNumber")}
                  placeholder={t("enterprise.tvaNumber")}
                  className="mt-3"
                  {...form.register("TVANumber")}
                />
              </div>
              <div className="w-1/3 border-r-[3px] border-secondary pl-2 pr-5 py-3 flex flex-col items-center h-full">
                <h4 className="text-xl font-bold w-full">
                  {t("common.localisation")}
                </h4>
                <Input
                  type="text"
                  label={t("common.address")}
                  placeholder={t("common.address")}
                  className="mt-4"
                  {...form.register("address")}
                />
                <Input
                  type="text"
                  label={t("common.zipCode")}
                  placeholder={t("common.zipCode")}
                  className="mt-4"
                  {...form.register("zipCode")}
                />
                <Input
                  type="text"
                  label={t("common.city")}
                  placeholder={t("common.city")}
                  className="mt-4"
                  {...form.register("city")}
                />
                <Select
                  label={t("common.country")}
                  placeholder={t("common.country")}
                  values={(countries.data ?? []).map((c) => ({
                    value: c.id.toString(),
                    textValue: t(c.name),
                  }))}
                  className="mt-3"
                  {...form.register("countryId")}
                />
              </div>
              <div className="w-1/3 pl-2 pr-5 py-3 flex flex-col items-center h-full">
                <h4 className="text-xl font-bold w-full">
                  {t("common.contact")}
                </h4>
                <Input
                  type="text"
                  label={t("common.email")}
                  placeholder={t("common.email")}
                  className="mt-5"
                  {...form.register("email")}
                />
                <Input
                  type="text"
                  label={t("common.phone")}
                  placeholder={t("common.phone")}
                  className="mt-5"
                  {...form.register("phone")}
                />
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
};

export default EnterpriseForm;
