
 // -----------------------------------------------------------------------------
 // sisiMove Admin — Financial Account API Mapper
 // -----------------------------------------------------------------------------
 // Converts untrusted JSON/API payloads into the frontend's typed models.
 // This mapper has no runtime dependencies and does not invent missing values.
 // Public IDs are preserved as returned; internal identifiers are never used.
 // -----------------------------------------------------------------------------

import {
  AdminFinancialAccountStatus,
  AdminFinancialAccountType,
} from '../models/admin-financial-account.enums';
import type {
  AdminFinancialAccount,
  AdminFinancialAccountBalance,
  AdminFinancialAccountBalanceOnly,
} from '../models/admin-financial-account.model';

export type FinancialAccountApiPayload = unknown;

export class AdminFinancialAccountMapperError extends Error {
  public constructor(message: string) {
    super(message);
    this.name = 'AdminFinancialAccountMapperError';
  }
}

const ACCOUNT_TYPES = new Set<string>(
  Object.values(AdminFinancialAccountType),
);

const ACCOUNT_STATUSES = new Set<string>(
  Object.values(AdminFinancialAccountStatus),
);

function asRecord(
  value: unknown,
  path: string,
): Record<string, unknown> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new AdminFinancialAccountMapperError(
      `${path} must be an object.`,
    );
  }

  return value as Record<string, unknown>;
}

function requiredString(value: unknown, path: string): string {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new AdminFinancialAccountMapperError(
      `${path} must be a non-empty string.`,
    );
  }

  return value;
}

function optionalOwnerPublicId(
  value: unknown,
): string | undefined {
  // JSON serialization omits properties whose value was undefined.
  if (value === undefined || value === null) {
    return undefined;
  }

  return requiredString(value, 'ownerPublicId');
}

function nonNegativeSafeInteger(
  value: unknown,
  path: string,
): number {
  if (
    typeof value !== 'number' ||
    !Number.isSafeInteger(value) ||
    value < 0
  ) {
    throw new AdminFinancialAccountMapperError(
      `${path} must be a non-negative safe integer (minor units for monetary amounts).`,
    );
  }

  return value;
}

function isoDateTime(value: unknown, path: string): string {
  const raw =
    value instanceof Date
      ? value.toISOString()
      : requiredString(value, path);

  if (Number.isNaN(Date.parse(raw))) {
    throw new AdminFinancialAccountMapperError(
      `${path} must be a valid date-time.`,
    );
  }

  return raw;
}

function accountType(
  value: unknown,
): AdminFinancialAccountType {
  const raw = requiredString(value, 'type');

  if (!ACCOUNT_TYPES.has(raw)) {
    throw new AdminFinancialAccountMapperError(
      `Unsupported financial account type: ${raw}.`,
    );
  }

  return raw as AdminFinancialAccountType;
}

function accountStatus(
  value: unknown,
): AdminFinancialAccountStatus {
  const raw = requiredString(value, 'status');

  if (!ACCOUNT_STATUSES.has(raw)) {
    throw new AdminFinancialAccountMapperError(
      `Unsupported financial account status: ${raw}.`,
    );
  }

  return raw as AdminFinancialAccountStatus;
}

function mapBalanceFields(
  payload: Record<string, unknown>,
  options: { includeAccountPublicId: true },
): AdminFinancialAccountBalance;

function mapBalanceFields(
  payload: Record<string, unknown>,
  options: { includeAccountPublicId: false },
): AdminFinancialAccountBalanceOnly;

function mapBalanceFields(
  payload: Record<string, unknown>,
  options: { includeAccountPublicId: boolean },
): AdminFinancialAccountBalance | AdminFinancialAccountBalanceOnly {
  const base = {
    publicId: requiredString(
      payload.publicId,
      'balance.publicId',
    ),
    availableAmount: nonNegativeSafeInteger(
      payload.availableAmount,
      'balance.availableAmount',
    ),
    pendingAmount: nonNegativeSafeInteger(
      payload.pendingAmount,
      'balance.pendingAmount',
    ),
    heldAmount: nonNegativeSafeInteger(
      payload.heldAmount,
      'balance.heldAmount',
    ),
    totalAmount: nonNegativeSafeInteger(
      payload.totalAmount,
      'balance.totalAmount',
    ),
    currency: requiredString(
      payload.currency,
      'balance.currency',
    ),
    version: nonNegativeSafeInteger(
      payload.version,
      'balance.version',
    ),
    createdAt: isoDateTime(
      payload.createdAt,
      'balance.createdAt',
    ),
    updatedAt: isoDateTime(
      payload.updatedAt,
      'balance.updatedAt',
    ),
  };

  const expectedTotal =
    base.availableAmount +
    base.pendingAmount +
    base.heldAmount;

  if (
    !Number.isSafeInteger(expectedTotal) ||
    base.totalAmount !== expectedTotal
  ) {
    throw new AdminFinancialAccountMapperError(
      'balance.totalAmount must equal availableAmount + pendingAmount + heldAmount.',
    );
  }

  if (!options.includeAccountPublicId) {
    return base;
  }

  return {
    ...base,
    accountPublicId: requiredString(
      payload.accountPublicId,
      'balance.accountPublicId',
    ),
  };
}

export class AdminFinancialAccountMapper {
  /**
   * Map GET /financial-accounts/:accountPublicId
   * into the frontend account model.
   */
  public static toAccount(
    payload: FinancialAccountApiPayload,
  ): AdminFinancialAccount {
    const record = asRecord(
      payload,
      'financial account response',
    );

    const balanceRecord = asRecord(
      record.balance,
      'balance',
    );

    const currency = requiredString(
      record.currency,
      'currency',
    );

    const balance = mapBalanceFields(
      balanceRecord,
      { includeAccountPublicId: true },
    );

    if (balance.currency !== currency) {
      throw new AdminFinancialAccountMapperError(
        'Account currency and nested balance currency must match.',
      );
    }

    return {
      publicId: requiredString(record.publicId, 'publicId'),
      ownerPublicId: optionalOwnerPublicId(
        record.ownerPublicId,
      ),
      type: accountType(record.type),
      status: accountStatus(record.status),
      currency,
      balance,
      createdAt: isoDateTime(
        record.createdAt,
        'createdAt',
      ),
      updatedAt: isoDateTime(
        record.updatedAt,
        'updatedAt',
      ),
    };
  }

  /**
   * Map GET /financial-accounts into frontend account models.
   * Each account is validated using the existing toAccount mapper.
   */
  public static toAccounts(
    payload: FinancialAccountApiPayload,
  ): AdminFinancialAccount[] {
    if (!Array.isArray(payload)) {
      throw new AdminFinancialAccountMapperError(
        'Financial accounts response must be an array.',
      );
    }

    return payload.map((item: unknown) => this.toAccount(item));
  }

  /** Map GET /financial-accounts/:accountPublicId/balance response. */
  public static toBalance(
    payload: FinancialAccountApiPayload,
  ): AdminFinancialAccountBalanceOnly {
    return mapBalanceFields(
      asRecord(
        payload,
        'financial account balance response',
      ),
      { includeAccountPublicId: false },
    );
  }
}

/** Convenient named functions for callers that prefer function imports. */
export const mapAdminFinancialAccount =
  AdminFinancialAccountMapper.toAccount;

export const mapAdminFinancialAccounts =
  AdminFinancialAccountMapper.toAccounts;

export const mapAdminFinancialAccountBalance =
  AdminFinancialAccountMapper.toBalance;
