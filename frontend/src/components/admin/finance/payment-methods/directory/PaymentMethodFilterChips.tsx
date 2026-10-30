/**
 * sisiMove Admin — Applied Payment Method Filter Chips
 */
import { X } from 'lucide-react';
import { Badge, Button } from '@/components/ui';
import type { PaymentMethodFiltersValue } from './PaymentMethodFilters';

export interface PaymentMethodFilterChipsProps {
  value: PaymentMethodFiltersValue;
  search?: string;
  onRemove: (key: keyof PaymentMethodFiltersValue | 'search') => void;
  className?: string;
}

export function PaymentMethodFilterChips({
  value,
  search = '',
  onRemove,
  className,
}: PaymentMethodFilterChipsProps) {
  const chips: Array<{ key: keyof PaymentMethodFiltersValue | 'search'; label: string }> = [];
  if (search.trim()) chips.push({ key: 'search', label: `Search: ${search.trim()}` });
  if (value.status !== 'all') chips.push({ key: 'status', label: `Status: ${value.status}` });
  if (value.defaultFilter !== 'all') chips.push({ key: 'defaultFilter', label: value.defaultFilter === 'default' ? 'Default only' : 'Non-default only' });
  if (value.type) chips.push({ key: 'type', label: `Type: ${value.type}` });
  if (value.provider) chips.push({ key: 'provider', label: `Provider: ${value.provider}` });

  if (!chips.length) return null;

  return (
    <div className={['flex flex-wrap items-center gap-2', className].filter(Boolean).join(' ')} aria-label="Applied filters">
      <span className="text-xs font-medium text-[var(--foreground-muted)]">Active filters</span>
      {chips.map((chip) => (
        <Badge key={chip.key} variant="outline" size="md" className="gap-1 pl-2 pr-1">
          <span>{chip.label}</span>
          <Button variant="ghost" size="sm" className="min-h-5 h-5 px-1" aria-label={`Remove ${chip.label}`} onClick={() => onRemove(chip.key)} leadingIcon={<X size={12} aria-hidden="true" />}>
            <span className="sr-only">Remove</span>
          </Button>
        </Badge>
      ))}
    </div>
  );
}

export default PaymentMethodFilterChips;
