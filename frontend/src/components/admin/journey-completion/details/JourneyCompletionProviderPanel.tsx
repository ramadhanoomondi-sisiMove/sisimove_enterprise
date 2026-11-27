
import { useId } from 'react';

import { cn } from '@/foundation/utils/cn';

import { JourneyCompletionPublicId } from '../shared/JourneyCompletionPublicId';
import { JourneyCompletionProviderLink } from '../shared/JourneyCompletionProviderLink';

export interface JourneyCompletionProviderPanelProps {
  providerPublicId: string;
  providerHref: string;
  className?: string;
}

export function JourneyCompletionProviderPanel({
  providerPublicId,
  providerHref,
  className,
}: JourneyCompletionProviderPanelProps) {
  const headingId = useId();

  const normalizedPublicId = providerPublicId.trim();
  const normalizedHref = providerHref.trim();

  return (
    <section
      aria-labelledby={headingId}
      className={cn(
        'min-w-0 rounded-xl border border-[var(--border)]',
        'bg-[var(--surface)] p-5 shadow-sm',
        className,
      )}
    >
      <div className="min-w-0">
        <h2
          id={headingId}
          className="text-base font-semibold text-[var(--foreground)]"
        >
          Provider information
        </h2>

        <p className="mt-1 text-sm text-[var(--foreground-muted)]">
          Provider associated with this completion record.
        </p>
      </div>

      <div className="mt-5 border-t border-[var(--border-subtle)] pt-4">
        <p className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
          Provider public ID
        </p>

        <div className="mt-2 min-w-0">
          <JourneyCompletionPublicId
            publicId={normalizedPublicId}
            maxLength={32}
          />
        </div>

        {normalizedPublicId && normalizedHref && (
          <div className="mt-3 min-w-0">
            <JourneyCompletionProviderLink
              publicId={normalizedPublicId}
              href={normalizedHref}
            />
          </div>
        )}
      </div>
    </section>
  );
}

export default JourneyCompletionProviderPanel;
