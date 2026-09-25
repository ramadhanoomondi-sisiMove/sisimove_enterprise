// -----------------------------------------------------------------------------
// sisiMove — Create Journey Demand Schema
// -----------------------------------------------------------------------------
//
// Validation schema for the initial JourneyDemand creation request.
//
// Important:
// - This schema represents user/application input.
// - It does NOT represent the complete JourneyDemand aggregate.
// - The server creates the JourneyDemand in DRAFT state.
// - Aggregate components are attached through their respective workflows.
//
// -----------------------------------------------------------------------------

import { z } from 'zod';

export const createJourneyDemandSchema = z.object({
  /**
   * Current backend create contract expects the requester's public identity ID.
   *
   * Architectural note:
   * The preferred future contract is for the backend to derive this from
   * CurrentIdentity rather than trusting a client-supplied requester ID.
   */
  requesterPublicId: z
    .string()
    .trim()
    .min(1, 'Requester identity is required.'),
});

export type CreateJourneyDemandInput = z.infer<
  typeof createJourneyDemandSchema
>;