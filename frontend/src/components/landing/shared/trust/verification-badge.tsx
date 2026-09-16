// -----------------------------------------------------------------------------
// sisiMove — Verification Badge
// -----------------------------------------------------------------------------
//
// Reusable presentation component for displaying a Traveller's public
// verification level.
//
// This component is intentionally compact because it is used inside dense
// marketplace trust summaries:
//
//     ✓ Verified
//     ✓ Highly verified
//
// It can also be used independently on public Traveller profiles.
//
// The component:
//
// - receives a public verification level;
// - does not fetch Trust data;
// - does not expose verification evidence;
// - does not import backend or Prisma enums;
// - does not determine verification eligibility;
// - does not infer what evidence was used;
// - can be reused by Journey cards, Demand cards, and public profiles.
//
// -----------------------------------------------------------------------------
// ARCHITECTURE BOUNDARY
// -----------------------------------------------------------------------------
//
// `verificationLevel` is already part of the public Trust read model.
//
// This component translates that public value into:
//
//   1. a human-readable public label;
//   2. a compact visual treatment;
//   3. an accessible description.
//
// It does NOT:
//
// - inspect government ID records;
// - inspect phone verification records;
// - determine whether a Traveller should be verified;
// - make API requests;
// - expose private verification evidence.
//
// -----------------------------------------------------------------------------
// VERIFICATION LEVELS
// -----------------------------------------------------------------------------
//
// Public verification levels currently supported:
//
//   NONE
//   BASIC
//   VERIFIED
//   HIGHLY_VERIFIED
//
// Unknown runtime values safely fall back to the public "Not verified"
// presentation.
//
// -----------------------------------------------------------------------------
// MARKETPLACE PRESENTATION
// -----------------------------------------------------------------------------
//
// Preferred compact presentation:
//
//   ✓ Verified
//
// or:
//
//   ✓ Highly verified
//
// When `showLabel={false}`:
//
//   ✓
//
// For NONE, the verification indicator is intentionally omitted:
//
//   Not verified
//
// This prevents the visual checkmark from implying that an unverified
// Traveller has passed verification.
//
// -----------------------------------------------------------------------------
// RESPONSIVE BEHAVIOR
// -----------------------------------------------------------------------------
//
// Marketplace cards remain horizontal on small screens.
//
// The badge therefore:
//
// - remains shrink-safe;
// - remains on one line;
// - wraps as a whole when its parent trust row wraps;
// - does not introduce a fixed width;
// - does not create horizontal scrolling.
//
// -----------------------------------------------------------------------------
// CSS TOKEN POLICY
// -----------------------------------------------------------------------------
//
// Use established sisiMove design tokens:
//
//   --success
//   --brand
//   --brand-soft
//   --background
//   --background-muted
//   --background-subtle
//   --foreground-secondary
//   --foreground-muted
//   --border
//
// Avoid generic/nonexistent application tokens:
//
//   --primary
//   --muted
//   --muted-foreground
//   --ring
// -----------------------------------------------------------------------------

import type {
  PublicTrustVerificationLevel,
} from '@/features/trust/models';


// =============================================================================
// Props
// =============================================================================

export interface VerificationBadgeProps {
  /**
   * Public verification level.
   *
   * This value must already come from the public Trust read model.
   */
  readonly verificationLevel: PublicTrustVerificationLevel;

  /**
   * Whether to display the verification level as text.
   *
   * Defaults to true.
   */
  readonly showLabel?: boolean;

  /**
   * Optional additional class name.
   */
  readonly className?: string;
}


// =============================================================================
// Helpers
// =============================================================================

/**
 * Convert the public verification level into its public-facing label.
 *
 * This is presentation mapping only.
 *
 * It does not reinterpret or calculate Trust domain semantics.
 */
function getVerificationLabel(
  verificationLevel: PublicTrustVerificationLevel,
): string {
  switch (verificationLevel) {
    case 'BASIC':
      return 'Basic';

    case 'VERIFIED':
      return 'Verified';

    case 'HIGHLY_VERIFIED':
      return 'Highly verified';

    case 'NONE':
    default:
      return 'Not verified';
  }
}


/**
 * Return the compact visual treatment for the public verification level.
 *
 * Visual strength follows the public verification state:
 *
 * HIGHLY_VERIFIED
 *   → success treatment
 *
 * VERIFIED
 *   → brand treatment
 *
 * BASIC
 *   → neutral treatment
 *
 * NONE
 *   → subdued neutral treatment
 *
 * This function does not determine whether a level is trustworthy. It only
 * maps an already-resolved public state to presentation styles.
 */
function getVerificationStyles(
  verificationLevel: PublicTrustVerificationLevel,
): string {
  switch (verificationLevel) {
    case 'HIGHLY_VERIFIED':
      return [
        'border-[color-mix(in_srgb,var(--success)_25%,transparent)]',
        'bg-[color-mix(in_srgb,var(--success)_10%,transparent)]',
        'text-[var(--success)]',
      ].join(' ');

    case 'VERIFIED':
      return [
        'border-[color-mix(in_srgb,var(--brand)_25%,transparent)]',
        'bg-[var(--brand-soft)]',
        'text-[var(--brand)]',
      ].join(' ');

    case 'BASIC':
      return [
        'border-[var(--border)]',
        'bg-[var(--background-muted)]',
        'text-[var(--foreground-secondary)]',
      ].join(' ');

    case 'NONE':
    default:
      return [
        'border-[var(--border)]',
        'bg-[var(--background-subtle)]',
        'text-[var(--foreground-muted)]',
      ].join(' ');
  }
}


/**
 * Determine whether the verification state has a positive verification
 * indicator.
 *
 * NONE deliberately has no checkmark.
 *
 * The distinction is presentation-only. The Trust domain remains responsible
 * for defining the meaning of the verification level.
 */
function hasVerificationIndicator(
  verificationLevel: PublicTrustVerificationLevel,
): boolean {
  return (
    verificationLevel === 'BASIC' ||
    verificationLevel === 'VERIFIED' ||
    verificationLevel === 'HIGHLY_VERIFIED'
  );
}


// =============================================================================
// Component
// =============================================================================

/**
 * Render a compact public verification badge.
 *
 * Presentation-only:
 *
 *     Public Trust Model
 *            │
 *            ▼
 *     VerificationBadge
 *
 * No Trust API or domain operation is performed here.
 */
export function VerificationBadge({
  verificationLevel,
  showLabel = true,
  className,
}: VerificationBadgeProps) {
  const label = getVerificationLabel(
    verificationLevel,
  );

  const styles = getVerificationStyles(
    verificationLevel,
  );

  const showIndicator =
    hasVerificationIndicator(
      verificationLevel,
    );

  const accessibleLabel =
    `Verification level: ${label}`;

  return (
    <span
      title={accessibleLabel}
      aria-label={accessibleLabel}
      className={[
        // -------------------------------------------------------------------
        // Compact badge shell
        // -------------------------------------------------------------------
        //
        // `shrink-0` is intentional. The verification badge should wrap as a
        // complete unit when TrustSummary becomes narrow rather than becoming
        // visually compressed.
        //
        'inline-flex',
        'max-w-full',
        'shrink-0',
        'items-center',
        'gap-1',

        'rounded-full',
        'border',

        'px-2',
        'py-0.5',

        'text-[11px]',
        'font-medium',
        'leading-4',

        'whitespace-nowrap',

        styles,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* ------------------------------------------------------------------- */}
      {/* Verification indicator                                             */}
      {/* ------------------------------------------------------------------- */}
      {showIndicator ? (
        <span
          aria-hidden="true"
          className={[
            'shrink-0',
            'text-[11px]',
            'font-bold',
            'leading-none',
          ].join(' ')}
        >
          ✓
        </span>
      ) : null}

      {/* ------------------------------------------------------------------- */}
      {/* Public verification label                                          */}
      {/* ------------------------------------------------------------------- */}
      {showLabel ? (
        <span className="truncate">
          {label}
        </span>
      ) : null}
    </span>
  );
}