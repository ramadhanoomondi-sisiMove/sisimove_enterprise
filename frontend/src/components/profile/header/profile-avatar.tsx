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
// The shared Avatar component owns image loading and fallback behavior.
// -----------------------------------------------------------------------------

import type { ReactNode } from 'react';

import { Avatar } from '@/components/ui/avatar';

export interface ProfileAvatarProps {
  src?: string | null;
  alt?: string;
  fallback?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

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