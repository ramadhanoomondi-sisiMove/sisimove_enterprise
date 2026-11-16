-- CreateTable
CREATE TABLE "financial_payment_c2b_callbacks" (
    "id" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "transId" TEXT NOT NULL,
    "billRefNumber" TEXT NOT NULL,
    "businessShortCode" TEXT NOT NULL,
    "transTime" TEXT,
    "transAmount" DECIMAL(18,2) NOT NULL,
    "msisdn" TEXT NOT NULL,
    "attemptId" TEXT,
    "payload" JSONB NOT NULL,
    "status" "FinancialPaymentCallbackStatus" NOT NULL DEFAULT 'PENDING',
    "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "financial_payment_c2b_callbacks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "financial_payment_c2b_callbacks_publicId_key" ON "financial_payment_c2b_callbacks"("publicId");

-- CreateIndex
CREATE INDEX "financial_payment_c2b_callbacks_attemptId_idx" ON "financial_payment_c2b_callbacks"("attemptId");

-- CreateIndex
CREATE INDEX "financial_payment_c2b_callbacks_billRefNumber_idx" ON "financial_payment_c2b_callbacks"("billRefNumber");

-- CreateIndex
CREATE INDEX "financial_payment_c2b_callbacks_status_receivedAt_idx" ON "financial_payment_c2b_callbacks"("status", "receivedAt");

-- CreateIndex
CREATE INDEX "financial_payment_c2b_callbacks_msisdn_idx" ON "financial_payment_c2b_callbacks"("msisdn");

-- CreateIndex
CREATE UNIQUE INDEX "financial_payment_c2b_callbacks_provider_transId_key" ON "financial_payment_c2b_callbacks"("provider", "transId");

-- AddForeignKey
ALTER TABLE "financial_payment_c2b_callbacks" ADD CONSTRAINT "financial_payment_c2b_callbacks_attemptId_fkey" FOREIGN KEY ("attemptId") REFERENCES "financial_payment_attempts"("id") ON DELETE SET NULL ON UPDATE CASCADE;
