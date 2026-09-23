// -----------------------------------------------------------------------------
// sisiMove — Profile Avatar
// -----------------------------------------------------------------------------
//
// Profile-specific avatar presentation for the authenticated traveller profile.
//
// Responsibilities:
// - Adapt profile identity data to the shared Avatar primitive.
// - Provide profile-specific fallback information.
// - Mark the primary profile avatar as a high-priority image when requested.
//
// Non-responsibilities:
// - Fetching profile data.
// - Uploading/changing profile photos.
// - Resolving asset URLs.
// - Managing avatar state.
// - Performing image delivery or optimization.
//
// Architecture:
//
// ProfileAvatar
//      │
//      ▼
// shared Avatar
//      │
//      └── already-resolved public Asset URL
//
// Asset resolution remains outside this component.
//
// The profile feature supplies:
// - resolved avatar URL;
// - accessible alt text;
// - fallback identity;
// - semantic size;
// - optional loading priority.
//
// Visual language:
// - Delegates sizing, shape, image treatment, fallback styling, and image
//   delivery entirely to the shared Avatar primitive.
// - Supports the large `2xl` identity size used by the primary profile header.
// - Allows profile compositions to provide local layout classes through
//   `className` without coupling this adapter to a specific profile layout.
//
// Loading:
// - The authenticated profile header sets `priority` because its avatar is
//   the primary above-the-fold identity image.
// - Journey and demand cards normally leave `priority` disabled.
//
// -----------------------------------------------------------------------------

import type { ReactNode } from 'react';

import { Avatar } from '@/components/ui/avatar';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface ProfileAvatarProps {
  /**
   * Already-resolved public avatar URL.
   *
   * Asset resolution remains outside this component.
   */
  readonly src?: string | null;

  /**
   * Accessible alternative text for the profile image.
   */
  readonly alt?: string;

  /**
   * Profile identity used by the shared Avatar when no image is available.
   */
  readonly fallback?: string;

  /**
   * Shared Avatar size.
   *
   * `2xl` is the primary identity size used by the authenticated profile
   * header.
   */
  readonly size?:
    | 'xs'
    | 'sm'
    | 'md'
    | 'lg'
    | 'xl'
    | '2xl';

  /**
   * Whether this avatar is an important above-the-fold image.
   *
   * The authenticated profile header should normally set this to `true`.
   * Journey and demand cards should normally leave it disabled.
   */
  readonly priority?: boolean;

  /**
   * Optional layout/presentation classes supplied by the parent.
   */
  readonly className?: string;
}

// -----------------------------------------------------------------------------
// Profile Avatar
// -----------------------------------------------------------------------------

export function ProfileAvatar({
  src,
  alt,
  fallback,
  size = '2xl',
  priority = false,
  className,
}: ProfileAvatarProps): ReactNode {
  const resolvedFallback =
    fallback?.trim() || '?';

  const resolvedAlt =
    alt?.trim() || 'Traveller profile photo';

  return (
    <Avatar
      src={src}
      alt={resolvedAlt}
      fallback={resolvedFallback}
      size={size}
      priority={priority}
      className={className}
    />
  );
}