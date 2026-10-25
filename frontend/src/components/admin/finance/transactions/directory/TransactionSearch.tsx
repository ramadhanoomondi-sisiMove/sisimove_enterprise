'use client';

import { Search, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export interface TransactionSearchProps {
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
  disabled?: boolean;
  placeholder?: string;
}

export function TransactionSearch({
  value,
  onChange,
  onClear,
  disabled = false,
  placeholder = 'Search transaction ID, reference, or account…',
}: TransactionSearchProps) {
  return (
    <div className="flex min-w-0 flex-1 items-end gap-2">
      <div className="min-w-0 flex-1">
        <Input
          id="transaction-search"
          label="Search transactions"
          type="search"
          value={value}
          onChange={(event) => onChange(event.currentTarget.value)}
          placeholder={placeholder}
          disabled={disabled}
          leadingContent={<Search size={16} />}
          autoComplete="off"
        />
      </div>
      {value.length > 0 && (
        <Button
          type="button"
          variant="ghost"
          size="md"
          disabled={disabled}
          leadingIcon={<X size={16} />}
          onClick={() => {
            onChange('');
            onClear?.();
          }}
          aria-label="Clear transaction search"
        >
          Clear
        </Button>
      )}
    </div>
  );
}

export default TransactionSearch;
