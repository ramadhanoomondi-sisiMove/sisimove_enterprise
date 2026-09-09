// -----------------------------------------------------------------------------
// sisiMove — Traveller Avatar
// -----------------------------------------------------------------------------
//
// Presentation component for a public traveller avatar.
//
// Responsibilities:
// - Render the traveller's public avatar.
// - Use the public handle as the accessible fallback identity.
// - Provide optional visual emphasis.
//
// This component does not:
// - resolve traveller identity;
// - fetch avatar data;
// - determine verification;
// - render trust state;
// - perform authentication or authorization;
// - expose private traveller information.
//
// Verification is intentionally handled by TravellerTrust rather than this
// component so that public trust presentation has a single responsibility.
//
// -----------------------------------------------------------------------------

import type { HTMLAttributes } from 'react';

import type {
  PublicTraveller,
} from '@/features/traveller-discovery';

import { Avatar } from '../../ui';

import { cn } from '../../../foundation/utils/cn';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface TravellerAvatarProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /**
   * Public avatar URL.
   */
  readonly src?: PublicTraveller['avatarUrl'];

  /**
   * Public traveller handle.
   *
   * Used for accessible alternative text and avatar fallback.
   */
  readonly handle: PublicTraveller['handle'];

  /**
   * Avatar size.
   */
  readonly size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';

  /**
   * Whether the avatar should be visually emphasized.
   */
  readonly emphasized?: boolean;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function TravellerAvatar({
  src,
  handle,
  size = 'md',
  emphasized = false,
  className,
  ...props
}: TravellerAvatarProps) {
  const normalizedHandle = handle.trim();

  if (!normalizedHandle) {
    return null;
  }

  const fallback = normalizedHandle;

  const alt = `@${normalizedHandle}'s profile photo`;

  return (
    <div
      {...props}
      className={cn(
        'relative',
        'inline-flex',
        'shrink-0',
        emphasized && [
          'rounded-[var(--radius-full)]',
          'ring-2',
          'ring-[var(--brand)]/15',
          'ring-offset-2',
          'ring-offset-[var(--surface)]',
        ].join(' '),
        className,
      )}
    >
      <Avatar
        src={src}
        alt={alt}
        fallback={fallback}
        size={size}
      />
    </div>
  );
}