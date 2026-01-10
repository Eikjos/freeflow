"use client";

import { Button } from "@components/ui/button";
import { Card, CardContent, CardHeader } from "@components/ui/card";
import { Form } from "@components/ui/form";
import { Input } from "@components/ui/input";
import { SecretInput } from "@components/ui/secret-input";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateUserData, CreateUserDataValidation } from "@repo/shared-types";
import { createUser } from "actions/users";
import { CircleCheckBig, ShieldX } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { cn } from "../../../lib/utils";

type CustomerInscriptionFormProps = {
  className?: string;
  token: string;
}

export default function CustomerInscriptionForm({ className, token }: CustomerInscriptionFormProps) {
  const t = useTranslations();
  const [isOk, setIsOk] = useState(false);
  const [tokenInvalid, setTokenInvlid] = useState(false);
  const form = useForm<CreateUserData & { confirmPassword : string}>({
    resolver: zodResolver(CreateUserDataValidation),
    defaultValues: {
      firstName: '',
      lastName: '',
      password: '',
      email: '',
      confirmPassword: '',
    }
  });

  const onSubmit = (values: CreateUserData) => {
    createUser(values, false, token).then((res) => {
      if (res.success) {
        setIsOk(true);
      } else if (res.message == "customer.token.invalid") {
        setTokenInvlid(true);
      } else { 
        toast.error(res.message)
      }
    })
  }

  if (tokenInvalid) {
    return (
      <Card className={cn(className)}>
        <CardContent className="p-4">
          <ShieldX color="red" size={50} className="mx-auto mt-10" />
          <p className="text-center my-5 text-muted-foreground">
            La session pour créer un compte a expiré ou est inconnu
            <br />
            Il faut demander un nouveau lien à l'entreprise pour pouvoir se créer un compte.
          </p>
        </CardContent>  
      </Card>
    )
  }

  // Vérifier que les informations sur le client est OK
  if (isOk) {
    return (
      <Card className={cn(className)}>
        <CardContent className="p-4">
          <CircleCheckBig color="green" size={50} className="mx-auto mt-10" />
          <p className="text-center my-5 text-muted-foreground">
            {t("inscription.success.title")}
            <br />
            {t("inscription.success.subtitle")}
          </p>
          <div className="text-center mb-10">
            <Button asChild className="inline-block text-wrap text-center h-[50px] ">
              <Link href="/customers/recapitulatif">
                {t("inscription.recapCustomer")}
              </Link>
            </Button>
          </div>
        </CardContent>  
      </Card>
    )
  }


  return (
    <Card className={cn(className)}>
      <CardContent>
        <CardHeader className="pl-0 text-xl font-semibold">{t("inscription.form.title")}</CardHeader>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Form {...form}>
            <Input type="text" label={t("inscription.form.label.firstName")} {...form.register("firstName")} placeholder={t("inscription.form.label.firstName")}/>
            <Input type="text" label={t("inscription.form.label.lastName")} {...form.register("lastName")} placeholder={t("inscription.form.label.lastName")} />
            <Input type="email" label={t("common.email")} {...form.register("email")} placeholder={t("common.email")} />
            <SecretInput label={t("common.password")} {...form.register("password")} placeholder={t("common.password")}/>
            <SecretInput label={t("common.confirmPassword")} {...form.register("confirmPassword")} placeholder={t("common.confirmPassword")} />
            <div className="text-center">
              <Button type="submit" className="mt-5 mb-2 inline-block">{t("inscription.createAccount")}</Button>
            </div>
          </Form>
        </form>
      </CardContent>
    </Card>
  )
}