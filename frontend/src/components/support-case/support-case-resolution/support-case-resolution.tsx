'use client';

// -----------------------------------------------------------------------------
// sisiMove — Support Case Resolution
// -----------------------------------------------------------------------------
//
// Member-facing presentation boundary for a Support Case resolution.
//
// Responsibilities:
// - display the server-provided resolution;
// - display the resolution type, summary, resolver reference, and timestamp.
//
// Non-responsibilities:
// - creating or editing resolutions;
// - deciding whether a case is resolved;
// - inferring case status from resolution existence;
// - resolving the resolver's profile;
// - exposing internal resolution workflows.
//
// Resolution lifecycle is owned by the Support domain. This component only
// presents the read-only resolution returned by the backend.
// -----------------------------------------------------------------------------

import { Badge, Card } from '@/components/ui';

import type { SupportCaseResolution as SupportCaseResolutionModel } from '@/features/support-case/models';

export interface SupportCaseResolutionProps {
  readonly resolution?: SupportCaseResolutionModel;
  readonly className?: string;
}

function formatResolutionType(type: string): string {
  return type
    .toLowerCase()
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function formatDate(value: Date): string {
  return new Intl.DateTimeFormat('en-KE', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(value);
}

export function SupportCaseResolution({
  resolution,
  className,
}: SupportCaseResolutionProps) {
  if (!resolution) {
    return null;
  }

  return (
    <Card
      variant="muted"
      padding="md"
      className={className}
    >
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-sm font-semibold text-slate-900">
              Resolution
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              This case has a recorded support resolution.
            </p>
          </div>

          <Badge variant="success" size="sm">
            Resolved
          </Badge>
        </div>

        <div className="space-y-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Resolution type
            </p>

            <p className="mt-1 text-sm font-medium text-slate-900">
              {formatResolutionType(resolution.type)}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Summary
            </p>

            <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-slate-700">
              {resolution.summary}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Resolved by
              </p>

              <p className="mt-1 break-all text-sm text-slate-700">
                {resolution.resolvedByPublicId}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Resolved
              </p>

              <time
                dateTime={resolution.resolvedAt.toISOString()}
                className="mt-1 block text-sm text-slate-700"
              >
                {formatDate(resolution.resolvedAt)}
              </time>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}