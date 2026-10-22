
/**
 * -----------------------------------------------------------------------------
 * sisiMove — Asset Control Center Header
 * -----------------------------------------------------------------------------
 *
 * Introduces the Assets Control Center and supports optional header actions.
 * -----------------------------------------------------------------------------
 */

import type { ReactNode } from 'react';
import { Boxes } from 'lucide-react';

import { cn } from '@/foundation/utils/cn';

export interface AssetControlCenterHeaderProps {
  readonly title?: string;
  readonly description?: string;
  readonly eyebrow?: string;
  readonly actions?: ReactNode;
  readonly className?: string;
}

export function AssetControlCenterHeader({
  title = 'Assets Control Center',
  description = 'Monitor, inspect, and manage the assets stored across sisiMove.',
  eyebrow = 'PLATFORM OPERATIONS',
  actions,
  className,
}: AssetControlCenterHeaderProps) {
  return (
    <header
      className={cn(
        'flex flex-col gap-5 border-b border-[var(--border)] pb-6 sm:flex-row sm:items-start sm:justify-between',
        className,
      )}
    >
      <div className="flex min-w-0 items-start gap-4">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--background-subtle)] text-[var(--brand)]">
          <Boxes size={23} strokeWidth={1.8} aria-hidden="true" />
        </div>

        <div className="min-w-0 space-y-1.5">
          <p className="text-xs font-semibold tracking-[0.14em] text-[var(--foreground-muted)]">
            {eyebrow}
          </p>

          <h1 className="text-2xl font-semibold tracking-tight text-[var(--foreground)] sm:text-3xl">
            {title}
          </h1>

          <p className="max-w-2xl text-sm leading-6 text-[var(--foreground-secondary)] sm:text-base">
            {description}
          </p>
        </div>
      </div>

      {actions && (
        <div className="flex shrink-0 flex-wrap items-center gap-3">
          {actions}
        </div>
      )}
    </header>
  );
}

export default AssetControlCenterHeader;
