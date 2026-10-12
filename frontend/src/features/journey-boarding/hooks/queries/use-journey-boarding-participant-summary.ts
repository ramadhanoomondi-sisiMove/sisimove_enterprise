// -----------------------------------------------------------------------------
// sisiMove — useJourneyBoardingParticipantSummary
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Retrieve a participant summary through the Journey Boarding query layer.
// - Manage loading, error, and cache state through React Query.
// - Map the API response into the frontend participant-summary model.
// - Avoid requests when required public identifiers are empty or the query
//   is disabled.
//
// Architectural rules:
// - HTTP execution remains in the API adapter.
// - Response mapping remains in the mapper layer.
// - The backend remains authoritative for contact visibility and verification.
// - Public identifiers remain opaque strings.
// - No participant-profile business rules belong here.
// -----------------------------------------------------------------------------

import { useQuery } from "@tanstack/react-query";

import {
  getJourneyBoardingParticipantSummary,
} from "@/features/journey-boarding/api/discovery";

import type {
  GetJourneyBoardingParticipantSummaryParams,
} from "@/features/journey-boarding/api/discovery";

import type {
  JourneyBoardingParticipantSummary,
} from "@/features/journey-boarding/models";

import {
  journeyBoardingParticipantSummaryMapper,
} from "@/features/journey-boarding/mappers/journey-boarding-participant-summary.mapper";

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface UseJourneyBoardingParticipantSummaryOptions
  extends GetJourneyBoardingParticipantSummaryParams {
  /**
   * Allows the caller to control whether the query executes.
   *
   * Both public identifiers must also be non-empty.
   */
  enabled?: boolean;
}

// -----------------------------------------------------------------------------
// Query Keys
// -----------------------------------------------------------------------------

export const journeyBoardingParticipantSummaryQueryKeys = {
  all: ["journey-boardings", "participant-summary"] as const,

  detail: (
    journeyBoardingPublicId: string,
    participantIdentityPublicId: string,
  ) =>
    [
      ...journeyBoardingParticipantSummaryQueryKeys.all,
      journeyBoardingPublicId,
      participantIdentityPublicId,
    ] as const,
};

// -----------------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------------

export function useJourneyBoardingParticipantSummary({
  journeyBoardingPublicId,
  participantIdentityPublicId,
  enabled = true,
}: UseJourneyBoardingParticipantSummaryOptions) {
  const normalizedJourneyBoardingPublicId =
    journeyBoardingPublicId.trim();

  const normalizedParticipantIdentityPublicId =
    participantIdentityPublicId.trim();

  const identifiersAreValid =
    normalizedJourneyBoardingPublicId.length > 0 &&
    normalizedParticipantIdentityPublicId.length > 0;

  return useQuery<JourneyBoardingParticipantSummary>({
    queryKey:
      journeyBoardingParticipantSummaryQueryKeys.detail(
        normalizedJourneyBoardingPublicId,
        normalizedParticipantIdentityPublicId,
      ),

    enabled: enabled && identifiersAreValid,

    queryFn: async () => {
      const response =
        await getJourneyBoardingParticipantSummary({
          journeyBoardingPublicId:
            normalizedJourneyBoardingPublicId,
          participantIdentityPublicId:
            normalizedParticipantIdentityPublicId,
        });

      return journeyBoardingParticipantSummaryMapper.toModel(
        response,
      );
    },
  });
}