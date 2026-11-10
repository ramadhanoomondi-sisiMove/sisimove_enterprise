/*
  Warnings:

  - A unique constraint covering the columns `[provider,providerOriginatorConversationId]` on the table `financial_disbursement_attempts` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[provider,providerConversationId]` on the table `financial_disbursement_attempts` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[provider,providerTransactionId]` on the table `financial_disbursement_attempts` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "financial_disbursement_attempts_providerReference_idx";

-- AlterTable
ALTER TABLE "financial_disbursement_attempts" ADD COLUMN     "cancelledAt" TIMESTAMP(3),
ADD COLUMN     "providerConversationId" TEXT,
ADD COLUMN     "providerOriginatorConversationId" TEXT,
ADD COLUMN     "providerTransactionId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "financial_disbursement_attempts_provider_providerOriginator_key" ON "financial_disbursement_attempts"("provider", "providerOriginatorConversationId");

-- CreateIndex
CREATE UNIQUE INDEX "financial_disbursement_attempts_provider_providerConversati_key" ON "financial_disbursement_attempts"("provider", "providerConversationId");

-- CreateIndex
CREATE UNIQUE INDEX "financial_disbursement_attempts_provider_providerTransactio_key" ON "financial_disbursement_attempts"("provider", "providerTransactionId");
