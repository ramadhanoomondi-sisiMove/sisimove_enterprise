
import { cn } from '@/foundation/utils/cn';

import { JourneyCompletionPublicId } from '../shared/JourneyCompletionPublicId';
import { JourneyCompletionJourneyLink } from '../shared/JourneyCompletionJourneyLink';

export interface JourneyCompletionJourneyPanelProps {
  journeyPublicId: string;
  journeyHref: string;
  className?: string;
}

export function JourneyCompletionJourneyPanel({
  journeyPublicId,
  journeyHref,
  className,
}: JourneyCompletionJourneyPanelProps) {
  const normalizedPublicId = journeyPublicId.trim();
  const normalizedHref = journeyHref.trim();

  return (
    <section
      aria-labelledby="journey-completion-journey-heading"
      className={cn(
        'min-w-0 rounded-xl border border-[var(--border)]',
        'bg-[var(--surface)] p-5 shadow-sm',
        className,
      )}
    >
      <div className="min-w-0">
        <h2
          id="journey-completion-journey-heading"
          className="text-base font-semibold text-[var(--foreground)]"
        >
          Journey information
        </h2>

        <p className="mt-1 text-sm text-[var(--foreground-muted)]">
          Journey associated with this completion record.
        </p>
      </div>

      <div className="mt-5 border-t border-[var(--border-subtle)] pt-4">
        <p className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
          Journey public ID
        </p>

        <div className="mt-2 min-w-0">
          <JourneyCompletionPublicId
            publicId={normalizedPublicId}
            maxLength={32}
          />
        </div>

        {normalizedPublicId && normalizedHref && (
          <div className="mt-3 min-w-0">
            <JourneyCompletionJourneyLink
              publicId={normalizedPublicId}
              href={normalizedHref}
            />
          </div>
        )}
      </div>
    </section>
  );
}

export default JourneyCompletionJourneyPanel;
