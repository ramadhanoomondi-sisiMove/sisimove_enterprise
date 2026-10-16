
/**
 * sisiMove — Member Avatar
 *
 * Member-specific avatar presentation for the Admin Members feature.
 *
 * Responsibilities:
 * - Adapt member identity information to the shared Avatar primitive.
 * - Provide accessible alternative text.
 * - Provide fallback identity information for missing images.
 * - Support shared semantic avatar sizes.
 * - Allow optional image loading priority.
 *
 * Asset URL resolution remains outside this component.
 */

import type { ReactNode } from 'react';

import {
  Avatar,
  type AvatarSize,
} from '@/components/ui/avatar';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface MemberAvatarProps {
  /** Already-resolved public avatar URL. */
  readonly src?: string | null;

  /** Accessible alternative text for the member image. */
  readonly alt?: string;

  /** Identity fallback when no image is available. */
  readonly fallback?: string;

  /** Shared Avatar size. */
  readonly size?: AvatarSize;

  /** Whether this is an important above-the-fold image. */
  readonly priority?: boolean;

  /** Optional layout and presentation classes. */
  readonly className?: string;
}

// -----------------------------------------------------------------------------
// Member Avatar
// -----------------------------------------------------------------------------

export function MemberAvatar({
  src,
  alt,
  fallback,
  size = 'md',
  priority = false,
  className,
}: MemberAvatarProps): ReactNode {
  const resolvedFallback = fallback?.trim() || '?';
  const resolvedAlt = alt?.trim() || 'Member profile photo';
  const resolvedSrc = src?.trim() || undefined;

  return (
    <Avatar
      src={resolvedSrc}
      alt={resolvedAlt}
      fallback={resolvedFallback}
      size={size}
      priority={priority}
      className={className}
    />
  );
}

export default MemberAvatar;
