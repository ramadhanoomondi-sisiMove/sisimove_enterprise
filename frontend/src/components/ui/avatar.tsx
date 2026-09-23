// -----------------------------------------------------------------------------
// sisiMove — Avatar
// -----------------------------------------------------------------------------
//
// Reusable avatar primitive for the sisiMove design system.
//
// Responsibilities:
// - Display public avatar images through the canonical Asset URL.
// - Provide accessible fallback initials.
// - Support semantic sizes.
// - Handle broken image sources gracefully.
// - Support direct Asset delivery without Next.js image optimization.
// - Remain completely domain-agnostic.
//
// Architectural note:
// - The Asset bounded context owns public image delivery.
// - This primitive receives a resolved URL.
// - It does not know about AssetPublicId, TravellerProfile,
//   Journey, JourneyDemand, or any other domain concept.
// - Public sisiMove assets are rendered directly from their canonical
//   delivery URL instead of being proxied through /_next/image.
//
// -----------------------------------------------------------------------------
//
// Why `unoptimized`?
//
// The sisiMove Asset API is already responsible for:
// - public visibility,
// - Asset lifecycle,
// - MIME type,
// - storage retrieval,
// - public delivery.
//
// Next.js therefore does not need to become another Asset delivery boundary.
//
// This keeps the Avatar primitive independent from Next.js remote-image
// optimizer configuration and ensures the same canonical Asset URL can be
// used consistently across:
// - profile headers,
// - journey cards,
// - demand cards,
// - authenticated navigation,
// - traveller identity surfaces.
//
// -----------------------------------------------------------------------------

'use client';

import Image, {
  type ImageProps,
} from 'next/image';

import {
  useState,
} from 'react';

import { cn } from '../../foundation/utils/cn';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export type AvatarSize =
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | '2xl';

export interface AvatarProps
  extends Omit<
    ImageProps,
    | 'src'
    | 'alt'
    | 'fill'
    | 'width'
    | 'height'
    | 'onError'
  > {
  /**
   * Image source.
   *
   * A resolved public URL is expected.
   *
   * The Avatar primitive intentionally does not know how the URL
   * was obtained. Asset reference resolution belongs outside this
   * presentation primitive.
   */
  src?: string | null;

  /**
   * Accessible alternative text for the avatar image.
   *
   * Decorative avatars may use an empty string.
   */
  alt?: string;

  /**
   * Fallback identity used to generate initials when the image
   * is unavailable or fails to load.
   */
  fallback?: string;

  /**
   * Avatar size.
   */
  size?: AvatarSize;

  /**
   * Optional image error handler.
   */
  onError?: ImageProps['onError'];

  /**
   * Whether this avatar is an important above-the-fold image.
   *
   * The profile header should normally use `priority`.
   * Journey and demand cards should normally leave this false.
   */
  priority?: boolean;
}

// -----------------------------------------------------------------------------
// Styles
// -----------------------------------------------------------------------------

const sizeClasses: Record<AvatarSize, string> = {
  xs: 'h-6 w-6 text-[10px]',
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
  xl: 'h-16 w-16 text-lg',
  '2xl': 'h-24 w-24 text-2xl',
};

const imageSizes: Record<AvatarSize, string> = {
  xs: '24px',
  sm: '32px',
  md: '40px',
  lg: '48px',
  xl: '64px',
  '2xl': '96px',
};

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function getInitials(value?: string): string {
  const normalized = value?.trim();

  if (!normalized) {
    return '?';
  }

  const parts = normalized
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

// -----------------------------------------------------------------------------
// Avatar
// -----------------------------------------------------------------------------

export function Avatar({
  src,
  alt = '',
  fallback,
  size = 'md',
  className,
  onError,
  sizes,
  priority = false,
  ...props
}: AvatarProps) {
  /**
   * Store the exact source that failed.
   *
   * We intentionally do not reset this state inside an effect when `src`
   * changes.
   *
   * Instead, whether the current image has failed is derived below by
   * comparing the current source with the failed source.
   *
   * Example:
   *
   *     src = ASSET-A
   *     ASSET-A fails
   *     failedSource = ASSET-A
   *
   * Then:
   *
   *     src = ASSET-B
   *
   * `failedSource === source` becomes false automatically, so ASSET-B
   * receives a fresh opportunity to render.
   */
  const [failedSource, setFailedSource] = useState<string | null>(null);

  const source = src?.trim() || undefined;

  const imageFailed =
    Boolean(source) &&
    failedSource === source;

  const showFallback =
    !source ||
    imageFailed;

  const resolvedFallback =
    fallback?.trim() || '?';

  const handleError: NonNullable<
    AvatarProps['onError']
  > = (event) => {
    if (source) {
      setFailedSource(source);
    }

    onError?.(event);
  };

  return (
    <span
      className={cn(
        'relative',
        'inline-flex',
        'shrink-0',
        'items-center',
        'justify-center',
        'overflow-hidden',
        'rounded-[var(--radius-full)]',
        'bg-[var(--background-muted)]',
        'font-semibold',
        'text-[var(--foreground-secondary)]',
        'select-none',
        sizeClasses[size],
        className,
      )}
    >
      {showFallback ? (
        <span
          aria-hidden="true"
          className="flex h-full w-full items-center justify-center"
        >
          {getInitials(resolvedFallback)}
        </span>
      ) : (
        <Image
          {...props}
          src={source}
          alt={alt}
          fill
          sizes={sizes ?? imageSizes[size]}
          priority={priority}
          unoptimized
          onError={handleError}
          className="object-cover"
        />
      )}
    </span>
  );
}