/*
  Warnings:

  - Added the required column `juridicShapeId` to the `Enterprise` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Enterprise" ADD COLUMN     "juridicShapeId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Enterprise" ADD CONSTRAINT "Enterprise_juridicShapeId_fkey" FOREIGN KEY ("juridicShapeId") REFERENCES "JuridicShape"("code") ON DELETE RESTRICT ON UPDATE CASCADE;
