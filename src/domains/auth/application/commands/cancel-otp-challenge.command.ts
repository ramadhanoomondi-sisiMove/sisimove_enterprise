// -----------------------------------------------------------------------------
// OTP Challenge — Cancel Command
// -----------------------------------------------------------------------------
//
// Application command representing the intent to cancel an existing
// OTP Challenge.
//
// The command represents the application-level intent:
//
//     Cancel OTP Challenge
//
// Cancellation may occur when an application workflow determines that an
// outstanding OTP Challenge is no longer required.
//
// The command handler is responsible for:
//
// - loading the OtpChallengeAggregate;
// - invoking aggregate.cancel();
// - persisting the aggregate.
//
// The aggregate/entity is responsible for:
//
// - enforcing cancellation lifecycle invariants;
// - performing the cancellation transition;
// - recording OtpChallengeCancelledEvent when the Challenge transitions
//   to CANCELLED.
//
// The command itself does NOT:
//
// - validate Identity domain state;
// - access Prisma;
// - persist the aggregate;
// - generate OTPs;
// - hash OTPs;
// - compare OTPs;
// - send notifications;
// - authenticate users;
// - modify Authentication;
// - modify Recovery;
// - manage Sessions;
// - construct or publish domain events.
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
//
// Domain-event metadata:
//
// correlationId is propagated to OtpChallengeCancelledEvent.
//
// causationId is propagated when supplied.
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
 * Command for cancelling an existing OTP Challenge.
 *
 * The command carries only the aggregate identity and operation metadata.
 *
 * Cancellation lifecycle rules remain owned by the OtpChallenge aggregate.
 */
export class CancelOtpChallengeCommand extends Command {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    /**
     * Public identity of the OTP Challenge being cancelled.
     */
    public readonly otpChallengePublicId: OtpChallengePublicId,

    /**
     * Correlation identifier for the cancellation operation.
     *
     * This value is propagated to OtpChallengeCancelledEvent when the
     * aggregate successfully transitions the Challenge to CANCELLED.
     */
    public readonly correlationId: string,

    /**
     * Optional identifier of the command or domain event that caused this
     * cancellation operation.
     */
    public readonly causationId?: string,
  ) {
    super();
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default CancelOtpChallengeCommand;
