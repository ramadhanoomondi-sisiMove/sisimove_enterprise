// -----------------------------------------------------------------------------
// sisiMove — Admin Member Detail Navigation
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Display navigation between member detail sections.
// - Support controlled active-section selection.
// - Provide accessible tab semantics.
// - Allow the parent to control which section is displayed.
//
// Non-responsibilities:
// - Fetching member data.
// - Managing API requests.
// - Enforcing administrative permissions.
// - Rendering the detail panels themselves.
//
// -----------------------------------------------------------------------------

import type { ReactNode } from 'react';

import { cn } from '@/foundation/utils/cn';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export const MEMBER_DETAIL_SECTIONS = [
  { id: 'identity', label: 'Identity' },
  { id: 'profile', label: 'Profile' },
  { id: 'verification', label: 'Verification' },
  { id: 'trust', label: 'Trust' },
  { id: 'roles', label: 'Roles & access' },
  { id: 'security', label: 'Security' },
  { id: 'journeys', label: 'Journeys' },
  { id: 'bookings', label: 'Bookings' },
  { id: 'activity', label: 'Activity' },
] as const;

export type MemberDetailSection =
  (typeof MEMBER_DETAIL_SECTIONS)[number]['id'];

export interface MemberDetailNavigationProps {
  /**
   * Currently selected detail section.
   */
  readonly activeSection: MemberDetailSection;

  /**
   * Called when the administrator selects another section.
   */
  readonly onSectionChange: (section: MemberDetailSection) => void;

  /**
   * Optional additional presentation classes.
   */
  readonly className?: string;

  /**
   * Optional stable ID used to associate the navigation with its tab panel.
   */
  readonly id?: string;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function MemberDetailNavigation({
  activeSection,
  onSectionChange,
  className,
  id = 'member-detail-navigation',
}: MemberDetailNavigationProps): ReactNode {
  return (
    <nav
      aria-label="Member detail sections"
      className={cn(
        'min-w-0 border-b border-[var(--border)]',
        className,
      )}
    >
      <div
        id={id}
        role="tablist"
        aria-label="Member detail sections"
        className={cn(
          'flex min-w-0 gap-1 overflow-x-auto overscroll-x-contain',
          'scrollbar-thin',
        )}
      >
        {MEMBER_DETAIL_SECTIONS.map((section) => {
          const isActive = activeSection === section.id;

          return (
            <button
              key={section.id}
              id={`${id}-tab-${section.id}`}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`${id}-panel-${section.id}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => onSectionChange(section.id)}
              className={cn(
                'relative -mb-px shrink-0 whitespace-nowrap',
                'border-b-2 px-3 py-3 text-sm font-medium',
                'transition-colors duration-150',
                'focus-visible:outline-none focus-visible:ring-2',
                'focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2',
                isActive
                  ? 'border-[var(--brand)] text-[var(--brand)]'
                  : [
                      'border-transparent',
                      'text-[var(--foreground-secondary)]',
                      'hover:border-[var(--border-strong)]',
                      'hover:text-[var(--foreground)]',
                    ].join(' '),
              )}
            >
              {section.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export default MemberDetailNavigation;
