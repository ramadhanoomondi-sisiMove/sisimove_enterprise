
import { cn } from '@/foundation/utils/cn';

import { WithdrawalPublicId } from './WithdrawalPublicId';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface WithdrawalReferenceProps {
  referenceType?: string | null;
  referencePublicId?: string | null;
  className?: string;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function WithdrawalReference({
  referenceType,
  referencePublicId,
  className,
}: WithdrawalReferenceProps) {
  const type = referenceType?.trim();
  const publicId = referencePublicId?.trim();

  if (!type && !publicId) {
    return null;
  }

  return (
    <div className={cn('flex min-w-0 flex-col gap-1', className)}>
      {type && (
        <span className="text-xs text-[var(--foreground-muted)]">
          {type}
        </span>
      )}

      {publicId && (
        <WithdrawalPublicId publicId={publicId} />
      )}
    </div>
  );
}

export default WithdrawalReference;
