// -----------------------------------------------------------------------------
// sisiMove — Journey Boarding Event Mapper
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Convert Journey Boarding event HTTP responses into frontend models.
// - Convert the transport event type into the typed frontend enum.
// - Preserve event metadata without interpreting it.
//
// Architectural rules:
// - No HTTP requests belong here.
// - No domain/business rules belong here.
// - Event metadata remains opaque to the mapper.
// - Mapping is the only responsibility of this file.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// API Contract
// -----------------------------------------------------------------------------

import type { GetJourneyBoardingEventResponse } from '../api/discovery/get-journey-boarding.api';

// -----------------------------------------------------------------------------
// Model
// -----------------------------------------------------------------------------

import {
  JourneyBoardingEventType,
  type JourneyBoardingEvent,
} from '../models';

// -----------------------------------------------------------------------------
// Mapper
// -----------------------------------------------------------------------------

export const journeyBoardingEventMapper = {
  /**
   * Maps an HTTP event response into the frontend event model.
   */
  toModel(
    response: GetJourneyBoardingEventResponse,
  ): JourneyBoardingEvent {
    return {
      publicId: response.publicId,
      boardingId: response.boardingId,
      type: response.type as JourneyBoardingEventType,
      memberPublicId: response.memberPublicId,
      bookingPublicId: response.bookingPublicId,
      actorPublicId: response.actorPublicId,
      occurredAt: response.occurredAt,
      metadata: response.metadata,
      createdAt: response.createdAt,
    };
  },

  /**
   * Maps a collection of HTTP event responses.
   */
  toModels(
    responses: GetJourneyBoardingEventResponse[],
  ): JourneyBoardingEvent[] {
    return responses.map((response) => this.toModel(response));
  },
};