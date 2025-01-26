import CompleteLayoutWithoutSideBar from "@components/layouts/complete-layout";
import EnterpriseForm from "@components/templates/enterprise-form";
import EnterpriseLogoForm from "@components/templates/enterprise-logo-form";
import RecapEnterpriseForm from "@components/templates/recap-enterprise-form";
import { Stepper } from "@components/templates/stepper";
import { useTranslations } from "next-intl";
import { ReactNode } from "react";

const CreateEnterprisePage = () => {
  const t = useTranslations();
  return (
    <>
      <h1 className="text-center font-bold font-amica text-5xl mt-10">
        {t("enterprise.create")}
      </h1>
      <Stepper
        labels={["Les informations", "Logo", "Verifications"]}
        components={[
          <EnterpriseForm />,
          <EnterpriseLogoForm />,
          <RecapEnterpriseForm />,
        ]}
        className="mt-10"
      />
    </>
  );
};

CreateEnterprisePage.getLayout = function getLayout(page: ReactNode) {
  return <CompleteLayoutWithoutSideBar>{page}</CompleteLayoutWithoutSideBar>;
};

export default CreateEnterprisePage;
