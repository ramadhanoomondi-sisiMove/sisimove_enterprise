-- CreateEnum
CREATE TYPE "FinancialDisbursementCallbackType" AS ENUM ('RESULT', 'QUEUE_TIMEOUT');

-- CreateEnum
CREATE TYPE "FinancialDisbursementCallbackStatus" AS ENUM ('PENDING', 'PROCESSED', 'FAILED');

-- CreateTable
CREATE TABLE "financial_disbursement_callbacks" (
    "id" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "type" "FinancialDisbursementCallbackType" NOT NULL,
    "originatorConversationId" TEXT NOT NULL,
    "conversationId" TEXT,
    "transactionId" TEXT,
    "attemptId" TEXT,
    "resultCode" INTEGER,
    "resultDesc" TEXT,
    "payload" JSONB NOT NULL,
    "status" "FinancialDisbursementCallbackStatus" NOT NULL DEFAULT 'PENDING',
    "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "financial_disbursement_callbacks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "financial_disbursement_callbacks_publicId_key" ON "financial_disbursement_callbacks"("publicId");

-- CreateIndex
CREATE INDEX "financial_disbursement_callbacks_attemptId_idx" ON "financial_disbursement_callbacks"("attemptId");

-- CreateIndex
CREATE INDEX "financial_disbursement_callbacks_status_receivedAt_idx" ON "financial_disbursement_callbacks"("status", "receivedAt");

-- CreateIndex
CREATE INDEX "financial_disbursement_callbacks_provider_conversationId_idx" ON "financial_disbursement_callbacks"("provider", "conversationId");

-- CreateIndex
CREATE INDEX "financial_disbursement_callbacks_provider_transactionId_idx" ON "financial_disbursement_callbacks"("provider", "transactionId");

-- CreateIndex
CREATE UNIQUE INDEX "financial_disbursement_callbacks_provider_originatorConvers_key" ON "financial_disbursement_callbacks"("provider", "originatorConversationId", "type");

-- AddForeignKey
ALTER TABLE "financial_disbursement_callbacks" ADD CONSTRAINT "financial_disbursement_callbacks_attemptId_fkey" FOREIGN KEY ("attemptId") REFERENCES "financial_disbursement_attempts"("id") ON DELETE SET NULL ON UPDATE CASCADE;
