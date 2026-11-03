// =============================================================================
// sisiMove — Map Financial Payment Provider
// =============================================================================
//
// Maps the backend API representation of a FinancialPaymentProvider into the
// member-facing frontend model.
//
// Architectural boundary:
//
//     Backend API Response
//              │
//              ▼
//     mapFinancialPaymentProvider()
//              │
//              ▼
//     FinancialPaymentProvider
//
// The mapper prevents backend transport shapes from leaking into UI components.
//
// It does NOT:
// - perform business logic;
// - perform authorization;
// - access persistence;
// - expose database identifiers;
// - expose provider credentials or configuration.
//
// =============================================================================

import type { FinancialPaymentProvider } from '../models';

// -----------------------------------------------------------------------------
// API Response Contract
// -----------------------------------------------------------------------------

/**
 * Raw member-facing API response for an available financial payment provider.
 */
export interface FinancialPaymentProviderApiResponse {
  publicId: string;
  code: string;
  name: string;
  type: FinancialPaymentProvider['type'];
}

// -----------------------------------------------------------------------------
// Mapper
// -----------------------------------------------------------------------------

/**
 * Maps a backend FinancialPaymentProvider response into the frontend model.
 */
export function mapFinancialPaymentProvider(
  response: FinancialPaymentProviderApiResponse,
): FinancialPaymentProvider {
  return {
    publicId: response.publicId,
    code: response.code,
    name: response.name,
    type: response.type,
  };
}