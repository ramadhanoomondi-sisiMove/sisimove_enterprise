/**
 * sisiMove — Trust Profile Loading State
 *
 * Displays a loading skeleton for the individual Trust profile workspace.
 */

import { Card } from "@/components/ui/card";
import { TrustPageContainer } from "@/components/admin/trust";

function MetricSkeleton() {
  return (
    <Card variant="default" padding="md">
      <div
        aria-hidden="true"
        className="animate-pulse space-y-3"
      >
        <div className="h-4 w-28 rounded bg-[var(--background-muted)]" />
        <div className="h-8 w-20 rounded bg-[var(--background-muted)]" />
      </div>
    </Card>
  );
}

export default function TrustProfileLoading() {
  return (
    <TrustPageContainer
      size="2xl"
      className="space-y-8 py-6"
    >
      <div
        role="status"
        aria-live="polite"
        className="space-y-4"
      >
        <span className="sr-only">Loading Trust profile workspace…</span>

        <div className="animate-pulse space-y-3">
          <div className="h-3 w-36 rounded bg-[var(--background-muted)]" />
          <div className="h-8 w-64 max-w-full rounded bg-[var(--background-muted)]" />
          <div className="h-4 w-full max-w-2xl rounded bg-[var(--background-muted)]" />
        </div>

        <Card variant="default" padding="lg">
          <div className="animate-pulse space-y-4">
            <div className="h-5 w-40 rounded bg-[var(--background-muted)]" />
            <div className="h-4 w-64 max-w-full rounded bg-[var(--background-muted)]" />

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="h-16 rounded bg-[var(--background-subtle)]" />
              <div className="h-16 rounded bg-[var(--background-subtle)]" />
            </div>
          </div>
        </Card>
      </div>

      <section
        aria-label="Loading Trust metrics"
        className="space-y-3"
      >
        <div className="h-5 w-40 animate-pulse rounded bg-[var(--background-muted)]" />

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 5 }, (_, index) => (
            <MetricSkeleton key={index} />
          ))}
        </div>
      </section>

      <section
        aria-label="Loading journey metrics"
        className="space-y-3"
      >
        <div className="h-5 w-44 animate-pulse rounded bg-[var(--background-muted)]" />

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <MetricSkeleton key={index} />
          ))}
        </div>
      </section>
    </TrustPageContainer>
  );
}
