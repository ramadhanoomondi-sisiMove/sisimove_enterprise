
import type {
  AdminProviderFilters,
  AdminProviderType,
  AdminProviderStatus,
  AdminProviderEnvironment,
} from '@/features/admin/finance/providers';
import {
  ADMIN_PROVIDER_TYPES,
  ADMIN_PROVIDER_STATUSES,
  ADMIN_PROVIDER_ENVIRONMENTS,
} from '@/features/admin/finance/providers';

import { cn } from '@/foundation/utils/cn';

export interface ProviderFiltersProps {
  filters: AdminProviderFilters;
  onChange: (filters: AdminProviderFilters) => void;
  className?: string;
}

const selectClassName =
  'h-10 w-full min-w-0 rounded-lg border border-[var(--border)] bg-background px-3 text-sm text-foreground outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring';

function formatLabel(value: string): string {
  return value
    .split('_')
    .map((part) => part.charAt(0) + part.slice(1).toLowerCase())
    .join(' ');
}

export function ProviderFilters({
  filters,
  onChange,
  className,
}: ProviderFiltersProps) {
  const updateFilter = <K extends keyof AdminProviderFilters>(
    key: K,
    value: AdminProviderFilters[K] | undefined,
  ) => {
    onChange({
      ...filters,
      [key]: value,
    });
  };

  return (
    <div
      className={cn(
        'grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4',
        className,
      )}
    >
      <div className="space-y-1.5">
        <label
          htmlFor="provider-type-filter"
          className="text-xs font-medium text-muted-foreground"
        >
          Provider type
        </label>

        <select
          id="provider-type-filter"
          value={filters.type ?? ''}
          onChange={(event) =>
            updateFilter(
              'type',
              event.target.value
                ? (event.target.value as AdminProviderType)
                : undefined,
            )
          }
          className={selectClassName}
        >
          <option value="">All types</option>
          {ADMIN_PROVIDER_TYPES.map((type) => (
            <option key={type} value={type}>
              {formatLabel(type)}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor="provider-status-filter"
          className="text-xs font-medium text-muted-foreground"
        >
          Provider status
        </label>

        <select
          id="provider-status-filter"
          value={filters.status ?? ''}
          onChange={(event) =>
            updateFilter(
              'status',
              event.target.value
                ? (event.target.value as AdminProviderStatus)
                : undefined,
            )
          }
          className={selectClassName}
        >
          <option value="">All statuses</option>
          {ADMIN_PROVIDER_STATUSES.map((status) => (
            <option key={status} value={status}>
              {formatLabel(status)}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor="provider-environment-filter"
          className="text-xs font-medium text-muted-foreground"
        >
          Environment
        </label>

        <select
          id="provider-environment-filter"
          value={filters.environment ?? ''}
          onChange={(event) =>
            updateFilter(
              'environment',
              event.target.value
                ? (event.target.value as AdminProviderEnvironment)
                : undefined,
            )
          }
          className={selectClassName}
        >
          <option value="">All environments</option>
          {ADMIN_PROVIDER_ENVIRONMENTS.map((environment) => (
            <option key={environment} value={environment}>
              {formatLabel(environment)}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor="provider-operational-filter"
          className="text-xs font-medium text-muted-foreground"
        >
          Operational state
        </label>

        <select
          id="provider-operational-filter"
          value={
            filters.operational === undefined
              ? ''
              : String(filters.operational)
          }
          onChange={(event) =>
            updateFilter(
              'operational',
              event.target.value === ''
                ? undefined
                : event.target.value === 'true',
            )
          }
          className={selectClassName}
        >
          <option value="">All states</option>
          <option value="true">Operational</option>
          <option value="false">Non-operational</option>
        </select>
      </div>
    </div>
  );
}
