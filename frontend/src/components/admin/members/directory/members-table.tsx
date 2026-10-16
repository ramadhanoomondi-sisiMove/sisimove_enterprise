
/**
 * sisiMove — Members Table
 *
 * Table presentation for the Admin Members directory.
 *
 * Responsibilities:
 * - Render the member directory table.
 * - Compose shared column definitions and MemberTableRow.
 * - Pass resolved public avatar URLs to member rows.
 * - Communicate row selection through typed callbacks.
 * - Provide an accessible table structure.
 *
 * Non-responsibilities:
 * - Fetching member records or profile photos.
 * - Resolving Asset URLs.
 * - Managing API loading and error states.
 * - Performing member-management mutations.
 * - Owning pagination state.
 */

import type { ReactNode } from 'react';

import type { MemberIdentity } from '@/features/admin/members/models/member.model';

import { MemberTableRow } from './member-table-row';
import { MEMBERS_TABLE_COLUMNS } from './members-table-columns';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface MembersTableProps {
  /** Member records supplied by the directory data owner. */
  readonly members: readonly MemberIdentity[];

  /**
   * Resolved public avatar URLs keyed by member identity public ID.
   * Members without a URL use the MemberAvatar initials fallback.
   */
  readonly avatarUrlsByMemberId?: ReadonlyMap<string, string | null>;

  /** Optional action content rendered for each member. */
  readonly renderActions?: (member: MemberIdentity) => ReactNode;

  /** Called when a member is selected for viewing. */
  readonly onOpenMember?: (member: MemberIdentity) => void;

  /** Optional accessible description for the table. */
  readonly caption?: string;

  /** Optional additional CSS classes. */
  readonly className?: string;
}

// -----------------------------------------------------------------------------
// Members Table
// -----------------------------------------------------------------------------

export function MembersTable({
  members,
  avatarUrlsByMemberId,
  renderActions,
  onOpenMember,
  caption = 'Members directory',
  className,
}: MembersTableProps): ReactNode {
  return (
    <div
      className={[
        'min-w-0 overflow-x-auto rounded-[var(--radius-xl)]',
        'border border-[var(--border)] bg-[var(--surface)]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <table className="w-full min-w-[680px] border-collapse text-left">
        <caption className="sr-only">{caption}</caption>

        <thead className="bg-[var(--background-subtle)]">
          <tr>
            {MEMBERS_TABLE_COLUMNS.map((column) => {
              const responsiveClass =
                column.responsive === 'md'
                  ? 'hidden md:table-cell'
                  : column.responsive === 'lg'
                    ? 'hidden lg:table-cell'
                    : '';

              const alignmentClass =
                column.align === 'end'
                  ? 'text-right'
                  : column.align === 'center'
                    ? 'text-center'
                    : 'text-left';

              return (
                <th
                  key={column.key}
                  scope="col"
                  className={[
                    'whitespace-nowrap px-4 py-3',
                    'text-xs font-semibold uppercase tracking-wide',
                    'text-[var(--foreground-muted)] sm:px-5',
                    responsiveClass,
                    alignmentClass,
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  {column.label}
                </th>
              );
            })}
          </tr>
        </thead>

        <tbody>
          {members.map((member) => (
            <MemberTableRow
              key={member.publicId}
              member={member}
              avatarUrl={avatarUrlsByMemberId?.get(member.publicId)}
              actions={renderActions?.(member)}
              onOpenMember={onOpenMember}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MembersTable;
