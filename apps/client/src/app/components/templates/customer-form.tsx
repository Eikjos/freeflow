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
} from "@repo/shared-types";
import { getCountries } from "actions/countries";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

type CustomerFormProps = {
  className?: string;
};

export default function CustomerForm({ className }: CustomerFormProps) {
  const t = useTranslations();
  const [countries, setCountries] = useState<CountryData[]>([]);
  const form = useForm<CustomerCreateModel>({
    resolver: zodResolver(CustomerCreateValidation),
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
  console.log(form.register("siret"));

  useEffect(() => {
    getCountries().then((res) => {
      setCountries(res);
    });
  }, []);

  return (
    <Card className={className}>
      <CardContent>
        <Form {...form}>
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
              <Button className="mt-2" type="button">
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
                {...form.register("TVANumber")}
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
                label={t("common.city")}
                placeholder={t("common.city")}
                className="mt-[1.8rem] w-full"
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
        </Form>
      </CardContent>
      <CardFooter className="flex flex-row justify-end">
        <Button>Créer</Button>
      </CardFooter>
    </Card>
  );
}
