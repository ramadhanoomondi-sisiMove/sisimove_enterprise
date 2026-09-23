// =============================================================================
// sisiMove — Map Financial Payment Method
// =============================================================================
//
// Maps the backend API representation of a FinancialPaymentMethod into the
// member-facing frontend model.
//
// Architectural boundary:
//
//     Backend API Response
//              │
//              ▼
//     mapFinancialPaymentMethod()
//              │
//              ▼
//     FinancialPaymentMethod
//
// The mapper deliberately prevents backend transport shapes from leaking into
// UI components and hooks.
//
// It does NOT:
// - perform business logic;
// - perform authorization;
// - access persistence;
// - modify payment-method state;
// - infer ownership;
// - expose database identifiers.
//
// =============================================================================

import type { FinancialPaymentMethod } from '../models';

// -----------------------------------------------------------------------------
// API Response Contract
// -----------------------------------------------------------------------------

/**
 * Raw member-facing API response for a financial payment method.
 *
 * Nullable backend fields are represented explicitly here because API
 * responses may contain `null`, while the frontend model uses optional
 * properties.
 *
 * This keeps null-normalisation at the mapper boundary.
 */
export interface FinancialPaymentMethodApiResponse {
  publicId: string;
  type: FinancialPaymentMethod['type'];
  provider: string;
  providerReference?: string | null;
  displayName?: string | null;
  lastFour?: string | null;
  isDefault: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// -----------------------------------------------------------------------------
// Mapper
// -----------------------------------------------------------------------------

/**
 * Maps a backend FinancialPaymentMethod response into the frontend model.
 *
 * Nullable optional API fields are converted to omitted optional properties.
 */
export function mapFinancialPaymentMethod(
  response: FinancialPaymentMethodApiResponse,
): FinancialPaymentMethod {
  return {
    publicId: response.publicId,
    type: response.type,
    provider: response.provider,

    ...(response.providerReference != null && {
      providerReference: response.providerReference,
    }),

    ...(response.displayName != null && {
      displayName: response.displayName,
    }),

    ...(response.lastFour != null && {
      lastFour: response.lastFour,
    }),

    isDefault: response.isDefault,
    isActive: response.isActive,
    createdAt: response.createdAt,
    updatedAt: response.updatedAt,
  };
}

