// -----------------------------------------------------------------------------
// Authentication — Create OTP Challenge Command Handler
// -----------------------------------------------------------------------------
//
// Application handler responsible for creating and persisting an
// OtpChallenge aggregate.
//
// Aggregate boundary:
//
//     OtpChallengeAggregate
//     └── OtpChallengeEntity
//
// -----------------------------------------------------------------------------
//
// CreateOtpChallengeCommand carries domain-ready value objects:
//
//     OtpChallengeIdentityPublicId
//     OtpChallengePurpose
//     OtpChallengeDestination
//     OtpChallengeMaxAttempts
//     OtpChallengeExpiresAt
//
// Therefore this handler MUST NOT:
//
//     command.identityPublicId.trim()
//     command.destination.trim()
//     command.maxAttempts < 1
//     command.expiresAt instanceof Date
//
// Those invariants belong to the corresponding value objects.
//
// -----------------------------------------------------------------------------
//
// Security boundary:
//
//     CreateOtpChallengeHandler
//              │
//              ▼
//          OtpService
//              │
//              ├── raw OTP
//              └── OTP hash
//                       │
//                       ▼
//              OtpChallengeHash
//                       │
//                       ▼
//               OtpChallengeEntity
//
// The raw OTP never enters the domain model.
//
// -----------------------------------------------------------------------------
//
// The handler does NOT:
//
// - construct entities with `new`;
// - construct aggregates with `new`;
// - implement OTP lifecycle rules;
// - verify OTPs;
// - compare OTPs;
// - validate Identity domain state;
// - access Prisma;
// - persist entities directly;
// - persist raw OTPs;
// - log raw OTPs;
// - place OTPs in domain events;
// - place OTP hashes in domain events;
// - send notifications directly;
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

import type { CreateOtpChallengeCommand } from '../commands/create-otp-challenge.command';

// -----------------------------------------------------------------------------
// Domain — Aggregate
// -----------------------------------------------------------------------------

import { OtpChallengeAggregate } from '../../domain/aggregates/otp-challenge.aggregate';

// -----------------------------------------------------------------------------
// Domain — Entity
// -----------------------------------------------------------------------------

import { OtpChallengeEntity } from '../../domain/entities/otp-challenge.entity';

// -----------------------------------------------------------------------------
// Domain — Repository
// -----------------------------------------------------------------------------

import type { OtpChallengeRepository } from '../../domain/repositories/otp-challenge.repository';

// -----------------------------------------------------------------------------
// Domain — Exception
// -----------------------------------------------------------------------------

import { OtpChallengeException } from '../../domain/exceptions/otp-challenge.exception';

// -----------------------------------------------------------------------------
// Domain — Value Objects
// -----------------------------------------------------------------------------

import { OtpChallengeHash } from '../../domain/value-objects';

// -----------------------------------------------------------------------------
// Foundation — Security
// -----------------------------------------------------------------------------

import type { OtpService } from '../../../../foundation/security/otp-service.interface';

// =============================================================================
// Result
// =============================================================================

/**
 * Result returned after successful OTP Challenge creation.
 *
 * The raw OTP exists only at the application boundary.
 *
 * It MUST NOT be:
 *
 * - persisted;
 * - logged;
 * - included in domain events;
 * - stored inside OtpChallengeEntity;
 * - stored inside OtpChallengeAggregate.
 */
export interface CreateOtpChallengeResult {
  /**
   * Public identity of the created OTP Challenge.
   */
  readonly otpChallengePublicId: string;

  /**
   * Raw OTP generated for immediate delivery.
   *
   * This value must be handled as sensitive credential material.
   */
  readonly otp: string;
}

// =============================================================================
// Handler
// =============================================================================

/**
 * Creates and persists an OtpChallenge aggregate.
 */
@Injectable()
export class CreateOtpChallengeHandler implements CommandHandler<
  CreateOtpChallengeCommand,
  CreateOtpChallengeResult
> {
  // ===========================================================================
  // Security Policy
  // ===========================================================================

  /**
   * OTP length required by the Authentication workflow.
   */
  private static readonly OTP_LENGTH = 6;

  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    @Inject(AUTH_TOKENS.REPOSITORIES.OTP_CHALLENGE)
    private readonly otpChallengeRepository: OtpChallengeRepository,

    @Inject(AUTH_TOKENS.APPLICATION_SERVICES.OTP)
    private readonly otpService: OtpService,
  ) {}

  // ===========================================================================
  // Execute
  // ===========================================================================

  /**
   * Creates and persists a new OTP Challenge.
   *
   * The command already contains domain-ready value objects.
   */
  public async execute(
    command: CreateOtpChallengeCommand,
  ): Promise<CreateOtpChallengeResult> {
    // -------------------------------------------------------------------------
    // 1. Validate command structure
    // -------------------------------------------------------------------------

    this.ensureCommand(command);

    // -------------------------------------------------------------------------
    // 2. Generate OTP
    // -------------------------------------------------------------------------
    //
    // OtpService owns cryptographically secure generation and hashing.
    //
    // The raw OTP exists only in this application workflow.
    // -------------------------------------------------------------------------

    const generated = await this.otpService.generate(
      CreateOtpChallengeHandler.OTP_LENGTH,
    );

    this.ensureGeneratedOtp(generated.otp);
    this.ensureGeneratedOtpHash(generated.hash);

    // -------------------------------------------------------------------------
    // 3. Create OTP hash value object
    // -------------------------------------------------------------------------
    //
    // Only the persistence-safe hash crosses into the domain.
    // -------------------------------------------------------------------------

    const otpHash = OtpChallengeHash.create(generated.hash);

    // -------------------------------------------------------------------------
    // 4. Create entity through domain factory
    // -------------------------------------------------------------------------
    //
    // Command properties are already domain-ready value objects.
    //
    // No:
    //
    // - trim();
    // - Date conversion;
    // - Number conversion;
    // - parsing;
    // - value-object recreation.
    // -------------------------------------------------------------------------

    const entity = OtpChallengeEntity.create(
      command.identityPublicId,
      command.purpose,
      command.destination,
      otpHash,
      command.expiresAt,
      {
        maxAttempts: command.maxAttempts,
      },
    );

    // -------------------------------------------------------------------------
    // 5. Create aggregate
    // -------------------------------------------------------------------------

    const aggregate = OtpChallengeAggregate.create(entity);

    // -------------------------------------------------------------------------
    // 6. Record creation event
    // -------------------------------------------------------------------------

    aggregate.recordCreated(command.correlationId, command.causationId);

    // -------------------------------------------------------------------------
    // 7. Persist aggregate
    // -------------------------------------------------------------------------

    await this.otpChallengeRepository.save(aggregate);

    // -------------------------------------------------------------------------
    // 8. Return application result
    // -------------------------------------------------------------------------
    //
    // The raw OTP remains outside the domain and persistence model.
    //
    // The caller is responsible for immediate delivery.
    // -------------------------------------------------------------------------

    return {
      otpChallengePublicId: aggregate.publicId.value,
      otp: generated.otp,
    };
  }

  // ===========================================================================
  // Command Validation
  // ===========================================================================

  /**
   * Performs only structural command validation.
   *
   * Domain value objects own their own primitive invariants.
   */
  private ensureCommand(command: CreateOtpChallengeCommand): void {
    if (command === undefined || command === null) {
      throw new OtpChallengeException(
        'Create OTP Challenge command is required.',
      );
    }

    // -------------------------------------------------------------------------
    // Identity public ID
    // -------------------------------------------------------------------------

    if (
      command.identityPublicId === undefined ||
      command.identityPublicId === null
    ) {
      throw new OtpChallengeException(
        'OTP Challenge identity public ID is required.',
      );
    }

    // -------------------------------------------------------------------------
    // Purpose
    // -------------------------------------------------------------------------

    if (command.purpose === undefined || command.purpose === null) {
      throw new OtpChallengeException('OTP Challenge purpose is required.');
    }

    // -------------------------------------------------------------------------
    // Destination
    // -------------------------------------------------------------------------

    if (command.destination === undefined || command.destination === null) {
      throw new OtpChallengeException('OTP Challenge destination is required.');
    }

    // -------------------------------------------------------------------------
    // Maximum attempts
    // -------------------------------------------------------------------------

    if (command.maxAttempts === undefined || command.maxAttempts === null) {
      throw new OtpChallengeException(
        'OTP Challenge maximum attempts is required.',
      );
    }

    // -------------------------------------------------------------------------
    // Expiration
    // -------------------------------------------------------------------------

    if (command.expiresAt === undefined || command.expiresAt === null) {
      throw new OtpChallengeException(
        'OTP Challenge expiration timestamp is required.',
      );
    }

    // -------------------------------------------------------------------------
    // Correlation ID
    // -------------------------------------------------------------------------

    if (
      typeof command.correlationId !== 'string' ||
      command.correlationId.length === 0
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
        command.causationId.length === 0)
    ) {
      throw new OtpChallengeException(
        'OTP Challenge causation ID must be a non-empty string when provided.',
      );
    }
  }

  // ===========================================================================
  // Generated OTP Validation
  // ===========================================================================

  /**
   * Ensures that security infrastructure returned the expected OTP format.
   */
  private ensureGeneratedOtp(otp: unknown): asserts otp is string {
    if (typeof otp !== 'string' || !/^\d{6}$/.test(otp)) {
      throw new OtpChallengeException(
        'Security infrastructure returned an invalid OTP.',
      );
    }
  }

  // ===========================================================================
  // Generated OTP Hash Validation
  // ===========================================================================

  /**
   * Ensures that security infrastructure returned a usable hash.
   */
  private ensureGeneratedOtpHash(hash: unknown): asserts hash is string {
    if (typeof hash !== 'string' || hash.length === 0) {
      throw new OtpChallengeException(
        'Security infrastructure returned an invalid OTP hash.',
      );
    }
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default CreateOtpChallengeHandler;
