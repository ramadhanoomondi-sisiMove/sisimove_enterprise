
import { cn } from '@/foundation/utils/cn';

export interface JourneyCompletionSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function JourneyCompletionSearch({
  value,
  onChange,
  placeholder = 'Search by completion, journey or provider ID...',
  className,
}: JourneyCompletionSearchProps) {
  return (
    <div className={cn('relative w-full', className)}>
      <label htmlFor="journey-completion-search" className="sr-only">
        Search journey completions
      </label>

      <input
        id="journey-completion-search"
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm text-[var(--foreground)] outline-none transition placeholder:text-[var(--foreground-muted)] focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand-tint)]"
      />
    </div>
  );
}
