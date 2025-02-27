"use client";

import { Button } from "@components/ui/button";
import { Card, CardContent, CardFooter } from "@components/ui/card";
import { Form } from "@components/ui/form";
import { Input } from "@components/ui/input";
import { Select } from "@components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CountryData,
  CustomerCreateModel,
  CustomerCreateValidation,
  EnterpriseInformation,
} from "@repo/shared-types";
import { getCountries } from "actions/countries";
import { CreateCustomer } from "actions/customer";
import { fetchEnterpriseInfo } from "actions/enterprise";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

type CustomerFormProps = {
  className?: string;
};

export default function CustomerForm({ className }: CustomerFormProps) {
  const t = useTranslations();
  const router = useRouter();
  const [countries, setCountries] = useState<CountryData[]>([]);
  const form = useForm<CustomerCreateModel>({
    resolver: zodResolver(CustomerCreateValidation),
    defaultValues: {
      siret: "",
      name: "",
      address: "",
      city: "",
      phone: "",
      tvaNumber: "",
      email: "",
      zipCode: "",
    },
  });

  const updateFormValues = async (
    data: EnterpriseInformation,
    email: string,
    phone: string
  ) => {
    // eslint-disable-next-line no-unused-vars
    const { juridicShape, TVANumber, ...customerInfo } = data;
    form.reset({
      ...customerInfo,
      tvaNumber: TVANumber,
      email,
      phone,
    });
    form.trigger([
      "siret",
      "name",
      "address",
      "city",
      "tvaNumber",
      "zipCode",
      "countryId",
    ]);
  };

  const fillFormWithEnterpriseinfo = () => {
    console.log(form.getValues());
    if (form.getValues().siret !== undefined) {
      fetchEnterpriseInfo(
        form.getValues().siret?.replace(/\s+/g, "") ?? ""
      ).then((data) => {
        if (data !== null) {
          updateFormValues(
            data,
            form.getValues().email,
            form.getValues().phone
          );
        }
      });
    }
  };

  const onSubmit = (values: CustomerCreateModel) => {
    console.log("coucou");
    CreateCustomer(values).then((res) => {
      if (res === null) {
        console.log("error");
      } else {
        router.push("/customers");
      }
    });
  };

  useEffect(() => {
    getCountries().then((res) => {
      setCountries(res);
    });
  }, []);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
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
                  className="mt-[1.8rem] w-full"
                  {...form.register("name")}
                />
                <Input
                  type="text"
                  label={t("enterprise.tvaNumber")}
                  placeholder={t("enterprise.tvaNumber")}
                  className="mt-3 w-full"
                  {...form.register("tvaNumber")}
                />
              </div>
              <div className="border-r-2 border-secondary h-full py-4 w-1/3 pr-5 flex flex-col items-center">
                <h4 className="text-lg font-bold w-full">
                  {t("common.localisation")}
                </h4>
                <Input
                  type="text"
                  label={t("common.address")}
                  placeholder={t("common.address")}
                  className="mt-4 w-full"
                  {...form.register("address")}
                />
                <Input
                  type="text"
                  label={t("common.zipCode")}
                  placeholder={t("common.zipCode")}
                  className="mt-3 w-full"
                  {...form.register("zipCode")}
                />
                <Input
                  type="text"
                  label={t("common.city")}
                  placeholder={t("common.city")}
                  className="mt-3 w-full"
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
              <div className="h-full py-4 w-1/3 flex flex-col items-center">
                <h4 className="text-lg font-bold w-full">
                  {t("common.contact")}
                </h4>
                <Input
                  type="email"
                  label={t("common.email")}
                  placeholder={t("common.email")}
                  className="mt-4 w-full"
                  {...form.register("email")}
                />
                <Input
                  type="phone"
                  label={t("common.phone")}
                  placeholder={t("common.phone")}
                  className="mt-[1.8rem] w-full"
                  {...form.register("phone")}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-row justify-end">
            <Button type="submit" disabled={!form.formState.isValid}>
              Créer
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
