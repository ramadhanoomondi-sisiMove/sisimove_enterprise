
import type { ReactNode } from 'react';

export interface MembersPageHeaderProps {
  /** Page title. */
  readonly title?: string;

  /** Supporting page description. */
  readonly description?: string;

  /** Optional actions supplied by the parent. */
  readonly actions?: ReactNode;

  /** Optional additional CSS classes. */
  readonly className?: string;
}

export function MembersPageHeader({
  title = 'Members',
  description = 'View and manage member identities across sisiMove.',
  actions,
  className,
}: MembersPageHeaderProps): ReactNode {
  return (
    <header
      className={[
        'flex min-w-0 flex-col gap-4 sm:flex-row sm:items-start sm:justify-between',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="min-w-0">
        <h1 className="text-2xl font-semibold tracking-tight text-[var(--foreground)]">
          {title}
        </h1>

        <p className="mt-1 max-w-2xl text-sm leading-6 text-[var(--foreground-secondary)]">
          {description}
        </p>
      </div>

      {actions ? (
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {actions}
        </div>
      ) : null}
    </header>
  );
}

export default MembersPageHeader;
