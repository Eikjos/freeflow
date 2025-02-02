"use client";

import { Button } from "@components/ui/button";
import { Form } from "@components/ui/form";
import { Input } from "@components/ui/input";
import { Select } from "@components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CountryData,
  EnterpriseCreateModel,
  EnterpriseCreateValidation,
  EnterpriseInformation,
  JuridicShapeData,
} from "@repo/shared-types";
import { getCountries } from "actions/countries";
import { fetchEnterpriseInfo } from "actions/enterprise";
import { getJuridicShapes } from "actions/juridic-shape";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent } from "../ui/card";
import { useStepper } from "./stepper";

const EnterpriseForm = () => {
  const [countries, setCountries] = useState<CountryData[]>([]);
  const [juridicShapes, setJuridicShapes] = useState<JuridicShapeData[]>([]);
  const t = useTranslations();
  const { setIsValid, data, setData } = useStepper();
  const form = useForm<EnterpriseCreateModel>({
    resolver: zodResolver(EnterpriseCreateValidation),
    defaultValues: {
      siret: "",
      name: "",
      address: "",
      city: "",
      phone: "",
      TVANumber: "",
      email: "",
      zipCode: "",
    },
  });

  const updateFormValues = async (
    data: EnterpriseInformation,
    email: string,
    phone: string
  ) => {
    form.setValue("siret", data.siret, { shouldValidate: true });
    form.setValue("name", data.name, { shouldValidate: true });
    form.setValue("address", data.address, { shouldValidate: true });
    form.setValue("city", data.city, { shouldValidate: true });
    form.setValue("TVANumber", data.TVANumber, { shouldValidate: true });
    form.setValue("zipCode", data.zipCode, { shouldValidate: true });
    form.setValue("juridicShape", data.juridicShape, { shouldValidate: true });
    form.setValue("countryId", data.countryId, { shouldValidate: true });
    if (email) form.setValue("email", email, { shouldValidate: true });
    if (phone) form.setValue("phone", phone, { shouldValidate: true });
  };

  useEffect(() => {
    getCountries().then((data) => {
      setCountries(data);
    });
    getJuridicShapes().then((data) => {
      setJuridicShapes(data);
    });
    if (data) {
      updateFormValues(data, data.email, data.phone);
    }
  }, []);

  useEffect(() => {
    // Notifier au stepper que peut passer à la prochaine étape
    setIsValid(form.formState.isValid);
    if (form.formState.isValid) {
      setData({ ...data, ...form.getValues() });
    }
  }, [form.formState.isValid]);

  const fillFormWithEnterpriseinfo = () => {
    fetchEnterpriseInfo(form.getValues().siret.replace(" ", "")).then(
      (data) => {
        if (data !== null) {
          updateFormValues(
            data,
            form.getValues().email,
            form.getValues().phone
          );
        }
      }
    );
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
                  values={juridicShapes.map((item) => ({
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
                  values={countries.map((c) => ({
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
