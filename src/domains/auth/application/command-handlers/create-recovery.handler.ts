// -----------------------------------------------------------------------------
// Recovery — Create Command Handler
// -----------------------------------------------------------------------------
//
// Application handler responsible for creating a new Recovery aggregate.
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
// - request generation of a cryptographically secure recovery token;
// - receive the raw token and persistence-safe hash from RecoveryTokenService;
// - create RecoveryTokenHash;
// - establish the recovery request timestamp;
// - create the RecoveryEntity;
// - create the RecoveryAggregate;
// - record RecoveryCreatedEvent through the aggregate;
// - persist the Recovery aggregate;
// - return the raw recovery token to the calling application workflow.
//
// -----------------------------------------------------------------------------
//
// IMPORTANT:
//
// CreateRecoveryCommand already contains domain value objects:
//
//     RecoveryIdentityPublicId
//     RecoveryType
//     RecoveryExpiresAt
//
// Therefore this handler MUST NOT:
//
//     command.identityPublicId.trim()
//     command.identityPublicId.length
//     command.expiresAt instanceof Date
//     command.expiresAt.getTime()
//
// Primitive validation belongs to the value-object factories.
//
// The application handler only validates structural presence.
//
// -----------------------------------------------------------------------------
//
// Security boundary:
//
//     CreateRecoveryHandler
//             │
//             ▼
//     RecoveryTokenService
//             │
//             ├── raw token
//             └── persistence hash
//             │
//             ▼
//       RecoveryTokenHash
//             │
//             ▼
//       RecoveryEntity
//             │
//             ▼
//       RecoveryAggregate
//
// The raw recovery token MUST NEVER:
//
// - enter RecoveryEntity;
// - enter RecoveryAggregate;
// - enter RecoveryTokenHash;
// - enter a domain event;
// - be persisted;
// - be logged.
//
// The raw token is returned only as an application result for immediate
// delivery by the calling application workflow.
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

import type { CreateRecoveryCommand } from '../commands/create-recovery.command';

// -----------------------------------------------------------------------------
// Domain Aggregate
// -----------------------------------------------------------------------------

import { RecoveryAggregate } from '../../domain/aggregates/recovery.aggregate';

// -----------------------------------------------------------------------------
// Domain Entity
// -----------------------------------------------------------------------------

import { RecoveryEntity } from '../../domain/entities/recovery.entity';

// -----------------------------------------------------------------------------
// Domain Repository
// -----------------------------------------------------------------------------

import type { RecoveryRepository } from '../../domain/repositories/recovery.repository';

// -----------------------------------------------------------------------------
// Domain Exception
// -----------------------------------------------------------------------------

import { RecoveryException } from '../../domain/exceptions/recovery.exception';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import {
  RecoveryRequestedAt,
  RecoveryTokenHash,
} from '../../domain/value-objects';

// -----------------------------------------------------------------------------
// Security
// -----------------------------------------------------------------------------

import type { RecoveryTokenService } from '../../../../foundation/security/recovery-token-service.interface';

// =============================================================================
// Result
// =============================================================================

/**
 * Application result returned after a Recovery has been successfully created.
 *
 * The raw recovery token exists only at the application boundary.
 *
 * It MUST NOT be persisted, logged, published through domain events, or
 * introduced into the Recovery aggregate.
 */
export interface CreateRecoveryResult {
  /**
   * Public identity of the newly-created Recovery.
   */
  readonly recoveryPublicId: string;

  /**
   * Raw recovery token.
   *
   * Sensitive credential material.
   *
   * The caller must use this only for immediate delivery.
   */
  readonly recoveryToken: string;
}

// =============================================================================
// Handler
// =============================================================================

/**
 * Creates and persists a new Recovery aggregate.
 *
 * Application flow:
 *
 *     CreateRecoveryCommand
 *              │
 *              ▼
 *       structural validation
 *              │
 *              ▼
 *     RecoveryTokenService.generate()
 *              │
 *              ├── raw token
 *              └── token hash
 *              │
 *              ▼
 *       RecoveryTokenHash
 *              │
 *              ▼
 *       RecoveryEntity.create()
 *              │
 *              ▼
 *       RecoveryAggregate.create()
 *              │
 *              ▼
 *       aggregate.recordCreated()
 *              │
 *              ▼
 *       repository.save()
 *              │
 *              ▼
 *       application result
 */
@Injectable()
export class CreateRecoveryHandler implements CommandHandler<
  CreateRecoveryCommand,
  CreateRecoveryResult
> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    @Inject(AUTH_TOKENS.REPOSITORIES.RECOVERY)
    private readonly recoveryRepository: RecoveryRepository,

    @Inject(AUTH_TOKENS.APPLICATION_SERVICES.RECOVERY_TOKEN)
    private readonly recoveryTokenService: RecoveryTokenService,
  ) {}

  // ===========================================================================
  // Execute
  // ===========================================================================

  /**
   * Executes the CreateRecoveryCommand.
   *
   * The raw recovery token exists only transiently between generation and
   * persistence of its corresponding hash.
   */
  public async execute(
    command: CreateRecoveryCommand,
  ): Promise<CreateRecoveryResult> {
    // -------------------------------------------------------------------------
    // 1. Command validation
    // -------------------------------------------------------------------------

    this.ensureCommand(command);
    this.ensureRequiredCommandFields(command);

    // -------------------------------------------------------------------------
    // 2. Generate recovery token and persistence-safe hash
    // -------------------------------------------------------------------------
    //
    // RecoveryTokenService owns the complete token-security workflow:
    //
    //     secure random generation
    //              ↓
    //           hashing
    //              ↓
    //       persistence-safe hash
    //
    // The handler does not perform token generation or hashing itself.
    // -------------------------------------------------------------------------

    const generated = this.recoveryTokenService.generate();

    this.ensureGeneratedRecoveryToken(generated.token);
    this.ensureGeneratedRecoveryTokenHash(generated.hash);

    // -------------------------------------------------------------------------
    // 3. Create RecoveryTokenHash value object
    // -------------------------------------------------------------------------
    //
    // Only the persistence-safe hash enters the domain.
    // -------------------------------------------------------------------------

    const recoveryTokenHash = RecoveryTokenHash.create(generated.hash);

    // -------------------------------------------------------------------------
    // 4. Establish request timestamp
    // -------------------------------------------------------------------------
    //
    // The command intentionally does not provide requestedAt.
    //
    // The application establishes the moment at which the recovery request
    // was accepted.
    // -------------------------------------------------------------------------

    const requestedAt = RecoveryRequestedAt.create(new Date());

    // -------------------------------------------------------------------------
    // 5. Create Recovery entity
    // -------------------------------------------------------------------------
    //
    // All command domain inputs are already value objects.
    //
    // No primitive extraction or validation is performed here.
    // -------------------------------------------------------------------------

    const recovery = RecoveryEntity.create(
      command.identityPublicId,
      command.type,
      requestedAt,
      command.expiresAt,
      {
        recoveryTokenHash,
      },
    );

    // -------------------------------------------------------------------------
    // 6. Create Recovery aggregate
    // -------------------------------------------------------------------------

    const aggregate = RecoveryAggregate.create(recovery);

    // -------------------------------------------------------------------------
    // 7. Record creation event
    // -------------------------------------------------------------------------
    //
    // The aggregate owns construction of the domain event.
    //
    // No token material is supplied.
    // -------------------------------------------------------------------------

    aggregate.recordCreated(command.correlationId, command.causationId);

    // -------------------------------------------------------------------------
    // 8. Persist aggregate
    // -------------------------------------------------------------------------

    await this.recoveryRepository.save(aggregate);

    // -------------------------------------------------------------------------
    // 9. Return application result
    // -------------------------------------------------------------------------
    //
    // The raw token remains outside the domain and persistence model.
    //
    // The calling application workflow is responsible for immediate delivery.
    // -------------------------------------------------------------------------

    return {
      recoveryPublicId: aggregate.publicId.value,
      recoveryToken: generated.token,
    };
  }

  // ===========================================================================
  // Command Validation
  // ===========================================================================

  /**
   * Ensures that a command was supplied.
   *
   * This guard protects the application boundary from invalid runtime input.
   */
  private ensureCommand(command: CreateRecoveryCommand): void {
    if (command === undefined || command === null) {
      throw new RecoveryException('Create Recovery command is required.');
    }
  }

  /**
   * Validates structural command requirements.
   *
   * IMPORTANT:
   *
   * The following fields are domain value objects:
   *
   *     identityPublicId
   *     type
   *     expiresAt
   *
   * Their internal primitive values must not be inspected here.
   *
   * Value-object factories are responsible for primitive validation.
   */
  private ensureRequiredCommandFields(command: CreateRecoveryCommand): void {
    // -------------------------------------------------------------------------
    // Identity public ID
    // -------------------------------------------------------------------------

    if (
      command.identityPublicId === undefined ||
      command.identityPublicId === null
    ) {
      throw new RecoveryException('Recovery Identity public ID is required.');
    }

    // -------------------------------------------------------------------------
    // Recovery type
    // -------------------------------------------------------------------------

    if (command.type === undefined || command.type === null) {
      throw new RecoveryException('Recovery type is required.');
    }

    // -------------------------------------------------------------------------
    // Recovery expiration
    // -------------------------------------------------------------------------

    if (command.expiresAt === undefined || command.expiresAt === null) {
      throw new RecoveryException('Recovery expiry timestamp is required.');
    }

    // -------------------------------------------------------------------------
    // Correlation ID
    // -------------------------------------------------------------------------
    //
    // Correlation ID is a primitive application metadata field.
    //
    // Use a regular-expression test rather than calling `.trim()` so that
    // runtime validation does not introduce an unsafe method call.
    // -------------------------------------------------------------------------

    if (
      typeof command.correlationId !== 'string' ||
      !/\S/.test(command.correlationId)
    ) {
      throw new RecoveryException('Recovery correlation ID is required.');
    }

    // -------------------------------------------------------------------------
    // Causation ID
    // -------------------------------------------------------------------------

    if (
      command.causationId !== undefined &&
      (typeof command.causationId !== 'string' ||
        !/\S/.test(command.causationId))
    ) {
      throw new RecoveryException(
        'Recovery causation ID must be a non-empty string when provided.',
      );
    }
  }

  // ===========================================================================
  // Recovery Token Validation
  // ===========================================================================

  /**
   * Ensures that security infrastructure returned a usable raw token.
   *
   * The token is deliberately not normalized.
   */
  private ensureGeneratedRecoveryToken(
    recoveryToken: unknown,
  ): asserts recoveryToken is string {
    if (typeof recoveryToken !== 'string' || recoveryToken.length === 0) {
      throw new RecoveryException(
        'Security infrastructure returned an invalid recovery token.',
      );
    }
  }

  /**
   * Ensures that security infrastructure returned a usable persistence hash.
   *
   * The hash is deliberately not normalized.
   */
  private ensureGeneratedRecoveryTokenHash(
    recoveryTokenHash: unknown,
  ): asserts recoveryTokenHash is string {
    if (
      typeof recoveryTokenHash !== 'string' ||
      recoveryTokenHash.length === 0
    ) {
      throw new RecoveryException(
        'Security infrastructure returned an invalid recovery token hash.',
      );
    }
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default CreateRecoveryHandler;
