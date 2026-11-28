export interface CommissionActiveFilter {
  readonly key: string;
  readonly label: string;
  readonly value: string;
}

export interface CommissionFilterChipsProps {
  readonly filters: readonly CommissionActiveFilter[];
  readonly onRemove: (key: string) => void;
  readonly onClearAll?: () => void;
  readonly className?: string;
}

export function CommissionFilterChips({
  filters,
  onRemove,
  onClearAll,
  className,
}: CommissionFilterChipsProps) {
  if (filters.length === 0) {
    return null;
  }

  return (
    <div
      className={[
        'flex flex-wrap items-center gap-2',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      aria-label="Active commission filters"
    >
      {filters.map((filter) => (
        <span
          key={filter.key}
          className="inline-flex items-center gap-2 rounded-[var(--radius-full)] border border-[var(--border)] bg-[var(--background-subtle)] px-3 py-1.5 text-xs text-[var(--foreground-secondary)]"
        >
          <span>
            <span className="font-medium text-[var(--foreground)]">
              {filter.label}:
            </span>{' '}
            {filter.value}
          </span>

          <button
            type="button"
            onClick={() => onRemove(filter.key)}
            aria-label={`Remove ${filter.label} filter`}
            className="rounded-full text-[var(--foreground-muted)] transition-colors hover:text-[var(--danger)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]"
          >
            <span aria-hidden="true">×</span>
          </button>
        </span>
      ))}

      {onClearAll && filters.length > 1 && (
        <button
          type="button"
          onClick={onClearAll}
          className="text-xs font-medium text-[var(--brand)] transition-colors hover:text-[var(--brand-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]"
        >
          Clear all
        </button>
      )}
    </div>
  );
}