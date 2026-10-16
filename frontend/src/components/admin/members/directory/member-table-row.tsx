
/**
 * sisiMove — Member Table Row
 *
 * Presentational table row for the Admin Members directory.
 *
 * Responsibilities:
 * - Render confirmed Identity model fields.
 * - Display a resolved public profile photo when available.
 * - Reuse MemberAvatar and MemberStatusBadge.
 * - Format the member's creation date.
 * - Allow the parent to provide row-specific actions.
 *
 * Non-responsibilities:
 * - Fetching member records or profile photos.
 * - Resolving Asset URLs.
 * - Performing member-management mutations.
 * - Inferring profile, verification or trust information.
 * - Implementing navigation or permission checks.
 */

import type { ReactNode } from 'react';

import {
  MemberAvatar,
  MemberStatusBadge,
} from '@/components/admin/members/primitives';

import {
  formatMemberCreatedAt,
  formatMemberPhoneNumber,
  getMemberDirectoryLabel,
  getMemberRoleCount,
} from './members-table-columns';

import type { MemberIdentity } from '@/features/admin/members/models/member.model';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface MemberTableRowProps {
  /** Identity record represented by this row. */
  readonly member: MemberIdentity;

  /** Already-resolved public profile photo URL, when available. */
  readonly avatarUrl?: string | null;

  /** Optional row actions supplied by the composing component. */
  readonly actions?: ReactNode;

  /** Optional callback to open the member detail view. */
  readonly onOpenMember?: (member: MemberIdentity) => void;

  /** Optional additional row classes. */
  readonly className?: string;
}

// -----------------------------------------------------------------------------
// Member Table Row
// -----------------------------------------------------------------------------

export function MemberTableRow({
  member,
  avatarUrl,
  actions,
  onOpenMember,
  className,
}: MemberTableRowProps): ReactNode {
  const memberLabel = getMemberDirectoryLabel(member);
  const roleCount = getMemberRoleCount(member);

  const rowClasses = [
    'border-b border-[var(--border-subtle)] last:border-b-0',
    'transition-colors hover:bg-[var(--background-subtle)]',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <tr className={rowClasses}>
      {/* Member identity */}
      <td className="px-4 py-4 sm:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <MemberAvatar
            src={avatarUrl}
            alt={`${memberLabel} profile photo`}
            fallback={memberLabel.slice(0, 2).toUpperCase()}
            size="md"
          />

          <div className="min-w-0">
            {onOpenMember ? (
              <button
                type="button"
                onClick={() => onOpenMember(member)}
                className={[
                  'block max-w-full truncate text-left text-sm font-medium',
                  'text-[var(--foreground)] hover:text-[var(--brand)]',
                  'focus-visible:outline-none focus-visible:underline',
                ].join(' ')}
                aria-label={`View member ${memberLabel}`}
              >
                {memberLabel}
              </button>
            ) : (
              <p className="truncate text-sm font-medium text-[var(--foreground)]">
                {memberLabel}
              </p>
            )}

            <p className="mt-1 truncate text-xs text-[var(--foreground-muted)]">
              ID: {member.publicId}
            </p>

            <p className="mt-1 truncate text-xs text-[var(--foreground-secondary)] md:hidden">
              {formatMemberPhoneNumber(member.phoneNumber)}
            </p>
          </div>
        </div>
      </td>

      {/* Phone number */}
      <td className="hidden px-4 py-4 text-sm text-[var(--foreground-secondary)] md:table-cell">
        {formatMemberPhoneNumber(member.phoneNumber)}
      </td>

      {/* Role assignments */}
      <td className="hidden px-4 py-4 lg:table-cell">
        <span className="inline-flex items-center rounded-[var(--radius-full)] bg-[var(--background-muted)] px-2.5 py-1 text-xs font-medium text-[var(--foreground-secondary)]">
          {roleCount} {roleCount === 1 ? 'role' : 'roles'}
        </span>
      </td>

      {/* Identity lifecycle status */}
      <td className="whitespace-nowrap px-4 py-4">
        <MemberStatusBadge status={member.status} />
      </td>

      {/* Creation date */}
      <td className="hidden whitespace-nowrap px-4 py-4 text-sm text-[var(--foreground-secondary)] lg:table-cell">
        {formatMemberCreatedAt(member.createdAt)}
      </td>

      {/* Parent-composed actions */}
      <td className="px-4 py-4 text-right">
        {actions}
      </td>
    </tr>
  );
}

export default MemberTableRow;
