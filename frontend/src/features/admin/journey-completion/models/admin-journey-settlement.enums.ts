
/**
 * Journey Settlement lifecycle statuses.
 *
 * These values mirror the JourneySettlementStatus Prisma enum.
 */
export enum AdminJourneySettlementStatus {
  PENDING = 'PENDING',
  SUBMITTED = 'SUBMITTED',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  HELD = 'HELD',
  CANCELLED = 'CANCELLED',
}

export default AdminJourneySettlementStatus;
