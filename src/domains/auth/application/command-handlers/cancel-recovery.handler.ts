// -----------------------------------------------------------------------------
// Recovery — Cancel Command Handler
// -----------------------------------------------------------------------------
//
// Application handler responsible for cancelling an existing Recovery
// aggregate.
//
// Aggregate boundary:
//
// RecoveryAggregate
// └── RecoveryEntity
//
// -----------------------------------------------------------------------------
//
// Application responsibilities:
//
// - validate the command;
// - load the Recovery aggregate;
// - ensure the Recovery exists;
// - invoke RecoveryAggregate.cancel();
// - persist the updated Recovery aggregate.
//
// -----------------------------------------------------------------------------
//
// Domain responsibilities:
//
// RecoveryEntity:
//
// - validates Recovery lifecycle state;
// - determines whether cancellation is allowed;
// - transitions the Recovery to CANCELLED;
// - records cancelledAt.
//
// RecoveryAggregate:
//
// - protects the aggregate boundary;
// - coordinates the cancellation transition;
// - records RecoveryCancelledEvent;
// - preserves correlation/causation metadata.
//
// RecoveryRepository:
//
// - retrieves the Recovery aggregate;
// - persists the updated Recovery aggregate.
//
// -----------------------------------------------------------------------------
//
// Security boundary:
//
// This handler does NOT:
//
// - generate recovery tokens;
// - hash recovery tokens;
// - compare raw recovery tokens;
// - reset passwords;
// - restore accounts;
// - authenticate users;
// - modify Authentication directly;
// - revoke Sessions directly;
// - send notifications;
// - access Prisma;
// - perform external side effects.
//
// -----------------------------------------------------------------------------
//
// Cancellation flow:
//
//     Application Workflow
//            │
//            │ CancelRecoveryCommand
//            ▼
//     CancelRecoveryHandler
//            │
//            ├── validate command
//            │
//            ├── repository.findByPublicId()
//            │
//            ├── RecoveryAggregate.cancel()
//            │        │
//            │        └── RecoveryEntity.cancel()
//            │
//            └── repository.save()
//            │
//            ▼
//       Recovery persisted
//
// -----------------------------------------------------------------------------
//
// Event rule:
//
// RecoveryCancelledEvent is created by RecoveryAggregate.cancel().
//
// The handler does not construct the domain event directly.
//
// -----------------------------------------------------------------------------
//
// Lifecycle rule:
//
// The handler does not call canCancel() before cancel().
//
// RecoveryAggregate.cancel() is the authoritative domain operation and
// RecoveryEntity.cancel() owns the lifecycle invariants.
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

import type { CancelRecoveryCommand } from '../commands/cancel-recovery.command';

// -----------------------------------------------------------------------------
// Domain Repository
// -----------------------------------------------------------------------------

import type { RecoveryRepository } from '../../domain/repositories/recovery.repository';

// -----------------------------------------------------------------------------
// Domain Exception
// -----------------------------------------------------------------------------

import { RecoveryException } from '../../domain/exceptions/recovery.exception';

// =============================================================================
// Handler
// =============================================================================

/**
 * Handles cancellation of an existing Recovery aggregate.
 *
 * The handler coordinates the application workflow only.
 *
 * RecoveryEntity owns lifecycle invariants.
 *
 * RecoveryAggregate owns aggregate-level coordination and domain-event
 * recording.
 *
 * RecoveryRepository owns persistence.
 */
@Injectable()
export class CancelRecoveryHandler implements CommandHandler<CancelRecoveryCommand> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    @Inject(AUTH_TOKENS.REPOSITORIES.RECOVERY)
    private readonly recoveryRepository: RecoveryRepository,
  ) {}

  // ===========================================================================
  // Execute
  // ===========================================================================

  /**
   * Executes the CancelRecoveryCommand.
   *
   * Application flow:
   *
   * 1. Validate the command.
   * 2. Load the Recovery aggregate.
   * 3. Ensure the Recovery exists.
   * 4. Delegate cancellation to the aggregate.
   * 5. Persist the aggregate.
   *
   * RecoveryAggregate.cancel() is responsible for:
   *
   * - validating the correlation ID;
   * - delegating the lifecycle transition to RecoveryEntity;
   * - enforcing cancellation rules;
   * - recording RecoveryCancelledEvent.
   */
  public async execute(command: CancelRecoveryCommand): Promise<void> {
    // -------------------------------------------------------------------------
    // 1. Command guard
    // -------------------------------------------------------------------------

    this.ensureCommand(command);

    // -------------------------------------------------------------------------
    // 2. Required command fields
    // -------------------------------------------------------------------------

    this.ensureRequiredCommandFields(command);

    // -------------------------------------------------------------------------
    // 3. Load Recovery aggregate
    // -------------------------------------------------------------------------

    const recovery = await this.recoveryRepository.findByPublicId(
      command.recoveryPublicId,
    );

    // -------------------------------------------------------------------------
    // 4. Ensure Recovery exists
    // -------------------------------------------------------------------------

    if (recovery === null) {
      throw new RecoveryException('Recovery not found.');
    }

    // -------------------------------------------------------------------------
    // 5. Cancel Recovery
    // -------------------------------------------------------------------------
    //
    // Do not call canCancel() first.
    //
    // cancel() is the authoritative domain operation. It owns the lifecycle
    // transition and throws when the transition is invalid.
    //
    // -------------------------------------------------------------------------

    recovery.cancel(
      command.cancelledAt,
      command.correlationId,
      command.causationId,
    );

    // -------------------------------------------------------------------------
    // 6. Persist aggregate
    // -------------------------------------------------------------------------

    await this.recoveryRepository.save(recovery);
  }

  // ===========================================================================
  // Command Validation
  // ===========================================================================

  /**
   * Ensures that a command was supplied.
   *
   * This protects the application boundary at runtime even though the command
   * is strongly typed at compile time.
   */
  private ensureCommand(command: CancelRecoveryCommand): void {
    if (command === undefined || command === null) {
      throw new RecoveryException('Cancel Recovery command is required.');
    }
  }

  /**
   * Validates required command properties.
   *
   * Structural validation belongs at the application boundary.
   *
   * Recovery lifecycle semantics remain inside the domain.
   */
  private ensureRequiredCommandFields(command: CancelRecoveryCommand): void {
    // -------------------------------------------------------------------------
    // Recovery public ID
    // -------------------------------------------------------------------------

    if (command.recoveryPublicId === undefined) {
      throw new RecoveryException('Recovery public ID is required.');
    }

    // -------------------------------------------------------------------------
    // Cancellation timestamp
    // -------------------------------------------------------------------------
    //
    // cancelledAt is already a domain value object.
    //
    // Its factory/value-object invariant owns timestamp validation. The
    // handler does not inspect or reinterpret its underlying Date.
    //
    // -------------------------------------------------------------------------

    if (command.cancelledAt === undefined) {
      throw new RecoveryException(
        'Recovery cancellation timestamp is required.',
      );
    }

    // -------------------------------------------------------------------------
    // Correlation ID
    // -------------------------------------------------------------------------

    if (
      typeof command.correlationId !== 'string' ||
      command.correlationId.trim().length === 0
    ) {
      throw new RecoveryException('Recovery correlation ID is required.');
    }

    // -------------------------------------------------------------------------
    // Causation ID
    // -------------------------------------------------------------------------

    if (
      command.causationId !== undefined &&
      (typeof command.causationId !== 'string' ||
        command.causationId.trim().length === 0)
    ) {
      throw new RecoveryException(
        'Recovery causation ID must be a non-empty string when provided.',
      );
    }
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default CancelRecoveryHandler;
