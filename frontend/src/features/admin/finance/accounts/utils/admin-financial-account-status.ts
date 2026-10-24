// -----------------------------------------------------------------------------
// sisiMove Admin — Financial Account Status Helpers
// -----------------------------------------------------------------------------
// These helpers map backend enum values to display text and semantic UI tones.
// They do not decide whether a user is authorized to perform an operation.
// -----------------------------------------------------------------------------

import {
  AdminFinancialAccountStatus,
  AdminFinancialAccountType,
  AdminFinancialBalanceType,
} from '../models/admin-financial-account.enums';

export type FinancialAccountStatusTone = 'success' | 'warning' | 'danger' | 'neutral';
export type FinancialAccountTypeTone = 'primary' | 'info' | 'neutral';
export type FinancialBalanceTypeTone = 'success' | 'warning' | 'info';

export function getFinancialAccountStatusLabel(
  status: AdminFinancialAccountStatus | string | null | undefined,
): string {
  switch (status) {
    case AdminFinancialAccountStatus.ACTIVE:
      return 'Active';
    case AdminFinancialAccountStatus.SUSPENDED:
      return 'Suspended';
    case AdminFinancialAccountStatus.CLOSED:
      return 'Closed';
    default:
      return status?.trim() || 'Unknown';
  }
}

export function getFinancialAccountStatusTone(
  status: AdminFinancialAccountStatus | string | null | undefined,
): FinancialAccountStatusTone {
  switch (status) {
    case AdminFinancialAccountStatus.ACTIVE:
      return 'success';
    case AdminFinancialAccountStatus.SUSPENDED:
      return 'warning';
    case AdminFinancialAccountStatus.CLOSED:
      return 'danger';
    default:
      return 'neutral';
  }
}

export function getFinancialAccountTypeLabel(
  type: AdminFinancialAccountType | string | null | undefined,
): string {
  switch (type) {
    case AdminFinancialAccountType.USER:
      return 'User';
    case AdminFinancialAccountType.PLATFORM:
      return 'Platform';
    case AdminFinancialAccountType.MERCHANT:
      return 'Merchant';
    case AdminFinancialAccountType.HOLDING:
      return 'Holding';
    case AdminFinancialAccountType.SETTLEMENT:
      return 'Settlement';
    default:
      return type?.trim() || 'Unknown';
  }
}

export function getFinancialAccountTypeTone(
  type: AdminFinancialAccountType | string | null | undefined,
): FinancialAccountTypeTone {
  switch (type) {
    case AdminFinancialAccountType.PLATFORM:
      return 'primary';
    case AdminFinancialAccountType.MERCHANT:
    case AdminFinancialAccountType.SETTLEMENT:
      return 'info';
    case AdminFinancialAccountType.USER:
    case AdminFinancialAccountType.HOLDING:
    default:
      return 'neutral';
  }
}

export function getFinancialBalanceTypeLabel(
  type: AdminFinancialBalanceType | string | null | undefined,
): string {
  switch (type) {
    case AdminFinancialBalanceType.AVAILABLE:
      return 'Available';
    case AdminFinancialBalanceType.PENDING:
      return 'Pending';
    case AdminFinancialBalanceType.HELD:
      return 'Held';
    default:
      return type?.trim() || 'Unknown';
  }
}

export function getFinancialBalanceTypeTone(
  type: AdminFinancialBalanceType | string | null | undefined,
): FinancialBalanceTypeTone {
  switch (type) {
    case AdminFinancialBalanceType.AVAILABLE:
      return 'success';
    case AdminFinancialBalanceType.PENDING:
      return 'warning';
    case AdminFinancialBalanceType.HELD:
      return 'info';
    default:
      return 'info';
  }
}

/** True only for the backend's ACTIVE state; this is not an authorization check. */
export function isFinancialAccountActive(
  status: AdminFinancialAccountStatus | string | null | undefined,
): boolean {
  return status === AdminFinancialAccountStatus.ACTIVE;
}

/** True only for the backend's CLOSED state. */
export function isFinancialAccountClosed(
  status: AdminFinancialAccountStatus | string | null | undefined,
): boolean {
  return status === AdminFinancialAccountStatus.CLOSED;
}
