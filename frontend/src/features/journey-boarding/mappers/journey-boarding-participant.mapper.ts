// -----------------------------------------------------------------------------
// sisiMove — Journey Boarding Participant Mapper
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Convert Journey Boarding participant HTTP responses into frontend models.
// - Convert transport enum strings into typed frontend enums.
// - Preserve opaque public identifiers and ISO date strings.
//
// Architectural rules:
// - No HTTP requests belong here.
// - No domain/business rules belong here.
// - No authentication concerns belong here.
// - Mapping is the only responsibility of this file.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// API Contract
// -----------------------------------------------------------------------------

import type { GetJourneyBoardingParticipantResponse } from '../api/discovery/get-journey-boarding.api';

// -----------------------------------------------------------------------------
// Model
// -----------------------------------------------------------------------------

import {
  JourneyBoardingParticipantRole,
  JourneyBoardingParticipantStatus,
  type JourneyBoardingParticipant,
} from '../models';

// -----------------------------------------------------------------------------
// Mapper
// -----------------------------------------------------------------------------

export const journeyBoardingParticipantMapper = {
  /**
   * Maps an HTTP participant response into the frontend participant model.
   */
  toModel(
    response: GetJourneyBoardingParticipantResponse,
  ): JourneyBoardingParticipant {
    return {
      publicId: response.publicId,
      boardingId: response.boardingId,
      memberPublicId: response.memberPublicId,
      bookingPublicId: response.bookingPublicId,
      role: response.role as JourneyBoardingParticipantRole,
      status: response.status as JourneyBoardingParticipantStatus,
      expectedAt: response.expectedAt,
      boardedAt: response.boardedAt,
      withdrawnAt: response.withdrawnAt,
      noShowAt: response.noShowAt,
      removedAt: response.removedAt,
      createdAt: response.createdAt,
      updatedAt: response.updatedAt,
    };
  },

  /**
   * Maps a collection of HTTP participant responses.
   */
  toModels(
    responses: GetJourneyBoardingParticipantResponse[],
  ): JourneyBoardingParticipant[] {
    return responses.map((response) => this.toModel(response));
  },
};