// -----------------------------------------------------------------------------
// sisiMove — Journey Completion Mapper
// -----------------------------------------------------------------------------
//
// Maps the aggregate-level Journey Completion HTTP response into the
// frontend Journey Completion model.
//
// A Journey Completion aggregate response contains:
//
// - Journey Completion root state;
// - confirmation collection;
// - dispute collection.
//
// The child collections are delegated to their dedicated mappers so that
// child mapping logic remains isolated and reusable.
// -----------------------------------------------------------------------------

import type { JourneyCompletion } from '../models/journey-completion';

import {
  JourneyCompletionConfirmationMapper,
  type JourneyCompletionConfirmationMapperInput,
} from './journey-completion-confirmation.mapper';

import {
  JourneyCompletionDisputeMapper,
  type JourneyCompletionDisputeMapperInput,
} from './journey-completion-dispute.mapper';

// -----------------------------------------------------------------------------
// Transport Contract
// -----------------------------------------------------------------------------

/**
 * Transport shape required to map a complete Journey Completion aggregate.
 *
 * This intentionally mirrors the backend JourneyCompletionResponse using
 * transport primitives.
 */
export interface JourneyCompletionMapperInput {
  publicId: string;
  journeyPublicId: string;
  providerPublicId: string;

  status: string;

  completionRequestedAt: string | undefined;
  confirmedAt: string | undefined;
  disputedAt: string | undefined;
  cancelledAt: string | undefined;

  requiredConfirmations: number;
  confirmedCount: number;
  version: number;

  confirmations: readonly JourneyCompletionConfirmationMapperInput[];
  disputes: readonly JourneyCompletionDisputeMapperInput[];

  createdAt: string;
  updatedAt: string;
}

// -----------------------------------------------------------------------------
// Mapper
// -----------------------------------------------------------------------------

export class JourneyCompletionMapper {
  // ===========================================================================
  // Aggregate Response
  // ===========================================================================

  /**
   * Maps a complete Journey Completion aggregate response.
   */
  public static fromResponse(
    response: JourneyCompletionMapperInput,
  ): JourneyCompletion {
    return {
      publicId: response.publicId,
      journeyPublicId: response.journeyPublicId,
      providerPublicId: response.providerPublicId,

      status: response.status as JourneyCompletion['status'],

      completionRequestedAt: response.completionRequestedAt,
      confirmedAt: response.confirmedAt,
      disputedAt: response.disputedAt,
      cancelledAt: response.cancelledAt,

      requiredConfirmations: response.requiredConfirmations,
      confirmedCount: response.confirmedCount,
      version: response.version,

      confirmations:
        JourneyCompletionConfirmationMapper.fromResponses(
          response.confirmations,
        ),

      disputes: JourneyCompletionDisputeMapper.fromResponses(
        response.disputes,
      ),

      createdAt: response.createdAt,
      updatedAt: response.updatedAt,
    };
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default JourneyCompletionMapper;