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
 * Raw API response for a member-facing financial payment method.
 *
 * Nullable backend fields are represented explicitly because API responses
 * may contain null, while the frontend model uses optional properties.
 *
 * Only supported member-facing payment provider values are accepted.
 */
export interface FinancialPaymentMethodApiResponse {
  publicId: string;

  type: FinancialPaymentMethod['type'];

  provider: FinancialPaymentMethod['provider'];

  phoneNumber: string;

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

    phoneNumber: response.phoneNumber,

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