/*
  Warnings:

  - A unique constraint covering the columns `[apiPublicToken]` on the table `Enterprise` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `companyName` to the `Customer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `apiPublicToken` to the `Enterprise` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "NotificationToEnum" AS ENUM ('ENTERPRISE', 'CUSTOMER');

-- CreateEnum
CREATE TYPE "NotificationTypeEnum" AS ENUM ('PAYED', 'VALIDATED', 'REFUSED', 'NEW_INVOICE', 'NEW_QUOTE', 'RELANCE_PAYED');

-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "companyName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Enterprise" ADD COLUMN     "apiPublicToken" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "EnterpriseCustomer" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "emailReviewSent" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Opinion" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "Notification" (
    "id" SERIAL NOT NULL,
    "type" "NotificationTypeEnum" NOT NULL,
    "to" "NotificationToEnum" NOT NULL,
    "enterpriseId" INTEGER NOT NULL,
    "customerId" INTEGER NOT NULL,
    "referenceId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Enterprise_apiPublicToken_key" ON "Enterprise"("apiPublicToken");

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_enterpriseId_fkey" FOREIGN KEY ("enterpriseId") REFERENCES "Enterprise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
