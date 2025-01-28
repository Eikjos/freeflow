"use client";

import { Button } from "@components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@components/ui/card";
import { Input } from "@components/ui/input";
import { CountryData, JuridicShapeData } from "@repo/shared-types";
import { getCountryById } from "actions/countries";
import { getJuridicShapeById } from "actions/juridic-shape";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useStepper } from "./stepper";

export default function RecapEnterpriseForm() {
  const { data } = useStepper();
  const [country, setCountry] = useState<CountryData>();
  const [juridicShape, setJuridicShape] = useState<JuridicShapeData>();

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
        <h2 className="text-3xl font-bold">Recapitulalif</h2>
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
            <h4 className="text-xl font-bold w-full">Informations</h4>
            <Input
              type="text"
              label="Siret"
              placeholder="Siret"
              className="mt-4"
              value={data.siret}
              disabled
            />
            <Input
              type="text"
              label="Nom"
              placeholder="Siret"
              className="mt-4"
              value={data.name}
              disabled
            />
            <Input
              type="text"
              label="Forme juridique"
              placeholder="Siret"
              className="mt-4"
              value={juridicShape?.designation ?? ""}
              disabled
            />
            <Input
              type="text"
              label="Numero de TVA"
              placeholder="Siret"
              className="mt-4"
              value={data.TVANumber}
              disabled
            />
          </div>
          <hr className="border-secondary border-t-2 w-3/4 mx-auto my-5" />
          <div>
            <h4 className="text-xl font-bold w-full">Localite</h4>
            <Input
              type="text"
              label="Adresse"
              placeholder="Siret"
              className="mt-4"
              value={data.address}
              disabled
            />
            <Input
              type="text"
              label="Ville"
              placeholder="Siret"
              className="mt-4"
              value={data.city}
              disabled
            />
            <Input
              type="text"
              label="Code postale"
              placeholder="Siret"
              className="mt-4"
              value={data.zipCode}
              disabled
            />
            <Input
              type="text"
              label="Pays"
              placeholder="Siret"
              className="mt-4"
              value={country?.name ?? ""}
              disabled
            />
          </div>
          <hr className="border-secondary border-t-2 w-3/4 mx-auto my-5" />
          <div>
            <h4 className="text-xl font-bold w-full">Contact</h4>
            <Input
              type="text"
              label="Adresse mail"
              placeholder="Siret"
              className="mt-4"
              value={data.email}
              disabled
            />
            <Input
              type="text"
              label="Telephone"
              placeholder="Telephone"
              className="mt-4"
              value={data.phone}
              disabled
            />
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button className="mx-auto">Creer mon entreprise</Button>
      </CardFooter>
    </Card>
  );
}
