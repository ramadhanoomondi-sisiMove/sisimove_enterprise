
import {
  AdminJourneyCompletionStatus,
  type AdminJourneyCompletionFilters,
} from '@/features/admin/journey-completion/models';
import { cn } from '@/foundation/utils/cn';

export interface JourneyCompletionFiltersProps {
  filters: AdminJourneyCompletionFilters;
  onChange: (filters: AdminJourneyCompletionFilters) => void;
  onClear: () => void;
  className?: string;
}

const STATUS_OPTIONS = [
  { value: '', label: 'All statuses' },
  { value: AdminJourneyCompletionStatus.PENDING, label: 'Pending' },
  {
    value: AdminJourneyCompletionStatus.CONFIRMATION_REQUIRED,
    label: 'Confirmation required',
  },
  { value: AdminJourneyCompletionStatus.CONFIRMED, label: 'Confirmed' },
  { value: AdminJourneyCompletionStatus.DISPUTED, label: 'Disputed' },
  { value: AdminJourneyCompletionStatus.CANCELLED, label: 'Cancelled' },
];

export function JourneyCompletionFilters({
  filters,
  onChange,
  onClear,
  className,
}: JourneyCompletionFiltersProps) {
  const update = (key: keyof AdminJourneyCompletionFilters, value: string) => {
    onChange({
      ...filters,
      [key]: value || undefined,
    });
  };

  const hasFilters = Boolean(
    filters.status || filters.journeyPublicId || filters.providerPublicId,
  );

  return (
    <div className={cn('flex flex-col gap-3 sm:flex-row sm:flex-wrap', className)}>
      <div className="min-w-44 flex-1">
        <label
          htmlFor="completion-status-filter"
          className="mb-1.5 block text-xs font-medium text-[var(--foreground-secondary)]"
        >
          Status
        </label>
        <select
          id="completion-status-filter"
          value={filters.status ?? ''}
          onChange={(event) => update('status', event.target.value)}
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm text-[var(--foreground)] outline-none focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand-tint)]"
        >
          {STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="min-w-44 flex-1">
        <label
          htmlFor="completion-journey-filter"
          className="mb-1.5 block text-xs font-medium text-[var(--foreground-secondary)]"
        >
          Journey ID
        </label>
        <input
          id="completion-journey-filter"
          value={filters.journeyPublicId ?? ''}
          onChange={(event) => update('journeyPublicId', event.target.value)}
          placeholder="Enter journey ID"
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--foreground-muted)] focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand-tint)]"
        />
      </div>

      <div className="min-w-44 flex-1">
        <label
          htmlFor="completion-provider-filter"
          className="mb-1.5 block text-xs font-medium text-[var(--foreground-secondary)]"
        >
          Provider ID
        </label>
        <input
          id="completion-provider-filter"
          value={filters.providerPublicId ?? ''}
          onChange={(event) => update('providerPublicId', event.target.value)}
          placeholder="Enter provider ID"
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--foreground-muted)] focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand-tint)]"
        />
      </div>

      {hasFilters ? (
        <div className="flex items-end">
          <button
            type="button"
            onClick={onClear}
            className="rounded-lg px-3 py-2.5 text-sm font-medium text-[var(--foreground-secondary)] transition hover:bg-[var(--background-subtle)] hover:text-[var(--foreground)]"
          >
            Clear filters
          </button>
        </div>
      ) : null}
    </div>
  );
}
