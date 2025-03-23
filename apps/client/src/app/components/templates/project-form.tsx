"use client";

import Autocomplete from "@components/molecules/autocomplete";
import { Card, CardContent } from "@components/ui/card";
import { Form } from "@components/ui/form";
import { Input } from "@components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProjectCreateData, ProjectCreateValidation } from "@repo/shared-types";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { getAllCustomersQueryOptions } from "../../../lib/api/customers";

type ProjectFormProps = {
  className?: string;
};

export default function ProjectForm({ className }: ProjectFormProps) {
  const t = useTranslations();
  const form = useForm<ProjectCreateData>({
    resolver: zodResolver(ProjectCreateValidation),
    defaultValues: {
      name: "",
      customerId: 1,
    },
  });
  return (
    <>
      <Form {...form}>
        <Card className={className}>
          <CardContent>
            <div className="w-1/3">
              <Input
                type="text"
                {...form.register("name")}
                label={t("common.name")}
              />
              <Autocomplete
                queryOptions={getAllCustomersQueryOptions}
                filterField="name"
                render={(customer) => customer.name}
                fieldIdentifier="id"
                {...form.register("customerId")}
                label="Client"
              />
            </div>
          </CardContent>
        </Card>
      </Form>
    </>
  );
}
