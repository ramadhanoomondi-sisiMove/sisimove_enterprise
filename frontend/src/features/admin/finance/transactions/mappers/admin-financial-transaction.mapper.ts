import type {
  AdminFinancialTransaction,
  AdminFinancialTransactionEntry,
} from '../models/admin-financial-transaction.model';

import {
  AdminFinancialTransactionStatus,
  AdminFinancialTransactionType,
  AdminFinancialTransactionEntryType,
  AdminFinancialBalanceType,
} from '../models/admin-financial-transaction.enums';

/**
 * Raw transaction response returned by the REST API.
 *
 * Dates may arrive as ISO strings or serialized Date values.
 * Optional fields may be omitted or explicitly null.
 */
export interface AdminFinancialTransactionApiResponse {
  publicId: string;
  type: string;
  status: string;
  amount: number;
  currency: string;

  sourceAccountPublicId?: string | null;
  destinationAccountPublicId?: string | null;

  reference?: string | null;
  accountingJournalPublicId?: string | null;

  entries: AdminFinancialTransactionEntryApiResponse[];

  completedAt?: string | null;
  failedAt?: string | null;
  reversedAt?: string | null;
  cancelledAt?: string | null;

  createdAt: string;
  updatedAt: string;
}

export interface AdminFinancialTransactionEntryApiResponse {
  publicId: string;
  accountPublicId: string;
  type: string;
  balanceType: string;
  amount: number;
  currency: string;
  createdAt: string;
}

/**
 * Runtime validation helpers.
 */
function requireString(value: unknown, field: string): string {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(
      `Invalid financial transaction response: ${field} must be a non-empty string.`,
    );
  }

  return value;
}

function requireAmount(value: unknown, field: string): number {
  if (
    typeof value !== 'number' ||
    !Number.isSafeInteger(value) ||
    value < 0
  ) {
    throw new Error(
      `Invalid financial transaction response: ${field} must be a non-negative safe integer.`,
    );
  }

  return value;
}

function normalizeOptionalString(
  value: string | null | undefined,
): string | undefined {
  if (value == null || value.trim() === '') {
    return undefined;
  }

  return value;
}

function normalizeOptionalDate(
  value: string | null | undefined,
  field: string,
): string | undefined {
  if (value == null) {
    return undefined;
  }

  return normalizeDate(value, field);
}

function normalizeDate(value: string, field: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new Error(
      `Invalid financial transaction response: ${field} must be a valid date.`,
    );
  }

  return date.toISOString();
}

function normalizeTransactionType(
  value: string,
): AdminFinancialTransactionType {
  if (
    !Object.values(AdminFinancialTransactionType).includes(
      value as AdminFinancialTransactionType,
    )
  ) {
    throw new Error(
      `Unknown financial transaction type: ${value}`,
    );
  }

  return value as AdminFinancialTransactionType;
}

function normalizeTransactionStatus(
  value: string,
): AdminFinancialTransactionStatus {
  if (
    !Object.values(AdminFinancialTransactionStatus).includes(
      value as AdminFinancialTransactionStatus,
    )
  ) {
    throw new Error(
      `Unknown financial transaction status: ${value}`,
    );
  }

  return value as AdminFinancialTransactionStatus;
}

function normalizeEntryType(
  value: string,
): AdminFinancialTransactionEntryType {
  if (
    !Object.values(AdminFinancialTransactionEntryType).includes(
      value as AdminFinancialTransactionEntryType,
    )
  ) {
    throw new Error(`Unknown transaction entry type: ${value}`);
  }

  return value as AdminFinancialTransactionEntryType;
}

function normalizeBalanceType(
  value: string,
): AdminFinancialBalanceType {
  if (
    !Object.values(AdminFinancialBalanceType).includes(
      value as AdminFinancialBalanceType,
    )
  ) {
    throw new Error(`Unknown financial balance type: ${value}`);
  }

  return value as AdminFinancialBalanceType;
}

/**
 * Maps a raw transaction entry into the frontend model.
 */
function mapEntry(
  entry: AdminFinancialTransactionEntryApiResponse,
): AdminFinancialTransactionEntry {
  return {
    publicId: requireString(entry.publicId, 'entries.publicId'),
    accountPublicId: requireString(
      entry.accountPublicId,
      'entries.accountPublicId',
    ),
    type: normalizeEntryType(entry.type),
    balanceType: normalizeBalanceType(entry.balanceType),
    amount: requireAmount(entry.amount, 'entries.amount'),
    currency: requireString(entry.currency, 'entries.currency'),
    createdAt: normalizeDate(
      entry.createdAt,
      'entries.createdAt',
    ),
  };
}

/**
 * Maps a single transaction API response into the frontend model.
 */
export function mapAdminFinancialTransaction(
  response: AdminFinancialTransactionApiResponse,
): AdminFinancialTransaction {
  if (!Array.isArray(response.entries)) {
    throw new Error(
      'Invalid financial transaction response: entries must be an array.',
    );
  }

  return {
    publicId: requireString(response.publicId, 'publicId'),

    type: normalizeTransactionType(response.type),
    status: normalizeTransactionStatus(response.status),

    amount: requireAmount(response.amount, 'amount'),
    currency: requireString(response.currency, 'currency'),

    sourceAccountPublicId: normalizeOptionalString(
      response.sourceAccountPublicId,
    ),

    destinationAccountPublicId: normalizeOptionalString(
      response.destinationAccountPublicId,
    ),

    reference: normalizeOptionalString(response.reference),

    accountingJournalPublicId: normalizeOptionalString(
      response.accountingJournalPublicId,
    ),

    entries: response.entries.map(mapEntry),

    completedAt: normalizeOptionalDate(
      response.completedAt,
      'completedAt',
    ),

    failedAt: normalizeOptionalDate(
      response.failedAt,
      'failedAt',
    ),

    reversedAt: normalizeOptionalDate(
      response.reversedAt,
      'reversedAt',
    ),

    cancelledAt: normalizeOptionalDate(
      response.cancelledAt,
      'cancelledAt',
    ),

    createdAt: normalizeDate(response.createdAt, 'createdAt'),
    updatedAt: normalizeDate(response.updatedAt, 'updatedAt'),
  };
}

/**
 * Maps a collection of transaction responses.
 */
export function mapAdminFinancialTransactions(
  responses: AdminFinancialTransactionApiResponse[],
): AdminFinancialTransaction[] {
  return responses.map(mapAdminFinancialTransaction);
}

/**
 * Maps an optional transaction response.
 */
export function mapOptionalAdminFinancialTransaction(
  response:
    | AdminFinancialTransactionApiResponse
    | null
    | undefined,
): AdminFinancialTransaction | null {
  if (response == null) {
    return null;
  }

  return mapAdminFinancialTransaction(response);
}

/**
 * Namespace-style mapper for convenient imports.
 */
export const AdminFinancialTransactionMapper = {
  toModel: mapAdminFinancialTransaction,
  toModels: mapAdminFinancialTransactions,
  toOptionalModel: mapOptionalAdminFinancialTransaction,
};

export default AdminFinancialTransactionMapper;