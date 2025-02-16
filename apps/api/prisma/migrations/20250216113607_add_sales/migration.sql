/*
  Warnings:

  - Added the required column `isPaid` to the `Invoice` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Enterprise" ALTER COLUMN "tvaNumber" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Invoice" ADD COLUMN     "isPaid" BOOLEAN NOT NULL;

-- CreateTable
CREATE TABLE "Sales" (
    "id" SERIAL NOT NULL,
    "enterpriseId" INTEGER NOT NULL,
    "number" DOUBLE PRECISION NOT NULL,
    "year" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Sales_id_key" ON "Sales"("id");

-- AddForeignKey
ALTER TABLE "Sales" ADD CONSTRAINT "Sales_enterpriseId_fkey" FOREIGN KEY ("enterpriseId") REFERENCES "Enterprise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
