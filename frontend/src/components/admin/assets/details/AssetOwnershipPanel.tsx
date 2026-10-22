
'use client';

import { Copy, Fingerprint, UserRound } from 'lucide-react';

import { Button } from '@/components/ui/button';
import type { AssetModel } from '@/features/admin/assets/models';
import { cn } from '@/foundation/utils/cn';

export interface AssetOwnershipPanelProps {
  readonly asset: AssetModel;
  readonly className?: string;
  readonly onViewOwner?: (ownerIdentityPublicId: string) => void;
}

export function AssetOwnershipPanel({
  asset,
  className,
  onViewOwner,
}: AssetOwnershipPanelProps) {
  const ownerIdentityPublicId =
    asset.ownerIdentityPublicId?.trim() || null;

  const copyOwnerId = async (): Promise<void> => {
    if (
      !ownerIdentityPublicId ||
      typeof navigator === 'undefined' ||
      !navigator.clipboard?.writeText
    ) {
      return;
    }

    try {
      await navigator.clipboard.writeText(ownerIdentityPublicId);
    } catch {
      // Clipboard access may be unavailable or denied by the browser.
      // The owner ID remains visible for manual copying.
    }
  };

  return (
    <section
      aria-labelledby="asset-ownership-title"
      className={cn(
        'min-w-0 rounded-2xl border border-[var(--border)]',
        'bg-[var(--background)]',
        className,
      )}
    >
      <div className="border-b border-[var(--border)] px-5 py-4">
        <h2
          id="asset-ownership-title"
          className="text-base font-semibold text-[var(--foreground)]"
        >
          Ownership
        </h2>

        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
          Identity associated with this asset
        </p>
      </div>

      <div className="space-y-4 p-5">
        <div className="flex items-start gap-3">
          <div
            className={cn(
              'flex size-11 shrink-0 items-center justify-center rounded-xl',
              'bg-[var(--background-muted)] text-[var(--muted-foreground)]',
            )}
          >
            <UserRound aria-hidden="true" className="size-5" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-[var(--foreground)]">
              Owner identity
            </p>

            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              {ownerIdentityPublicId
                ? 'An owner identity is associated with this asset.'
                : 'No owner identity is assigned to this asset.'}
            </p>
          </div>
        </div>

        {ownerIdentityPublicId ? (
          <div className="rounded-xl border border-[var(--border)] bg-[var(--background-muted)] p-3">
            <div className="flex items-start gap-2">
              <Fingerprint
                aria-hidden="true"
                className="mt-0.5 size-4 shrink-0 text-[var(--muted-foreground)]"
              />

              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-[var(--muted-foreground)]">
                  Owner public ID
                </p>

                <p className="mt-1 break-all font-mono text-sm text-[var(--foreground)]">
                  {ownerIdentityPublicId}
                </p>
              </div>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                aria-label="Copy owner public ID"
                leadingIcon={
                  <Copy aria-hidden="true" className="size-4" />
                }
                onClick={copyOwnerId}
              >
                Copy
              </Button>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-[var(--border)] px-4 py-5 text-center">
            <p className="text-sm text-[var(--muted-foreground)]">
              Ownership information is unavailable.
            </p>
          </div>
        )}

        {ownerIdentityPublicId && onViewOwner && (
          <Button
            type="button"
            variant="outline"
            size="md"
            className="w-full"
            onClick={() => onViewOwner(ownerIdentityPublicId)}
          >
            View owner details
          </Button>
        )}
      </div>
    </section>
  );
}

export default AssetOwnershipPanel;
