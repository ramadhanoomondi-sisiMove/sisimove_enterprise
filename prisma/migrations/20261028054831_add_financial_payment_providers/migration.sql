-- CreateEnum
CREATE TYPE "FinancialPaymentProviderType" AS ENUM ('MOBILE_MONEY', 'BANK', 'CARD_PROCESSOR', 'PAYMENT_GATEWAY', 'DIGITAL_WALLET', 'OTHER');

-- CreateEnum
CREATE TYPE "FinancialPaymentProviderIntegrationStatus" AS ENUM ('NOT_CONFIGURED', 'CONFIGURING', 'READY', 'DEGRADED', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "FinancialPaymentProviderEnvironment" AS ENUM ('SANDBOX', 'PRODUCTION');

-- CreateEnum
CREATE TYPE "FinancialPaymentProviderCapabilityType" AS ENUM ('INITIATE_PAYMENT', 'VERIFY_PAYMENT', 'QUERY_PAYMENT', 'REFUND_PAYMENT', 'INITIATE_DISBURSEMENT', 'VERIFY_DISBURSEMENT', 'QUERY_BALANCE', 'WEBHOOKS');

-- CreateTable
CREATE TABLE "financial_payment_providers" (
    "id" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" "FinancialPaymentProviderType" NOT NULL,
    "integrationStatus" "FinancialPaymentProviderIntegrationStatus" NOT NULL DEFAULT 'NOT_CONFIGURED',
    "environment" "FinancialPaymentProviderEnvironment" NOT NULL DEFAULT 'SANDBOX',
    "isEnabled" BOOLEAN NOT NULL DEFAULT false,
    "configurationReference" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "financial_payment_providers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "financial_payment_provider_capabilities" (
    "id" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "type" "FinancialPaymentProviderCapabilityType" NOT NULL,
    "isSupported" BOOLEAN NOT NULL DEFAULT false,
    "isEnabled" BOOLEAN NOT NULL DEFAULT false,
    "configurationReference" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "financial_payment_provider_capabilities_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "financial_payment_providers_publicId_key" ON "financial_payment_providers"("publicId");

-- CreateIndex
CREATE UNIQUE INDEX "financial_payment_providers_code_key" ON "financial_payment_providers"("code");

-- CreateIndex
CREATE INDEX "financial_payment_providers_type_idx" ON "financial_payment_providers"("type");

-- CreateIndex
CREATE INDEX "financial_payment_providers_integrationStatus_idx" ON "financial_payment_providers"("integrationStatus");

-- CreateIndex
CREATE INDEX "financial_payment_providers_environment_idx" ON "financial_payment_providers"("environment");

-- CreateIndex
CREATE INDEX "financial_payment_providers_isEnabled_idx" ON "financial_payment_providers"("isEnabled");

-- CreateIndex
CREATE UNIQUE INDEX "financial_payment_provider_capabilities_publicId_key" ON "financial_payment_provider_capabilities"("publicId");

-- CreateIndex
CREATE INDEX "financial_payment_provider_capabilities_providerId_idx" ON "financial_payment_provider_capabilities"("providerId");

-- CreateIndex
CREATE INDEX "financial_payment_provider_capabilities_type_idx" ON "financial_payment_provider_capabilities"("type");

-- CreateIndex
CREATE INDEX "financial_payment_provider_capabilities_isSupported_idx" ON "financial_payment_provider_capabilities"("isSupported");

-- CreateIndex
CREATE INDEX "financial_payment_provider_capabilities_isEnabled_idx" ON "financial_payment_provider_capabilities"("isEnabled");

-- CreateIndex
CREATE UNIQUE INDEX "financial_payment_provider_capabilities_providerId_type_key" ON "financial_payment_provider_capabilities"("providerId", "type");

-- AddForeignKey
ALTER TABLE "financial_payment_provider_capabilities" ADD CONSTRAINT "financial_payment_provider_capabilities_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "financial_payment_providers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
