"use client";

import { Card, CardContent } from "@components/ui/card";
import InputFile from "@components/ui/input-file";
import Image from "next/image";
import { useCallback, useMemo, useState } from "react";

const EnterpriseLogoForm = () => {
  const [logo, setLogo] = useState<Blob>();

  const onChangeInput = (files: Blob[]) => {
    setLogo(files[0]);
  };

  return (
    <Card className="w-1/2 h-auto mx-auto">
      <CardContent className="py-4 px-4 flex flex-row items-center">
        <InputFile
          onFilesSelected={onChangeInput}
          multiple={false}
          accept=".png, .jpeg, .jpg"
        />
        <div className="h-44 border-l-2 border-secondary pl-24 pb-10 ml-10 flex flex-row justify-center items-center">
          {logo && (
            <Image
              src={URL.createObjectURL(logo)}
              width={300}
              height={0}
              alt="Logo de votre entreprise"
            />
          )}
          {!logo && (
            <div className="w-56 ml-16 mt-9">
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
