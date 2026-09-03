// -----------------------------------------------------------------------------
// OTP Challenge — Verify Command
// -----------------------------------------------------------------------------
//
// Application command for verifying an OTP Challenge.
//
// The command represents the application-level intent:
//
//     Verify OTP Challenge
//
// The application workflow is responsible for:
//
// - locating the OTP Challenge aggregate;
// - validating the supplied Identity reference when required;
// - obtaining the raw OTP from the transport/application boundary;
// - securely comparing the raw OTP against the persisted OTP hash;
// - determining whether the challenge may be verified;
// - invoking OtpChallengeAggregate.verify();
// - persisting the changed aggregate;
// - publishing resulting domain events.
//
// IMPORTANT:
//
// The raw OTP is intentionally NOT carried by this domain/application command.
//
// OTP comparison belongs to the security/application boundary. The aggregate
// receives only the successful verification instruction and verification
// timestamp.
//
// This command does NOT:
//
// - compare OTP values;
// - hash OTPs;
// - generate OTPs;
// - access Prisma;
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
// - verifiedAt;
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

import type {
  OtpChallengePublicId,
  OtpChallengeVerifiedAt,
} from '../../domain/value-objects';

// =============================================================================
// Command
// =============================================================================

/**
 * Command for successfully verifying an OTP Challenge.
 *
 * The command is issued only after the application/security workflow has
 * securely established that the supplied OTP matches the persisted hash.
 */
export class VerifyOtpChallengeCommand extends Command {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  constructor(
    /**
     * Public identity of the OTP Challenge being verified.
     */
    public readonly otpChallengePublicId: OtpChallengePublicId,

    /**
     * Timestamp at which successful OTP verification occurred.
     */
    public readonly verifiedAt: OtpChallengeVerifiedAt,

    /**
     * Correlation identifier for the verification operation.
     *
     * This value is propagated to OtpChallengeVerifiedEvent.
     */
    public readonly correlationId: string,

    /**
     * Optional identifier of the command or domain event that caused this
     * verification command.
     */
    public readonly causationId?: string,
  ) {
    super();
  }
}
