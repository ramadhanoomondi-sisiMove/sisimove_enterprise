
import type { AdminJourneySettlementStatus } from './admin-journey-settlement.enums';

/**
 * ISO-8601 date string returned by the HTTP API.
 */
export type AdminJourneySettlementDate = string;

/**
 * Admin-facing representation of a Journey Settlement.
 *
 * Mirrors JourneySettlementResponse from the backend.
 *
 * Journey Settlement is its own aggregate. It is displayed within
 * the Journey Completion detail module, but remains a separate model.
 */
export interface AdminJourneySettlement {
  // ===========================================================================
  // Identity
  // ===========================================================================

  publicId: string;

  completionId: string;

  journeyPublicId: string;

  providerPublicId: string;

  // ===========================================================================
  // Financial Reference
  // ===========================================================================

  financialTransactionPublicId?: string;

  // ===========================================================================
  // Lifecycle
  // ===========================================================================

  status: AdminJourneySettlementStatus;

  submittedAt?: AdminJourneySettlementDate;

  processingAt?: AdminJourneySettlementDate;

  completedAt?: AdminJourneySettlementDate;

  failedAt?: AdminJourneySettlementDate;

  heldAt?: AdminJourneySettlementDate;

  cancelledAt?: AdminJourneySettlementDate;

  failureReason?: string;

  version: number;

  // ===========================================================================
  // Audit
  // ===========================================================================

  createdAt: AdminJourneySettlementDate;

  updatedAt: AdminJourneySettlementDate;
}

/**
 * Collection of Journey Settlement records.
 */
export type AdminJourneySettlementList = AdminJourneySettlement[];

export default AdminJourneySettlement;
