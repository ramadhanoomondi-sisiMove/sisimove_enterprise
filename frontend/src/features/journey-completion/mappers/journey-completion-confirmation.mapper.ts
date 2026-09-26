 // -----------------------------------------------------------------------------
 // sisiMove — Journey Completion Confirmation Mapper
 // -----------------------------------------------------------------------------
 //
 // Maps raw Journey Completion Confirmation HTTP responses into the frontend
 // domain model.
 //
 // Responsibilities:
 //
 // - translate transport primitives into frontend model types;
 // - translate backend enum strings into frontend enums;
 // - preserve ISO date strings as ISO date strings;
 // - keep HTTP/API response contracts out of the presentation layer.
 //
 // Non-responsibilities:
 //
 // - validation;
 // - authorization;
 // - lifecycle decisions;
 // - API calls;
 // - mutation of domain state.
 // -----------------------------------------------------------------------------

import type { JourneyCompletionConfirmation } from '../models/journey-completion-confirmation';
import { JourneyCompletionConfirmationRole } from '../models/journey-completion-confirmation-role';
import { JourneyCompletionConfirmationStatus } from '../models/journey-completion-confirmation-status';

// -----------------------------------------------------------------------------
// Transport Contract
// -----------------------------------------------------------------------------

/**
 * Minimal transport shape required to map a Journey Completion Confirmation.
 *
 * The API adapters intentionally own their endpoint-specific response
 * interfaces. The mapper therefore accepts the common transport shape instead
 * of importing one particular API response type.
 */
export interface JourneyCompletionConfirmationMapperInput {
  publicId: string;
  completionId: string;
  memberPublicId: string;
  bookingPublicId: string | undefined;
  role: string;
  status: string;
  confirmedAt: string;
  withdrawnAt: string | undefined;
  createdAt: string;
  updatedAt: string;
}

// -----------------------------------------------------------------------------
// Mapper
// -----------------------------------------------------------------------------

export class JourneyCompletionConfirmationMapper {
  // ===========================================================================
  // Single Response
  // ===========================================================================

  /**
   * Maps a raw HTTP confirmation response into the frontend model.
   */
  public static fromResponse(
    response: JourneyCompletionConfirmationMapperInput,
  ): JourneyCompletionConfirmation {
    return {
      publicId: response.publicId,
      completionId: response.completionId,
      memberPublicId: response.memberPublicId,
      bookingPublicId: response.bookingPublicId,

      role: response.role as JourneyCompletionConfirmationRole,
      status: response.status as JourneyCompletionConfirmationStatus,

      confirmedAt: response.confirmedAt,
      withdrawnAt: response.withdrawnAt,
      createdAt: response.createdAt,
      updatedAt: response.updatedAt,
    };
  }

  // ===========================================================================
  // Collection
  // ===========================================================================

  /**
   * Maps a collection of raw HTTP confirmation responses.
   */
  public static fromResponses(
    responses: readonly JourneyCompletionConfirmationMapperInput[],
  ): JourneyCompletionConfirmation[] {
    return responses.map((response) => this.fromResponse(response));
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default JourneyCompletionConfirmationMapper;