/*
  Warnings:

  - Added the required column `estimation` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "estimation" DOUBLE PRECISION NOT NULL;
