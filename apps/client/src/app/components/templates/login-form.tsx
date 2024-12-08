"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LoginData, LoginDataValidation } from "@repo/shared-types";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { cn } from "../../../lib/utils";
import { login } from "../../actions/login";
import { Button } from "../ui/button";
import { Form } from "../ui/form";
import { Input } from "../ui/input";
import { SecretInput } from "../ui/secret-input";

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
    login(values.email, values.password).then((data) => {
      if (!data.success) {
        setError(data.message);
      }
    });
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
          {t("login.noAccount")}{" "}
          <a href="#" className="text-secondary">
            {t("login.createAccount")}
          </a>
        </p>
        <Button type="submit" className="w-40">
          {t("login.login")}
        </Button>
      </form>
    </Form>
  );
};
