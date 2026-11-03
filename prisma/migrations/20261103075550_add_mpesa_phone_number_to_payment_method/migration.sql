/*
  Warnings:

  - A unique constraint covering the columns `[accountId,provider,phoneNumber]` on the table `financial_payment_methods` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "financial_payment_methods" ADD COLUMN     "phoneNumber" TEXT;

-- CreateIndex
CREATE INDEX "financial_payment_methods_phoneNumber_idx" ON "financial_payment_methods"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "financial_payment_methods_accountId_provider_phoneNumber_key" ON "financial_payment_methods"("accountId", "provider", "phoneNumber");
