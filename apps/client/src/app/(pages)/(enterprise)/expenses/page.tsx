import { Button } from "@components/ui/button";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

function ExpensesPage() {
  const t = useTranslations();
  return (
    <>
      <div className="flex flex-row justify-between items-center">
        <h1 className="font-amica text-4xl">{t("expense.titlePage")}</h1>
        <Button asChild>
          <Link href={"/expenses/create"}>
            <Plus />
            {t("expense.add")}
          </Link>
        </Button>
      </div>
    </>
  );
}

export default ExpensesPage;
