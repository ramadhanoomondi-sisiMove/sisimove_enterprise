export type CommissionDirectoryType = 'ALL' | 'BOOKING' | 'EARNING';

export interface CommissionTypeTabsProps {
  readonly value: CommissionDirectoryType;
  readonly onChange: (type: CommissionDirectoryType) => void;
  readonly disabled?: boolean;
  readonly className?: string;
}

const tabs: {
  readonly value: CommissionDirectoryType;
  readonly label: string;
}[] = [
  { value: 'ALL', label: 'All Commissions' },
  { value: 'BOOKING', label: 'Booking Commissions' },
  { value: 'EARNING', label: 'Earning Commissions' },
];

export function CommissionTypeTabs({
  value,
  onChange,
  disabled = false,
  className,
}: CommissionTypeTabsProps) {
  return (
    <div
      className={[
        'border-b border-[var(--border)]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div
        role="tablist"
        aria-label="Commission type"
        className="-mb-px flex gap-5 overflow-x-auto"
      >
        {tabs.map((tab) => {
          const isActive = value === tab.value;

          return (
            <button
              key={tab.value}
              type="button"
              role="tab"
              id={`commission-tab-${tab.value.toLowerCase()}`}
              aria-selected={isActive}
              aria-controls="commission-directory-panel"
              disabled={disabled}
              onClick={() => onChange(tab.value)}
              className={[
                'shrink-0 border-b-2 px-1 py-3 text-sm font-medium transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]',
                isActive
                  ? 'border-[var(--brand)] text-[var(--brand)]'
                  : 'border-transparent text-[var(--foreground-secondary)] hover:text-[var(--foreground)]',
                'disabled:cursor-not-allowed disabled:opacity-50',
              ].join(' ')}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}