import { Button } from "@components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@components/ui/dialog";
import { Form } from "@components/ui/form";
import { InputOTPWithController } from "@components/ui/input-otp";
import { zodResolver } from "@hookform/resolvers/zod";
import { InvoiceData, QuoteValidateData, ValidateQuoteValidation } from "@repo/shared-types";
import { sendValidationQuote, validateQuote } from "actions/invoice";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type ValidateQuoteDialogProps = {
  devis: InvoiceData;
  trigger: JSX.Element;
  onValidate: () => void;
}


export default function ValidateQuoteDialog({ devis, onValidate, trigger }: ValidateQuoteDialogProps) {
  const [open, setOpen] = useState(false);
  const t = useTranslations();
  const form = useForm<QuoteValidateData>({
    defaultValues: {
      code: "",
      value: true
    },
    resolver: zodResolver(ValidateQuoteValidation)
  });
  const handleOpen = (value: boolean) => {
    if (value) {
      sendValidationQuote(devis.id).then(() => {
        setOpen(value);
      }).catch(() => {
        toast.error("Une erreur est survenue. Veuillez réessayer plus tard.");
      });
    } else {
      setOpen(value);
    }
  }

  const onSubmit = (value : QuoteValidateData) => {
    validateQuote(devis.id, true, value.code).then(() => {
      onValidate();
      toast.success(t("devis.success.validate"));
    }).catch((e : Error) => {
      toast.error(e.message)
    }).finally(() => {
      setOpen(false);
    })
  }

  const handleSubmit = () => {
    form.handleSubmit(onSubmit);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-3xl">
            {t("devis.validateTitle", { number: devis.number })}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <Form {...form}>
            <div className="flex flex-col items-center">
              <p className="text-sm my-5">{t("devis.validateContent")}</p>
              <InputOTPWithController length={5} name="code" control={form.control}  className="mb-5"/>
              <Button type="submit">{t("common.validate")}</Button>
            </div>
          </Form>
         
        </form>
      </DialogContent>
    </Dialog>
  )
}