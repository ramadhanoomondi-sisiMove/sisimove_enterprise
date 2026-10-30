
import { Search, X } from 'lucide-react';

import { Input } from '@/components/ui';
import { cn } from '@/foundation/utils/cn';

export interface ProviderSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function ProviderSearch({
  value,
  onChange,
  placeholder = 'Search providers by name, code, type, or status...',
  className,
}: ProviderSearchProps) {
  return (
    <div className={cn('relative w-full', className)}>
      <Search
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"
      />

      <Input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label="Search payment providers"
        className="pl-10 pr-10"
      />

      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="Clear provider search"
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
