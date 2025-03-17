/*
  Warnings:

  - You are about to drop the column `isDeleted` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the `_CustomerToEnterprise` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_CustomerToEnterprise" DROP CONSTRAINT "_CustomerToEnterprise_A_fkey";

-- DropForeignKey
ALTER TABLE "_CustomerToEnterprise" DROP CONSTRAINT "_CustomerToEnterprise_B_fkey";

-- AlterTable
ALTER TABLE "Customer" DROP COLUMN "isDeleted";

-- DropTable
DROP TABLE "_CustomerToEnterprise";

-- CreateTable
CREATE TABLE "EnterpriseCustomer" (
    "enterpriseId" INTEGER NOT NULL,
    "customerId" INTEGER NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "EnterpriseCustomer_pkey" PRIMARY KEY ("enterpriseId","customerId")
);

-- AddForeignKey
ALTER TABLE "EnterpriseCustomer" ADD CONSTRAINT "EnterpriseCustomer_enterpriseId_fkey" FOREIGN KEY ("enterpriseId") REFERENCES "Enterprise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EnterpriseCustomer" ADD CONSTRAINT "EnterpriseCustomer_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
