"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { Suspense } from "react";
import { LoginForm } from "../../components/templates/login-form";

const LoginPage = () => {
  const t = useTranslations();

  return (
    <div className="flex flew-row items-center h-screen">
      <div className="flex flex-col w-3/4 h-full justify-evenly">
        <Image
          src="/assets/login.png"
          alt="Auto entrepreneur"
          width={600}
          height={400}
          className="mx-auto"
        />
        <p className="text-3xl w-3/4 mx-auto text-center">
          Gérer votre vie d'entrepreneur facilement
        </p>
      </div>
      <div className="w-1/4 border-l-[1px] border-secondary h-full bg-card">
        <div className="flex flex-row items-center gap-4 justify-center my-5">
          <Image
            src="/assets/freeflow.png"
            width={55}
            height={55}
            alt="freeflow logo"
          />
          <span className="font-amica text-5xl">Freeflow</span>
        </div>
        <h1 className="text-5xl mt-28 text-center font-amica">{t("signIn")}</h1>
        <Suspense>
          <LoginForm className="mt-12 px-10" />
        </Suspense>
      </div>
    </div>
  );
};

export default LoginPage;
