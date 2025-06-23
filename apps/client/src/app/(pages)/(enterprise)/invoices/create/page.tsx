"use client";

import InvoiceTemplate from "@components/templates/invoice-template";
import { Button } from "@components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";

export default function CreateInvoicesPage() {
  return (
    <div className="h-full">
      <Card className="mb-10">
        <CardHeader>
          <CardTitle>Creation d'une facture</CardTitle>
        </CardHeader>
        <CardContent>
          <PDFDownloadLink
            document={<InvoiceTemplate title={"hello"} />}
            fileName="invoice-1.pdf"
          >
            {({ blob, url, loading, error }) => (
              <Button>
                {loading ? "Loading document..." : "Download now!"}
              </Button>
            )}
          </PDFDownloadLink>
        </CardContent>
      </Card>
      <PDFViewer className="w-full h-5/6 rounded-md" showToolbar={false}>
        <InvoiceTemplate title={"hello"} />
      </PDFViewer>
    </div>
  );
}
