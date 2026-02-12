"use client";

import { DataTable } from "@components/ui/data-table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@components/ui/tooltip";
import { InvoiceData, InvoiceLineData } from "@repo/shared-types";
import { ColumnDef } from "@tanstack/react-table";
import { payInvoice, validateQuote } from "actions/invoice";
import clsx from "clsx";
import dayjs from "dayjs";
import { Banknote, ClipboardCheck, FolderInput, Printer, ReceiptEuro, Send, TicketX } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import getQueryClient from "../../../lib/query-client";
import {
  formatPrice,
  getMediaUrl,
  invoiceStatusToString,
} from "../../../lib/utils";
import ValidateQuoteDialog from "./validate-quote-dialog";

export type InvoiceTableProps = {
  data: InvoiceData[];
  isLoading: boolean;
  className?: string;
  isCustomer?: boolean;
  onRefetch?: () => void;
};

export default function InvoiceTable({
  data,
  isLoading,
  className,
  isCustomer = false, 
  onRefetch = () => { }
}: InvoiceTableProps) {
  const t = useTranslations();
  const queryClient = getQueryClient();

  const handleValidateQuote = (id: number, value: boolean, code?: string) => {
    validateQuote(id, value, code).then(() => {
      void queryClient.invalidateQueries({
        queryKey: ["invoices"]
      });
      onRefetch();
      toast.success("Le devis a bien été validé.")
    }).catch((e : Error)=> {
      toast.error(e.message);
    });
  }

  const handlePayInvoice = (id: number) => {
    payInvoice(id).then(() => {
      void queryClient.invalidateQueries({
        queryKey: ["invoices"]
      });
      onRefetch();
      toast.success("La facture a bien été payé.")
    }).catch((e : Error) => {
      toast.error(e.message);
    })
  }
 
  const columnsDef: ColumnDef<InvoiceData>[] = [
    {
      accessorKey: "number",
      header: t("common.number"),
    },
    {
      accessorKey: isCustomer ? "enterprise.name" : "customer.name",
      header: t(isCustomer ? "common.enterprise" : "common.customer"),
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
        if (!isCustomer) {
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
        }
        return (
          <div className="flex flex-row justify-end gap-5">
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
            {row.original.type === "QUOTE" && row.original.status === "WAITING_VALIDATION" && (
              <Tooltip>
                <TooltipContent>
                  {t("devis.accept")}
                </TooltipContent>
                  <ValidateQuoteDialog
                    trigger={
                      <TooltipTrigger>
                        <ClipboardCheck size={15} />
                      </TooltipTrigger>}
                    devis={row.original}
                    onValidate={onRefetch}
                  />
              </Tooltip>
            )}
            {row.original.type === "INVOICE" && row.original.status === "WAITING_PAYED" && (
              <Tooltip>
                <TooltipContent>
                  {t("invoice.indicatePay")}
                </TooltipContent>
                <TooltipTrigger>
                  <Banknote size={15} onClick={() => handlePayInvoice(row.original.id)} />
                </TooltipTrigger>
              </Tooltip>
            )}
            {row.original.type === "QUOTE" && row.original.status === "WAITING_VALIDATION" && (
              <Tooltip>
                <TooltipContent>
                  {t("devis.refuse")}
                </TooltipContent>
                <TooltipTrigger>
                  <TicketX size={15} onClick={() => handleValidateQuote(row.original.id, false)}/>
                </TooltipTrigger>
              </Tooltip>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <>
      <DataTable
        columns={columnsDef}
        data={data ?? []}
        isLoading={isLoading}
        className={className}
      />
    </>
  
  );
}
