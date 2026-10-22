
import { Check, Copy, Database, HardDrive, Server } from 'lucide-react';

import { Button } from '@/components/ui/button';
import type { AssetModel } from '@/features/admin/assets/models';
import { cn } from '@/foundation/utils/cn';

export interface AssetStoragePanelProps {
  readonly asset: AssetModel;
  readonly className?: string;
}

interface StorageFieldProps {
  readonly label: string;
  readonly value: string | null | undefined;
  readonly icon: typeof Database;
  readonly copyable?: boolean;
}

function StorageField({
  label,
  value,
  icon: Icon,
  copyable = false,
}: StorageFieldProps) {
  const displayValue = value?.trim() || null;

  const copyValue = async (): Promise<void> => {
    if (
      !displayValue ||
      typeof navigator === 'undefined' ||
      !navigator.clipboard?.writeText
    ) {
      return;
    }

    try {
      await navigator.clipboard.writeText(displayValue);
    } catch {
      // Clipboard access may be unavailable or denied.
      // Keep the value visible for manual copying.
    }
  };

  return (
    <div className="flex min-w-0 items-start gap-3 py-3">
      <div
        className={cn(
          'flex size-9 shrink-0 items-center justify-center rounded-lg',
          'bg-[var(--background-muted)] text-[var(--muted-foreground)]',
        )}
      >
        <Icon aria-hidden="true" className="size-4" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-[var(--muted-foreground)]">
          {label}
        </p>

        <p
          className={cn(
            'mt-1 break-all text-sm font-medium',
            displayValue
              ? 'text-[var(--foreground)]'
              : 'text-[var(--muted-foreground)]',
          )}
        >
          {displayValue || 'Not specified'}
        </p>
      </div>

      {copyable && displayValue && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          aria-label={`Copy ${label.toLowerCase()}`}
          leadingIcon={<Copy aria-hidden="true" className="size-4" />}
          onClick={copyValue}
        >
          Copy
        </Button>
      )}
    </div>
  );
}

export function AssetStoragePanel({
  asset,
  className,
}: AssetStoragePanelProps) {
  return (
    <section
      aria-labelledby="asset-storage-title"
      className={cn(
        'min-w-0 rounded-2xl border border-[var(--border)]',
        'bg-[var(--background)]',
        className,
      )}
    >
      <div className="border-b border-[var(--border)] px-5 py-4">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'flex size-10 items-center justify-center rounded-xl',
              'bg-[var(--background-muted)] text-[var(--muted-foreground)]',
            )}
          >
            <Database aria-hidden="true" className="size-5" />
          </div>

          <div>
            <h2
              id="asset-storage-title"
              className="text-base font-semibold text-[var(--foreground)]"
            >
              Storage
            </h2>

            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              Storage location and object identifiers
            </p>
          </div>
        </div>
      </div>

      <div className="px-5 py-2">
        <StorageField
          label="Storage provider"
          value={asset.storageProvider}
          icon={Server}
        />

        <div className="border-t border-[var(--border)]">
          <StorageField
            label="Bucket"
            value={asset.bucket}
            icon={Database}
            copyable
          />
        </div>

        <div className="border-t border-[var(--border)]">
          <StorageField
            label="Object key"
            value={asset.objectKey}
            icon={HardDrive}
            copyable
          />
        </div>

        <div className="border-t border-[var(--border)]">
          <div className="flex items-start gap-3 py-3">
            <div
              className={cn(
                'flex size-9 shrink-0 items-center justify-center rounded-lg',
                'bg-[var(--background-muted)] text-[var(--muted-foreground)]',
              )}
            >
              <Check aria-hidden="true" className="size-4" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-[var(--muted-foreground)]">
                Storage reference
              </p>

              <p className="mt-1 text-sm text-[var(--foreground)]">
                {asset.bucket?.trim() && asset.objectKey?.trim()
                  ? 'Bucket and object key are recorded.'
                  : 'Storage location details are incomplete.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AssetStoragePanel;
