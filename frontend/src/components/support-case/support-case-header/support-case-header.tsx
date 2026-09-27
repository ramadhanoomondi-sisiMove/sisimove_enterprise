// -----------------------------------------------------------------------------
// sisiMove — Support Case Header
// -----------------------------------------------------------------------------
//
// Presentation boundary for the primary Support case metadata.
//
// Responsibilities:
// - display subject;
// - display lifecycle status;
// - display category and priority;
// - display opening/resolution dates;
// - display the member-facing case description.
//
// Non-responsibilities:
// - fetching the case;
// - changing lifecycle state;
// - assignment management;
// - resolution mutation;
// - internal notes.
//
// -----------------------------------------------------------------------------

import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

import type { SupportCase } from '@/features/support-case/models';

import { SupportCaseCategory } from '../support-case-category';
import { SupportCasePriority } from '../support-case-priority';
import { SupportCaseStatus } from '../support-case-status';

export interface SupportCaseHeaderProps {
  supportCase: SupportCase;
}

export function SupportCaseHeader({
  supportCase,
}: SupportCaseHeaderProps) {
  return (
    <Card
      variant="default"
      padding="md"
    >
      <div className="space-y-4">
        <div
          className={[
            'flex',
            'items-start',
            'justify-between',
            'gap-3',
          ].join(' ')}
        >
          <div className="min-w-0">
            <p className="text-xs font-medium text-[var(--foreground-muted)]">
              Support case
            </p>

            <h1
              className={[
                'mt-1',
                'text-lg',
                'font-semibold',
                'leading-6',
                'text-[var(--foreground)]',
                'break-words',
              ].join(' ')}
            >
              {supportCase.subject}
            </h1>
          </div>

          <SupportCaseStatus status={supportCase.status} />
        </div>

        <div
          className={[
            'flex',
            'flex-wrap',
            'items-center',
            'gap-2',
          ].join(' ')}
        >
          <SupportCaseCategory category={supportCase.category} />
          <SupportCasePriority priority={supportCase.priority} />

          {supportCase.isAssigned && (
            <Badge
              variant="outline"
              size="sm"
            >
              Assigned
            </Badge>
          )}
        </div>

        {supportCase.description && (
          <div
            className={[
              'border-t',
              'border-[var(--border-subtle)]',
              'pt-4',
            ].join(' ')}
          >
            <p
              className={[
                'whitespace-pre-wrap',
                'text-sm',
                'leading-6',
                'text-[var(--foreground-secondary)]',
              ].join(' ')}
            >
              {supportCase.description}
            </p>
          </div>
        )}

        <div
          className={[
            'flex',
            'flex-wrap',
            'gap-x-4',
            'gap-y-1',
            'text-xs',
            'text-[var(--foreground-muted)]',
          ].join(' ')}
        >
          <span>
            Opened {formatDate(supportCase.openedAt)}
          </span>

          {supportCase.isResolved && supportCase.resolvedAt && (
            <span>
              Resolved {formatDate(supportCase.resolvedAt)}
            </span>
          )}

          {supportCase.isClosed && supportCase.closedAt && (
            <span>
              Closed {formatDate(supportCase.closedAt)}
            </span>
          )}

          {supportCase.isCancelled && supportCase.cancelledAt && (
            <span>
              Cancelled {formatDate(supportCase.cancelledAt)}
            </span>
          )}
        </div>
      </div>
    </Card>
  );
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-KE', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}