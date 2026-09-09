// -----------------------------------------------------------------------------
// sisiMove — Avatar
// -----------------------------------------------------------------------------
//
// Reusable avatar primitive for the sisiMove design system.
//
// Responsibilities:
// - Display optimized profile images through next/image
// - Provide accessible fallback initials
// - Support semantic sizes
// - Handle broken image sources gracefully
// - Provide responsive image sizing for optimized delivery
//
// The component remains domain-agnostic.
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
  | 'xl';

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
   * A URL is expected because public SisiMove assets are exposed
   * through the application's asset API/CDN.
   */
  src?: string | null;

  /**
   * Accessible alternative text for the avatar image.
   *
   * Decorative avatars may use an empty string.
   */
  alt?: string;

  /**
   * Fallback content used to generate initials when the image
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
};

const imageSizes: Record<AvatarSize, string> = {
  xs: '24px',
  sm: '32px',
  md: '40px',
  lg: '48px',
  xl: '64px',
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
  ...props
}: AvatarProps) {
  const [failedSource, setFailedSource] = useState<string | null>(null);

  const source = src?.trim() || undefined;

  const imageFailed =
    Boolean(source) &&
    failedSource === source;

  const showFallback =
    !source ||
    imageFailed;

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
          {getInitials(fallback)}
        </span>
      ) : (
        <Image
          {...props}
          src={source}
          alt={alt}
          fill
          sizes={sizes ?? imageSizes[size]}
          onError={handleError}
          className="object-cover"
        />
      )}
    </span>
  );
}