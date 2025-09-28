"use client";

import EnterpriseForm from "@components/templates/enterprise-form";
import EnterpriseLogoForm from "@components/templates/enterprise-logo-form";
import Footer from "@components/templates/footer";
import Header from "@components/templates/header";
import RecapEnterpriseForm from "@components/templates/recap-enterprise-form";
import { Stepper } from "@components/templates/stepper";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  EnterpriseCreateModel,
  EnterpriseCreateValidation,
} from "@repo/shared-types";
import { useTranslations } from "next-intl";
import { FormProvider, useForm } from "react-hook-form";

const CreateEnterprisePage = () => {
  const t = useTranslations();
  const form = useForm<EnterpriseCreateModel>({
    resolver: zodResolver(EnterpriseCreateValidation),
    defaultValues: {
      siret: "",
      name: "",
      address: "",
      city: "",
      phone: "",
      tvaNumber: "",
      juridicShape: "",
      email: "",
      zipCode: "",
      prefixeInvoice: "",
      lastInvoiceNumber: 0,
    },
  });

  return (
    <>
      <Header />
      <div className="min-h-[calc(100vh-170px)]">
        <h1 className="text-center font-bold font-amica text-5xl mt-10">
          {t("enterprise.create")}
        </h1>
        <FormProvider {...form}>
          <Stepper
            labels={[
              t("enterprise.informations"),
              t("enterprise.logo"),
              t("enterprise.recap"),
            ]}
            isValid={form.formState.isValid}
            components={[
              <EnterpriseForm />,
              <EnterpriseLogoForm />,
              <RecapEnterpriseForm />,
            ]}
            className="mt-10"
          />
        </FormProvider>
      </div>
      <Footer />
    </>
  );
};

export default CreateEnterprisePage;
