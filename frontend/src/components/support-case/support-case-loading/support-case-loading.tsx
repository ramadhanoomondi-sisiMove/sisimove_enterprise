// -----------------------------------------------------------------------------
// sisiMove — Support Case Loading
// -----------------------------------------------------------------------------
//
// Presentation-only loading state shared by Support Case surfaces.
//
// Responsibilities:
// - communicate that Support Case content is loading;
// - preserve the compact authenticated/mobile-first layout.
//
// Non-responsibilities:
// - fetching data;
// - owning query state;
// - retrying requests;
// - deciding whether a case exists.
//
// The component intentionally accepts no domain data so it can be used while
// any Support Case query is resolving.
// -----------------------------------------------------------------------------

import { Card } from '@/components/ui';

export interface SupportCaseLoadingProps {
  readonly className?: string;
}

export function SupportCaseLoading({
  className,
}: SupportCaseLoadingProps) {
  return (
    <div
      className={className}
      role="status"
      aria-live="polite"
      aria-label="Loading support case"
    >
      <Card
        variant="default"
        padding="md"
      >
        <div className="animate-pulse space-y-4">
          <div className="space-y-2">
            <div className="h-5 w-2/3 rounded bg-slate-200" />
            <div className="h-4 w-1/3 rounded bg-slate-200" />
          </div>

          <div className="h-16 w-full rounded-lg bg-slate-100" />

          <div className="space-y-3">
            <div className="h-12 w-5/6 rounded-lg bg-slate-100" />
            <div className="ml-auto h-12 w-4/5 rounded-lg bg-slate-100" />
            <div className="h-12 w-3/5 rounded-lg bg-slate-100" />
          </div>

          <div className="h-10 w-full rounded-lg bg-slate-200" />
        </div>
      </Card>

      <span className="sr-only">
        Loading support case…
      </span>
    </div>
  );
}