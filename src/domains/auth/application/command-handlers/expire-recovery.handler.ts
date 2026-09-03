// -----------------------------------------------------------------------------
// Recovery — Expire Command Handler
// -----------------------------------------------------------------------------
//
// Application handler responsible for expiring a Recovery aggregate.
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
// - validate required command input;
// - load the Recovery aggregate;
// - invoke RecoveryAggregate.expire();
// - persist the aggregate.
//
// -----------------------------------------------------------------------------
//
// Domain responsibilities:
//
// RecoveryEntity:
//
// - determines whether the Recovery has expired;
// - enforces Recovery lifecycle invariants;
// - performs the PENDING → EXPIRED transition.
//
// RecoveryAggregate:
//
// - owns the aggregate boundary;
// - coordinates the expiration operation;
// - records RecoveryExpiredEvent;
// - preserves correlation/causation metadata.
//
// RecoveryRepository:
//
// - retrieves the Recovery aggregate;
// - persists the complete Recovery aggregate.
//
// -----------------------------------------------------------------------------
//
// This handler does NOT:
//
// - determine whether the Recovery has expired;
// - calculate the expiry timestamp;
// - modify Recovery status directly;
// - generate recovery tokens;
// - hash recovery tokens;
// - compare raw recovery tokens;
// - reset passwords;
// - authenticate users;
// - validate Identity domain state;
// - modify Identity;
// - modify Authentication;
// - revoke Sessions;
// - send notifications;
// - access Prisma;
// - construct RecoveryExpiredEvent;
// - perform external side effects.
//
// -----------------------------------------------------------------------------
//
// Expiration flow:
//
//     ExpireRecoveryCommand
//            │
//            ▼
//     ExpireRecoveryHandler
//            │
//            ├── validate command
//            │
//            ├── findByPublicId()
//            │
//            ├── aggregate.expire()
//            │       │
//            │       ├── entity evaluates expiration
//            │       ├── entity transitions PENDING → EXPIRED
//            │       └── aggregate records RecoveryExpiredEvent
//            │
//            └── repository.save()
//                    │
//                    ▼
//              Recovery persisted
//
// -----------------------------------------------------------------------------
//
// Reference date:
//
// The command supplies referenceDate explicitly.
//
// This keeps expiration deterministic and allows the application to control
// the point in time against which expiration is evaluated.
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

import type { ExpireRecoveryCommand } from '../commands/expire-recovery.command';

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
 * Expires a Recovery aggregate when the domain determines that expiration
 * is applicable.
 *
 * The handler coordinates the application workflow only.
 *
 * RecoveryEntity owns expiration rules and lifecycle invariants.
 *
 * RecoveryAggregate owns aggregate-level coordination and domain-event
 * recording.
 *
 * RecoveryRepository owns persistence.
 */
@Injectable()
export class ExpireRecoveryHandler implements CommandHandler<ExpireRecoveryCommand> {
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
   * Executes the ExpireRecoveryCommand.
   *
   * Application flow:
   *
   * 1. Validate the command.
   * 2. Load the Recovery aggregate.
   * 3. Delegate expiration to the aggregate.
   * 4. Persist the aggregate.
   *
   * The aggregate determines whether an actual lifecycle transition occurs.
   */
  public async execute(command: ExpireRecoveryCommand): Promise<void> {
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
    // The application identifies the aggregate using its public identity.
    //
    // The repository translates that public identity into the persistence
    // representation and returns the complete RecoveryAggregate.
    // -------------------------------------------------------------------------

    const aggregate = await this.recoveryRepository.findByPublicId(
      command.recoveryPublicId,
    );

    if (aggregate === null) {
      throw new RecoveryException('Recovery was not found.');
    }

    // -------------------------------------------------------------------------
    // 4. Expire Recovery
    // -------------------------------------------------------------------------
    //
    // IMPORTANT:
    //
    // RecoveryAggregate.expire() is defined as:
    //
    //     expire(
    //       correlationId,
    //       causationId?,
    //       referenceDate,
    //     )
    //
    // Therefore the command values must be supplied in that exact order.
    //
    // The aggregate:
    //
    // - delegates expiration evaluation to RecoveryEntity;
    // - allows the entity to enforce lifecycle rules;
    // - detects the PENDING → EXPIRED transition;
    // - records RecoveryExpiredEvent when the transition occurs.
    //
    // The handler does not modify status directly.
    // -------------------------------------------------------------------------

    aggregate.expire(
      command.correlationId,
      command.causationId,
      command.referenceDate,
    );

    // -------------------------------------------------------------------------
    // 5. Persist aggregate
    // -------------------------------------------------------------------------
    //
    // The repository persists the complete Recovery aggregate.
    //
    // Domain-event dispatching remains the responsibility of the configured
    // persistence/unit-of-work/event infrastructure.
    // -------------------------------------------------------------------------

    await this.recoveryRepository.save(aggregate);
  }

  // ===========================================================================
  // Command Validation
  // ===========================================================================

  /**
   * Ensures that a command was supplied.
   *
   * This protects the runtime application boundary even though the command is
   * strongly typed at compile time.
   */
  private ensureCommand(command: ExpireRecoveryCommand): void {
    if (command === undefined || command === null) {
      throw new RecoveryException('Expire Recovery command is required.');
    }
  }

  /**
   * Validates required command properties.
   *
   * Structural validation belongs at the application boundary.
   *
   * Recovery lifecycle semantics remain inside the domain.
   */
  private ensureRequiredCommandFields(command: ExpireRecoveryCommand): void {
    // -------------------------------------------------------------------------
    // Recovery public ID
    // -------------------------------------------------------------------------

    if (command.recoveryPublicId === undefined) {
      throw new RecoveryException('Recovery public ID is required.');
    }

    // -------------------------------------------------------------------------
    // Reference date
    // -------------------------------------------------------------------------
    //
    // The reference date is a domain operation input and must be a valid Date.
    //
    // Do not convert it to a string.
    // -------------------------------------------------------------------------

    if (
      !(command.referenceDate instanceof Date) ||
      !Number.isFinite(command.referenceDate.getTime())
    ) {
      throw new RecoveryException(
        'Recovery expiration reference date must be valid.',
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

export default ExpireRecoveryHandler;
