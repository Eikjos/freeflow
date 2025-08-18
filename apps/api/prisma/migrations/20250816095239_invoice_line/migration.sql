-- CreateTable
CREATE TABLE "InvoiceLine" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "prixUnit" DOUBLE PRECISION NOT NULL,
    "invoiceId" INTEGER NOT NULL,

    CONSTRAINT "InvoiceLine_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "InvoiceLine" ADD CONSTRAINT "InvoiceLine_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
