// -----------------------------------------------------------------------------
// Identity — Grant Driver Verification Command
// -----------------------------------------------------------------------------
//
// Application command for granting DRIVER verification to an Identity.
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
//     VerificationLevel = DRIVER
//
// It is distinct from approving the underlying VerificationRequest.
//
// -----------------------------------------------------------------------------
//
// Required references:
//
// - identityPublicId
//     Identity that owns the Verification aggregate.
//
// - verificationPublicId
//     Verification aggregate being changed.
//
// - verificationRequestPublicId
//     Approved DRIVER_LICENSE request providing the required evidence.
//
// - reviewedByPublicId
//     Identity that performed the verification decision.
//
// -----------------------------------------------------------------------------
//
// CORRELATION / CAUSATION
//
// - correlationId identifies the complete DRIVER verification operation.
// - causationId optionally identifies the operation that caused this decision.
//
// These values are application-level metadata.
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
 * Command for granting DRIVER verification.
 *
 * Granting DRIVER verification establishes:
 *
 *     Verification.status = VERIFIED
 *     Verification.level  = DRIVER
 *
 * The supplied VerificationRequest must represent approved DRIVER_LICENSE
 * evidence. The aggregate remains responsible for enforcing that rule.
 */
export class GrantDriverVerificationCommand implements Command {
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
     * the DRIVER_LICENSE evidence required for DRIVER verification.
     *
     * The application handler does not inspect or interpret the request.
     * The VerificationAggregate validates its ownership, approval state,
     * and request type.
     */
    public readonly verificationRequestPublicId: VerificationRequestPublicId,

    /**
     * Public identity of the Identity that performed the DRIVER verification
     * decision.
     */
    public readonly reviewedByPublicId: IdentityPublicId,

    /**
     * Correlation identifier for the complete DRIVER verification operation
     * and resulting domain event.
     */
    public readonly correlationId: string,

    /**
     * Optional identifier of the command, event, or operation that caused
     * this DRIVER verification decision.
     */
    public readonly causationId?: string,

    /**
     * Optional timestamp at which DRIVER verification is considered granted.
     *
     * When omitted, the aggregate uses the current time.
     */
    public readonly verifiedAt?: Date,

    /**
     * Optional expiration timestamp for the resulting DRIVER verification.
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

export default GrantDriverVerificationCommand;
