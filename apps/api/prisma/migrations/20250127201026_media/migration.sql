/*
  Warnings:

  - You are about to drop the column `path` on the `Media` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[mediaId]` on the table `Enterprise` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[mediaId]` on the table `Expense` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[mediaId]` on the table `Invoice` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[mediaId]` on the table `Project` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `extension` to the `Media` table without a default value. This is not possible if the table is not empty.
  - Added the required column `filename` to the `Media` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Invoice" DROP CONSTRAINT "Invoice_mediaId_fkey";

-- AlterTable
ALTER TABLE "Enterprise" ADD COLUMN     "mediaId" INTEGER;

-- AlterTable
ALTER TABLE "Expense" ADD COLUMN     "mediaId" INTEGER;

-- AlterTable
ALTER TABLE "Invoice" ALTER COLUMN "mediaId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Media" DROP COLUMN "path",
ADD COLUMN     "extension" TEXT NOT NULL,
ADD COLUMN     "filename" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "mediaId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Enterprise_mediaId_key" ON "Enterprise"("mediaId");

-- CreateIndex
CREATE UNIQUE INDEX "Expense_mediaId_key" ON "Expense"("mediaId");

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_mediaId_key" ON "Invoice"("mediaId");

-- CreateIndex
CREATE UNIQUE INDEX "Project_mediaId_key" ON "Project"("mediaId");

-- AddForeignKey
ALTER TABLE "Enterprise" ADD CONSTRAINT "Enterprise_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;
