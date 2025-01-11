"use client";

import { Label } from "@components/ui/label";
import { Card, CardContent } from "../ui/card";
import { Input } from "@components/ui/input";
import { Form } from "@components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  EnterpriseCreateModel,
  EnterpriseCreateValidation,
} from "@repo/shared-types";
import { Button } from "@components/ui/button";
import { fetchEnterpriseInfo } from "actions/enterprise";

const EnterpriseForm = () => {
  const form = useForm<EnterpriseCreateModel>({
    resolver: zodResolver(EnterpriseCreateValidation),
    defaultValues: {
      siret: "",
    },
  });

  const fillFormWithEnterpriseinfo = () => {
    fetchEnterpriseInfo(form.getValues().siret);
  };

  return (
    <>
      <Card className="w-3/4 h-auto mx-auto">
        <CardContent className="py-5 px-8">
          <Form {...form}>
            <form className="flex flew-row gap-2 items-start h-96">
              <div className="w-1/3 border-r-[3px] border-secondary pl-2 pr-5 py-3 flex flex-col items-center h-full">
                <h4 className="text-xl font-bold w-full">Informations</h4>
                <Input
                  type="text"
                  label="Siret"
                  placeholder="Siret"
                  className="mt-5"
                  description="Peut pré-remplir tous les champs si possible"
                  {...form.register("siret")}
                />
                <Button className="mt-2" type="button">
                  Remplir
                </Button>
                <Input
                  type="text"
                  label="Nom de l'entreprise"
                  placeholder="Nom de l'entreprise"
                  className="mt-[1.6rem]"
                  {...form.register("siret")}
                />
                <Input
                  type="text"
                  label="Numero de TVA"
                  placeholder="Numero de TVA"
                  className="mt-2"
                  {...form.register("siret")}
                />
              </div>
              <div className="w-1/3 border-r-[3px] border-secondary pl-2 pr-5 py-3 flex flex-col items-center h-full">
                <h4 className="text-xl font-bold w-full">Localité</h4>
                <Input
                  type="text"
                  label="Adresse Postale"
                  placeholder="Siret"
                  className="mt-4"
                  {...form.register("siret")}
                />
                <Input
                  type="text"
                  label="Code Postale"
                  placeholder="Nom de l'entreprise"
                  className="mt-4"
                  {...form.register("siret")}
                />
                <Input
                  type="text"
                  label="Ville"
                  placeholder="Numero de TVA"
                  className="mt-4"
                  {...form.register("siret")}
                />
                <Input
                  type="text"
                  label="Pays"
                  placeholder="Numero de TVA"
                  className="mt-3"
                  {...form.register("siret")}
                />
              </div>
              <div className="w-1/3 pl-2 pr-5 py-3 flex flex-col items-center h-full">
                <h4 className="text-xl font-bold w-full">Contact</h4>
                <Input
                  type="text"
                  label="Adresse mail"
                  placeholder="Nom de l'entreprise"
                  className="mt-5"
                  {...form.register("siret")}
                />
                <Input
                  type="text"
                  label="Téléphone"
                  placeholder="Numero de TVA"
                  className="mt-5"
                  {...form.register("siret")}
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
