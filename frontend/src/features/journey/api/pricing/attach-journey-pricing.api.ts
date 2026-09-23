// -----------------------------------------------------------------------------
// sisiMove — Attach Journey Pricing API
// -----------------------------------------------------------------------------
//
// Attaches provider-declared pricing to an existing Journey.
//
// Architectural rules:
// - JourneyPricing is a child entity of Journey.
// - There is no pricing catalogue.
// - The provider declares the passenger contribution.
// - `amount` and `currency` are supplied by the provider.
// - The backend remains authoritative for validation.
// - The frontend never supplies journeyId or providerPublicId.
//
// Backend operation:
//
// POST /journeys/:journeyPublicId/pricing
//
// Request:
//
// {
//   amount: number,
//   currency: string
// }
//
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from '@/foundation/http';

// =============================================================================
// Types
// =============================================================================

export interface AttachJourneyPricingInput {
  /**
   * Passenger contribution amount for the Journey.
   *
   * The backend owns the authoritative monetary validation.
   */
  amount: number;

  /**
   * ISO currency code.
   *
   * The backend remains authoritative over supported currencies.
   */
  currency: string;
}

// =============================================================================
// API
// =============================================================================

export async function attachJourneyPricing(
  journeyPublicId: string,
  input: AttachJourneyPricingInput,
): Promise<void> {
  await authenticatedApiClient.post<void>(
    `/journeys/${encodeURIComponent(
      journeyPublicId,
    )}/pricing`,
    input,
  );
}

