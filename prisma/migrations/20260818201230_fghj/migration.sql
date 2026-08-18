-- CreateEnum
CREATE TYPE "JourneyBoardingStatus" AS ENUM ('NOT_STARTED', 'BOARDING', 'STARTED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "JourneyBoardingParticipantRole" AS ENUM ('PROVIDER', 'PASSENGER');

-- CreateEnum
CREATE TYPE "JourneyBoardingParticipantStatus" AS ENUM ('EXPECTED', 'BOARDED', 'WITHDRAWN', 'NO_SHOW', 'REMOVED');

-- CreateEnum
CREATE TYPE "JourneyBoardingEventType" AS ENUM ('BOARDING_OPENED', 'PROVIDER_BOARDED', 'PASSENGER_BOARDED', 'PASSENGER_NO_SHOW', 'BOARDING_WITHDRAWN', 'PARTICIPANT_REMOVED', 'JOURNEY_STARTED', 'BOARDING_CANCELLED');

-- AlterEnum
ALTER TYPE "JourneyStatus" ADD VALUE 'BOARDING';

-- AlterTable
ALTER TABLE "journeys" ADD COLUMN     "journeyBoardingId" TEXT;

-- CreateTable
CREATE TABLE "journey_boardings" (
    "id" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "journeyId" TEXT NOT NULL,
    "providerPublicId" TEXT NOT NULL,
    "status" "JourneyBoardingStatus" NOT NULL DEFAULT 'NOT_STARTED',
    "boardingStartedAt" TIMESTAMP(3),
    "journeyStartedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "journey_boardings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "journey_boarding_participants" (
    "id" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "boardingId" TEXT NOT NULL,
    "memberPublicId" TEXT NOT NULL,
    "bookingPublicId" TEXT,
    "role" "JourneyBoardingParticipantRole" NOT NULL,
    "status" "JourneyBoardingParticipantStatus" NOT NULL DEFAULT 'EXPECTED',
    "expectedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "boardedAt" TIMESTAMP(3),
    "withdrawnAt" TIMESTAMP(3),
    "noShowAt" TIMESTAMP(3),
    "removedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "journey_boarding_participants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "journey_boarding_events" (
    "id" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "boardingId" TEXT NOT NULL,
    "type" "JourneyBoardingEventType" NOT NULL,
    "memberPublicId" TEXT,
    "bookingPublicId" TEXT,
    "actorPublicId" TEXT,
    "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "journey_boarding_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "journey_boardings_publicId_key" ON "journey_boardings"("publicId");

-- CreateIndex
CREATE UNIQUE INDEX "journey_boardings_journeyId_key" ON "journey_boardings"("journeyId");

-- CreateIndex
CREATE INDEX "journey_boardings_providerPublicId_idx" ON "journey_boardings"("providerPublicId");

-- CreateIndex
CREATE INDEX "journey_boardings_status_idx" ON "journey_boardings"("status");

-- CreateIndex
CREATE INDEX "journey_boardings_status_boardingStartedAt_idx" ON "journey_boardings"("status", "boardingStartedAt");

-- CreateIndex
CREATE INDEX "journey_boardings_journeyStartedAt_idx" ON "journey_boardings"("journeyStartedAt");

-- CreateIndex
CREATE UNIQUE INDEX "journey_boarding_participants_publicId_key" ON "journey_boarding_participants"("publicId");

-- CreateIndex
CREATE INDEX "journey_boarding_participants_boardingId_idx" ON "journey_boarding_participants"("boardingId");

-- CreateIndex
CREATE INDEX "journey_boarding_participants_memberPublicId_idx" ON "journey_boarding_participants"("memberPublicId");

-- CreateIndex
CREATE INDEX "journey_boarding_participants_bookingPublicId_idx" ON "journey_boarding_participants"("bookingPublicId");

-- CreateIndex
CREATE INDEX "journey_boarding_participants_role_idx" ON "journey_boarding_participants"("role");

-- CreateIndex
CREATE INDEX "journey_boarding_participants_status_idx" ON "journey_boarding_participants"("status");

-- CreateIndex
CREATE INDEX "journey_boarding_participants_boardingId_role_idx" ON "journey_boarding_participants"("boardingId", "role");

-- CreateIndex
CREATE INDEX "journey_boarding_participants_boardingId_status_idx" ON "journey_boarding_participants"("boardingId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "journey_boarding_participants_boardingId_memberPublicId_key" ON "journey_boarding_participants"("boardingId", "memberPublicId");

-- CreateIndex
CREATE UNIQUE INDEX "journey_boarding_events_publicId_key" ON "journey_boarding_events"("publicId");

-- CreateIndex
CREATE INDEX "journey_boarding_events_boardingId_idx" ON "journey_boarding_events"("boardingId");

-- CreateIndex
CREATE INDEX "journey_boarding_events_type_idx" ON "journey_boarding_events"("type");

-- CreateIndex
CREATE INDEX "journey_boarding_events_memberPublicId_idx" ON "journey_boarding_events"("memberPublicId");

-- CreateIndex
CREATE INDEX "journey_boarding_events_bookingPublicId_idx" ON "journey_boarding_events"("bookingPublicId");

-- CreateIndex
CREATE INDEX "journey_boarding_events_actorPublicId_idx" ON "journey_boarding_events"("actorPublicId");

-- CreateIndex
CREATE INDEX "journey_boarding_events_boardingId_occurredAt_idx" ON "journey_boarding_events"("boardingId", "occurredAt");

-- AddForeignKey
ALTER TABLE "journey_boardings" ADD CONSTRAINT "journey_boardings_journeyId_fkey" FOREIGN KEY ("journeyId") REFERENCES "journeys"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "journey_boarding_participants" ADD CONSTRAINT "journey_boarding_participants_boardingId_fkey" FOREIGN KEY ("boardingId") REFERENCES "journey_boardings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "journey_boarding_events" ADD CONSTRAINT "journey_boarding_events_boardingId_fkey" FOREIGN KEY ("boardingId") REFERENCES "journey_boardings"("id") ON DELETE CASCADE ON UPDATE CASCADE;
