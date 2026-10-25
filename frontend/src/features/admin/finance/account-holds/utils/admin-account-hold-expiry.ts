import type { AdminAccountHold } from '../models/admin-account-hold.model';

/**
 * Determines whether the expiry timestamp has passed.
 *
 * This is a presentation helper only. It does not change the hold lifecycle.
 */
export function isAdminAccountHoldExpiryPassed(
  expiresAt?: string | Date | null,
  now: Date = new Date(),
): boolean {
  if (expiresAt == null || expiresAt === '') {
    return false;
  }

  const expiry =
    expiresAt instanceof Date ? expiresAt : new Date(expiresAt);

  if (Number.isNaN(expiry.getTime())) {
    return false;
  }

  return expiry.getTime() <= now.getTime();
}

/**
 * Determines whether a hold is both ACTIVE and not expired.
 */
export function isAdminAccountHoldCurrentlyUsable(
  hold: Pick<AdminAccountHold, 'status' | 'expiresAt'>,
  now: Date = new Date(),
): boolean {
  if (hold.status !== 'ACTIVE') {
    return false;
  }

  if (hold.expiresAt == null) {
    return true;
  }

  return !isAdminAccountHoldExpiryPassed(hold.expiresAt, now);
}

/**
 * Returns a readable expiry label.
 */
export function getAdminAccountHoldExpiryLabel(
  hold: Pick<AdminAccountHold, 'status' | 'expiresAt'>,
  now: Date = new Date(),
): string {
  if (hold.expiresAt == null) {
    return 'No expiry configured';
  }

  if (isAdminAccountHoldExpiryPassed(hold.expiresAt, now)) {
    return hold.status === 'ACTIVE'
      ? 'Expired — still ACTIVE'
      : 'Expiry passed';
  }

  return 'Expires ' + hold.expiresAt.toString();
}