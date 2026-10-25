import type { AdminAccountHold } from '../models/admin-account-hold.model';
import { AdminAccountHoldStatus } from '../models/admin-account-hold.enums';

/**
 * Raw REST response from the Financial Account Hold backend.
 *
 * The backend mapper exposes Date values, which normally arrive as
 * ISO strings over JSON HTTP transport.
 */
export interface AdminAccountHoldApiResponse {
  publicId: string;
  accountPublicId: string;

  amount: number;
  currency: string;
  status: string;

  isActive: boolean;
  isReleased: boolean;
  isCaptured: boolean;
  isCancelled: boolean;
  isTerminal: boolean;

  referenceType?: string;
  referencePublicId?: string;

  expiresAt?: string | Date;
  hasExpiry: boolean;
  isExpired: boolean;
  isCurrentlyActive: boolean;

  holdTransactionPublicId?: string;
  releaseTransactionPublicId?: string;
  captureTransactionPublicId?: string;

  releasedAt?: string | Date;
  capturedAt?: string | Date;
  cancelledAt?: string | Date;

  createdAt: string | Date;
  updatedAt: string | Date;
}

const VALID_STATUSES = new Set<string>(
  Object.values(AdminAccountHoldStatus),
);

function normalizeOptionalDate(
  value?: string | Date | null,
): string | undefined {
  if (value == null || value === '') {
    return undefined;
  }

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return undefined;
  }

  return date.toISOString();
}

function normalizeRequiredDate(
  value: string | Date,
  fieldName: string,
): string {
  const normalized = normalizeOptionalDate(value);

  if (!normalized) {
    throw new Error(
      `Invalid ${fieldName} in Financial Account Hold response.`,
    );
  }

  return normalized;
}

function normalizeStatus(status: string): AdminAccountHoldStatus {
  if (!VALID_STATUSES.has(status)) {
    throw new Error(
      `Unknown Financial Account Hold status: ${status}`,
    );
  }

  return status as AdminAccountHoldStatus;
}

/**
 * Maps one backend Financial Account Hold response to the frontend model.
 *
 * Backend lifecycle and expiry flags are preserved rather than recalculated.
 */
export function mapAdminAccountHold(
  response: AdminAccountHoldApiResponse,
): AdminAccountHold {
  return {
    publicId: response.publicId,
    accountPublicId: response.accountPublicId,

    amount: response.amount,
    currency: response.currency,
    status: normalizeStatus(response.status),

    isActive: response.isActive,
    isReleased: response.isReleased,
    isCaptured: response.isCaptured,
    isCancelled: response.isCancelled,
    isTerminal: response.isTerminal,

    referenceType: response.referenceType,
    referencePublicId: response.referencePublicId,

    expiresAt: normalizeOptionalDate(response.expiresAt),
    hasExpiry: response.hasExpiry,
    isExpired: response.isExpired,
    isCurrentlyActive: response.isCurrentlyActive,

    holdTransactionPublicId: response.holdTransactionPublicId,
    releaseTransactionPublicId: response.releaseTransactionPublicId,
    captureTransactionPublicId: response.captureTransactionPublicId,

    releasedAt: normalizeOptionalDate(response.releasedAt),
    capturedAt: normalizeOptionalDate(response.capturedAt),
    cancelledAt: normalizeOptionalDate(response.cancelledAt),

    createdAt: normalizeRequiredDate(response.createdAt, 'createdAt'),
    updatedAt: normalizeRequiredDate(response.updatedAt, 'updatedAt'),
  };
}

/**
 * Maps a collection of backend hold responses.
 */
export function mapAdminAccountHolds(
  responses: readonly AdminAccountHoldApiResponse[],
): AdminAccountHold[] {
  return responses.map(mapAdminAccountHold);
}