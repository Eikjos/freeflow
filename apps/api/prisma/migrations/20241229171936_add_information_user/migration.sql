/*
  Warnings:

  - Added the required column `isCustomer` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isEnterprise` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isCustomer" BOOLEAN NOT NULL,
ADD COLUMN     "isEnterprise" BOOLEAN NOT NULL;
