/**
 * sisiMove Admin — Payment Method Directory Header
 */
import { Button } from '@/components/ui';
import { Plus, RefreshCw } from 'lucide-react';

export interface PaymentMethodDirectoryHeaderProps {
  total?: number;
  isRefreshing?: boolean;
  onRefresh?: () => void;
  onCreate?: () => void;
  canCreate?: boolean;
  className?: string;
}

export function PaymentMethodDirectoryHeader({
  total,
  isRefreshing = false,
  onRefresh,
  onCreate,
  canCreate = false,
  className,
}: PaymentMethodDirectoryHeaderProps) {
  return (
    <header className={['flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between', className].filter(Boolean).join(' ')}>
      <div className="min-w-0">
        <p className="text-sm font-medium text-[var(--brand)]">Finance administration</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-[var(--foreground)] sm:text-3xl">
          Payment methods
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-[var(--foreground-secondary)]">
          Review registered payment methods, their providers, and account defaults.
        </p>
        {typeof total === 'number' && (
          <p className="mt-2 text-sm text-[var(--foreground-muted)]">
            {total.toLocaleString()} {total === 1 ? 'payment method' : 'payment methods'}
          </p>
        )}
      </div>
      <div className="flex shrink-0 flex-wrap items-center gap-2">
        {onRefresh && (
          <Button variant="outline" size="md" onClick={onRefresh} loading={isRefreshing} leadingIcon={<RefreshCw size={16} aria-hidden="true" />}>
            Refresh
          </Button>
        )}
        {canCreate && onCreate && (
          <Button onClick={onCreate} leadingIcon={<Plus size={16} aria-hidden="true" />}>
            Add payment method
          </Button>
        )}
      </div>
    </header>
  );
}

export default PaymentMethodDirectoryHeader;
