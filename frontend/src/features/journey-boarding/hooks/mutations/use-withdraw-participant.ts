// -----------------------------------------------------------------------------
// sisiMove — useWithdrawParticipant
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Execute the participant withdrawal operation.
// - Manage mutation state through React Query.
// - Map the HTTP response into the frontend JourneyBoarding model.
//
// Architectural rules:
// - No boarding business rules belong in this hook.
// - The API adapter owns HTTP execution.
// - Authentication remains inside AuthenticatedApiClient.
// - The mapper owns transport-to-domain-model conversion.
// - The backend JourneyBoardingAggregate remains authoritative.
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
  withdrawParticipant,
  type WithdrawParticipantParams,
  type WithdrawParticipantRequest,
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

export interface WithdrawParticipantVariables {
  params: WithdrawParticipantParams;
  request?: WithdrawParticipantRequest;
}

// -----------------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------------

/**
 * Withdraws a participant from Journey Boarding.
 *
 * The mutation returns the updated frontend JourneyBoarding model rather
 * than exposing the raw HTTP transport response to consuming components.
 */
export function useWithdrawParticipant() {
  return useMutation<
    JourneyBoarding,
    Error,
    WithdrawParticipantVariables
  >({
    mutationFn: async ({ params, request }) => {
      const response = await withdrawParticipant(
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