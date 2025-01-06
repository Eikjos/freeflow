import CompleteLayoutWithoutSideBar from "@components/layouts/complete-layout";
import EnterpriseForm from "@components/templates/enterprise-form";
import Stepper from "@components/templates/stepper";
import { useTranslations } from "next-intl";
import { ReactNode } from "react";

const CreateEnterprisePage = () => {
  const t = useTranslations();
  return (
    <>
      <h1 className="text-center font-bold font-amica text-5xl mt-24">
        {t("enterprise.create")}
      </h1>
      <Stepper
        labels={["Les informations", "Verifications"]}
        components={[<EnterpriseForm />]}
        className="mt-20"
      />
    </>
  );
};

CreateEnterprisePage.getLayout = function getLayout(page: ReactNode) {
  return <CompleteLayoutWithoutSideBar>{page}</CompleteLayoutWithoutSideBar>;
};

export default CreateEnterprisePage;
