// =============================================================================
// sisiMove — Map Financial Payment
// =============================================================================
//
// Maps the FinancialPayment API response into the frontend FinancialPayment
// model.
//
// This mapper is a frontend boundary adapter.
//
// Responsibilities:
// - translate API response data into the frontend model;
// - map nested payment attempts;
// - convert nullable optional API fields into frontend optional fields;
// - preserve API-safe public identifiers;
// - keep backend response details out of UI components.
//
// Non-responsibilities:
// - payment lifecycle rules;
// - payment processing;
// - provider communication;
// - wallet balance mutation;
// - currency conversion;
// - monetary calculations.
//
// Monetary amounts remain integer minor units. No formatting, rounding, or
// arithmetic is performed here.
//
// =============================================================================

import type {
  FinancialPayment,
  FinancialPaymentAttempt,
} from '../models';
import type { FinancialPaymentAttemptStatus } from '../models';
import type { FinancialPaymentStatus } from '../models';

// -----------------------------------------------------------------------------
// API Response Types
// -----------------------------------------------------------------------------

export interface FinancialPaymentAttemptApiResponse {
  readonly publicId: string;
  readonly status: FinancialPaymentAttemptStatus;
  readonly provider: string;
  readonly providerReference?: string | null;
  readonly amount: number;
  readonly currency: string;
  readonly failureCode?: string | null;
  readonly failureMessage?: string | null;
  readonly startedAt?: string | null;
  readonly completedAt?: string | null;
  readonly failedAt?: string | null;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface FinancialPaymentApiResponse {
  readonly publicId: string;
  readonly amount: number;
  readonly currency: string;
  readonly status: FinancialPaymentStatus;
  readonly methodPublicId?: string | null;
  readonly attempts?: readonly FinancialPaymentAttemptApiResponse[] | null;
  readonly transactionPublicId?: string | null;
  readonly referenceType?: string | null;
  readonly referencePublicId?: string | null;
  readonly initiatedAt: string;
  readonly completedAt?: string | null;
  readonly failedAt?: string | null;
  readonly cancelledAt?: string | null;
  readonly createdAt: string;
  readonly updatedAt: string;
}

// -----------------------------------------------------------------------------
// Map Payment Attempt
// -----------------------------------------------------------------------------

function mapFinancialPaymentAttempt(
  response: FinancialPaymentAttemptApiResponse,
): FinancialPaymentAttempt {
  return {
    publicId: response.publicId,
    status: response.status,
    provider: response.provider,
    ...(response.providerReference != null
      ? { providerReference: response.providerReference }
      : {}),
    amount: response.amount,
    currency: response.currency,
    ...(response.failureCode != null
      ? { failureCode: response.failureCode }
      : {}),
    ...(response.failureMessage != null
      ? { failureMessage: response.failureMessage }
      : {}),
    ...(response.startedAt != null
      ? { startedAt: response.startedAt }
      : {}),
    ...(response.completedAt != null
      ? { completedAt: response.completedAt }
      : {}),
    ...(response.failedAt != null
      ? { failedAt: response.failedAt }
      : {}),
    createdAt: response.createdAt,
    updatedAt: response.updatedAt,
  };
}

// -----------------------------------------------------------------------------
// Map Financial Payment
// -----------------------------------------------------------------------------

export function mapFinancialPayment(
  response: FinancialPaymentApiResponse,
): FinancialPayment {
  return {
    publicId: response.publicId,
    amount: response.amount,
    currency: response.currency,
    status: response.status,
    ...(response.methodPublicId != null
      ? { methodPublicId: response.methodPublicId }
      : {}),
    attempts: (response.attempts ?? []).map(mapFinancialPaymentAttempt),
    ...(response.transactionPublicId != null
      ? { transactionPublicId: response.transactionPublicId }
      : {}),
    ...(response.referenceType != null
      ? { referenceType: response.referenceType }
      : {}),
    ...(response.referencePublicId != null
      ? { referencePublicId: response.referencePublicId }
      : {}),
    initiatedAt: response.initiatedAt,
    ...(response.completedAt != null
      ? { completedAt: response.completedAt }
      : {}),
    ...(response.failedAt != null
      ? { failedAt: response.failedAt }
      : {}),
    ...(response.cancelledAt != null
      ? { cancelledAt: response.cancelledAt }
      : {}),
    createdAt: response.createdAt,
    updatedAt: response.updatedAt,
  };
}

