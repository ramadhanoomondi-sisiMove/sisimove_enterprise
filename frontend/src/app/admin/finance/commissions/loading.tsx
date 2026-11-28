import {
  Card,
  Skeleton,
} from '@/components/ui';

function MetricCardSkeleton() {
  return (
    <Card padding="md">
      <div className="flex items-center justify-between gap-4">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-8 w-8 rounded-md" />
      </div>

      <div className="mt-4 space-y-2">
        <Skeleton className="h-7 w-24" />
        <Skeleton className="h-3 w-36" />
      </div>
    </Card>
  );
}

function PanelSkeleton({
  rows = 3,
}: {
  readonly rows?: number;
}) {
  return (
    <Card
      padding="md"
      header={
        <div className="w-full space-y-2">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-3 w-56 max-w-full" />
        </div>
      }
    >
      <div className="space-y-4">
        {Array.from({ length: rows }).map((_, index) => (
          <div
            key={index}
            className="flex items-center justify-between gap-4"
          >
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
      </div>
    </Card>
  );
}

export default function CommissionLoading() {
  return (
    <div
      className="space-y-6"
      aria-label="Loading commissions"
    >
      {/* Page heading */}
      <div className="space-y-2">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-4 w-72 max-w-full" />
      </div>

      {/* Overview metrics */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <MetricCardSkeleton key={index} />
        ))}
      </div>

      {/* Distribution panels */}
      <div className="grid gap-6 lg:grid-cols-2">
        <PanelSkeleton rows={4} />
        <PanelSkeleton rows={4} />
      </div>

      {/* Recent activity */}
      <PanelSkeleton rows={5} />
    </div>
  );
}