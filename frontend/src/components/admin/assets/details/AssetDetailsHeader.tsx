
'use client';

import { ArrowLeft, ExternalLink, File } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { AssetModel } from '@/features/admin/assets/models';
import { cn } from '@/foundation/utils/cn';

export interface AssetDetailsHeaderProps {
  readonly asset: AssetModel;
  readonly onBack?: () => void;
  readonly onOpenOriginal?: (asset: AssetModel) => void;
  readonly className?: string;
}

const STATUS_VARIANTS = {
  UPLOADING: 'warning',
  UPLOADED: 'default',
  READY: 'success',
  ARCHIVED: 'outline',
  DELETED: 'danger',
} as const;

function formatLabel(value: string): string {
  return value
    .toLowerCase()
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export function AssetDetailsHeader({
  asset,
  onBack,
  onOpenOriginal,
  className,
}: AssetDetailsHeaderProps) {
  const filename = asset.originalFilename?.trim() || 'Untitled asset';

  return (
    <header
      className={cn(
        'flex min-w-0 flex-col gap-4',
        'border-b border-[var(--border)] pb-5',
        className,
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          {onBack && (
            <Button
              variant="ghost"
              size="sm"
              leadingIcon={<ArrowLeft aria-hidden="true" className="size-4" />}
              onClick={onBack}
            >
              Back to assets
            </Button>
          )}
        </div>

        {onOpenOriginal && (
          <Button
            variant="outline"
            size="sm"
            leadingIcon={
              <ExternalLink aria-hidden="true" className="size-4" />
            }
            onClick={() => onOpenOriginal(asset)}
          >
            Open asset
          </Button>
        )}
      </div>

      <div className="flex min-w-0 items-start gap-4">
        <div
          className={cn(
            'flex size-14 shrink-0 items-center justify-center rounded-2xl',
            'border border-[var(--border)] bg-[var(--background-muted)]',
            'text-[var(--muted-foreground)]',
          )}
        >
          <File aria-hidden="true" className="size-7" />
        </div>

        <div className="min-w-0 flex-1">
          <h1 className="break-words text-xl font-semibold tracking-tight text-[var(--foreground)] sm:text-2xl">
            {filename}
          </h1>

          <p className="mt-1 break-all text-sm text-[var(--muted-foreground)]">
            Asset ID: {asset.publicId}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Badge variant={STATUS_VARIANTS[asset.status]}>
              {formatLabel(asset.status)}
            </Badge>

            <Badge variant="outline">
              {formatLabel(asset.type)}
            </Badge>

            <Badge variant="outline">
              {formatLabel(asset.category)}
            </Badge>

            <Badge variant="outline">
              {formatLabel(asset.visibility)}
            </Badge>
          </div>
        </div>
      </div>
    </header>
  );
}

export default AssetDetailsHeader;
