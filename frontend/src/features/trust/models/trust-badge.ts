// -----------------------------------------------------------------------------
// Trust Badge
// -----------------------------------------------------------------------------
//
// Frontend representation of a public trust badge awarded to a traveller.
//
// A badge is a human-readable trust signal. The frontend consumes the badge
// awarded by the Trust domain; it does not determine eligibility or calculate
// whether a traveller has earned a badge.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Trust Badge
// -----------------------------------------------------------------------------

/**
 * Public trust badge.
 *
 * Badges may represent meaningful, product-defined trust achievements such as
 * completed-journey milestones or verified capabilities.
 *
 * This model intentionally contains only presentation-safe badge information.
 *
 * It must not contain:
// - Internal eligibility rules
// - Risk scores
// - Fraud signals
// - Moderation decisions
// - Verification evidence
// - Private traveller information
// - Financial information
// - Internal Trust-domain identifiers
 */
export interface TrustBadge {
  /**
   * Public identifier of the badge.
   */
  publicId: string;

  /**
   * Stable badge type.
   *
   * This is useful for frontend behavior while the display name remains
   * presentation-oriented.
   */
  type: string;

  /**
   * Human-readable badge name.
   */
  name: string;

  /**
   * Optional explanation of what the badge represents.
   */
  description: string | null;

  /**
   * Optional public badge artwork.
   */
  assetUrl: string | null;
}