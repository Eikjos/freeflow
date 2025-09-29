"use client";

import { Button } from "@components/ui/button";
import { Card, CardContent, CardFooter } from "@components/ui/card";
import { Form } from "@components/ui/form";
import { Input } from "@components/ui/input";
import Loading from "@components/ui/loading";
import { Select } from "@components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { fetchExpenseCategories } from "../../../lib/api/expense-categories";

type ExpenseFormProps = {
  className?: string;
};

export default function ExpenseForm({ className }: ExpenseFormProps) {
  const t = useTranslations();
  const form = useForm();
  const { data, isLoading } = useQuery({
    queryFn: () => fetchExpenseCategories(),
    queryKey: ["expense", "category"],
  });

  if (isLoading)
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Loading />
      </div>
    );

  return (
    <Form {...form}>
      <form>
        <Card className={className}>
          <CardContent className="px-8 py-6">
            <Input label={t("common.name")} />
            <Input type="number" step={0.01} label={t("common.amount")} />
            <Select
              label={t("common.category")}
              values={
                data?.data?.map((e) => ({
                  value: e.id.toString(),
                  textValue: e.key ? t(e.key) : e.name,
                })) ?? []
              }
              {...form.register("")}
            />
            <CardFooter className="flex flex-row justify-end px-0 mt-5">
              <Button>{t("common.save")}</Button>
            </CardFooter>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}
