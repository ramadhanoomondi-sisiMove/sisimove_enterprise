// -----------------------------------------------------------------------------
// Authentication — Fail OTP Challenge Command Handler
// -----------------------------------------------------------------------------
//
// Application handler responsible for recording a failed OTP verification
// attempt against an existing OtpChallenge aggregate.
//
// Aggregate boundary:
//
// OtpChallengeAggregate
// └── OtpChallengeEntity
//
// -----------------------------------------------------------------------------
//
// Application responsibilities:
//
// - validate required command input;
// - retrieve the OTP Challenge aggregate;
// - invoke the aggregate failed-attempt operation;
// - persist the changed aggregate.
//
// -----------------------------------------------------------------------------
//
// Domain responsibilities:
//
// - determine whether another verification attempt may be consumed;
// - enforce OTP Challenge lifecycle invariants;
// - increment the consumed-attempt count;
// - determine whether the maximum number of attempts has been exhausted;
// - transition the Challenge to FAILED when appropriate;
// - record OtpChallengeFailedEvent when the Challenge becomes FAILED.
//
// -----------------------------------------------------------------------------
//
// Security/application boundary responsibilities:
//
// Before this command is issued, the application/security workflow must have:
//
// - obtained the raw OTP from the transport boundary;
// - retrieved the persisted OTP hash;
// - securely compared the raw OTP against the persisted hash;
// - established that the supplied OTP is incorrect;
// - dispatched this command to record the failed attempt.
//
// The raw OTP must NOT enter this command or handler.
//
// -----------------------------------------------------------------------------
//
// This handler does NOT:
//
// - receive the raw OTP;
// - generate OTPs;
// - hash OTPs;
// - compare OTP values;
// - calculate or increment the resulting attempt count;
// - access Prisma;
// - validate Identity domain state;
// - construct OtpChallengeEntity with `new`;
// - construct OtpChallengeAggregate with `new`;
// - modify entity properties directly;
// - send OTPs;
// - send notifications;
// - modify Authentication;
// - modify Recovery;
// - create Sessions.
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

import type { FailOtpChallengeCommand } from '../commands/fail-otp-challenge.command';

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
 * Records a failed OTP verification attempt.
 *
 * The security/application boundary has already established that the supplied
 * OTP is invalid before this command is issued.
 *
 * The aggregate/entity owns attempt progression and lifecycle transitions.
 */
@Injectable()
export class FailOtpChallengeHandler implements CommandHandler<FailOtpChallengeCommand> {
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
   * Executes the FailOtpChallengeCommand.
   */
  public async execute(command: FailOtpChallengeCommand): Promise<void> {
    // -------------------------------------------------------------------------
    // 1. Command guard
    // -------------------------------------------------------------------------

    this.ensureCommand(command);

    // -------------------------------------------------------------------------
    // 2. Required command fields
    // -------------------------------------------------------------------------

    this.ensureRequiredCommandFields(command);

    // -------------------------------------------------------------------------
    // 3. Retrieve OTP Challenge aggregate
    // -------------------------------------------------------------------------

    const aggregate = await this.otpChallengeRepository.findByPublicId(
      command.otpChallengePublicId,
    );

    if (aggregate === null) {
      throw new OtpChallengeException('OTP Challenge could not be found.');
    }

    // -------------------------------------------------------------------------
    // 4. Record failed verification attempt
    // -------------------------------------------------------------------------
    //
    // The aggregate/entity owns:
    //
    // - lifecycle validation;
    // - expiration validation;
    // - remaining-attempt validation;
    // - attempt-count progression;
    // - maximum-attempt enforcement;
    // - FAILED transition;
    // - OtpChallengeFailedEvent construction.
    // -------------------------------------------------------------------------

    if (command.causationId === undefined) {
      aggregate.recordFailedAttempt(command.correlationId);
    } else {
      aggregate.recordFailedAttempt(command.correlationId, command.causationId);
    }

    // -------------------------------------------------------------------------
    // 5. Persist aggregate
    // -------------------------------------------------------------------------

    await this.otpChallengeRepository.save(aggregate);
  }

  // ===========================================================================
  // Command Validation
  // ===========================================================================

  /**
   * Ensures that the command exists.
   */
  private ensureCommand(command: FailOtpChallengeCommand): void {
    if (command === undefined || command === null) {
      throw new OtpChallengeException(
        'Fail OTP Challenge command is required.',
      );
    }
  }

  /**
   * Validates required command properties.
   *
   * OTP Challenge lifecycle and attempt invariants remain owned by the
   * aggregate/entity.
   */
  private ensureRequiredCommandFields(command: FailOtpChallengeCommand): void {
    if (command.otpChallengePublicId === undefined) {
      throw new OtpChallengeException('OTP Challenge public ID is required.');
    }

    if (
      typeof command.correlationId !== 'string' ||
      command.correlationId.trim().length === 0
    ) {
      throw new OtpChallengeException(
        'OTP Challenge correlation ID is required.',
      );
    }

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

export default FailOtpChallengeHandler;
