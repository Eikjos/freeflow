import CustomerForm from "@components/templates/customer-form";
import { useTranslations } from "next-intl";

export default function CreateCustomerPage() {
  const t = useTranslations();

  return (
    <>
      <h1 className="font-amica text-4xl mb-20">{t("customer.create")}</h1>
      <CustomerForm className="mt-20" />
    </>
  );
}
