
'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { ImageProps } from 'next/image';

import { cn } from '@/foundation/utils/cn';
import type { AssetType } from '@/features/admin/assets/models';

import {
  AssetPreviewFallback,
  type AssetPreviewFallbackReason,
} from './AssetPreviewFallback';

export interface AssetThumbnailProps
  extends Omit<ImageProps, 'src' | 'alt' | 'onError'> {
  readonly src?: string | null;
  readonly alt: string;
  readonly type?: AssetType;
  readonly fallbackReason?: AssetPreviewFallbackReason;
  readonly fallbackTitle?: string;
  readonly fallbackDescription?: string;
  readonly containerClassName?: string;
  readonly onError?: () => void;
}

export function AssetThumbnail({
  src,
  alt,
  type,
  fallbackReason = 'missing',
  fallbackTitle,
  fallbackDescription,
  className,
  containerClassName,
  onError,
  ...imageProps
}: AssetThumbnailProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  const imageSrc =
    typeof src === 'string' && src.trim().length > 0
      ? src
      : null;

  const imageFailed =
    imageSrc !== null && failedSrc === imageSrc;

  const canDisplayImage =
    imageSrc !== null && !imageFailed;

  if (!canDisplayImage) {
    return (
      <div className={cn('w-full', containerClassName)}>
        <AssetPreviewFallback
          type={type}
          reason={imageFailed ? 'unavailable' : fallbackReason}
          title={fallbackTitle}
          description={fallbackDescription}
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex items-center justify-center overflow-hidden rounded-xl',
        'border border-[var(--border)] bg-[var(--background-muted)]',
        containerClassName,
      )}
    >
      <Image
        {...imageProps}
        src={imageSrc}
        alt={alt}
        width={640}
        height={480}
        unoptimized
        onError={() => {
          setFailedSrc(imageSrc);
          onError?.();
        }}
        className={cn(
          'block h-auto max-h-full max-w-full object-contain',
          className,
        )}
      />
    </div>
  );
}

export default AssetThumbnail;
