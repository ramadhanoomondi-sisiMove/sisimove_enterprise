/*
  Warnings:

  - A unique constraint covering the columns `[calendarId,periodKey]` on the table `accounting_periods` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "AccountingPeriodFrequency" AS ENUM ('MONTHLY');

-- CreateEnum
CREATE TYPE "AccountingCalendarStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- AlterTable
ALTER TABLE "accounting_periods" ADD COLUMN     "calendarId" TEXT,
ADD COLUMN     "periodKey" TEXT;

-- CreateTable
CREATE TABLE "accounting_calendars" (
    "id" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "timezone" TEXT NOT NULL,
    "fiscalYearStartMonth" INTEGER NOT NULL,
    "frequency" "AccountingPeriodFrequency" NOT NULL DEFAULT 'MONTHLY',
    "status" "AccountingCalendarStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "accounting_calendars_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "accounting_calendars_publicId_key" ON "accounting_calendars"("publicId");

-- CreateIndex
CREATE UNIQUE INDEX "accounting_calendars_code_key" ON "accounting_calendars"("code");

-- CreateIndex
CREATE INDEX "accounting_calendars_status_idx" ON "accounting_calendars"("status");

-- CreateIndex
CREATE INDEX "accounting_calendars_frequency_idx" ON "accounting_calendars"("frequency");

-- CreateIndex
CREATE INDEX "accounting_periods_calendarId_startsAt_endsAt_idx" ON "accounting_periods"("calendarId", "startsAt", "endsAt");

-- CreateIndex
CREATE UNIQUE INDEX "accounting_periods_calendarId_periodKey_key" ON "accounting_periods"("calendarId", "periodKey");

-- AddForeignKey
ALTER TABLE "accounting_periods" ADD CONSTRAINT "accounting_periods_calendarId_fkey" FOREIGN KEY ("calendarId") REFERENCES "accounting_calendars"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
