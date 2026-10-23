import type { ReactNode } from 'react';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/foundation/utils/cn';

export interface JourneyDetailHeaderProps {
  title: string;
  description?: string;
  eyebrow?: string;
  leadingContent?: ReactNode;
  status?: ReactNode;
  metadata?: ReactNode;
  actions?: ReactNode;
  backHref?: string;
  onBack?: () => void;
  backLabel?: string;
  className?: string;
}

export function JourneyDetailHeader({
  title,
  description,
  eyebrow = 'JOURNEY DETAILS',
  leadingContent,
  status,
  metadata,
  actions,
  backHref,
  onBack,
  backLabel = 'Back to journeys',
  className,
}: JourneyDetailHeaderProps) {
  const backControl = (
    <span className="inline-flex items-center gap-2 text-sm font-medium text-[var(--foreground-secondary)] transition-colors hover:text-[var(--brand)]">
      <ArrowLeft aria-hidden="true" className="size-4" />
      {backLabel}
    </span>
  );

  return (
    <header
      className={cn(
        'w-full border-b border-[var(--border)] pb-6 sm:pb-8',
        className,
      )}
    >
      {(backHref || onBack) && (
        <div className="mb-6">
          {backHref ? (
            <a href={backHref} className="inline-flex rounded-md outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2">
              {backControl}
            </a>
          ) : (
            <button
              type="button"
              onClick={onBack}
              className="inline-flex rounded-md outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2"
            >
              {backControl}
            </button>
          )}
        </div>
      )}

      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex min-w-0 items-start gap-4">
          {leadingContent && (
            <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--surface)] text-[var(--brand)] shadow-[var(--shadow-sm)] sm:size-14">
              {leadingContent}
            </div>
          )}

          <div className="min-w-0 flex-1">
            {eyebrow && (
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--foreground-muted)]">
                {eyebrow}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-3">
              <h1 className="break-words text-2xl font-semibold tracking-tight text-[var(--foreground)] sm:text-3xl">
                {title}
              </h1>

              {status && (
                <div className="flex shrink-0 items-center">{status}</div>
              )}
            </div>

            {description && (
              <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--foreground-muted)] sm:text-base">
                {description}
              </p>
            )}

            {metadata && (
              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
                {metadata}
              </div>
            )}
          </div>
        </div>

        {actions && (
          <div className="flex shrink-0 flex-wrap items-center gap-2 lg:justify-end">
            {actions}
          </div>
        )}
      </div>
    </header>
  );
}

export default JourneyDetailHeader;