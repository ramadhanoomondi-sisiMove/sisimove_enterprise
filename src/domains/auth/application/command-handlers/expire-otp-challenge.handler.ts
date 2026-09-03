// -----------------------------------------------------------------------------
// Authentication — Expire OTP Challenge Command Handler
// -----------------------------------------------------------------------------
//
// Application handler responsible for evaluating and expiring an existing
// OtpChallenge aggregate.
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
// - validate command input;
// - retrieve the OTP Challenge aggregate;
// - invoke the aggregate expiry operation;
// - persist the aggregate.
//
// -----------------------------------------------------------------------------
//
// Domain responsibilities:
//
// - determine whether the Challenge has expired relative to the supplied
//   reference date;
// - enforce OTP Challenge lifecycle invariants;
// - transition the Challenge to EXPIRED when appropriate;
// - record OtpChallengeExpiredEvent when the lifecycle transition occurs.
//
// -----------------------------------------------------------------------------
//
// Expiry may be triggered by:
//
// - an application workflow;
// - a scheduled/background process;
// - an OTP verification workflow detecting expiration.
//
// The handler does not determine whether the Challenge is expired.
// That decision belongs exclusively to the aggregate/entity.
//
// -----------------------------------------------------------------------------
//
// This handler does NOT:
//
// - determine expiry itself;
// - modify Challenge status directly;
// - calculate expiry timestamps;
// - access Prisma;
// - validate Identity domain state;
// - construct OtpChallengeEntity with `new`;
// - construct OtpChallengeAggregate with `new`;
// - modify entity properties directly;
// - construct domain events directly;
// - send notifications;
// - modify Authentication;
// - modify Recovery;
// - create Sessions.
//
// -----------------------------------------------------------------------------
//
// Expiry flow:
//
//     Application / Background Workflow
//                │
//                │ referenceDate
//                ▼
//       ExpireOtpChallengeCommand
//                │
//                ▼
//       ExpireOtpChallengeHandler
//                │
//                ▼
//       OtpChallengeRepository
//                │
//                ▼
//       aggregate.expire()
//                │
//                ├── not expired
//                │
//                └── expired
//                       │
//                       ▼
//              Challenge → EXPIRED
//                       │
//                       ▼
//              OtpChallengeExpiredEvent
//                       │
//                       ▼
//                repository.save()
//
// -----------------------------------------------------------------------------
//
// Event rule:
//
// OtpChallengeExpiredEvent is created exclusively by the aggregate and only
// when the Challenge transitions into the EXPIRED state.
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

import type { ExpireOtpChallengeCommand } from '../commands/expire-otp-challenge.command';

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
 * Evaluates and expires an OTP Challenge.
 *
 * The handler coordinates the application workflow.
 *
 * Expiration semantics, lifecycle transitions, and domain-event recording
 * remain owned by the OtpChallenge aggregate/entity.
 */
@Injectable()
export class ExpireOtpChallengeHandler implements CommandHandler<ExpireOtpChallengeCommand> {
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
   * Executes the ExpireOtpChallengeCommand.
   *
   * The supplied reference date is passed to the aggregate, which determines
   * whether expiration is applicable.
   */
  public async execute(command: ExpireOtpChallengeCommand): Promise<void> {
    // -------------------------------------------------------------------------
    // 1. Validate command
    // -------------------------------------------------------------------------

    this.ensureCommand(command);

    this.ensureRequiredCommandFields(command);

    // -------------------------------------------------------------------------
    // 2. Retrieve aggregate
    // -------------------------------------------------------------------------

    const aggregate = await this.otpChallengeRepository.findByPublicId(
      command.otpChallengePublicId,
    );

    if (aggregate === null) {
      throw new OtpChallengeException('OTP Challenge could not be found.');
    }

    // -------------------------------------------------------------------------
    // 3. Expire Challenge
    // -------------------------------------------------------------------------
    //
    // The aggregate/entity owns:
    //
    // - expiration evaluation;
    // - lifecycle validation;
    // - EXPIRED transition;
    // - OtpChallengeExpiredEvent recording.
    //
    // The handler deliberately does not reproduce these rules.
    // -------------------------------------------------------------------------

    aggregate.expire(
      command.referenceDate,
      command.correlationId,
      command.causationId,
    );

    // -------------------------------------------------------------------------
    // 4. Persist aggregate
    // -------------------------------------------------------------------------
    //
    // The aggregate is the unit of persistence.
    //
    // Saving is safe even when expire() produces no state transition. Whether
    // the infrastructure optimizes unchanged aggregates is an implementation
    // concern.
    // -------------------------------------------------------------------------

    await this.otpChallengeRepository.save(aggregate);
  }

  // ===========================================================================
  // Command Validation
  // ===========================================================================

  /**
   * Ensures that the command exists.
   */
  private ensureCommand(command: ExpireOtpChallengeCommand): void {
    if (command === undefined || command === null) {
      throw new OtpChallengeException(
        'Expire OTP Challenge command is required.',
      );
    }
  }

  /**
   * Validates required command properties.
   *
   * This validation is structural only.
   *
   * Expiration semantics and OTP Challenge lifecycle invariants remain owned
   * by the aggregate/entity.
   */
  private ensureRequiredCommandFields(
    command: ExpireOtpChallengeCommand,
  ): void {
    // -------------------------------------------------------------------------
    // OTP Challenge public identity
    // -------------------------------------------------------------------------

    if (command.otpChallengePublicId === undefined) {
      throw new OtpChallengeException('OTP Challenge public ID is required.');
    }

    // -------------------------------------------------------------------------
    // Reference date
    // -------------------------------------------------------------------------

    if (
      !(command.referenceDate instanceof Date) ||
      !Number.isFinite(command.referenceDate.getTime())
    ) {
      throw new OtpChallengeException(
        'OTP Challenge reference date must be a valid date.',
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

export default ExpireOtpChallengeHandler;
