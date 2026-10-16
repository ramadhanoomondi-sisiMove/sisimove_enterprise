
// -----------------------------------------------------------------------------
// sisiMove — Members Table Columns
// -----------------------------------------------------------------------------
//
// Column definitions and formatting helpers for the Admin Members directory.
//
// Responsibilities:
// - Define the identity fields displayed in the member directory.
// - Provide consistent column labels and alignment metadata.
// - Format identity values for display.
// - Keep identity data separate from Profile, Verification and Trust domains.
//
// Non-responsibilities:
// - Fetching member data.
// - Rendering the complete table.
// - Inferring verification or trust information from identity data.
//
// -----------------------------------------------------------------------------

import type { MemberIdentity } from '@/features/admin/members/models/member.model';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export type MemberTableColumnKey =
  | 'member'
  | 'phoneNumber'
  | 'roles'
  | 'status'
  | 'createdAt'
  | 'actions';

export type MemberTableColumnAlignment = 'start' | 'center' | 'end';

export interface MemberTableColumn {
  /** Stable column identifier. */
  readonly key: MemberTableColumnKey;

  /** Human-readable column heading. */
  readonly label: string;

  /** Horizontal alignment for column content. */
  readonly align: MemberTableColumnAlignment;

  /** Whether the column may be hidden on narrower screens. */
  readonly responsive?: 'always' | 'md' | 'lg';

  /** Whether this column is sortable by the directory. */
  readonly sortable: boolean;
}

// -----------------------------------------------------------------------------
// Column Definitions
// -----------------------------------------------------------------------------

export const MEMBERS_TABLE_COLUMNS: readonly MemberTableColumn[] = [
  {
    key: 'member',
    label: 'Member',
    align: 'start',
    sortable: true,
  },
  {
    key: 'phoneNumber',
    label: 'Phone number',
    align: 'start',
    responsive: 'md',
    sortable: false,
  },
  {
    key: 'roles',
    label: 'Roles',
    align: 'start',
    responsive: 'lg',
    sortable: false,
  },
  {
    key: 'status',
    label: 'Status',
    align: 'start',
    sortable: true,
  },
  {
    key: 'createdAt',
    label: 'Date joined',
    align: 'start',
    responsive: 'lg',
    sortable: true,
  },
  {
    key: 'actions',
    label: 'Actions',
    align: 'end',
    sortable: false,
  },
] as const;

// -----------------------------------------------------------------------------
// Formatting Helpers
// -----------------------------------------------------------------------------

/**
 * Returns a safe display name for an identity that has no name field.
 *
 * The Identity model supplied so far exposes email and phoneNumber, not
 * firstName, lastName or displayName.
 */
export function getMemberDirectoryLabel(
  member: Pick<MemberIdentity, 'email' | 'publicId'>,
): string {
  const email = member.email.trim();

  if (email.length > 0) {
    return email;
  }

  return `Member ${member.publicId}`;
}

/**
 * Returns a display-safe phone number.
 */
export function formatMemberPhoneNumber(
  phoneNumber: string | null | undefined,
): string {
  const value = phoneNumber?.trim();

  return value || 'Not provided';
}

/**
 * Returns a readable date for a valid serialized date string.
 */
export function formatMemberCreatedAt(
  createdAt: string | null | undefined,
  locale = 'en-KE',
): string {
  if (!createdAt) {
    return '—';
  }

  const date = new Date(createdAt);

  if (Number.isNaN(date.getTime())) {
    return '—';
  }

  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

/**
 * Returns the number of role assignments associated with an identity.
 */
export function getMemberRoleCount(
  member: Pick<MemberIdentity, 'roles'>,
): number {
  return member.roles.length;
}
