// -----------------------------------------------------------------------------
// sisiMove — useCreateJourneyBoarding
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Execute Journey Boarding creation.
// - Manage mutation state through the application's query layer.
// - Map the HTTP response into the frontend JourneyBoarding model.
//
// Architectural rules:
// - The hook owns mutation orchestration only.
// - HTTP execution remains inside the API adapter.
// - Authentication remains inside AuthenticatedApiClient.
// - Response mapping remains inside the mapper.
// - No domain/business rules belong here.
// - Public identifiers remain opaque strings.
// - The backend aggregate remains authoritative for creation rules.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// React Query
// -----------------------------------------------------------------------------

import { useMutation } from '@tanstack/react-query';

// -----------------------------------------------------------------------------
// API
// -----------------------------------------------------------------------------

import {
  createJourneyBoarding,
  type CreateJourneyBoardingRequest,
} from '../../api';

// -----------------------------------------------------------------------------
// Model
// -----------------------------------------------------------------------------

import type { JourneyBoarding } from '../../models';

// -----------------------------------------------------------------------------
// Mapper
// -----------------------------------------------------------------------------

import { journeyBoardingMapper } from '../../mappers';

// -----------------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------------

/**
 * Creates a Journey Boarding.
 *
 * The mutation returns the frontend JourneyBoarding model rather than the
 * raw HTTP transport response.
 */
export function useCreateJourneyBoarding() {
  return useMutation<
    JourneyBoarding,
    Error,
    CreateJourneyBoardingRequest
  >({
    mutationFn: async (request) => {
      const response = await createJourneyBoarding(request);

      return journeyBoardingMapper.toModel({
        publicId: response.publicId,
        journeyId: response.journeyId,
        providerPublicId: response.providerPublicId,
        status: response.status,
        boardingStartedAt: response.boardingStartedAt,
        journeyStartedAt: response.journeyStartedAt,
        cancelledAt: response.cancelledAt,
        version: response.version,
        participants: response.participants,
        events: response.events,
        createdAt: response.createdAt,
        updatedAt: response.updatedAt,
      });
    },
  });
}