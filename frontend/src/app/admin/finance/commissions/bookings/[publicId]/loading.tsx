import { Skeleton } from '@/components/ui';
import { CommissionPageContainer } from '@/components/admin/finance/commissions/layout/CommissionPageContainer';

export default function BookingCommissionLoading() {
  return (
    <CommissionPageContainer>
      <div
        className="space-y-6"
        role="status"
        aria-label="Loading booking commission details"
        aria-busy="true"
      >
        {/* Page header */}
        <div className="space-y-3">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-8 w-72 max-w-full" />
          <Skeleton className="h-4 w-96 max-w-full" />
        </div>

        {/* Commission identity and booking information */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <section
            className="space-y-4 rounded-[var(--radius-lg)] border border-[var(--border)] p-5"
            aria-label="Commission identity loading"
          >
            <Skeleton className="h-5 w-40" />
            <div className="space-y-3">
              <Skeleton className="h-4 w-full max-w-xs" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </section>

          <section
            className="space-y-4 rounded-[var(--radius-lg)] border border-[var(--border)] p-5"
            aria-label="Booking information loading"
          >
            <Skeleton className="h-5 w-36" />
            <div className="space-y-3">
              <Skeleton className="h-4 w-full max-w-xs" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </section>
        </div>

        {/* Journey and commission rule */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <section
            className="space-y-4 rounded-[var(--radius-lg)] border border-[var(--border)] p-5"
            aria-label="Journey information loading"
          >
            <Skeleton className="h-5 w-32" />
            <div className="space-y-3">
              <Skeleton className="h-4 w-full max-w-xs" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </section>

          <section
            className="space-y-4 rounded-[var(--radius-lg)] border border-[var(--border)] p-5"
            aria-label="Commission rule loading"
          >
            <Skeleton className="h-5 w-36" />
            <div className="space-y-3">
              <Skeleton className="h-4 w-full max-w-xs" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </section>
        </div>

        {/* Assessment and lifecycle */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <section
            className="space-y-4 rounded-[var(--radius-lg)] border border-[var(--border)] p-5"
            aria-label="Assessment information loading"
          >
            <Skeleton className="h-5 w-36" />
            <div className="space-y-3">
              <Skeleton className="h-4 w-full max-w-xs" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </section>

          <section
            className="space-y-4 rounded-[var(--radius-lg)] border border-[var(--border)] p-5"
            aria-label="Lifecycle information loading"
          >
            <Skeleton className="h-5 w-32" />
            <div className="space-y-3">
              <Skeleton className="h-4 w-full max-w-xs" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </section>
        </div>

        {/* Audit information */}
        <section
          className="space-y-4 rounded-[var(--radius-lg)] border border-[var(--border)] p-5"
          aria-label="Audit information loading"
        >
          <Skeleton className="h-5 w-36" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Skeleton className="h-4 w-full max-w-xs" />
            <Skeleton className="h-4 w-full max-w-xs" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </section>
      </div>
    </CommissionPageContainer>
  );
}