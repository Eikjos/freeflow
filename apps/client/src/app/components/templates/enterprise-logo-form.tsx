"use client";

import { Card, CardContent } from "@components/ui/card";
import InputFile from "@components/ui/input-file";
import Image from "next/image";
import { useStepper } from "./stepper";

const EnterpriseLogoForm = () => {
  const { data, setData } = useStepper();

  const onChangeInput = (files: File[]) => {
    var file = files[files.length - 1];
    if (file) {
      setData({ ...data, logo: URL.createObjectURL(file), logoBlob: file });
    } else {
      setData({ ...data, logo: null, logoBlob: null });
    }
  };

  return (
    <Card className="w-1/2 h-auto mx-auto">
      <CardContent className="py-4 px-4 flex flex-row items-center">
        <InputFile
          onFilesSelected={onChangeInput}
          multiple={false}
          accept=".png, .jpeg, .jpg"
        />
        <div className="h-44 border-l-2 border-secondary ml-10 flex flex-row justify-center items-center w-full">
          {data.logo && (
            <Image
              src={data.logo}
              width={500}
              height={150}
              className="object-contain w-96 h-32"
              alt="Logo de votre entreprise"
            />
          )}
          {!data.logo && (
            <div className="w-48 mx-auto">
              <p className="text-sm text-center">
                Vous pouvez pre-visualiser l'image.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EnterpriseLogoForm;
