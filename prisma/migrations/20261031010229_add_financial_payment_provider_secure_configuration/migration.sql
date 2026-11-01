-- CreateTable
CREATE TABLE "financial_payment_provider_configurations" (
    "id" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "environment" "FinancialPaymentProviderEnvironment" NOT NULL,
    "encryptedPayload" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "financial_payment_provider_configurations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "financial_payment_provider_configurations_reference_key" ON "financial_payment_provider_configurations"("reference");

-- CreateIndex
CREATE INDEX "financial_payment_provider_configurations_providerId_idx" ON "financial_payment_provider_configurations"("providerId");

-- CreateIndex
CREATE INDEX "financial_payment_provider_configurations_environment_idx" ON "financial_payment_provider_configurations"("environment");

-- CreateIndex
CREATE UNIQUE INDEX "financial_payment_provider_configurations_providerId_enviro_key" ON "financial_payment_provider_configurations"("providerId", "environment");

-- AddForeignKey
ALTER TABLE "financial_payment_provider_configurations" ADD CONSTRAINT "financial_payment_provider_configurations_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "financial_payment_providers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
