// -----------------------------------------------------------------------------
// OTP Challenge — Expire Command
// -----------------------------------------------------------------------------
//
// Application command for expiring an OTP Challenge.
//
// The command represents the application-level intent:
//
//     Expire OTP Challenge
//
// Expiry may be triggered by:
//
// - an application workflow;
// - a scheduled/background process;
// - an OTP verification workflow detecting expiration.
//
// The aggregate/entity is responsible for enforcing the actual expiry
// transition relative to the supplied reference date.
//
// The command handler is responsible for:
//
// - loading the OtpChallengeAggregate;
// - invoking aggregate.expire();
// - persisting the aggregate;
// - publishing OtpChallengeExpiredEvent.
//
// This command does NOT:
//
// - access Prisma;
// - persist the aggregate directly;
// - send notifications;
// - modify Authentication;
// - modify Recovery;
// - manage Sessions;
// - validate Identity domain state.
//
// -----------------------------------------------------------------------------
//
// Required inputs:
//
// - otpChallengePublicId;
// - referenceDate;
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
 * Command for expiring an OTP Challenge.
 */
export class ExpireOtpChallengeCommand extends Command {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  constructor(
    /**
     * Public identity of the OTP Challenge being expired.
     */
    public readonly otpChallengePublicId: OtpChallengePublicId,

    /**
     * Reference timestamp used to evaluate OTP Challenge expiration.
     *
     * The aggregate/entity determines whether the challenge has actually
     * expired relative to this timestamp.
     */
    public readonly referenceDate: Date,

    /**
     * Correlation identifier for the expiry operation.
     *
     * This value is propagated to OtpChallengeExpiredEvent.
     */
    public readonly correlationId: string,

    /**
     * Optional identifier of the command or domain event that caused this
     * expiry command.
     */
    public readonly causationId?: string,
  ) {
    super();
  }
}
