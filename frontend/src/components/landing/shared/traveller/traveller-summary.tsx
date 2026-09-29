// -----------------------------------------------------------------------------
// sisiMove — Traveller Summary
// -----------------------------------------------------------------------------
//
// Reusable public presentation component for displaying a compact Traveller
// Profile summary.
//
// This component supports two presentation orientations:
//
//     horizontal:
//
//     [avatar]  @traveller
//
//     vertical:
//
//        [avatar]
//        @traveller
//
// Trust information is deliberately NOT rendered here.
//
// TrustSummary remains responsible for:
//
//     ✓ Verification
//     ★ Rating
//     · Completed journeys
//     · Public trust badges
//
// This separation allows TravellerSummary to remain reusable across:
//
//     - Journey marketplace cards;
//     - Journey Demand marketplace cards;
//     - public Traveller pages;
//     - other public identity surfaces.
//
// -----------------------------------------------------------------------------
// Architecture boundary
// -----------------------------------------------------------------------------
//
// This component is presentation-only.
//
// It:
//
// - receives an already-resolved PublicTraveller model;
// - displays public Traveller identity information;
// - optionally links to the public Traveller page;
// - supports horizontal or vertical identity presentation;
// - does not fetch Traveller data;
// - does not fetch Trust data;
// - does not resolve identity references;
// - does not access private identity information;
// - does not calculate trust;
// - does not contain marketplace business logic.
//
// The Traveller Profile / public read boundary is responsible for providing
// the public Traveller representation.
//
// TravellerSummary only presents that representation.
//
// -----------------------------------------------------------------------------
// Marketplace presentation
// -----------------------------------------------------------------------------
//
// The default marketplace identity block remains compact:
//
//     [avatar]  @traveller
//
// A vertical presentation is also available for marketplace columns where the
// identity should be visually prioritized:
//
//        [avatar]
//        @traveller
//
// A Traveller bio is intentionally omitted.
//
// Marketplace cards prioritize:
//
//     WHO → WHERE → WHAT → PRICE → ACTION
//
// rather than consuming scarce space with profile prose.
//
// -----------------------------------------------------------------------------
// Orientation
// -----------------------------------------------------------------------------
//
// `orientation` controls only the internal presentation of the Traveller
// identity:
//
//     horizontal
//         [avatar] @handle
//
//     vertical
//         [avatar]
//         @handle
//
// The default is `horizontal` to preserve the existing presentation for all
// existing consumers.
//
// A parent component may request `vertical` when the available column is
// better suited to a stacked identity presentation.
//
// This component still owns all Traveller identity rendering in either mode.
//
// -----------------------------------------------------------------------------
// Responsive behavior
// -----------------------------------------------------------------------------
//
// Marketplace cards remain horizontal even on small screens.
//
// Therefore this component must be able to shrink inside a constrained
// marketplace column.
//
// Important rules:
//
// - root uses `min-w-0`;
// - identity content uses `min-w-0`;
// - avatar remains `shrink-0`;
// - handle is allowed to truncate in horizontal mode;
// - no fixed desktop width is introduced;
// - no horizontal scrolling is introduced.
//
// Vertical mode intentionally centers the identity block while still allowing
// the component itself to shrink within the marketplace column.
//
// -----------------------------------------------------------------------------
// URL policy
// -----------------------------------------------------------------------------
//
// Public Traveller pages use the Traveller handle:
//
//     /travellers/:handle
//
// The handle is normalized and encoded before being inserted into the URL
// path so unusual public handles cannot accidentally create malformed paths.
//
// -----------------------------------------------------------------------------
// CSS token policy
// -----------------------------------------------------------------------------
//
// Use established sisiMove tokens:
//
//     --brand
//     --background
//     --foreground
//     --foreground-muted
//
// Do not introduce generic/nonexistent application tokens such as:
//
//     --ring
//     --primary
//     --primary-foreground
//
// -----------------------------------------------------------------------------

import Link from 'next/link';

import { Avatar } from '@/components/ui/avatar';

import type {
  PublicTraveller,
} from '@/features/traveller-profile/models';


// =============================================================================
// Props
// =============================================================================

export interface TravellerSummaryProps {
  /**
   * Public Traveller read model.
   *
   * The Traveller must already be resolved by the appropriate public read
   * boundary. This component does not fetch or resolve Traveller data.
   */
  readonly traveller: PublicTraveller;

  /**
   * Whether the Traveller identity should link to the public Traveller page.
   *
   * Defaults to true.
   */
  readonly linkToProfile?: boolean;

  /**
   * Controls the internal presentation of the Traveller identity.
   *
   * `horizontal`:
   *
   *     [avatar] @traveller
   *
   * `vertical`:
   *
   *        [avatar]
   *        @traveller
   *
   * Defaults to `horizontal` to preserve the existing presentation contract.
   */
  readonly orientation?: 'horizontal' | 'vertical';

  /**
   * Optional additional class name for the root element.
   */
  readonly className?: string;
}


// =============================================================================
// Helpers
// =============================================================================

/**
 * Normalize a public Traveller handle.
 *
 * Public handles are stored/displayed consistently without multiple leading
 * `@` characters.
 *
 * This helper is intentionally presentation-oriented and does not mutate the
 * underlying PublicTraveller model.
 */
function normalizeHandle(
  handle: string,
): string {
  return handle
    .trim()
    .replace(/^@+/, '');
}


/**
 * Format a public Traveller handle for display.
 *
 * Public handles are consistently displayed with exactly one leading `@`.
 */
function formatHandle(
  handle: string,
): string {
  const normalizedHandle = normalizeHandle(handle);

  return normalizedHandle.length > 0
    ? `@${normalizedHandle}`
    : '@traveller';
}


/**
 * Derive a compact avatar fallback from the public Traveller handle.
 *
 * The handle is the only identity value required by this presentation
 * component.
 *
 * No private identity information is inspected.
 */
function getTravellerInitials(
  traveller: PublicTraveller,
): string {
  const normalizedHandle = normalizeHandle(
    traveller.handle,
  );

  if (normalizedHandle.length === 0) {
    return '?';
  }

  const words = normalizedHandle
    .split(/[\s_-]+/)
    .filter(Boolean);

  if (words.length === 0) {
    return '?';
  }

  if (words.length === 1) {
    return words[0]
      .slice(0, 2)
      .toUpperCase();
  }

  return `${words[0][0]}${words[1][0]}`.toUpperCase();
}


/**
 * Build the public Traveller profile destination.
 *
 * The normalized handle is encoded because it is inserted directly into the
 * URL path.
 */
function getTravellerProfileHref(
  traveller: PublicTraveller,
): string {
  const normalizedHandle = normalizeHandle(
    traveller.handle,
  );

  return `/travellers/${encodeURIComponent(normalizedHandle)}`;
}


// =============================================================================
// Component
// =============================================================================

/**
 * Render a compact public Traveller identity summary.
 *
 * This component owns identity presentation only.
 *
 * Trust, verification, ratings, completed journeys, and other trust signals
 * belong to TrustSummary.
 */
export function TravellerSummary({
  traveller,
  linkToProfile = true,
  orientation = 'horizontal',
  className,
}: TravellerSummaryProps) {
  const handleLabel = formatHandle(
    traveller.handle,
  );

  const initials = getTravellerInitials(
    traveller,
  );

  const profileHref = getTravellerProfileHref(
    traveller,
  );

  const avatar = traveller.avatar;


  // ---------------------------------------------------------------------------
  // Avatar
  // ---------------------------------------------------------------------------
  //
  // The avatar is already part of the public Traveller representation.
  //
  // TravellerSummary does not resolve an Asset separately.
  //
  // Avatar remains a reusable UI primitive while this component supplies the
  // public Traveller-specific information.
  // ---------------------------------------------------------------------------

  const avatarContent = (
    <Avatar
      src={avatar?.url ?? undefined}
      alt={
        avatar?.alt ??
        `${handleLabel} avatar`
      }
      fallback={initials}
      size="md"
    />
  );


  // ---------------------------------------------------------------------------
  // Orientation
  // ---------------------------------------------------------------------------
  //
  // Horizontal mode:
  //
  //     [avatar] @handle
  //
  // Vertical mode:
  //
  //        [avatar]
  //        @handle
  //
  // The orientation affects only the layout of the identity summary. It does
  // not alter the underlying Traveller model or navigation behavior.
  // ---------------------------------------------------------------------------

  const isVertical = orientation === 'vertical';


  // ---------------------------------------------------------------------------
  // Root
  // ---------------------------------------------------------------------------
  //
  // `min-w-0` is important because TravellerSummary is placed inside a
  // shrinking marketplace column.
  //
  // Without it, long handles can force the marketplace card wider than its
  // available viewport.
  //
  // Vertical mode centers the identity block so the visual order is clearly:
  //
  //        avatar
  //        handle
  //
  // Horizontal mode retains the existing compact marketplace presentation.
  // ---------------------------------------------------------------------------

  return (
    <div
      className={[
        'flex',
        'min-w-0',

        isVertical
          ? [
              'flex-col',
              'items-center',
              'justify-center',
              'gap-1.5',
            ].join(' ')
          : [
              'flex-row',
              'items-center',
              'gap-2',
              'sm:gap-2.5',
            ].join(' '),

        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* ------------------------------------------------------------------- */}
      {/* Traveller avatar                                                     */}
      {/* ------------------------------------------------------------------- */}
      {linkToProfile ? (
        <Link
          href={profileHref}
          aria-label={`View ${handleLabel} traveller profile`}
          className={[
            'shrink-0',
            'rounded-full',

            'outline-offset-2',

            'transition-opacity',
            'hover:opacity-85',

            'focus-visible:outline',
            'focus-visible:outline-2',
            'focus-visible:outline-[var(--brand)]',
          ].join(' ')}
        >
          {avatarContent}
        </Link>
      ) : (
        <div className="shrink-0">
          {avatarContent}
        </div>
      )}


      {/* ------------------------------------------------------------------- */}
      {/* Traveller identity                                                    */}
      {/* ------------------------------------------------------------------- */}
      <div
        className={[
          'min-w-0',

          isVertical
            ? [
                'max-w-full',
                'text-center',
              ].join(' ')
            : [
                'flex-1',
              ].join(' '),
        ].join(' ')}
      >
        {linkToProfile ? (
          <Link
            href={profileHref}
            aria-label={`View ${handleLabel} traveller profile`}
            className={[
              'block',
              'min-w-0',
              'max-w-full',

              // Long handles remain safely constrained in both orientations.
              'truncate',

              'rounded-sm',

              'text-xs',
              'font-semibold',
              'leading-5',
              'text-[var(--foreground)]',

              'outline-offset-2',

              'hover:underline',

              'focus-visible:outline',
              'focus-visible:outline-2',
              'focus-visible:outline-[var(--brand)]',

              'sm:text-sm',
            ].join(' ')}
          >
            {handleLabel}
          </Link>
        ) : (
          <span
            className={[
              'block',
              'min-w-0',
              'max-w-full',

              'truncate',

              'text-xs',
              'font-semibold',
              'leading-5',
              'text-[var(--foreground)]',

              'sm:text-sm',
            ].join(' ')}
          >
            {handleLabel}
          </span>
        )}

        {/* ----------------------------------------------------------------- */}
        {/* Public bio intentionally omitted                                   */}
        {/* ----------------------------------------------------------------- */}
        {/*
          PublicTraveller may contain richer profile information, but this
          component intentionally remains an identity summary.

          Marketplace cards need to preserve space for:

              WHO → WHERE → WHAT → PRICE → ACTION

          The public Traveller detail page is responsible for richer profile
          presentation.
        */}
      </div>
    </div>
  );
}