-- CreateIndex
CREATE INDEX "financial_payment_c2b_callbacks_provider_billRefNumber_stat_idx" ON "financial_payment_c2b_callbacks"("provider", "billRefNumber", "status", "receivedAt", "id");
