
import type { ReactNode } from 'react';

import { cn } from '@/foundation/utils/cn';

export interface JourneyCompletionEvidenceItem {
  id: string;
  label: string;
  description?: string | null;
  content: ReactNode;
}

export interface JourneyCompletionEvidencePanelProps {
  items?: JourneyCompletionEvidenceItem[];
  className?: string;
  emptyMessage?: string;
}

export function JourneyCompletionEvidencePanel({
  items = [],
  className,
  emptyMessage = 'No evidence information available.',
}: JourneyCompletionEvidencePanelProps) {
  const hasItems = items.length > 0;

  return (
    <section
      aria-labelledby="journey-completion-evidence-heading"
      className={cn(
        'min-w-0 rounded-xl border border-[var(--border)]',
        'bg-[var(--surface)] p-5 shadow-sm',
        className,
      )}
    >
      <div>
        <h2
          id="journey-completion-evidence-heading"
          className="text-base font-semibold text-[var(--foreground)]"
        >
          Evidence
        </h2>

        <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
          Supporting information associated with this completion record.
        </p>
      </div>

      <div className="mt-5 border-t border-[var(--border-subtle)] pt-4">
        {!hasItems ? (
          <div
            className="flex min-h-20 items-center justify-center rounded-lg border border-dashed border-[var(--border)] bg-[var(--background-subtle)] px-4 py-6 text-center"
            role="status"
          >
            <p className="max-w-md text-sm text-[var(--foreground-muted)]">
              {emptyMessage}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <article
                key={item.id}
                className={cn(
                  'min-w-0 rounded-lg border border-[var(--border-subtle)]',
                  'bg-[var(--background-subtle)] p-4',
                )}
              >
                <div className="min-w-0">
                  <h3 className="break-words text-sm font-semibold text-[var(--foreground)]">
                    {item.label}
                  </h3>

                  {item.description?.trim() && (
                    <p className="mt-1 break-words text-sm text-[var(--foreground-secondary)]">
                      {item.description}
                    </p>
                  )}
                </div>

                <div className="mt-3 min-w-0 text-sm text-[var(--foreground)]">
                  {item.content}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default JourneyCompletionEvidencePanel;
