-- AlterTable
ALTER TABLE "financial_payment_attempts" ADD COLUMN     "merchantRequestId" TEXT;

-- CreateIndex
CREATE INDEX "financial_payment_attempts_merchantRequestId_idx" ON "financial_payment_attempts"("merchantRequestId");
