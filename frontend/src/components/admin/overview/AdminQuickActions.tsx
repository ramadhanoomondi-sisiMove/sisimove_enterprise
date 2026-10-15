
/**
 * -----------------------------------------------------------------------------
 * sisiMove — Admin Quick Actions
 * -----------------------------------------------------------------------------
 *
 * Quick-action panel for the Admin Overview dashboard.
 *
 * Responsibilities:
 *
 * - provide shortcuts to common administrative workflows;
 * - present actions consistently with the sisiMove design system;
 * - support optional descriptions and leading icons;
 * - support disabled actions where a workflow is unavailable;
 * - leave navigation ownership with the parent component.
 *
 * Architectural boundaries:
 *
 * - This component does not fetch API data.
 * - It does not define application routes.
 * - It does not assume a particular routing library.
 * - The parent supplies action callbacks.
 *
 * -----------------------------------------------------------------------------
 */

import type { ReactNode } from 'react';

import {
  Button,
  Card,
  Divider,
} from '@/components/ui';

import OverviewSectionHeader from './OverviewSectionHeader';


// =============================================================================
// Types
// =============================================================================

export interface AdminQuickAction {
  /**
   * Stable identifier for the action.
   */
  id: string;

  /**
   * Main action label.
   */
  label: string;

  /**
   * Short explanation of the destination or workflow.
   */
  description?: string;

  /**
   * Optional icon rendered beside the action.
   */
  icon?: ReactNode;

  /**
   * Callback executed when the action is selected.
   */
  onClick: () => void;

  /**
   * Whether the action is currently unavailable.
   */
  disabled?: boolean;

  /**
   * Optional accessible label when the visible label is insufficient.
   */
  ariaLabel?: string;
}

export interface AdminQuickActionsProps {
  /**
   * Actions to display in the panel.
   */
  actions?: AdminQuickAction[];

  /**
   * Panel heading.
   */
  title?: string;

  /**
   * Supporting heading text.
   */
  description?: string;

  /**
   * Optional additional classes for the panel.
   */
  className?: string;

  /**
   * Number of columns at larger screen widths.
   */
  columns?: 1 | 2 | 3;
}


// =============================================================================
// Action Item
// =============================================================================

function QuickActionItem({
  action,
}: {
  action: AdminQuickAction;
}) {
  return (
    <button
      type="button"
      onClick={action.onClick}
      disabled={action.disabled}
      aria-label={action.ariaLabel}
      className={[
        'group',
        'flex',
        'min-w-0',
        'items-start',
        'gap-3',
        'rounded-[var(--radius-lg)]',
        'border',
        'border-[var(--border)]',
        'bg-[var(--surface)]',
        'p-4',
        'text-left',
        'transition-colors',
        'duration-150',
        'hover:border-[var(--border-strong)]',
        'hover:bg-[var(--background-subtle)]',
        'focus-visible:outline-none',
        'focus-visible:ring-2',
        'focus-visible:ring-[var(--brand)]',
        'disabled:cursor-not-allowed',
        'disabled:opacity-50',
      ].join(' ')}
    >
      {action.icon && (
        <span
          aria-hidden="true"
          className={[
            'flex',
            'h-10',
            'w-10',
            'shrink-0',
            'items-center',
            'justify-center',
            'rounded-[var(--radius-md)]',
            'bg-[var(--brand-soft)]',
            'text-[var(--brand)]',
            'transition-colors',
            'group-hover:bg-[var(--background-muted)]',
          ].join(' ')}
        >
          {action.icon}
        </span>
      )}

      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-[var(--foreground)]">
          {action.label}
        </span>

        {action.description && (
          <span className="mt-1 block text-xs leading-5 text-[var(--foreground-muted)]">
            {action.description}
          </span>
        )}
      </span>

      <span
        aria-hidden="true"
        className="shrink-0 text-lg leading-5 text-[var(--foreground-subtle)] transition-transform group-hover:translate-x-0.5 group-hover:text-[var(--brand)]"
      >
        →
      </span>
    </button>
  );
}


// =============================================================================
// Admin Quick Actions
// =============================================================================

export default function AdminQuickActions({
  actions = [],
  title = 'Quick actions',
  description = 'Jump directly to common administration tasks.',
  className,
  columns = 2,
}: AdminQuickActionsProps) {
  const columnClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3',
  }[columns];

  return (
    <Card
      variant="default"
      padding="lg"
      className={className}
    >
      <OverviewSectionHeader
        title={title}
        description={description}
        headingLevel={3}
      />

      <Divider className="my-5" />

      {actions.length > 0 ? (
        <div className={`grid gap-3 ${columnClasses}`}>
          {actions.map((action) => (
            <QuickActionItem
              key={action.id}
              action={action}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-[var(--radius-lg)] border border-dashed border-[var(--border-strong)] px-5 py-8 text-center">
          <p className="text-sm font-medium text-[var(--foreground-secondary)]">
            No quick actions configured
          </p>

          <p className="mt-1 text-xs text-[var(--foreground-muted)]">
            Administrative shortcuts will appear here when configured.
          </p>
        </div>
      )}
    </Card>
  );
}
