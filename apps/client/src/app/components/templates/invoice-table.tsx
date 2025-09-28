"use client";

import { DataTable } from "@components/ui/data-table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@components/ui/tooltip";
import { InvoiceData, InvoiceLineData } from "@repo/shared-types";
import { ColumnDef } from "@tanstack/react-table";
import clsx from "clsx";
import dayjs from "dayjs";
import { FolderInput, Printer, ReceiptEuro, Send } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  formatPrice,
  getMediaUrl,
  invoiceStatusToString,
} from "../../../lib/utils";

export type InvoiceTableProps = {
  data: InvoiceData[];
  isLoading: boolean;
  className?: string;
};

export default function InvoiceTable({
  data,
  isLoading,
  className,
}: InvoiceTableProps) {
  const t = useTranslations();
  const columnsDef: ColumnDef<InvoiceData>[] = [
    {
      accessorKey: "number",
      header: t("common.number"),
    },
    {
      accessorKey: "customer.name",
      header: t("common.customer"),
    },
    {
      accessorKey: "type",
      header: t("common.type"),
      cell: ({ row }) => (
        <>
          <span>
            {row.getValue("type") === "INVOICE" ? "Facture" : "Devis"}
          </span>
        </>
      ),
    },
    {
      accessorKey: "date",
      header: t("common.date"),
      cell: ({ row }) => (
        <span>{dayjs(row.getValue("date")).format("DD/MM/YYYY")}</span>
      ),
    },
    {
      accessorKey: "status",
      header: t("common.date"),
      cell: ({ row }) => (
        <>
          <span
            className={clsx(
              row.getValue("status") === "PAYED" ||
                row.getValue("status") === "VALIDATE"
                ? "text-green-700"
                : "text-red-700"
            )}
          >
            {invoiceStatusToString(row.getValue("status"))}
          </span>
        </>
      ),
    },
    {
      accessorKey: "invoiceLines",
      header: t("invoice.amount"),
      cell: ({ row }) => {
        const invoiceLines: InvoiceLineData[] = row.original.invoiceLines;
        const totalAmount =
          invoiceLines
            .map((e) => e.quantity * e.unitPrice)
            .reduce((prev, a) => prev + a, 0) *
          (row.original.excludeTva === true ? 1 : 1.2);
        return (
          <>
            <span>{formatPrice(totalAmount, "FR-fr", "EUR")}</span>
          </>
        );
      },
    },
    {
      accessorKey: "credits",
      header: t("invoice.credits.amount"),
      cell: ({ row }) => {
        const creditsAmount = row.original.credits
          .map((c) => c.totalAmount)
          .reduce((i, prev) => i + prev, 0);
        return (
          <>
            <span>{formatPrice(creditsAmount, "FR-fr", "EUR")}</span>
          </>
        );
      },
    },
    {
      header: t("common.amount"),
      cell: ({ row }) => {
        const invoiceLines: InvoiceLineData[] = row.original.invoiceLines;
        const totalAmount =
          invoiceLines
            .map((e) => e.quantity * e.unitPrice)
            .reduce((prev, a) => prev + a, 0) *
          (row.original.excludeTva === true ? 1 : 1.2);
        const creditsAmount = row.original.credits
          .map((c) => c.totalAmount)
          .reduce((i, prev) => i + prev, 0);
        return (
          <>
            <span>
              {formatPrice(totalAmount - creditsAmount, "FR-fr", "EUR")}
            </span>
          </>
        );
      },
    },
    {
      id: "actions",
      accessorKey: "",
      cell: ({ row }) => {
        return (
          <div className="flex flex-row justify-end gap-5 mr-10 ml-auto">
            {row.original.type === "QUOTE" &&
              row.original.status === "VALIDATE" && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <a href={`/invoices/create?devisId=${row.original.id}`}>
                      <FolderInput size={15}></FolderInput>
                    </a>
                  </TooltipTrigger>
                  <TooltipContent>{t("devis.transformInvoice")}</TooltipContent>
                </Tooltip>
              )}
            {row.original.type === "INVOICE" && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <a href={`/credits/create?invoiceId=${row.original.id}`}>
                    <ReceiptEuro size={15}></ReceiptEuro>
                  </a>
                </TooltipTrigger>
                <TooltipContent>{t("credit.createButton")}</TooltipContent>
              </Tooltip>
            )}
            <Tooltip>
              <TooltipTrigger>
                <a href={getMediaUrl(row.original.mediaId)}>
                  <Printer size={15}></Printer>
                </a>
              </TooltipTrigger>
              <TooltipContent>
                {t("common.print")}{" "}
                {row.original.type === "INVOICE"
                  ? t("invoice.theInvoice")
                  : t("devis.theDevis")}
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger>
                <Send size={15}></Send>
              </TooltipTrigger>
              <TooltipContent>
                {t("common.resend")}{" "}
                {row.original.type === "INVOICE"
                  ? t("invoice.theInvoice")
                  : t("devis.theDevis")}
              </TooltipContent>
            </Tooltip>
          </div>
        );
      },
    },
  ];

  return (
    <DataTable
      columns={columnsDef}
      data={data ?? []}
      isLoading={isLoading}
      className={className}
    />
  );
}
