// -----------------------------------------------------------------------------
// Identity — Grant Member Verification Command
// -----------------------------------------------------------------------------
//
// Application command for granting MEMBER verification to an Identity.
//
// Aggregate boundary:
//
// VerificationAggregate
// └── VerificationEntity
//     └── VerificationRequestEntity[]
//
// This command represents the aggregate-level decision:
//
//     Verification = VERIFIED
//     VerificationLevel = MEMBER
//
// It is distinct from approving the underlying VerificationRequest.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { Command } from '../../../../foundation/kernel/application/command';

// -----------------------------------------------------------------------------
// Identity Value Objects
// -----------------------------------------------------------------------------

import type {
  IdentityPublicId,
  VerificationPublicId,
  VerificationRequestPublicId,
} from '../../domain/value-objects';

// =============================================================================
// Command
// =============================================================================

/**
 * Command for granting MEMBER verification.
 *
 * Granting MEMBER verification establishes:
 *
 *     Verification.status = VERIFIED
 *     Verification.level  = MEMBER
 *
 * The supplied VerificationRequest must represent approved MEMBER-eligible
 * evidence.
 *
 * The VerificationAggregate remains responsible for enforcing:
 *
 * - request ownership;
 * - request approval state;
 * - supported request type;
 * - MEMBER eligibility;
 * - lifecycle transition;
 * - reviewer information;
 * - expiration rules.
 */
export class GrantMemberVerificationCommand implements Command {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    /**
     * Public identity of the Identity that owns the Verification aggregate.
     *
     * This is an opaque cross-aggregate public identifier.
     */
    public readonly identityPublicId: IdentityPublicId,

    /**
     * Public identifier of the Verification aggregate being changed.
     */
    public readonly verificationPublicId: VerificationPublicId,

    /**
     * Public identifier of the approved VerificationRequest that provides
     * the evidence required for MEMBER verification.
     *
     * The aggregate validates that the request:
     *
     * - belongs to this Verification aggregate;
     * - is APPROVED;
     * - is PROFILE_PHOTO or GOVERNMENT_ID.
     */
    public readonly verificationRequestPublicId: VerificationRequestPublicId,

    /**
     * Public identity of the Identity that performed the MEMBER verification
     * decision.
     */
    public readonly reviewedByPublicId: IdentityPublicId,

    /**
     * Correlation identifier for the complete MEMBER verification operation
     * and resulting domain event.
     */
    public readonly correlationId: string,

    /**
     * Optional identifier of the command, event, or operation that caused
     * this MEMBER verification decision.
     */
    public readonly causationId?: string,

    /**
     * Optional timestamp at which MEMBER verification is considered granted.
     *
     * When omitted, the aggregate uses the current time.
     */
    public readonly verifiedAt?: Date,

    /**
     * Optional expiration timestamp for the resulting MEMBER verification.
     *
     * The aggregate requires:
     *
     *     expiresAt > verifiedAt
     */
    public readonly expiresAt?: Date,
  ) {}
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GrantMemberVerificationCommand;
