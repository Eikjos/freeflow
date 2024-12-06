"use client";

import { LoginForm } from "@components/ui/templates/login-form";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="flex flew-row items-center h-screen">
      <div className="flex flex-col w-3/4 h-full justify-evenly">
        <Image
          src="/assets/login.png"
          alt="Img"
          width={700}
          height={450}
          className="mx-auto"
        />
        <p className="text-5xl w-1/2 mx-auto text-center">
          Gérer votre vie d'entrepreneur facilement
        </p>
      </div>
      <div className="w-1/4 border-l-[1px] border-secondary h-full bg-card">
        <div className="flex flex-row items-center gap-4 justify-center my-5">
          <Image
            src="/assets/Freeflow.png"
            width={55}
            height={55}
            alt="freeflow logo"
          />
          <span className="font-amica text-5xl">Freeflow</span>
        </div>
        <h1 className="text-5xl mt-28 text-center font-amica">Connexion</h1>
        <LoginForm className="mt-12 px-20" />
      </div>
    </div>
  );
}
