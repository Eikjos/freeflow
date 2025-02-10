"use client";

import { Card, CardContent } from "@components/ui/card";
import InputFile from "@components/ui/input-file";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useFormContext } from "react-hook-form";
import { EnterpriseCreateModel } from "@repo/shared-types";

const EnterpriseLogoForm = () => {
  const t = useTranslations();
  const form = useFormContext<EnterpriseCreateModel>();
  const { logo } = form.watch();

  const onChangeInput = (files: File[]) => {
    var file = files[files.length - 1];
    if (file) {
      form.setValue("logo", file, { shouldValidate: true });
    } else {
      form.setValue("logo", undefined, { shouldValidate: false });
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
          {logo && (
            <Image
              src={URL.createObjectURL(logo)}
              width={500}
              height={150}
              className="object-contain w-96 h-32"
              alt="Logo de votre entreprise"
            />
          )}
          {!logo && (
            <div className="w-48 mx-auto">
              <p className="text-sm text-center">
                {t("common.previsualizeImage")}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EnterpriseLogoForm;
