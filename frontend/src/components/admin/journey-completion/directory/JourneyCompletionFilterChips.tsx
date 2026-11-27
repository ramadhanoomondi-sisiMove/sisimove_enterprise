
import {
  AdminJourneyCompletionStatus,
  type AdminJourneyCompletionFilters,
} from '@/features/admin/journey-completion/models';
import { cn } from '@/foundation/utils/cn';

export interface JourneyCompletionFilterChipsProps {
  filters: AdminJourneyCompletionFilters;
  onRemove: (key: keyof AdminJourneyCompletionFilters) => void;
  onClear: () => void;
  className?: string;
}

const STATUS_LABELS: Record<AdminJourneyCompletionStatus, string> = {
  [AdminJourneyCompletionStatus.PENDING]: 'Pending',
  [AdminJourneyCompletionStatus.CONFIRMATION_REQUIRED]: 'Confirmation required',
  [AdminJourneyCompletionStatus.CONFIRMED]: 'Confirmed',
  [AdminJourneyCompletionStatus.DISPUTED]: 'Disputed',
  [AdminJourneyCompletionStatus.CANCELLED]: 'Cancelled',
};

export function JourneyCompletionFilterChips({
  filters,
  onRemove,
  onClear,
  className,
}: JourneyCompletionFilterChipsProps) {
  const chips: {
    key: keyof AdminJourneyCompletionFilters;
    label: string;
  }[] = [];

  if (filters.status) {
    chips.push({
      key: 'status',
      label: `Status: ${STATUS_LABELS[filters.status]}`,
    });
  }

  if (filters.journeyPublicId) {
    chips.push({
      key: 'journeyPublicId',
      label: `Journey: ${filters.journeyPublicId}`,
    });
  }

  if (filters.providerPublicId) {
    chips.push({
      key: 'providerPublicId',
      label: `Provider: ${filters.providerPublicId}`,
    });
  }

  if (chips.length === 0) return null;

  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      {chips.map((chip) => (
        <span
          key={chip.key}
          className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--background-subtle)] px-3 py-1.5 text-xs font-medium text-[var(--foreground-secondary)]"
        >
          {chip.label}
          <button
            type="button"
            onClick={() => onRemove(chip.key)}
            aria-label={`Remove ${chip.label} filter`}
            className="text-[var(--foreground-muted)] hover:text-[var(--danger)]"
          >
            ×
          </button>
        </span>
      ))}

      <button
        type="button"
        onClick={onClear}
        className="px-2 py-1 text-xs font-medium text-[var(--brand)] hover:underline"
      >
        Clear all
      </button>
    </div>
  );
}
