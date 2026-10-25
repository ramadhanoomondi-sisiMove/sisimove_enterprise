import { cn } from '@/foundation/utils/cn';
import { AccountHoldPublicId } from '../shared/AccountHoldPublicId';

export interface AccountHoldTransactionReferenceProps {
  label: string;
  publicId?: string;
  description?: string;
  className?: string;
}

export function AccountHoldTransactionReference({
  label,
  publicId,
  description,
  className,
}: AccountHoldTransactionReferenceProps) {
  return (
    <div
      className={cn(
        'min-w-0 space-y-2 rounded-lg border border-[var(--border-subtle)] p-4',
        className,
      )}
    >
      <p className="text-sm font-medium text-[var(--foreground)]">{label}</p>

      {publicId ? (
        <AccountHoldPublicId publicId={publicId} visibleCharacters={24} />
      ) : (
        <p className="text-sm text-[var(--foreground-subtle)]">
          No transaction linked
        </p>
      )}

      {description ? (
        <p className="text-xs text-[var(--foreground-muted)]">{description}</p>
      ) : null}
    </div>
  );
}