// -----------------------------------------------------------------------------
// sisiMove — Journey Completion Dispute Mapper
// -----------------------------------------------------------------------------
//
// Maps raw Journey Completion Dispute HTTP responses into the frontend
// Journey Completion Dispute model.
//
// The mapper is deliberately transport-focused. It does not determine whether
// a dispute can be opened, reviewed, resolved, rejected, or withdrawn. Those
// decisions belong to the backend and its authorization/domain rules.
// -----------------------------------------------------------------------------

import type { JourneyCompletionDispute } from '../models/journey-completion-dispute';
import { JourneyCompletionDisputeReason } from '../models/journey-completion-dispute-reason';
import { JourneyCompletionDisputeStatus } from '../models/journey-completion-dispute-status';

// -----------------------------------------------------------------------------
// Transport Contract
// -----------------------------------------------------------------------------

/**
 * Minimal transport shape required to map a Journey Completion Dispute.
 *
 * Endpoint-specific API response interfaces remain local to their API modules.
 */
export interface JourneyCompletionDisputeMapperInput {
  publicId: string;
  completionId: string;
  raisedByPublicId: string;
  reason: string;
  description: string | undefined;
  status: string;
  resolvedByPublicId: string | undefined;
  resolutionSummary: string | undefined;
  openedAt: string;
  resolvedAt: string | undefined;
  rejectedAt: string | undefined;
  withdrawnAt: string | undefined;
  createdAt: string;
  updatedAt: string;
}

// -----------------------------------------------------------------------------
// Mapper
// -----------------------------------------------------------------------------

export class JourneyCompletionDisputeMapper {
  // ===========================================================================
  // Single Response
  // ===========================================================================

  /**
   * Maps a raw HTTP dispute response into the frontend model.
   */
  public static fromResponse(
    response: JourneyCompletionDisputeMapperInput,
  ): JourneyCompletionDispute {
    return {
      publicId: response.publicId,
      completionId: response.completionId,
      raisedByPublicId: response.raisedByPublicId,

      reason: response.reason as JourneyCompletionDisputeReason,

      description: response.description,

      status: response.status as JourneyCompletionDisputeStatus,

      resolvedByPublicId: response.resolvedByPublicId,
      resolutionSummary: response.resolutionSummary,

      openedAt: response.openedAt,
      resolvedAt: response.resolvedAt,
      rejectedAt: response.rejectedAt,
      withdrawnAt: response.withdrawnAt,

      createdAt: response.createdAt,
      updatedAt: response.updatedAt,
    };
  }

  // ===========================================================================
  // Collection
  // ===========================================================================

  /**
   * Maps a collection of raw HTTP dispute responses.
   */
  public static fromResponses(
    responses: readonly JourneyCompletionDisputeMapperInput[],
  ): JourneyCompletionDispute[] {
    return responses.map((response) => this.fromResponse(response));
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default JourneyCompletionDisputeMapper;