-- CreateEnum
CREATE TYPE "FinancialPaymentCallbackStatus" AS ENUM ('PENDING', 'PROCESSED', 'FAILED');

-- CreateTable
CREATE TABLE "financial_payment_callbacks" (
    "id" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "merchantRequestId" TEXT NOT NULL,
    "checkoutRequestId" TEXT NOT NULL,
    "attemptId" TEXT,
    "resultCode" INTEGER NOT NULL,
    "resultDesc" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "status" "FinancialPaymentCallbackStatus" NOT NULL DEFAULT 'PENDING',
    "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "financial_payment_callbacks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "financial_payment_callbacks_publicId_key" ON "financial_payment_callbacks"("publicId");

-- CreateIndex
CREATE INDEX "financial_payment_callbacks_attemptId_idx" ON "financial_payment_callbacks"("attemptId");

-- CreateIndex
CREATE INDEX "financial_payment_callbacks_status_receivedAt_idx" ON "financial_payment_callbacks"("status", "receivedAt");

-- CreateIndex
CREATE INDEX "financial_payment_callbacks_merchantRequestId_idx" ON "financial_payment_callbacks"("merchantRequestId");

-- CreateIndex
CREATE UNIQUE INDEX "financial_payment_callbacks_provider_checkoutRequestId_key" ON "financial_payment_callbacks"("provider", "checkoutRequestId");

-- AddForeignKey
ALTER TABLE "financial_payment_callbacks" ADD CONSTRAINT "financial_payment_callbacks_attemptId_fkey" FOREIGN KEY ("attemptId") REFERENCES "financial_payment_attempts"("id") ON DELETE SET NULL ON UPDATE CASCADE;
