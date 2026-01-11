"use client";

import { Button } from "@components/ui/button";
import { Card, CardContent, CardHeader } from "@components/ui/card";
import { Form } from "@components/ui/form";
import { Input } from "@components/ui/input";
import { Select } from "@components/ui/select";
import { Separator } from "@components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CustomerCreateModel,
  CustomerCreateValidation,
  CustomerDetailModel,
  EnterpriseInformation,
} from "@repo/shared-types";
import { useQuery } from "@tanstack/react-query";
import { UpdateCustomer } from "actions/customer";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { getAllCountriesQueryOptions } from "../../../lib/api/countries";
import { fetchEnterpriseInfo } from "../../../lib/api/enterprise";
import getQueryClient from "../../../lib/query-client";

type CustomerFormVerifProps = {
  customer: CustomerDetailModel;
};

export default function CustomerFormVerif({
  customer,
}: CustomerFormVerifProps) {
  const router = useRouter();
  const t = useTranslations();
  const queryClient = getQueryClient();
  const { data: countries } = useQuery(getAllCountriesQueryOptions());
  const form = useForm<CustomerCreateModel>({
    resolver: zodResolver(CustomerCreateValidation),
    defaultValues: {
      name: customer.name,
      siret: customer.siret,
      tvaNumber: customer.tvaNumber,
      address: customer.address,
      city: customer.city,
      zipCode: customer.zipCode,
      countryId: customer.countryId.toString(),
      phone: customer.phone,
      email: customer.email,
    },
  });

  const onSubmit = (values: CustomerCreateModel) => {
    if (form.formState.isDirty) {
      UpdateCustomer(customer.id, values).then((res) => {
        if (res === null) {
          toast.error(t("customer.error.edit"));
        } else {
          toast.success(t("customer.success.edit"));
          queryClient.invalidateQueries({
            queryKey: ["customers", customer.id],
          });
          router.push("/customers/dashboard");
        }
      });
    } else {
      router.push("/customers/dashboard");
    }
  };

  const updateFormValues = async (
    email: string,
    phone: string,
    data?: EnterpriseInformation
  ) => {
    if (data) {
      // eslint-disable-next-line no-unused-vars
      const { juridicShape, ...customerInfo } = data;
      form.reset({
        ...customerInfo,
        email,
        phone,
      });
    } else {
      form.reset({ email, phone });
    }
    form.trigger([
      "name",
      "address",
      "city",
      "tvaNumber",
      "zipCode",
      "countryId",
    ]);
  };

  const fillFormWithEnterpriseinfo = async () => {
    const data = await fetchEnterpriseInfo(
      form.getValues().siret?.replace(/\s+/g, "") ?? ""
    );
    if (data && data.ok && data.data) {
      updateFormValues(
        form.getValues().email,
        form.getValues().phone,
        data.data
      );
    }
  };

  return (
    <Card className="w-1/2 mx-auto mt-10 mb-28">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent>
            <CardHeader className="font-semibold p-0 my-5 text-xl">
              <h1>{t("customer.verif.title")}</h1>
            </CardHeader>
            <div className="flex flex-col gap-3">
              <Input
                type="text"
                label={t("enterprise.name")}
                {...form.register("name")}
              />
              <Input
                type="text"
                label={t("enterprise.tvaNumber")}
                {...form.register("tvaNumber")}
              />
              <Input
                type="text"
                label={t("common.siret")}
                {...form.register("siret")}
              />
              <Button
                className="mx-auto px-10"
                onClick={fillFormWithEnterpriseinfo}
                type="button"
              >
                {t("common.fill")}
              </Button>
              <p className="text-sm text-muted-foreground text-center w-[500px] mx-auto">
                {t("common.fillWithSiret")}
              </p>
              <Separator className="bg-secondary" />
              <h2 className="font-semibold">{t("common.localisation")}</h2>
              <Input
                type="text"
                label={t("common.address")}
                {...form.register("address")}
              />
              <Input
                type="text"
                label={t("common.zipCode")}
                {...form.register("zipCode")}
              />
              <Input
                type="text"
                label={t("common.city")}
                {...form.register("city")}
              />
              <Select
                label={t("common.country")}
                placeholder={t("common.country")}
                values={(countries?.data ?? []).map((c) => ({
                  value: c.id.toString(),
                  textValue: t(c.name),
                }))}
                className="mt-3"
                {...form.register("countryId")}
              />
              <Separator className="bg-secondary" />
              <h2 className="font-semibold">{t("common.contact")}</h2>
              <Input
                type="text"
                label={t("common.email")}
                {...form.register("email")}
              />
              <Input
                type="text"
                label={t("common.phone")}
                {...form.register("phone")}
              />
              <Button className="mx-auto px-10 mt-5" type="submit">
                {t("common.validate")}
              </Button>
            </div>
          </CardContent>
        </form>
      </Form>
    </Card>
  );
}
