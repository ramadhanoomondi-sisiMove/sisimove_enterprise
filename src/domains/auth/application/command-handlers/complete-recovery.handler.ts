// -----------------------------------------------------------------------------
// Recovery — Complete Command Handler
// -----------------------------------------------------------------------------
//
// Application handler responsible for completing an existing Recovery
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
// - invoke RecoveryAggregate.complete();
// - persist the updated Recovery aggregate.
//
// -----------------------------------------------------------------------------
//
// Domain responsibilities:
//
// RecoveryEntity:
//
// - validates Recovery lifecycle state;
// - determines whether completion is allowed;
// - transitions the Recovery to COMPLETED;
// - records completedAt.
//
// RecoveryAggregate:
//
// - protects the aggregate boundary;
// - coordinates the completion transition;
// - records RecoveryCompletedEvent;
// - preserves correlation/causation metadata.
//
// RecoveryRepository:
//
// - retrieves the Recovery aggregate;
// - persists the completed aggregate.
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
// - restore accounts directly;
// - authenticate users;
// - modify Authentication directly;
// - revoke Sessions directly;
// - send notifications;
// - access Prisma;
// - perform external side effects.
//
// Password reset, account restoration, authentication changes, session
// revocation, notification delivery, and other cross-aggregate workflows
// belong to the appropriate application/infrastructure boundaries.
//
// -----------------------------------------------------------------------------
//
// Completion flow:
//
//     Application Workflow
//            │
//            │ CompleteRecoveryCommand
//            ▼
//     CompleteRecoveryHandler
//            │
//            ├── validate command
//            │
//            ├── repository.findByPublicId()
//            │
//            ├── RecoveryAggregate.complete()
//            │        │
//            │        └── RecoveryEntity.complete()
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
// RecoveryCompletedEvent is recorded by RecoveryAggregate.complete().
//
// The handler does not construct the domain event directly.
//
// -----------------------------------------------------------------------------
//
// Error rule:
//
// A missing Recovery is an application-level lookup failure.
//
// Lifecycle failures are delegated to the Recovery aggregate/entity.
//
// The handler does not duplicate Recovery lifecycle rules.
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

import type { CompleteRecoveryCommand } from '../commands/complete-recovery.command';

// -----------------------------------------------------------------------------
// Domain Aggregate
// -----------------------------------------------------------------------------

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
 * Completes an existing Recovery aggregate.
 *
 * The handler coordinates the application workflow.
 *
 * It does not implement Recovery lifecycle rules itself. Those rules remain
 * inside RecoveryEntity and RecoveryAggregate.
 *
 * RecoveryRepository owns persistence.
 */
@Injectable()
export class CompleteRecoveryHandler implements CommandHandler<CompleteRecoveryCommand> {
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
   * Executes the CompleteRecoveryCommand.
   *
   * Application flow:
   *
   * 1. Validate the command.
   * 2. Load the Recovery aggregate.
   * 3. Ensure the Recovery exists.
   * 4. Delegate completion to the aggregate.
   * 5. Persist the updated aggregate.
   *
   * RecoveryAggregate.complete() is responsible for:
   *
   * - enforcing completion eligibility;
   * - transitioning the Recovery lifecycle;
   * - recording RecoveryCompletedEvent.
   */
  public async execute(command: CompleteRecoveryCommand): Promise<void> {
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
    //
    // The repository returns the complete aggregate rather than exposing the
    // RecoveryEntity as the application persistence contract.
    //
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
    // 5. Complete Recovery
    // -------------------------------------------------------------------------
    //
    // Lifecycle rules remain inside the aggregate/entity.
    //
    // RecoveryAggregate.complete() will:
    //
    // - validate the correlation ID;
    // - delegate the lifecycle transition to RecoveryEntity;
    // - determine whether the transition actually occurred;
    // - record RecoveryCompletedEvent when appropriate.
    //
    // -------------------------------------------------------------------------

    recovery.complete(
      command.completedAt,
      command.correlationId,
      command.causationId,
    );

    // -------------------------------------------------------------------------
    // 6. Persist aggregate
    // -------------------------------------------------------------------------
    //
    // Domain events remain attached to the aggregate until the persistence /
    // application event pipeline processes them according to the project's
    // Unit of Work / event-dispatching strategy.
    //
    // -------------------------------------------------------------------------

    await this.recoveryRepository.save(recovery);
  }

  // ===========================================================================
  // Command Validation
  // ===========================================================================

  /**
   * Ensures that a command was supplied.
   *
   * The command is strongly typed at compile time, but the application
   * boundary may still receive an invalid runtime value.
   */
  private ensureCommand(command: CompleteRecoveryCommand): void {
    if (command === undefined || command === null) {
      throw new RecoveryException('Complete Recovery command is required.');
    }
  }

  /**
   * Validates required command properties.
   *
   * Structural validation belongs at the application boundary.
   *
   * Recovery lifecycle semantics remain inside the domain.
   */
  private ensureRequiredCommandFields(command: CompleteRecoveryCommand): void {
    // -------------------------------------------------------------------------
    // Recovery public ID
    // -------------------------------------------------------------------------

    if (command.recoveryPublicId === undefined) {
      throw new RecoveryException('Recovery public ID is required.');
    }

    // -------------------------------------------------------------------------
    // Completion timestamp
    // -------------------------------------------------------------------------
    //
    // completedAt is already a RecoveryCompletedAt value object.
    //
    // Its domain factory is responsible for validating the underlying
    // timestamp. The handler must not reinterpret that value.
    //
    // -------------------------------------------------------------------------

    if (command.completedAt === undefined) {
      throw new RecoveryException('Recovery completion timestamp is required.');
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

export default CompleteRecoveryHandler;
