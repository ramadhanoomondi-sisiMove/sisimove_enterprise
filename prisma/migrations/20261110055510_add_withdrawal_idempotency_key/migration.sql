/*
  Warnings:

  - You are about to drop the column `destinationId` on the `financial_disbursements` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[disbursementPublicId]` on the table `financial_account_withdrawals` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[accountId,idempotencyKey]` on the table `financial_account_withdrawals` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[withdrawalPublicId]` on the table `financial_disbursements` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `destinationType` to the `financial_disbursements` table without a default value. This is not possible if the table is not empty.
  - Added the required column `destinationValue` to the `financial_disbursements` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "financial_disbursements" DROP CONSTRAINT "financial_disbursements_destinationId_fkey";

-- DropIndex
DROP INDEX "financial_account_withdrawals_disbursementPublicId_idx";

-- DropIndex
DROP INDEX "financial_disbursements_destinationId_idx";

-- AlterTable
ALTER TABLE "financial_account_withdrawals" ADD COLUMN     "idempotencyKey" TEXT;

-- AlterTable
ALTER TABLE "financial_disbursements" DROP COLUMN "destinationId",
ADD COLUMN     "destinationType" "FinancialDisbursementDestinationType" NOT NULL,
ADD COLUMN     "destinationValue" TEXT NOT NULL,
ADD COLUMN     "withdrawalPublicId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "financial_account_withdrawals_disbursementPublicId_key" ON "financial_account_withdrawals"("disbursementPublicId");

-- CreateIndex
CREATE UNIQUE INDEX "financial_account_withdrawals_accountId_idempotencyKey_key" ON "financial_account_withdrawals"("accountId", "idempotencyKey");

-- CreateIndex
CREATE UNIQUE INDEX "financial_disbursements_withdrawalPublicId_key" ON "financial_disbursements"("withdrawalPublicId");

-- CreateIndex
CREATE INDEX "financial_disbursements_destinationType_idx" ON "financial_disbursements"("destinationType");
