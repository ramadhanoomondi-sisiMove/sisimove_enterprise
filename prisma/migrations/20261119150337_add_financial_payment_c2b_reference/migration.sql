/*
  Warnings:

  - A unique constraint covering the columns `[c2bReference]` on the table `financial_payments` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "financial_payments" ADD COLUMN     "c2bReference" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "financial_payments_c2bReference_key" ON "financial_payments"("c2bReference");
