
import { Skeleton } from '@/components/ui';
import { cn } from '@/foundation/utils/cn';

export interface ProviderTableSkeletonProps {
  rows?: number;
  className?: string;
}

const COLUMNS = [
  'Provider',
  'Type',
  'Environment',
  'Status',
  'Operational',
  'Enabled',
  'Last updated',
];

export function ProviderTableSkeleton({
  rows = 6,
  className,
}: ProviderTableSkeletonProps) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-xl border border-[var(--border)] bg-background',
        className,
      )}
      role="status"
      aria-label="Loading payment providers"
    >
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[900px] border-collapse text-left">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--background-muted)]">
              {COLUMNS.map((column) => (
                <th
                  key={column}
                  scope="col"
                  className="px-5 py-3"
                >
                  <Skeleton className="h-3 w-20" />
                  <span className="sr-only">{column}</span>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {Array.from({ length: rows }).map((_, index) => (
              <tr
                key={index}
                className="border-b border-[var(--border)] last:border-b-0"
              >
                <td className="space-y-2 px-5 py-4">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-20" />
                </td>

                <td className="px-4 py-4">
                  <Skeleton className="h-5 w-24 rounded-full" />
                </td>

                <td className="px-4 py-4">
                  <Skeleton className="h-5 w-20 rounded-full" />
                </td>

                <td className="px-4 py-4">
                  <Skeleton className="h-5 w-24 rounded-full" />
                </td>

                <td className="px-4 py-4">
                  <Skeleton className="h-4 w-20" />
                </td>

                <td className="px-4 py-4">
                  <Skeleton className="h-4 w-16" />
                </td>

                <td className="px-5 py-4">
                  <Skeleton className="h-4 w-24" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <span className="sr-only">Please wait while providers load.</span>
    </div>
  );
}
