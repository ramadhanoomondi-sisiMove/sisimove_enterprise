
import Link from 'next/link';

import { cn } from '@/foundation/utils/cn';
import { ADMIN_ROUTES } from '@/foundation/routing/admin-routes';

import type { AdminProvider } from '@/features/admin/finance/providers';

export interface ProviderTableRowProps {
  provider: AdminProvider;
  className?: string;
}

function formatLabel(value: string): string {
  return value
    .split('_')
    .map(
      (part) =>
        part.charAt(0) + part.slice(1).toLowerCase(),
    )
    .join(' ');
}

function formatDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '—';
  }

  return new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

function getStatusClasses(status: string): string {
  switch (status) {
    case 'READY':
      return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400';

    case 'DEGRADED':
    case 'CONFIGURING':
      return 'bg-amber-500/10 text-amber-700 dark:text-amber-400';

    case 'SUSPENDED':
      return 'bg-red-500/10 text-red-700 dark:text-red-400';

    default:
      return 'bg-[var(--background-muted)] text-muted-foreground';
  }
}

function StateLabel({
  value,
  positive,
}: {
  value: boolean;
  positive: string;
}) {
  return (
    <span
      className={
        value
          ? 'inline-flex items-center gap-1.5 text-sm font-medium text-emerald-700 dark:text-emerald-400'
          : 'inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground'
      }
    >
      <span
        className={
          value
            ? 'h-1.5 w-1.5 rounded-full bg-emerald-500'
            : 'h-1.5 w-1.5 rounded-full bg-muted-foreground'
        }
        aria-hidden="true"
      />

      {value ? positive : 'No'}
    </span>
  );
}

export function ProviderTableRow({
  provider,
  className,
}: ProviderTableRowProps) {
  const providerHref = ADMIN_ROUTES.FINANCE_PROVIDER(
    provider.publicId,
  );

  return (
    <tr
      className={cn(
        'transition-colors hover:bg-[var(--background-muted)]',
        className,
      )}
    >
      {/* Provider */}

      <td className="px-5 py-4">
        <div className="min-w-0 space-y-1">
          <Link
            href={providerHref}
            className="block truncate text-sm font-semibold text-foreground transition-colors hover:text-[var(--brand)] hover:underline"
          >
            {provider.name}
          </Link>

          <Link
            href={providerHref}
            className="block text-xs text-muted-foreground transition-colors hover:text-[var(--brand)]"
          >
            {provider.code}
          </Link>
        </div>
      </td>

      {/* Type */}

      <td className="px-4 py-4">
        <span className="text-sm text-foreground">
          {formatLabel(provider.type)}
        </span>
      </td>

      {/* Environment */}

      <td className="px-4 py-4">
        <span className="text-sm text-foreground">
          {formatLabel(provider.environment)}
        </span>
      </td>

      {/* Status */}

      <td className="px-4 py-4">
        <span
          className={cn(
            'inline-flex rounded-full px-2.5 py-1 text-xs font-medium',
            getStatusClasses(provider.status),
          )}
        >
          {formatLabel(provider.status)}
        </span>
      </td>

      {/* Operational */}

      <td className="px-4 py-4">
        <StateLabel
          value={provider.isOperational}
          positive="Operational"
        />
      </td>

      {/* Enabled */}

      <td className="px-4 py-4">
        <StateLabel
          value={provider.isEnabled}
          positive="Enabled"
        />
      </td>

      {/* Last Updated */}

      <td className="px-5 py-4">
        <span className="whitespace-nowrap text-sm text-muted-foreground">
          {formatDate(provider.updatedAt)}
        </span>
      </td>
    </tr>
  );
}
