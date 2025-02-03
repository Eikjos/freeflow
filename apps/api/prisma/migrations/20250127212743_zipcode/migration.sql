/*
  Warnings:

  - Added the required column `zipCode` to the `Enterprise` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Enterprise" ADD COLUMN     "zipCode" TEXT NOT NULL;
