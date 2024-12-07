"use client";

import { SecretInput } from "@components/ui/secret-input";
import { zodResolver } from "@hookform/resolvers/zod";
import { login } from "@lib/api/auth/login";
import { cn } from "@lib/utils";
import { LoginData, LoginDataValidation } from "@repo/shared-types";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Form } from "../ui/form";
import { Input } from "../ui/input";

type LoginFormProps = {
  className?: string;
};

export const LoginForm = ({ className }: LoginFormProps) => {
  const [error, setError] = useState<string>();
  const t = useTranslations();
  const form = useForm<LoginData>({
    resolver: zodResolver(LoginDataValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const onSubmit = (values: LoginData) => {
    login(values.email, values.password)
      .then((data) => console.log(data))
      .catch((e: TypeError) => setError(e.message));
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("px-10 flex flex-col items-center gap-7", className)}
      >
        {error && (
          <p className="text-sm text-destructive w-full text-center">
            {t(error)}
          </p>
        )}
        <Input
          {...form.register("email")}
          className="w-full"
          placeholder="Adresse mail"
          label="Adresse mail"
        />
        <SecretInput
          {...form.register("password")}
          placeholder="Mot de passe"
          label="Mot de passe"
        />
        <p className="text-sm">
          Pas encore de compte ?{" "}
          <a href="#" className="text-secondary">
            Inscrivez-vous
          </a>
        </p>
        <Button type="submit" className="w-40">
          Se connecter
        </Button>
      </form>
    </Form>
  );
};
