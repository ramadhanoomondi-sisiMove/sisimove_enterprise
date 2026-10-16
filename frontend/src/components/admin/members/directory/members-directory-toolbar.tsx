
// -----------------------------------------------------------------------------
// sisiMove — Members Directory Toolbar
// -----------------------------------------------------------------------------
//
// Toolbar composition for the Admin Members directory.
//
// Responsibilities:
// - Compose the member search and status filters.
// - Display an optional directory summary.
// - Provide a slot for directory-level actions.
// - Keep filtering and action execution owned by their respective components.
//
// Non-responsibilities:
// - Fetching member records.
// - Applying backend query parameters.
// - Performing member-management mutations.
// - Managing pagination.
//
// -----------------------------------------------------------------------------

import type { ReactNode } from 'react';

import {
  MembersFilterBar,
  type MembersFilterValues,
} from './members-filter-bar';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface MembersDirectoryToolbarProps {
  /** Controlled directory filters. */
  readonly filters: MembersFilterValues;

  /** Receives changes to the directory filters. */
  readonly onFiltersChange: (filters: MembersFilterValues) => void;

  /** Optional summary displayed above the filters. */
  readonly summary?: string;

  /** Optional actions, such as create or export controls. */
  readonly actions?: ReactNode;

  /** Disable the toolbar controls during a parent-controlled operation. */
  readonly disabled?: boolean;

  /** Optional additional CSS classes. */
  readonly className?: string;
}

// -----------------------------------------------------------------------------
// Members Directory Toolbar
// -----------------------------------------------------------------------------

export function MembersDirectoryToolbar({
  filters,
  onFiltersChange,
  summary,
  actions,
  disabled = false,
  className,
}: MembersDirectoryToolbarProps): ReactNode {
  return (
    <section
      aria-label="Members directory controls"
      className={[
        'min-w-0 space-y-4',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {summary ? (
        <p className="text-sm text-[var(--foreground-muted)]">
          {summary}
        </p>
      ) : null}

      <MembersFilterBar
        values={filters}
        onChange={onFiltersChange}
        actions={actions}
        disabled={disabled}
      />
    </section>
  );
}

export default MembersDirectoryToolbar;
