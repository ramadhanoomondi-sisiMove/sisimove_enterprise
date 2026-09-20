// -----------------------------------------------------------------------------
// sisiMove — Profile Avatar
// -----------------------------------------------------------------------------
//
// Profile-specific avatar presentation for the authenticated traveller profile.
//
// Responsibilities:
// - Adapt profile identity data to the shared Avatar primitive.
// - Provide profile-specific fallback information.
// - Keep profile presentation independent from image-fetching concerns.
//
// Non-responsibilities:
// - Fetching profile data.
// - Uploading/changing profile photos.
// - Resolving asset URLs.
// - Managing avatar state.
//
// Architecture:
// - This component is a profile-specific presentation adapter.
// - The shared Avatar primitive owns image rendering, sizing, shape, and
//   fallback behavior.
// - ProfileAvatar does not introduce profile-specific image state.
// - The profile feature supplies already-resolved `src`, `alt`, and fallback
//   values.
//
// Visual language:
// - Delegates sizing, shape, image treatment, and fallback styling entirely
//   to the shared Avatar primitive.
// - Supports the large `2xl` identity size used by primary profile headers.
// - Allows profile compositions to provide local layout classes through
//   `className` without coupling this adapter to a specific profile layout.
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
   * Profile-specific fallback content supplied to the shared Avatar.
   */
  readonly fallback?: string;

  /**
   * Shared Avatar size.
   *
   * `2xl` is the large identity size used by profile headers and
   * other primary traveller identity surfaces.
   */
  readonly size?:
    | 'xs'
    | 'sm'
    | 'md'
    | 'lg'
    | 'xl'
    | '2xl';

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
  alt = '',
  fallback,
  size = 'xl',
  className,
}: ProfileAvatarProps): ReactNode {
  return (
    <Avatar
      src={src}
      alt={alt}
      fallback={fallback}
      size={size}
      className={className}
    />
  );
}