// -----------------------------------------------------------------------------
// Authentication — Cancel OTP Challenge Command Handler
// -----------------------------------------------------------------------------
//
// Application handler responsible for cancelling an existing OtpChallenge
// aggregate.
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
// - invoke the aggregate cancellation operation;
// - persist the changed aggregate.
//
// -----------------------------------------------------------------------------
//
// Domain responsibilities:
//
// - determine whether the Challenge may be cancelled;
// - enforce OTP Challenge lifecycle invariants;
// - transition the Challenge to CANCELLED;
// - record OtpChallengeCancelledEvent when the lifecycle transition occurs.
//
// -----------------------------------------------------------------------------
//
// This handler does NOT:
//
// - determine Identity state;
// - validate Identity domain state;
// - access Prisma;
// - construct OtpChallengeEntity with `new`;
// - construct OtpChallengeAggregate with `new`;
// - modify entity properties directly;
// - construct domain events directly;
// - generate OTPs;
// - hash OTPs;
// - compare OTPs;
// - send OTPs;
// - send notifications;
// - authenticate users;
// - modify Authentication;
// - modify Recovery;
// - create Sessions.
//
// -----------------------------------------------------------------------------
//
// Cancellation flow:
//
//     Application Workflow
//             │
//             ▼
//     CancelOtpChallengeCommand
//             │
//             ▼
//     CancelOtpChallengeHandler
//             │
//             ▼
//     OtpChallengeRepository
//             │
//             ▼
//     aggregate.cancel()
//             │
//             ├── invalid lifecycle
//             │       │
//             │       └── domain exception
//             │
//             └── valid cancellation
//                     │
//                     ▼
//              Challenge → CANCELLED
//                     │
//                     ▼
//          OtpChallengeCancelledEvent
//                     │
//                     ▼
//               repository.save()
//
// -----------------------------------------------------------------------------
//
// Event rule:
//
// OtpChallengeCancelledEvent is created exclusively by the aggregate when the
// Challenge actually transitions into the CANCELLED state.
//
// The handler does not construct or publish the domain event directly.
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

import type { CancelOtpChallengeCommand } from '../commands/cancel-otp-challenge.command';

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
 * Cancels an existing OTP Challenge.
 *
 * The handler coordinates the application workflow only.
 *
 * The aggregate owns the cancellation decision, lifecycle transition, and
 * OtpChallengeCancelledEvent creation.
 */
@Injectable()
export class CancelOtpChallengeHandler implements CommandHandler<CancelOtpChallengeCommand> {
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
   * Executes the CancelOtpChallengeCommand.
   *
   * The handler retrieves the aggregate and delegates cancellation to it.
   *
   * Lifecycle rules remain entirely inside the aggregate/entity.
   */
  public async execute(command: CancelOtpChallengeCommand): Promise<void> {
    // -------------------------------------------------------------------------
    // 1. Validate command
    // -------------------------------------------------------------------------

    this.ensureCommand(command);

    this.ensureRequiredCommandFields(command);

    // -------------------------------------------------------------------------
    // 2. Retrieve OTP Challenge aggregate
    // -------------------------------------------------------------------------

    const aggregate = await this.otpChallengeRepository.findByPublicId(
      command.otpChallengePublicId,
    );

    if (aggregate === null) {
      throw new OtpChallengeException('OTP Challenge could not be found.');
    }

    // -------------------------------------------------------------------------
    // 3. Cancel Challenge through aggregate
    // -------------------------------------------------------------------------
    //
    // The aggregate/entity owns:
    //
    // - lifecycle validation;
    // - cancellation eligibility;
    // - CANCELLED transition;
    // - OtpChallengeCancelledEvent construction.
    //
    // The handler deliberately does not reproduce these rules.
    // -------------------------------------------------------------------------

    aggregate.cancel(command.correlationId, command.causationId);

    // -------------------------------------------------------------------------
    // 4. Persist aggregate
    // -------------------------------------------------------------------------
    //
    // The aggregate is the unit of persistence.
    // -------------------------------------------------------------------------

    await this.otpChallengeRepository.save(aggregate);
  }

  // ===========================================================================
  // Command Validation
  // ===========================================================================

  /**
   * Ensures that the command exists.
   */
  private ensureCommand(command: CancelOtpChallengeCommand): void {
    if (command === undefined || command === null) {
      throw new OtpChallengeException(
        'Cancel OTP Challenge command is required.',
      );
    }
  }

  /**
   * Validates required command properties.
   *
   * This validation is structural only.
   *
   * OTP Challenge lifecycle rules remain owned by the aggregate/entity.
   */
  private ensureRequiredCommandFields(
    command: CancelOtpChallengeCommand,
  ): void {
    // -------------------------------------------------------------------------
    // OTP Challenge public identity
    // -------------------------------------------------------------------------

    if (command.otpChallengePublicId === undefined) {
      throw new OtpChallengeException('OTP Challenge public ID is required.');
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

export default CancelOtpChallengeHandler;
