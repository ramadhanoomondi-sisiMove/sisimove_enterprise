-- CreateEnum
CREATE TYPE "OutboxMessageStatus" AS ENUM ('PENDING', 'PROCESSING', 'PUBLISHED', 'DEAD_LETTERED');

-- CreateTable
CREATE TABLE "stored_events" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "eventName" TEXT NOT NULL,
    "eventVersion" INTEGER NOT NULL,
    "aggregateId" TEXT NOT NULL,
    "aggregateType" TEXT NOT NULL,
    "correlationId" TEXT,
    "causationId" TEXT,
    "eventTimestamp" TIMESTAMP(3) NOT NULL,
    "producerPlatform" TEXT NOT NULL,
    "eventSchemaVersion" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "stored_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "outbox_messages" (
    "id" TEXT NOT NULL,
    "storedEventId" TEXT NOT NULL,
    "status" "OutboxMessageStatus" NOT NULL DEFAULT 'PENDING',
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "availableAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lockedAt" TIMESTAMP(3),
    "lockedUntil" TIMESTAMP(3),
    "lastAttemptAt" TIMESTAMP(3),
    "lastError" TEXT,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "outbox_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "processed_events" (
    "id" TEXT NOT NULL,
    "storedEventId" TEXT NOT NULL,
    "consumerName" TEXT NOT NULL,
    "processedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "processed_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "stored_events_eventId_key" ON "stored_events"("eventId");

-- CreateIndex
CREATE INDEX "stored_events_aggregateId_eventTimestamp_idx" ON "stored_events"("aggregateId", "eventTimestamp");

-- CreateIndex
CREATE INDEX "stored_events_eventName_eventTimestamp_idx" ON "stored_events"("eventName", "eventTimestamp");

-- CreateIndex
CREATE INDEX "stored_events_aggregateType_aggregateId_idx" ON "stored_events"("aggregateType", "aggregateId");

-- CreateIndex
CREATE INDEX "stored_events_correlationId_idx" ON "stored_events"("correlationId");

-- CreateIndex
CREATE UNIQUE INDEX "outbox_messages_storedEventId_key" ON "outbox_messages"("storedEventId");

-- CreateIndex
CREATE INDEX "outbox_messages_status_availableAt_idx" ON "outbox_messages"("status", "availableAt");

-- CreateIndex
CREATE INDEX "outbox_messages_status_lockedUntil_idx" ON "outbox_messages"("status", "lockedUntil");

-- CreateIndex
CREATE INDEX "processed_events_storedEventId_idx" ON "processed_events"("storedEventId");

-- CreateIndex
CREATE INDEX "processed_events_processedAt_idx" ON "processed_events"("processedAt");

-- CreateIndex
CREATE UNIQUE INDEX "processed_events_consumerName_storedEventId_key" ON "processed_events"("consumerName", "storedEventId");

-- AddForeignKey
ALTER TABLE "outbox_messages" ADD CONSTRAINT "outbox_messages_storedEventId_fkey" FOREIGN KEY ("storedEventId") REFERENCES "stored_events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "processed_events" ADD CONSTRAINT "processed_events_storedEventId_fkey" FOREIGN KEY ("storedEventId") REFERENCES "stored_events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
