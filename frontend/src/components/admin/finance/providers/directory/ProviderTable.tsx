
import { cn } from '@/foundation/utils/cn';

import type { AdminProvider } from '@/features/admin/finance/providers';

import { ProviderTableRow } from './ProviderTableRow';

export interface ProviderTableProps {
  providers: AdminProvider[];
  isFetching?: boolean;
  className?: string;
}

export function ProviderTable({
  providers,
  isFetching = false,
  className,
}: ProviderTableProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl border border-[var(--border)] bg-background',
        className,
      )}
    >
      {isFetching && (
        <div
          className="absolute inset-x-0 top-0 z-10 h-0.5 animate-pulse bg-[var(--brand)]"
          role="status"
          aria-label="Refreshing providers"
        />
      )}

      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[900px] border-collapse text-left">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--background-muted)]">
              <th
                scope="col"
                className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground"
              >
                Provider
              </th>

              <th
                scope="col"
                className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground"
              >
                Type
              </th>

              <th
                scope="col"
                className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground"
              >
                Environment
              </th>

              <th
                scope="col"
                className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground"
              >
                Status
              </th>

              <th
                scope="col"
                className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground"
              >
                Operational
              </th>

              <th
                scope="col"
                className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground"
              >
                Enabled
              </th>

              <th
                scope="col"
                className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground"
              >
                Last updated
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[var(--border)]">
            {providers.map((provider) => (
              <ProviderTableRow
                key={provider.publicId}
                provider={provider}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
