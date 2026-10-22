
'use client';

import { useState } from 'react';
import { ArrowUpRight, ExternalLink } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useAssetPreview } from '@/features/admin/assets/hooks/useAssetPreview';
import type { AssetModel } from '@/features/admin/assets/models';
import { cn } from '@/foundation/utils/cn';

import { AssetFileInformation } from './AssetFileInformation';
import { AssetPreviewFallback } from './AssetPreviewFallback';
import { AssetThumbnail } from './AssetThumbnail';

export interface AssetPreviewPanelProps {
  readonly asset: AssetModel;
  readonly previewUrl?: string | null;
  readonly onOpenOriginal?: (asset: AssetModel) => void;
  readonly className?: string;
}

export function AssetPreviewPanel({
  asset,
  previewUrl,
  onOpenOriginal,
  className,
}: AssetPreviewPanelProps) {
  const [failedPreviewUrl, setFailedPreviewUrl] =
    useState<string | null>(null);

  const suppliedPreviewUrl =
    typeof previewUrl === 'string' && previewUrl.trim().length > 0
      ? previewUrl.trim()
      : null;

  const shouldResolvePreview =
    !suppliedPreviewUrl && asset.type === 'IMAGE';

  const {
    previewUrl: authenticatedPreviewUrl,
    isLoading: isResolvingPreview,
    isError: resolutionFailed,
  } = useAssetPreview(
    asset.publicId,
    shouldResolvePreview,
  );

  const resolvedPreviewUrl =
    suppliedPreviewUrl ?? authenticatedPreviewUrl;

  const previewFailed =
    resolvedPreviewUrl !== null &&
    failedPreviewUrl === resolvedPreviewUrl;

  const canPreview =
    asset.type === 'IMAGE' &&
    resolvedPreviewUrl !== null &&
    !previewFailed;

  const fallbackReason =
    previewFailed || resolutionFailed
      ? 'unavailable'
      : resolvedPreviewUrl
        ? 'unsupported'
        : 'missing';

  const fallbackDescription = isResolvingPreview
    ? 'Loading image preview…'
    : previewFailed
      ? 'The preview could not be loaded. Check the asset content and access permissions.'
      : resolutionFailed
        ? 'The image content could not be retrieved. Verify your access permissions and the authenticated asset content endpoint.'
        : asset.type !== 'IMAGE'
          ? 'A visual preview is not available for this file type.'
          : 'No preview URL is available for this asset.';

  return (
    <section
      aria-label={`Preview of ${asset.originalFilename || asset.publicId}`}
      className={cn(
        'grid min-w-0 gap-5 xl:grid-cols-[minmax(0,1fr)_360px]',
        className,
      )}
    >
      <div className="min-w-0 space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="break-words text-lg font-semibold text-[var(--foreground)]">
              {asset.originalFilename || 'Untitled asset'}
            </h2>

            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              {asset.mimeType || asset.type} · {asset.status}
            </p>
          </div>

          {onOpenOriginal && (
            <Button
              variant="outline"
              size="sm"
              leadingIcon={
                <ExternalLink
                  aria-hidden="true"
                  className="size-4"
                />
              }
              onClick={() => onOpenOriginal(asset)}
            >
              Open asset
            </Button>
          )}
        </div>

        <div
          className={cn(
            'flex min-h-[320px] items-center justify-center overflow-hidden',
            'rounded-2xl border border-[var(--border)]',
            'bg-[var(--background-muted)] p-4 sm:min-h-[420px]',
          )}
        >
          {canPreview && resolvedPreviewUrl ? (
            <AssetThumbnail
              key={`${asset.publicId}:${resolvedPreviewUrl}`}
              src={resolvedPreviewUrl}
              alt={asset.originalFilename || 'Asset preview'}
              type={asset.type}
              fallbackReason="unavailable"
              containerClassName={cn(
                'flex h-full w-full items-center justify-center',
                'border-0 bg-transparent',
              )}
              className="max-h-[520px] w-auto max-w-full object-contain"
              onError={() => setFailedPreviewUrl(resolvedPreviewUrl)}
            />
          ) : (
            <AssetPreviewFallback
              type={asset.type}
              reason={fallbackReason}
              title={
                isResolvingPreview
                  ? 'Loading preview'
                  : previewFailed || resolutionFailed
                    ? 'Preview unavailable'
                    : undefined
              }
              description={fallbackDescription}
              actions={
                resolvedPreviewUrl && onOpenOriginal ? (
                  <Button
                    variant="outline"
                    size="sm"
                    leadingIcon={
                      <ArrowUpRight
                        aria-hidden="true"
                        className="size-4"
                      />
                    }
                    onClick={() => onOpenOriginal(asset)}
                  >
                    Open asset details
                  </Button>
                ) : undefined
              }
            />
          )}
        </div>
      </div>

      <aside className="min-w-0">
        <AssetFileInformation asset={asset} />
      </aside>
    </section>
  );
}

export default AssetPreviewPanel;
