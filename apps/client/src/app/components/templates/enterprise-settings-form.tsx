import { Button } from "@components/ui/button";
import { Form } from "@components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  EditEnterpriseData,
  EnterpriseData,
  EnterpriseEditValidation,
} from "@repo/shared-types";
import { useTranslations } from "next-intl";
import { FormProvider, useForm } from "react-hook-form";
import InvoiceInfoForm from "./invoice-info-form";
import MyEnterpriseForm from "./my-enterprise-form";

type EnterpriseSettingFormProps = {
  enterprise: EnterpriseData;
};

export default function EnterpriseSettingsForm({
  enterprise,
}: EnterpriseSettingFormProps) {
  const t = useTranslations();
  const form = useForm<EditEnterpriseData>({
    resolver: zodResolver(EnterpriseEditValidation),
    defaultValues: {
      name: enterprise.name,
      tvaNumber: enterprise.tvaNumber,
      juridicShapeId: enterprise.juridicShapeId,
      countryId: enterprise.countryId.toString(),
      city: enterprise.city,
      zipCode: enterprise.zipCode,
      address: enterprise.address,
      email: enterprise.email,
      phone: enterprise.phone,
      invoiceNumber: enterprise.invoiceNumber,
      invoicePrefixe: enterprise.invoicePrefixe,
    },
  });

  const onSubmit = (values: EditEnterpriseData) => {
    console.log("hello", values);
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit, (err) =>
        console.log(err, form.getValues())
      )}
    >
      <Form {...form}>
        <FormProvider {...form}>
          <MyEnterpriseForm className="mt-2" enterprise={enterprise} />
          <InvoiceInfoForm className="mt-2" />
        </FormProvider>
      </Form>
      <Button type="submit" className="float-right mt-5 mb-5">
        {t("common.save")}
      </Button>
    </form>
  );
}
