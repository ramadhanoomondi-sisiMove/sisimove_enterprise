// -----------------------------------------------------------------------------
// OTP Challenge — Fail Command
// -----------------------------------------------------------------------------
//
// Application command for recording a failed OTP verification attempt.
//
// The command represents the application-level intent:
//
//     Record Failed OTP Challenge Verification Attempt
//
// The application/security workflow is responsible for:
//
// - receiving the supplied OTP;
// - securely comparing it against the persisted OTP hash;
// - determining that verification failed;
// - dispatching this command.
//
// The aggregate/entity is responsible for:
//
// - validating that another verification attempt may be consumed;
// - incrementing the consumed-attempt count;
// - enforcing the maximum-attempt invariant;
// - transitioning the Challenge to FAILED when the maximum is exhausted;
// - recording OtpChallengeFailedEvent when the Challenge transitions to FAILED.
//
// IMPORTANT:
//
// Raw OTP values and OTP hashes are never carried by this command.
//
// This command does NOT:
//
// - compare OTP values;
// - hash OTPs;
// - generate OTPs;
// - calculate the resulting attempt count;
// - determine Identity state;
// - persist the aggregate;
// - send notifications;
// - modify Authentication;
// - create Sessions;
// - modify Recovery.
//
// -----------------------------------------------------------------------------
//
// Required inputs:
//
// - otpChallengePublicId;
// - correlationId.
//
// Optional:
//
// - causationId.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Command } from '../../../../foundation/kernel/application/command';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import type { OtpChallengePublicId } from '../../domain/value-objects';

// =============================================================================
// Command
// =============================================================================

/**
 * Command for recording a failed OTP verification attempt.
 *
 * The aggregate/entity owns attempt-count progression and determines whether
 * the OTP Challenge transitions to FAILED.
 */
export class FailOtpChallengeCommand extends Command {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  constructor(
    /**
     * Public identity of the OTP Challenge whose verification attempt failed.
     */
    public readonly otpChallengePublicId: OtpChallengePublicId,

    /**
     * Correlation identifier for the failed-verification operation.
     *
     * This value is propagated to any resulting domain event.
     */
    public readonly correlationId: string,

    /**
     * Optional identifier of the command or domain event that caused this
     * failed-verification command.
     */
    public readonly causationId?: string,
  ) {
    super();
  }
}
