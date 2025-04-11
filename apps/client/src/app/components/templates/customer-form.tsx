"use client";

import { Button } from "@components/ui/button";
import { Card, CardContent, CardFooter } from "@components/ui/card";
import { Form } from "@components/ui/form";
import { Input } from "@components/ui/input";
import { Select } from "@components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CustomerCreateModel,
  CustomerCreateValidation,
  CustomerDetailModel,
  EnterpriseInformation,
} from "@repo/shared-types";
import { useQuery } from "@tanstack/react-query";
import { CreateCustomer, UpdateCustomer } from "actions/customer";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { getAllCountriesQueryOptions } from "../../../lib/api/countries";
import { fetchEnterpriseInfo } from "../../../lib/api/enterprise";
import getQueryClient from "../../../lib/query-client";

type CustomerFormProps = {
  className?: string;
  edit?: boolean;
  customerId?: number;
  data?: CustomerDetailModel;
};

export default function CustomerForm({
  className,
  edit,
  customerId,
  data,
}: CustomerFormProps) {
  const queryClient = getQueryClient();
  const t = useTranslations();
  const router = useRouter();
  const form = useForm<CustomerCreateModel>({
    resolver: zodResolver(CustomerCreateValidation),
    defaultValues: {
      siret: edit ? (data?.siret ?? "") : "",
      name: edit ? (data?.name ?? "") : "",
      address: edit ? (data?.address ?? "") : "",
      city: edit ? (data?.city ?? "") : "",
      phone: edit ? (data?.phone ?? "") : "",
      tvaNumber: edit ? (data?.tvaNumber ?? "") : "",
      email: edit ? (data?.email ?? "") : "",
      zipCode: edit ? (data?.zipCode ?? "") : "",
      countryId: edit ? (data?.countryId.toString() ?? "") : "",
    },
  });
  const siret = form.watch("siret");
  const updateFormValues = async (
    email: string,
    phone: string,
    data?: EnterpriseInformation
  ) => {
    if (data) {
      // eslint-disable-next-line no-unused-vars
      const { juridicShape, TVANumber, ...customerInfo } = data;
      form.reset({
        ...customerInfo,
        tvaNumber: TVANumber,
        email,
        phone,
      });
    } else {
      form.reset({ email, phone, siret });
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

  const onSubmit = (values: CustomerCreateModel) => {
    if (edit && customerId) {
      UpdateCustomer(customerId, values).then((res) => {
        if (res === null) {
          toast.error(t("customer.error.edit"));
        } else {
          toast.success(t("customer.success.edit"));
          queryClient.invalidateQueries({
            queryKey: ["customers", customerId],
          });
          router.push("/customers");
        }
      });
    } else {
      CreateCustomer(values).then((res) => {
        if (res === null) {
          toast.error(t("customer.error.create"));
        } else {
          toast.success(t("customer.success.create"));
          router.push("/customers");
        }
      });
    }
  };

  const { data: countries } = useQuery(getAllCountriesQueryOptions());

  const fillFormWithEnterpriseinfo = async () => {
    const data = await fetchEnterpriseInfo(siret?.replace(/\s+/g, "") ?? "");
    if (data && data.ok && data.data) {
      updateFormValues(
        form.getValues().email,
        form.getValues().phone,
        data.data
      );
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card className={className}>
          <CardContent>
            <div className="flex flew-row gap-4 pt-4">
              <div className="border-r-2 border-secondary h-full py-4 pr-5 w-1/3 flex flex-col items-center">
                <h4 className="text-lg font-bold w-full">
                  {t("common.informations")}
                </h4>
                <Input
                  type="text"
                  label={t("enterprise.siret")}
                  placeholder={t("enterprise.siret")}
                  className="mt-4 w-full"
                  description={t("enterprise.fillForm")}
                  {...form.register("siret")}
                />
                <Button
                  className="mt-2"
                  type="button"
                  onClick={fillFormWithEnterpriseinfo}
                >
                  {t("common.fill")}
                </Button>
                <Input
                  type="text"
                  label={t("enterprise.name")}
                  placeholder={t("enterprise.name")}
                  className="mt-[1.8rem] w-full"
                  {...form.register("name")}
                />
                <Input
                  type="text"
                  label={t("enterprise.tvaNumber")}
                  placeholder={t("enterprise.tvaNumber")}
                  className="mt-3 w-full"
                  {...form.register("tvaNumber")}
                />
              </div>
              <div className="border-r-2 border-secondary h-full py-4 w-1/3 pr-5 flex flex-col items-center">
                <h4 className="text-lg font-bold w-full">
                  {t("common.localisation")}
                </h4>
                <Input
                  type="text"
                  label={t("common.address")}
                  placeholder={t("common.address")}
                  className="mt-4 w-full"
                  {...form.register("address")}
                />
                <Input
                  type="text"
                  label={t("common.zipCode")}
                  placeholder={t("common.zipCode")}
                  className="mt-3 w-full"
                  {...form.register("zipCode")}
                />
                <Input
                  type="text"
                  label={t("common.city")}
                  placeholder={t("common.city")}
                  className="mt-3 w-full"
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
              </div>
              <div className="h-full py-4 w-1/3 flex flex-col items-center">
                <h4 className="text-lg font-bold w-full">
                  {t("common.contact")}
                </h4>
                <Input
                  type="email"
                  label={t("common.email")}
                  placeholder={t("common.email")}
                  className="mt-4 w-full"
                  {...form.register("email")}
                />
                <Input
                  type="phone"
                  label={t("common.phone")}
                  placeholder={t("common.phone")}
                  className="mt-[1.8rem] w-full"
                  {...form.register("phone")}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-row justify-end">
            <Button
              type="submit"
              isLoading={form.formState.isSubmitting}
              disabled={!form.formState.isValid}
            >
              {edit ? t("common.modify") : t("common.create")}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
