import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@lib/utils";
import { LoginData, LoginDataValidation } from "@repo/shared-types";
import { useForm } from "react-hook-form";
import { Button } from "../button";
import { Form } from "../form";
import { Input } from "../input";

type LoginFormProps = {
  className?: string;
};

export const LoginForm = ({ className }: LoginFormProps) => {
  const form = useForm<LoginData>({
    resolver: zodResolver(LoginDataValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(() => console.log("coucou"))}
        className={cn("px-10 flex flex-col items-center gap-7", className)}
      >
        <Input
          {...form.register("email")}
          className="w-full"
          placeholder="Adresse mail"
          label="Adresse mail"
        />
        <Input
          {...form.register("password")}
          placeholder="Mot de passe"
          type="password"
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
