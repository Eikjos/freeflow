"use client";

import { Button } from "@components/ui/button";
import { Card, CardContent, CardHeader } from "@components/ui/card";
import { Form } from "@components/ui/form";
import { Input } from "@components/ui/input";
import { SecretInput } from "@components/ui/secret-input";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateUserData, CreateUserDataValidation } from "@repo/shared-types";
import { createUser } from "actions/users";
import { CircleCheckBig } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { cn } from "../../../lib/utils";

type EnterpriseInscriptionFormProps = {
  className?: string;
}

export default function EnterpriseInscriptionForm({ className }: EnterpriseInscriptionFormProps) {
  const [isOk, setIsOk] = useState(false);
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
    createUser(values, true).then((res) => {
      if (res.success) {
        setIsOk(true);
      } else {
        toast.error(res.message)
      }
    })
  }

  if (isOk) {
    return (
      <Card className={cn(className)}>
        <CardContent className="p-4">
          <CircleCheckBig color="green" size={50} className="mx-auto mt-10" />
          <p className="text-center my-5 text-muted-foreground">
            Votre compte a été créer avec succès. 
            <br />
            Prochaine étape créer votre entreprise !
          </p>
          <div className="text-center mb-10">
            <Button asChild className="inline-block">
              <Link href="/enterprises/create">
                Créer mon entrerprise
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
        <CardHeader className="pl-0 text-xl font-semibold">Formulaire d'inscription</CardHeader>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Form {...form}>
            <Input type="text" label="Prénom" {...form.register("firstName")} placeholder="Prénom" />
            <Input type="text" label="Nom" {...form.register("lastName")} placeholder="Nom" />
            <Input type="email" label="Adresse mail" {...form.register("email")}  placeholder="Adresse mail"/>
            <SecretInput label="Mot de passe" {...form.register("password")} placeholder="Mot de passe "/>
            <SecretInput label="Confirmation du mot de passe" {...form.register("confirmPassword")} placeholder="Confirmation du mot de passe"/>
            <div className="text-center">
              <Button type="submit" className="mt-5 mb-2 inline-block">Créer mon compte</Button>
            </div>
          </Form>
        </form>
      </CardContent>
    </Card>
  )
}