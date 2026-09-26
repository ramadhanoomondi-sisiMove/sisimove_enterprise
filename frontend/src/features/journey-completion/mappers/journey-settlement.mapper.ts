// -----------------------------------------------------------------------------
// sisiMove — Journey Settlement Mapper
// -----------------------------------------------------------------------------
//
// Maps raw Journey Settlement HTTP responses into the frontend
// Journey Settlement model.
//
// Journey Settlement is a separate backend aggregate. The frontend mapper
// therefore does not derive settlement state from Journey Completion state.
//
// Settlement status is backend-authoritative.
// -----------------------------------------------------------------------------

import type { JourneySettlement } from '../models/journey-settlement';
import { JourneySettlementStatus } from '../models/journey-settlement-status';

// -----------------------------------------------------------------------------
// Transport Contract
// -----------------------------------------------------------------------------

/**
 * Transport shape required to map a Journey Settlement response.
 *
 * This matches JourneySettlementResponse produced by the backend response
 * mapper.
 */
export interface JourneySettlementMapperInput {
  publicId: string;
  completionId: string;
  journeyPublicId: string;
  providerPublicId: string;

  financialTransactionPublicId: string | undefined;

  status: string;

  submittedAt: string | undefined;
  processingAt: string | undefined;
  completedAt: string | undefined;
  failedAt: string | undefined;
  heldAt: string | undefined;
  cancelledAt: string | undefined;

  failureReason: string | undefined;

  version: number;

  createdAt: string;
  updatedAt: string;
}

// -----------------------------------------------------------------------------
// Mapper
// -----------------------------------------------------------------------------

export class JourneySettlementMapper {
  // ===========================================================================
  // Single Response
  // ===========================================================================

  /**
   * Maps a raw HTTP settlement response into the frontend model.
   */
  public static fromResponse(
    response: JourneySettlementMapperInput,
  ): JourneySettlement {
    return {
      publicId: response.publicId,
      completionId: response.completionId,
      journeyPublicId: response.journeyPublicId,
      providerPublicId: response.providerPublicId,

      financialTransactionPublicId:
        response.financialTransactionPublicId,

      status: response.status as JourneySettlementStatus,

      submittedAt: response.submittedAt,
      processingAt: response.processingAt,
      completedAt: response.completedAt,
      failedAt: response.failedAt,
      heldAt: response.heldAt,
      cancelledAt: response.cancelledAt,

      failureReason: response.failureReason,

      version: response.version,

      createdAt: response.createdAt,
      updatedAt: response.updatedAt,
    };
  }

  // ===========================================================================
  // Collection
  // ===========================================================================

  /**
   * Maps a collection of raw HTTP settlement responses.
   */
  public static fromResponses(
    responses: readonly JourneySettlementMapperInput[],
  ): JourneySettlement[] {
    return responses.map((response) => this.fromResponse(response));
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default JourneySettlementMapper;