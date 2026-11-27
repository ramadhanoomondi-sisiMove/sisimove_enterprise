
import type { AdminJourneySettlement } from '../models/admin-journey-settlement.model';

import { AdminJourneySettlementStatus } from '../models/admin-journey-settlement.enums';

/**
 * HTTP representation of a Journey Settlement.
 *
 * Mirrors the backend JourneySettlementResponse contract.
 *
 * The backend mapper exposes Date values. Depending on the HTTP
 * serialization boundary, these arrive as ISO strings in JSON.
 */
export interface ApiAdminJourneySettlement {
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

  financialTransactionPublicId?: string | null;

  // ===========================================================================
  // Lifecycle
  // ===========================================================================

  status: string;

  submittedAt?: string | Date | null;

  processingAt?: string | Date | null;

  completedAt?: string | Date | null;

  failedAt?: string | Date | null;

  heldAt?: string | Date | null;

  cancelledAt?: string | Date | null;

  failureReason?: string | null;

  version: number;

  // ===========================================================================
  // Audit
  // ===========================================================================

  createdAt: string | Date;

  updatedAt: string | Date;
}

export class AdminJourneySettlementMapper {
  /**
   * Converts an optional API date into an ISO string.
   */
  private static mapDate(
    value: string | Date | null | undefined,
  ): string | undefined {
    if (value === null || value === undefined) {
      return undefined;
    }

    return value instanceof Date ? value.toISOString() : value;
  }

  /**
   * Converts a required API date into an ISO string.
   */
  private static mapRequiredDate(value: string | Date): string {
    return value instanceof Date ? value.toISOString() : value;
  }

  /**
   * Maps one API Journey Settlement response to the frontend model.
   */
  public static toModel(
    response: ApiAdminJourneySettlement,
  ): AdminJourneySettlement {
    return {
      // -----------------------------------------------------------------------
      // Identity
      // -----------------------------------------------------------------------

      publicId: response.publicId,
      completionId: response.completionId,
      journeyPublicId: response.journeyPublicId,
      providerPublicId: response.providerPublicId,

      // -----------------------------------------------------------------------
      // Financial Reference
      // -----------------------------------------------------------------------

      financialTransactionPublicId:
        response.financialTransactionPublicId ?? undefined,

      // -----------------------------------------------------------------------
      // Lifecycle
      // -----------------------------------------------------------------------

      status: response.status as AdminJourneySettlementStatus,

      submittedAt: this.mapDate(response.submittedAt),
      processingAt: this.mapDate(response.processingAt),
      completedAt: this.mapDate(response.completedAt),
      failedAt: this.mapDate(response.failedAt),
      heldAt: this.mapDate(response.heldAt),
      cancelledAt: this.mapDate(response.cancelledAt),

      failureReason: response.failureReason ?? undefined,

      version: response.version,

      // -----------------------------------------------------------------------
      // Audit
      // -----------------------------------------------------------------------

      createdAt: this.mapRequiredDate(response.createdAt),
      updatedAt: this.mapRequiredDate(response.updatedAt),
    };
  }

  /**
   * Maps a collection of API Journey Settlement responses.
   */
  public static toModelList(
    responses: ApiAdminJourneySettlement[],
  ): AdminJourneySettlement[] {
    return responses.map((response) => this.toModel(response));
  }
}

export default AdminJourneySettlementMapper;
