// -----------------------------------------------------------------------------
// sisiMove — useOpenJourneyBoarding
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Execute the Journey Boarding open operation.
// - Manage mutation state through the application's query layer.
// - Map the HTTP response into the frontend JourneyBoarding model.
//
// Architectural rules:
// - The hook owns mutation orchestration only.
// - HTTP execution remains inside the API adapter.
// - Authentication remains inside AuthenticatedApiClient.
// - Response mapping remains inside the mapper.
// - No domain/business rules belong here.
// - The backend aggregate remains authoritative for lifecycle transitions.
// - Public identifiers remain opaque strings.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// React Query
// -----------------------------------------------------------------------------

import { useMutation } from '@tanstack/react-query';

// -----------------------------------------------------------------------------
// API
// -----------------------------------------------------------------------------

import {
  openJourneyBoarding,
  type OpenJourneyBoardingParams,
  type OpenJourneyBoardingRequest,
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
// Variables
// -----------------------------------------------------------------------------

export interface OpenJourneyBoardingVariables {
  params: OpenJourneyBoardingParams;
  request?: OpenJourneyBoardingRequest;
}

// -----------------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------------

/**
 * Opens a Journey Boarding.
 *
 * The mutation returns the frontend JourneyBoarding model rather than the
 * raw HTTP transport response.
 */
export function useOpenJourneyBoarding() {
  return useMutation<
    JourneyBoarding,
    Error,
    OpenJourneyBoardingVariables
  >({
    mutationFn: async ({ params, request }) => {
      const response = await openJourneyBoarding(
        params,
        request,
      );

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