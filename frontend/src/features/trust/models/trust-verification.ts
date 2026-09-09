// -----------------------------------------------------------------------------
// Trust Verification
// -----------------------------------------------------------------------------
//
// Frontend representation of a traveller's public verification summary.
//
// This model exposes only the verification signal appropriate for the current
// frontend experience. It does not expose verification evidence or sensitive
// identity information.
//
// The Identity and Trust domains remain authoritative for verification state.
// The frontend only consumes the resulting public representation.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Trust Verification
// -----------------------------------------------------------------------------

/**
 * Public verification summary for a traveller.
 *
 * This model may be used by:
 * - Public traveller profiles
 * - Traveller discovery
 * - Journey participant views
 * - Trust summaries
 *
 * It intentionally contains only presentation-safe verification information.
 *
 * It must not contain:
 * - Identity documents
 * - Document numbers
 * - Selfie/biometric data
 * - Verification evidence
 * - Verification provider responses
 * - Internal review notes
 * - Risk or fraud signals
 * - Internal verification request identifiers
 */
export interface TrustVerification {
  /**
   * Indicates whether the traveller currently has the public verification
   * status represented by this summary.
   */
  verified: boolean;

  /**
   * Public verification level.
   *
   * Null means that no public verification level is available or intended
   * for the current consumer.
   */
  level: string | null;
}