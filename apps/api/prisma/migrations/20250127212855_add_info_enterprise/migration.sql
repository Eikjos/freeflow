/*
  Warnings:

  - Added the required column `email` to the `Enterprise` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `Enterprise` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Enterprise" ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "phone" TEXT NOT NULL;
