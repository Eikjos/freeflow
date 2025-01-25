"use client";

import { Card, CardContent } from "@components/ui/card";
import InputFile from "@components/ui/input-file";

const EnterpriseLogoForm = () => {
  return (
    <Card className="w-3/4 h-auto mx-auto">
      <CardContent className="py-4 px-4 flex flex-row items-center">
        <InputFile onFilesSelected={(files) => console.log(files)} />
        <div className="h-44 w-3/4 border-l-2 border-secondary pl-10 ml-10">
          <p>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Magnam
            repellendus quidem ratione, quas earum quos velit consequatur.
            Aliquid reiciendis quae quasi totam quibusdam hic. Dicta ducimus
            aspernatur ad maxime! Eligendi?
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnterpriseLogoForm;
