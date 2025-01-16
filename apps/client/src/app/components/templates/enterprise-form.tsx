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
  const { setIsValid } = useStepper();
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

  const updateFormValues = (data: EnterpriseInformation) => {
    form.reset({
      name: data.name,
      TVANumber: data.TVANumber,
      city: data.city,
      address: data.address,
      zipCode: data.zipCode,
      juridicShape: data.juridicShape,
      countryId: 60,
      siret: data.siret,
    });
  };

  useEffect(() => {
    getCountries().then((data) => {
      setCountries(data);
    });
    getJuridicShapes().then((data) => {
      setJuridicShapes(data);
    });
  }, []);

  useEffect(() => {
    // Notifier au stepper que peut passer à la prochaine étape
    setIsValid(form.formState.isValid);
  }, [form.formState.isValid]);

  const fillFormWithEnterpriseinfo = () => {
    fetchEnterpriseInfo(form.getValues().siret.replace(" ", "")).then(
      (data) => {
        if (data !== null) {
          updateFormValues(data);
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
                <h4 className="text-xl font-bold w-full">Informations</h4>
                <Input
                  type="text"
                  label="Siret"
                  placeholder="Siret"
                  className="mt-4"
                  description="Peut pré-remplir tous les champs si possible"
                  {...form.register("siret")}
                />
                <Button
                  className="mt-2"
                  type="button"
                  onClick={fillFormWithEnterpriseinfo}
                >
                  Remplir
                </Button>
                <Input
                  type="text"
                  label="Nom de l'entreprise"
                  placeholder="Nom de l'entreprise"
                  className="mt-[1.8rem]"
                  {...form.register("name")}
                />
                <Select
                  label="Forme juridique"
                  className="mt-3"
                  placeholder="Forme juridique"
                  values={juridicShapes.map((item) => ({
                    value: item.code,
                    textValue: item.designation,
                  }))}
                  {...form.register("juridicShape")}
                />
                <Input
                  type="text"
                  label="Numero de TVA"
                  placeholder="Numero de TVA"
                  className="mt-3"
                  {...form.register("TVANumber")}
                />
              </div>
              <div className="w-1/3 border-r-[3px] border-secondary pl-2 pr-5 py-3 flex flex-col items-center h-full">
                <h4 className="text-xl font-bold w-full">Localité</h4>
                <Input
                  type="text"
                  label="Adresse Postale"
                  placeholder="Adresse Postale"
                  className="mt-4"
                  {...form.register("address")}
                />
                <Input
                  type="text"
                  label="Code Postale"
                  placeholder="Code Postale"
                  className="mt-4"
                  {...form.register("zipCode")}
                />
                <Input
                  type="text"
                  label="Ville"
                  placeholder="Ville"
                  className="mt-4"
                  {...form.register("city")}
                />
                <Select
                  label="Pays"
                  placeholder="Pays"
                  values={countries.map((c) => ({
                    value: c.id.toString(),
                    textValue: t(c.name),
                  }))}
                  className="mt-3"
                  {...form.register("countryId")}
                />
              </div>
              <div className="w-1/3 pl-2 pr-5 py-3 flex flex-col items-center h-full">
                <h4 className="text-xl font-bold w-full">Contact</h4>
                <Input
                  type="text"
                  label="Adresse mail"
                  placeholder="Adresse mail"
                  className="mt-5"
                  {...form.register("email")}
                />
                <Input
                  type="text"
                  label="Téléphone"
                  placeholder="Téléphone"
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
