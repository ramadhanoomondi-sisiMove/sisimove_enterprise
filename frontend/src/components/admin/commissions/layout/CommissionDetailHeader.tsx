
import type { ReactNode } from 'react';

// -----------------------------------------------------------------------------
// sisiMove Admin — Commission Detail Header
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Display the detail page title and description.
// - Display optional eyebrow text.
// - Display record metadata separately from page actions.
// - Provide a responsive layout for desktop and mobile.
//
// Architecture:
// - Presentation-only component.
// - Parent containers own action availability and behavior.
// - Metadata and actions are independently composed through ReactNode slots.
// -----------------------------------------------------------------------------

export interface CommissionDetailHeaderProps {
  readonly title: string;
  readonly description?: string;
  readonly eyebrow?: string;
  readonly metadata?: ReactNode;
  readonly actions?: ReactNode;
  readonly className?: string;
}

export function CommissionDetailHeader({
  title,
  description,
  eyebrow,
  metadata,
  actions,
  className,
}: CommissionDetailHeaderProps) {
  return (
    <header
      className={[
        'flex',
        'flex-col',
        'gap-4',
        'border-b',
        'border-[var(--border)]',
        'pb-6',
        'sm:flex-row',
        'sm:items-start',
        'sm:justify-between',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* Header Information */}

      <div className="min-w-0 flex-1">
        {eyebrow && (
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--foreground-muted)]">
            {eyebrow}
          </p>
        )}

        <h1 className="break-words text-2xl font-semibold tracking-tight text-[var(--foreground)] sm:text-3xl">
          {title}
        </h1>

        {description && (
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--foreground-muted)]">
            {description}
          </p>
        )}

        {/* Record Metadata */}

        {metadata && (
          <div className="mt-3 flex min-w-0 flex-wrap items-center gap-2">
            {metadata}
          </div>
        )}
      </div>

      {/* Page Actions */}

      {actions && (
        <div className="flex w-full shrink-0 flex-wrap items-center gap-2 sm:w-auto sm:justify-end">
          {actions}
        </div>
      )}
    </header>
  );
}
