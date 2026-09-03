// -----------------------------------------------------------------------------
// Authentication — Verify OTP Challenge Command Handler
// -----------------------------------------------------------------------------
//
// Application handler responsible for successfully verifying an existing
// OtpChallenge aggregate.
//
// Aggregate boundary:
//
// OtpChallengeAggregate
// └── OtpChallengeEntity
//
// -----------------------------------------------------------------------------
//
// APPLICATION RESPONSIBILITIES:
//
// - validate the command;
// - retrieve the OTP Challenge aggregate;
// - delegate successful verification to the aggregate;
// - persist the changed aggregate.
//
// -----------------------------------------------------------------------------
//
// DOMAIN RESPONSIBILITIES:
//
// OtpChallengeAggregate / OtpChallengeEntity own:
//
// - OTP Challenge lifecycle invariants;
// - verification eligibility;
// - expiration rules;
// - attempt limits;
// - verification timestamp validation;
// - transition to VERIFIED;
// - OtpChallengeVerifiedEvent creation.
//
// -----------------------------------------------------------------------------
//
// SECURITY / APPLICATION BOUNDARY:
//
// The raw OTP is intentionally excluded from this command and handler.
//
// Before VerifyOtpChallengeCommand is issued, the surrounding authentication
// workflow is responsible for:
//
// - obtaining the raw OTP from the transport boundary;
// - retrieving the persisted OTP hash;
// - securely comparing the supplied OTP against the persisted hash;
// - establishing that the OTP is valid.
//
// Only after successful OTP comparison should this command be dispatched.
//
// -----------------------------------------------------------------------------
//
// THIS HANDLER DOES NOT:
//
// - receive the raw OTP;
// - generate OTPs;
// - hash OTPs;
// - compare OTP values;
// - access Prisma;
// - access persistence implementations directly;
// - validate Identity domain state;
// - construct OtpChallengeEntity with `new`;
// - construct OtpChallengeAggregate with `new`;
// - modify entity state directly;
// - send OTPs;
// - send notifications;
// - modify Authentication;
// - modify Recovery;
// - create Sessions.
//
// -----------------------------------------------------------------------------
//
// VERIFICATION FLOW:
//
//     Transport / Authentication Workflow
//                    │
//                    │ raw OTP
//                    ▼
//             OTP verification service
//                    │
//                    │ successful comparison
//                    ▼
//          VerifyOtpChallengeCommand
//                    │
//                    ▼
//       VerifyOtpChallengeHandler
//                    │
//                    ▼
//       OtpChallengeRepository
//                    │
//                    │ aggregate
//                    ▼
//        OtpChallengeAggregate.verify()
//                    │
//                    ├── lifecycle transition
//                    │
//                    └── OtpChallengeVerifiedEvent
//                    │
//                    ▼
//          OtpChallengeRepository.save()
//
// -----------------------------------------------------------------------------
//
// SECURITY BOUNDARY:
//
// The raw OTP never enters:
//
// - VerifyOtpChallengeCommand;
// - VerifyOtpChallengeHandler;
// - OtpChallengeAggregate;
// - OtpChallengeEntity;
// - OtpChallengeVerifiedEvent;
// - persistence.
//
// -----------------------------------------------------------------------------
//
// IMPORTANT:
//
// This handler assumes that the command represents a successful OTP
// verification result.
//
// If OTP comparison fails, the caller must use the appropriate failed-attempt
// workflow instead of dispatching this command.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

// -----------------------------------------------------------------------------
// Authentication Tokens
// -----------------------------------------------------------------------------

import { AUTH_TOKENS } from '../auth.tokens';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

import type { VerifyOtpChallengeCommand } from '../commands/verify-otp-challenge.command';

// -----------------------------------------------------------------------------
// Repository
// -----------------------------------------------------------------------------

import type { OtpChallengeRepository } from '../../domain/repositories/otp-challenge.repository';

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { OtpChallengeException } from '../../domain/exceptions/otp-challenge.exception';

// =============================================================================
// Handler
// =============================================================================

/**
 * Successfully verifies an OTP Challenge.
 *
 * This handler coordinates the successful OTP Challenge lifecycle transition.
 *
 * OTP comparison is intentionally outside this handler. The command is issued
 * only after the surrounding authentication/security workflow has established
 * that the supplied OTP matches the persisted OTP hash.
 *
 * The handler therefore performs only application-level orchestration:
 *
 * 1. validate the command;
 * 2. retrieve the aggregate;
 * 3. delegate verification to the aggregate;
 * 4. persist the aggregate.
 *
 * Domain invariants and lifecycle transitions remain inside the aggregate.
 */
@Injectable()
export class VerifyOtpChallengeHandler implements CommandHandler<VerifyOtpChallengeCommand> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    @Inject(AUTH_TOKENS.REPOSITORIES.OTP_CHALLENGE)
    private readonly otpChallengeRepository: OtpChallengeRepository,
  ) {}

  // ===========================================================================
  // Execute
  // ===========================================================================

  /**
   * Executes the VerifyOtpChallengeCommand.
   *
   * The command represents an already-successful OTP verification result.
   *
   * No raw OTP is available to this handler.
   */
  public async execute(command: VerifyOtpChallengeCommand): Promise<void> {
    // -------------------------------------------------------------------------
    // 1. Validate command
    // -------------------------------------------------------------------------

    this.ensureCommand(command);

    // -------------------------------------------------------------------------
    // 2. Validate required command fields
    // -------------------------------------------------------------------------

    this.ensureRequiredCommandFields(command);

    // -------------------------------------------------------------------------
    // 3. Retrieve aggregate
    // -------------------------------------------------------------------------
    //
    // The repository returns the aggregate rather than exposing persistence
    // models to the application handler.
    // -------------------------------------------------------------------------

    const aggregate = await this.otpChallengeRepository.findByPublicId(
      command.otpChallengePublicId,
    );

    if (aggregate === null) {
      throw new OtpChallengeException('OTP Challenge could not be found.');
    }

    // -------------------------------------------------------------------------
    // 4. Delegate verification to aggregate
    // -------------------------------------------------------------------------
    //
    // The aggregate owns the domain transition.
    //
    // It is responsible for:
    //
    // - determining whether verification is currently permitted;
    // - enforcing lifecycle invariants;
    // - validating the verification timestamp;
    // - transitioning the Challenge to VERIFIED;
    // - recording OtpChallengeVerifiedEvent.
    //
    // The handler does not reproduce these rules.
    // -------------------------------------------------------------------------

    aggregate.verify(
      command.verifiedAt,
      command.correlationId,
      command.causationId,
    );

    // -------------------------------------------------------------------------
    // 5. Persist aggregate
    // -------------------------------------------------------------------------
    //
    // The aggregate remains the unit of persistence.
    //
    // Any domain events recorded by the aggregate remain associated with the
    // aggregate and are handled by the application's domain-event mechanism
    // according to the repository/event infrastructure contract.
    // -------------------------------------------------------------------------

    await this.otpChallengeRepository.save(aggregate);
  }

  // ===========================================================================
  // Command Validation
  // ===========================================================================

  /**
   * Ensures that a command instance was supplied.
   *
   * This guard protects the application boundary from invalid invocation.
   */
  private ensureCommand(command: VerifyOtpChallengeCommand): void {
    if (command === undefined || command === null) {
      throw new OtpChallengeException(
        'Verify OTP Challenge command is required.',
      );
    }
  }

  /**
   * Validates structurally required command properties.
   *
   * These checks protect the application boundary.
   *
   * Business semantics remain the responsibility of the aggregate.
   */
  private ensureRequiredCommandFields(
    command: VerifyOtpChallengeCommand,
  ): void {
    // -------------------------------------------------------------------------
    // OTP Challenge public identity
    // -------------------------------------------------------------------------

    if (command.otpChallengePublicId === undefined) {
      throw new OtpChallengeException('OTP Challenge public ID is required.');
    }

    // -------------------------------------------------------------------------
    // Verification timestamp
    // -------------------------------------------------------------------------

    if (command.verifiedAt === undefined) {
      throw new OtpChallengeException(
        'OTP Challenge verification timestamp is required.',
      );
    }

    // -------------------------------------------------------------------------
    // Correlation ID
    // -------------------------------------------------------------------------

    if (
      typeof command.correlationId !== 'string' ||
      command.correlationId.trim().length === 0
    ) {
      throw new OtpChallengeException(
        'OTP Challenge correlation ID is required.',
      );
    }

    // -------------------------------------------------------------------------
    // Causation ID
    // -------------------------------------------------------------------------

    if (
      command.causationId !== undefined &&
      (typeof command.causationId !== 'string' ||
        command.causationId.trim().length === 0)
    ) {
      throw new OtpChallengeException(
        'OTP Challenge causation ID must be a non-empty string when provided.',
      );
    }
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default VerifyOtpChallengeHandler;
