// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Participant Schema
// -----------------------------------------------------------------------------
//
// Validation schemas for JourneyDemand participant operations.
//
// Participants are Identity references represented by memberPublicId.
//
// -----------------------------------------------------------------------------

import { z } from 'zod';

// -----------------------------------------------------------------------------
// Add participant
// -----------------------------------------------------------------------------

export const journeyDemandParticipantSchema = z.object({
  /**
   * Identity/member public identifier.
   */
  memberPublicId: z
    .string()
    .trim()
    .min(1, 'Member identity is required.'),

  /**
   * Number of seats contributed by this participant.
   */
  seats: z
    .number()
    .int()
    .min(1, 'A participant must request at least one seat.')
    .max(50, 'Participant seats cannot exceed 50.'),
});

export type JourneyDemandParticipantInput = z.infer<
  typeof journeyDemandParticipantSchema
>;

// -----------------------------------------------------------------------------
// Update participant
// -----------------------------------------------------------------------------
//
// Participant identity is immutable.
//
// Only the participant's requested seat count is changed.
//
// -----------------------------------------------------------------------------

export const updateJourneyDemandParticipantSchema = z.object({
  seats: z
    .number()
    .int()
    .min(1, 'A participant must request at least one seat.')
    .max(50, 'Participant seats cannot exceed 50.'),
});

export type UpdateJourneyDemandParticipantInput = z.infer<
  typeof updateJourneyDemandParticipantSchema
>;