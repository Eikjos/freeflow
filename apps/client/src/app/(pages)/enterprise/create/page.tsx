import CompleteLayoutWithoutSideBar from "@components/layouts/complete-layout";
import EnterpriseForm from "@components/templates/enterprise-form";
import EnterpriseLogoForm from "@components/templates/enterprise-logo-form";
import Footer from "@components/templates/footer";
import Header from "@components/templates/header";
import RecapEnterpriseForm from "@components/templates/recap-enterprise-form";
import { Stepper } from "@components/templates/stepper";
import { useTranslations } from "next-intl";
import { ReactNode } from "react";

const CreateEnterprisePage = () => {
  const t = useTranslations();
  return (
    <>
      <Header />
      <div className="min-h-[calc(100vh-170px)]">
        <h1 className="text-center font-bold font-amica text-5xl mt-10">
          {t("enterprise.create")}
        </h1>
        <Stepper
          labels={[
            t("enterprise.informations"),
            t("enterprise.logo"),
            t("enterprise.recap"),
          ]}
          components={[
            <EnterpriseForm />,
            <EnterpriseLogoForm />,
            <RecapEnterpriseForm />,
          ]}
          className="mt-10"
        />
      </div>
      <Footer />
    </>
  );
};

CreateEnterprisePage.getLayout = function getLayout(page: ReactNode) {
  return <CompleteLayoutWithoutSideBar>{page}</CompleteLayoutWithoutSideBar>;
};

export default CreateEnterprisePage;
