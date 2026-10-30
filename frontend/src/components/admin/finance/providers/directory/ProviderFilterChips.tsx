
import { X } from 'lucide-react';

import { Badge } from '@/components/ui';
import { cn } from '@/foundation/utils/cn';

import type {
  AdminProviderFilters,
} from '@/features/admin/finance/providers';

export interface ProviderFilterChipsProps {
  filters: AdminProviderFilters;
  search: string;
  onFiltersChange: (filters: AdminProviderFilters) => void;
  onSearchChange: (search: string) => void;
  onClear: () => void;
  className?: string;
}

function formatLabel(value: string): string {
  return value
    .split('_')
    .map((part) => part.charAt(0) + part.slice(1).toLowerCase())
    .join(' ');
}

export function ProviderFilterChips({
  filters,
  search,
  onFiltersChange,
  onSearchChange,
  onClear,
  className,
}: ProviderFilterChipsProps) {
  const activeFilters: {
    key: keyof AdminProviderFilters;
    label: string;
    value: string;
  }[] = [];

  if (filters.type) {
    activeFilters.push({
      key: 'type',
      label: 'Type',
      value: formatLabel(filters.type),
    });
  }

  if (filters.status) {
    activeFilters.push({
      key: 'status',
      label: 'Status',
      value: formatLabel(filters.status),
    });
  }

  if (filters.environment) {
    activeFilters.push({
      key: 'environment',
      label: 'Environment',
      value: formatLabel(filters.environment),
    });
  }

  if (filters.operational !== undefined) {
    activeFilters.push({
      key: 'operational',
      label: 'Operational',
      value: filters.operational ? 'Yes' : 'No',
    });
  }

  const hasSearch = search.trim().length > 0;
  const hasActiveFilters = activeFilters.length > 0;

  if (!hasSearch && !hasActiveFilters) {
    return null;
  }

  const removeFilter = (key: keyof AdminProviderFilters) => {
    onFiltersChange({
      ...filters,
      [key]: undefined,
    });
  };

  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-2',
        className,
      )}
    >
      <span className="text-xs font-medium text-muted-foreground">
        Active filters:
      </span>

      {hasSearch && (
        <Badge variant="outline" size="sm">
          <span>Search: {search.trim()}</span>
          <button
            type="button"
            onClick={() => onSearchChange('')}
            aria-label="Remove search filter"
            className="ml-1 rounded-full p-0.5 hover:bg-[var(--background-muted)]"
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      )}

      {activeFilters.map((filter) => (
        <Badge
          key={filter.key}
          variant="outline"
          size="sm"
        >
          <span>
            {filter.label}: {filter.value}
          </span>

          <button
            type="button"
            onClick={() => removeFilter(filter.key)}
            aria-label={`Remove ${filter.label} filter`}
            className="ml-1 rounded-full p-0.5 hover:bg-[var(--background-muted)]"
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}

      <button
        type="button"
        onClick={onClear}
        className="ml-1 text-xs font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
      >
        Clear all
      </button>
    </div>
  );
}
