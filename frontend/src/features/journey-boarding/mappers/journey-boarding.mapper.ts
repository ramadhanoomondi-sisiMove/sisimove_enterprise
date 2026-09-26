// -----------------------------------------------------------------------------
// sisiMove — Journey Boarding Mapper
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Convert a Journey Boarding HTTP response into the frontend model.
// - Compose participant and event mapping through their dedicated mappers.
// - Convert the transport status into the typed frontend enum.
//
// Architectural rules:
// - No HTTP requests belong here.
// - No domain/business rules belong here.
// - Nested participant/event mapping is delegated.
// - Mapping is the only responsibility of this file.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// API Contract
// -----------------------------------------------------------------------------

import type { GetJourneyBoardingResponse } from '../api/discovery/get-journey-boarding.api';

// -----------------------------------------------------------------------------
// Models
// -----------------------------------------------------------------------------

import {
  JourneyBoardingStatus,
  type JourneyBoarding,
} from '../models';

// -----------------------------------------------------------------------------
// Nested Mappers
// -----------------------------------------------------------------------------

import { journeyBoardingEventMapper } from './journey-boarding-event.mapper';
import { journeyBoardingParticipantMapper } from './journey-boarding-participant.mapper';

// -----------------------------------------------------------------------------
// Mapper
// -----------------------------------------------------------------------------

export const journeyBoardingMapper = {
  /**
   * Maps an HTTP Journey Boarding response into the frontend model.
   */
  toModel(response: GetJourneyBoardingResponse): JourneyBoarding {
    return {
      publicId: response.publicId,
      journeyId: response.journeyId,
      providerPublicId: response.providerPublicId,
      status: response.status as JourneyBoardingStatus,
      boardingStartedAt: response.boardingStartedAt,
      journeyStartedAt: response.journeyStartedAt,
      cancelledAt: response.cancelledAt,
      version: response.version,
      participants: journeyBoardingParticipantMapper.toModels(
        response.participants,
      ),
      events: journeyBoardingEventMapper.toModels(response.events),
      createdAt: response.createdAt,
      updatedAt: response.updatedAt,
    };
  },

  /**
   * Maps a collection of HTTP Journey Boarding responses.
   */
  toModels(
    responses: GetJourneyBoardingResponse[],
  ): JourneyBoarding[] {
    return responses.map((response) => this.toModel(response));
  },
};