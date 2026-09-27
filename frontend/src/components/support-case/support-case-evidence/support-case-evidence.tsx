'use client';

// -----------------------------------------------------------------------------
// sisiMove — Support Case Evidence
// -----------------------------------------------------------------------------
//
// Presentation boundary for member-visible evidence attached to a Support Case.
//
// Responsibilities:
// - display evidence associated with the case;
// - present the evidence asset reference;
// - display the submitter reference and optional description;
// - preserve the server-provided evidence order;
// - provide an empty state when no evidence exists.
//
// Non-responsibilities:
// - fetching evidence;
// - uploading assets;
// - creating evidence records;
// - resolving the referenced Asset;
// - resolving the submitter's Traveller Profile;
// - deciding whether evidence may be submitted;
// - managing SupportCaseAggregate lifecycle;
// - exposing internal SupportCase notes.
//
// Evidence is intentionally treated as a Support-domain record that references
// an Asset through an opaque public identifier. Asset resolution remains inside
// the existing Assets feature boundary.
//
// The component therefore does not attempt to reconstruct an Asset URL from
// assetId or fetch another domain directly.
//
// -----------------------------------------------------------------------------

import { Card } from '@/components/ui';

import type { SupportCaseEvidence as SupportCaseEvidenceModel } from '@/features/support-case/models';

export interface SupportCaseEvidenceProps {
  readonly evidence: readonly SupportCaseEvidenceModel[];
  readonly className?: string;
}

function formatDate(value: Date): string {
  return new Intl.DateTimeFormat('en-KE', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(value);
}

export function SupportCaseEvidence({
  evidence,
  className,
}: SupportCaseEvidenceProps) {
  if (evidence.length === 0) {
    return (
      <Card
        variant="muted"
        padding="md"
        className={className}
      >
        <div className="space-y-1">
          <h2 className="text-sm font-semibold text-slate-900">
            Evidence
          </h2>

          <p className="text-sm text-slate-600">
            No evidence has been attached to this case.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card
      variant="default"
      padding="md"
      className={className}
    >
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-sm font-semibold text-slate-900">
              Evidence
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Files submitted to help with this support case.
            </p>
          </div>

          <span className="shrink-0 text-xs font-medium text-slate-500">
            {evidence.length}
          </span>
        </div>

        <div className="space-y-3">
          {evidence.map((item) => (
            <article
              key={item.publicId}
              className="rounded-lg border border-slate-200 bg-white p-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 space-y-1">
                  <p className="text-sm font-medium text-slate-900">
                    Evidence attachment
                  </p>

                  <p className="break-all text-xs text-slate-500">
                    Asset: {item.assetId}
                  </p>
                </div>

                <time
                  dateTime={item.createdAt.toISOString()}
                  className="shrink-0 text-xs text-slate-500"
                >
                  {formatDate(item.createdAt)}
                </time>
              </div>

              {item.description ? (
                <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                  {item.description}
                </p>
              ) : null}

              <p className="mt-3 text-xs text-slate-500">
                Submitted by {item.submittedByPublicId}
              </p>
            </article>
          ))}
        </div>
      </div>
    </Card>
  );
}