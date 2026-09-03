// -----------------------------------------------------------------------------
// Session — Create Command Handler
// -----------------------------------------------------------------------------
//
// Application handler responsible for creating and persisting a new
// Session aggregate.
//
// Aggregate:
//
// SessionAggregate
// └── SessionEntity
//
// -----------------------------------------------------------------------------
//
// Purpose
// -----------------------------------------------------------------------------
//
// This handler translates the application-level:
//
//     CreateSessionCommand
//
// into a persisted:
//
//     SessionAggregate
//
// The handler is deliberately small. It coordinates the Session creation
// workflow but does not own Session business rules.
//
// -----------------------------------------------------------------------------
//
// Application responsibilities
// -----------------------------------------------------------------------------
//
// The handler:
//
// - validates the command structurally;
// - creates SessionEntity through SessionEntity.create();
// - creates SessionAggregate through SessionAggregate.create();
// - records SessionCreatedEvent through the aggregate;
// - persists the aggregate through SessionRepository;
// - returns the created SessionAggregate.
//
// -----------------------------------------------------------------------------
//
// Domain responsibilities
// -----------------------------------------------------------------------------
//
// SessionEntity owns:
//
// - Session identity;
// - Session public identity;
// - initial ACTIVE status;
// - refresh-token hash state;
// - token-family membership;
// - replacement lineage;
// - revocation state;
// - Session timestamps;
// - Session chronology invariants.
//
// SessionAggregate owns:
//
// - aggregate boundary;
// - aggregate consistency;
// - lifecycle coordination;
// - domain-event creation.
//
// -----------------------------------------------------------------------------
//
// Security boundary
// -----------------------------------------------------------------------------
//
// Raw refresh-token generation and hashing occur BEFORE this handler is
// invoked.
//
// Expected flow:
//
//     TokenService
//          │
//          │ generateRefreshToken()
//          ▼
//     rawRefreshToken
//          │
//          │ hash
//          ▼
//     SessionRefreshTokenHash
//          │
//          ▼
//     CreateSessionCommand
//          │
//          ▼
//     CreateSessionHandler
//          │
//          ▼
//     SessionAggregate
//
// The raw refresh token MUST NOT enter:
//
// - this handler;
// - CreateSessionCommand;
// - SessionEntity;
// - SessionAggregate;
// - SessionCreatedEvent;
// - SessionRepository.
//
// The handler receives only the persisted refresh-token hash.
//
// -----------------------------------------------------------------------------
//
// Token-family boundary
// -----------------------------------------------------------------------------
//
// The token-family public identifier is supplied by the surrounding
// authentication/application workflow.
//
// This handler does not:
//
// - generate token families;
// - rotate token families;
// - detect token reuse;
// - revoke token families;
// - calculate token-family policy.
//
// -----------------------------------------------------------------------------
//
// Cross-aggregate references
// -----------------------------------------------------------------------------
//
// Identity and Device remain separate aggregate boundaries.
//
// This handler receives opaque public references:
//
//     SessionIdentityPublicId
//     SessionDevicePublicId
//
// It does not load, validate, or mutate the referenced Identity or Device.
//
// Any required cross-aggregate validation belongs to the surrounding
// application workflow.
//
// -----------------------------------------------------------------------------
//
// This handler does NOT
// -----------------------------------------------------------------------------
//
// This handler does NOT:
//
// - authenticate users;
// - verify passwords;
// - generate raw refresh tokens;
// - hash refresh tokens;
// - compare refresh tokens;
// - generate access tokens;
// - sign JWTs;
// - verify JWTs;
// - validate Identity state;
// - validate Device state;
// - create Devices;
// - activate Devices;
// - revoke Sessions;
// - rotate Sessions;
// - detect refresh-token reuse;
// - revoke token families;
// - perform authorization;
// - access Prisma;
// - access persistence models directly;
// - construct domain events directly;
// - send notifications;
// - communicate with external systems.
//
// -----------------------------------------------------------------------------
//
// Creation flow
// -----------------------------------------------------------------------------
//
//     AuthenticateHandler
//            │
//            ├── authenticate Identity
//            │
//            ├── verify password
//            │
//            ├── record successful Authentication
//            │
//            ├── generate refresh token
//            │
//            ├── hash refresh token
//            │
//            ├── establish token family
//            │
//            └── establish Session timestamps/context
//                       │
//                       ▼
//              CreateSessionCommand
//                       │
//                       ▼
//              CreateSessionHandler
//                       │
//                       ▼
//              SessionEntity.create()
//                       │
//                       ▼
//              SessionAggregate.create()
//                       │
//                       ▼
//              aggregate.recordCreated()
//                       │
//                       ▼
//              SessionRepository.save()
//                       │
//                       ▼
//              SessionAggregate
//
// -----------------------------------------------------------------------------
//
// Return value
// -----------------------------------------------------------------------------
//
// The handler returns the newly-created SessionAggregate.
//
// This is important because the surrounding authentication workflow may need
// the created Session immediately after successful authentication.
//
// For example:
//
//     const session = await createSessionHandler.execute(command);
//
// The caller can then map the Session aggregate into a SessionResponse without
// exposing persistence identifiers or refresh-token hashes.
//
// -----------------------------------------------------------------------------
//
// Event boundary
// -----------------------------------------------------------------------------
//
// SessionCreatedEvent is created by SessionAggregate.recordCreated().
//
// This handler does not construct the event directly.
//
// The event intentionally does not contain:
//
// - raw refresh token;
// - refresh-token hash;
// - token-family secret;
// - password;
// - authentication credentials.
//
// Domain-event publication remains outside the repository/handler boundary
// according to the application's event-dispatch strategy.
//
// -----------------------------------------------------------------------------
//
// Persistence boundary
// -----------------------------------------------------------------------------
//
// SessionRepository is the persistence abstraction.
//
// The handler never accesses Prisma directly.
//
// The repository is responsible for translating:
//
//     SessionAggregate
//
// into the persistence representation.
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

import type { CreateSessionCommand } from '../commands/create-session.command';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import { SessionAggregate } from '../../domain/aggregates/session.aggregate';

// -----------------------------------------------------------------------------
// Entity
// -----------------------------------------------------------------------------

import { SessionEntity } from '../../domain/entities/session.entity';

// -----------------------------------------------------------------------------
// Repository
// -----------------------------------------------------------------------------

import type { SessionRepository } from '../../domain/repositories/session.repository';

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { SessionException } from '../../domain/exceptions/session.exception';

// =============================================================================
// Handler
// =============================================================================

/**
 * Creates and persists a new Session aggregate.
 *
 * The handler coordinates application-level Session creation while keeping
 * Session business rules inside the Session domain.
 */
@Injectable()
export class CreateSessionHandler implements CommandHandler<
  CreateSessionCommand,
  SessionAggregate
> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    @Inject(AUTH_TOKENS.REPOSITORIES.SESSION)
    private readonly sessionRepository: SessionRepository,
  ) {}

  // ===========================================================================
  // Execute
  // ===========================================================================

  /**
   * Executes the CreateSessionCommand.
   *
   * The command contains only domain-ready Session values.
   *
   * In particular, it contains a SessionRefreshTokenHash rather than a raw
   * refresh token.
   *
   * @returns The newly-created and persisted SessionAggregate.
   */
  public async execute(
    command: CreateSessionCommand,
  ): Promise<SessionAggregate> {
    // -------------------------------------------------------------------------
    // 1. Validate command
    // -------------------------------------------------------------------------

    this.ensureRequiredCommandFields(command);

    // -------------------------------------------------------------------------
    // 2. Create Session Entity
    // -------------------------------------------------------------------------
    //
    // SessionEntity.create() owns:
    //
    // - internal Session identity;
    // - public Session identity;
    // - ACTIVE initial status;
    // - refresh-token hash;
    // - token-family membership;
    // - initial replacement state;
    // - initial revocation state;
    // - Session timestamps;
    // - Session chronology validation.
    //
    // Optional properties are conditionally added to the options object.
    //
    // This is intentional when exactOptionalPropertyTypes is enabled:
    //
    //     devicePublicId?: SessionDevicePublicId
    //
    // permits omission of the property, but does not necessarily permit:
    //
    //     devicePublicId: undefined
    // -------------------------------------------------------------------------

    const session = SessionEntity.create(
      command.identityPublicId,
      command.refreshTokenHash,
      command.tokenFamilyPublicId,
      command.authenticatedAt,
      command.lastActivityAt,
      command.expiresAt,
      {
        ...(command.devicePublicId !== undefined
          ? {
              devicePublicId: command.devicePublicId,
            }
          : {}),

        ...(command.ipAddress !== undefined
          ? {
              ipAddress: command.ipAddress,
            }
          : {}),

        ...(command.userAgent !== undefined
          ? {
              userAgent: command.userAgent,
            }
          : {}),

        ...(command.countryCode !== undefined
          ? {
              countryCode: command.countryCode,
            }
          : {}),

        ...(command.city !== undefined
          ? {
              city: command.city,
            }
          : {}),
      },
    );

    // -------------------------------------------------------------------------
    // 3. Create Session Aggregate
    // -------------------------------------------------------------------------
    //
    // SessionAggregate.create() establishes the aggregate boundary and
    // performs aggregate-level structural consistency validation.
    //
    // The handler deliberately does not instantiate the aggregate directly.
    // -------------------------------------------------------------------------

    const aggregate = SessionAggregate.create(session);

    // -------------------------------------------------------------------------
    // 4. Record Session Created Event
    // -------------------------------------------------------------------------
    //
    // SessionAggregate owns construction of SessionCreatedEvent.
    //
    // The aggregate event contains Session lifecycle information and operation
    // metadata, but does not expose security-sensitive token material.
    // -------------------------------------------------------------------------

    aggregate.recordCreated(command.correlationId, command.causationId);

    // -------------------------------------------------------------------------
    // 5. Persist Session Aggregate
    // -------------------------------------------------------------------------
    //
    // SessionAggregate is the unit of persistence.
    //
    // SessionRepository owns the persistence translation.
    //
    // The handler never accesses Prisma directly.
    // -------------------------------------------------------------------------

    await this.sessionRepository.save(aggregate);

    // -------------------------------------------------------------------------
    // 6. Return Created Aggregate
    // -------------------------------------------------------------------------
    //
    // Returning the aggregate allows the surrounding authentication workflow
    // to immediately obtain the newly-created Session state.
    //
    // The raw refresh token is still outside this aggregate and is therefore
    // not exposed by this return value.
    // -------------------------------------------------------------------------

    return aggregate;
  }

  // ===========================================================================
  // Command Validation
  // ===========================================================================

  /**
   * Performs structural validation of the CreateSessionCommand.
   *
   * This method does not duplicate Session business invariants. Those remain
   * owned by SessionEntity and SessionAggregate.
   */
  private ensureRequiredCommandFields(command: CreateSessionCommand): void {
    // -------------------------------------------------------------------------
    // Command
    // -------------------------------------------------------------------------

    if (command === undefined || command === null) {
      throw new SessionException('Create Session command is required.');
    }

    // -------------------------------------------------------------------------
    // Identity public ID
    // -------------------------------------------------------------------------

    if (command.identityPublicId === undefined) {
      throw new SessionException('Session Identity public ID is required.');
    }

    // -------------------------------------------------------------------------
    // Refresh-token hash
    // -------------------------------------------------------------------------

    if (command.refreshTokenHash === undefined) {
      throw new SessionException('Session refresh-token hash is required.');
    }

    // -------------------------------------------------------------------------
    // Token-family public ID
    // -------------------------------------------------------------------------

    if (command.tokenFamilyPublicId === undefined) {
      throw new SessionException('Session token-family public ID is required.');
    }

    // -------------------------------------------------------------------------
    // Authenticated timestamp
    // -------------------------------------------------------------------------

    if (command.authenticatedAt === undefined) {
      throw new SessionException(
        'Session authenticated-at timestamp is required.',
      );
    }

    this.ensureValidDate(
      command.authenticatedAt.value,
      'Session authenticated-at timestamp',
    );

    // -------------------------------------------------------------------------
    // Last activity timestamp
    // -------------------------------------------------------------------------

    if (command.lastActivityAt === undefined) {
      throw new SessionException(
        'Session last-activity timestamp is required.',
      );
    }

    this.ensureValidDate(
      command.lastActivityAt.value,
      'Session last-activity timestamp',
    );

    // -------------------------------------------------------------------------
    // Expiry timestamp
    // -------------------------------------------------------------------------

    if (command.expiresAt === undefined) {
      throw new SessionException('Session expiry timestamp is required.');
    }

    this.ensureValidDate(command.expiresAt.value, 'Session expiry timestamp');

    // -------------------------------------------------------------------------
    // Optional Device public ID
    // -------------------------------------------------------------------------

    if (command.devicePublicId !== undefined) {
      this.ensureNonEmptyValue(
        command.devicePublicId.value,
        'Session Device public ID',
      );
    }

    // -------------------------------------------------------------------------
    // Optional IP address
    // -------------------------------------------------------------------------

    if (command.ipAddress !== undefined) {
      this.ensureNonEmptyValue(command.ipAddress.value, 'Session IP address');
    }

    // -------------------------------------------------------------------------
    // Optional User-Agent
    // -------------------------------------------------------------------------

    if (command.userAgent !== undefined) {
      this.ensureNonEmptyValue(command.userAgent.value, 'Session user-agent');
    }

    // -------------------------------------------------------------------------
    // Optional Country Code
    // -------------------------------------------------------------------------

    if (command.countryCode !== undefined) {
      this.ensureNonEmptyValue(
        command.countryCode.value,
        'Session country code',
      );
    }

    // -------------------------------------------------------------------------
    // Optional City
    // -------------------------------------------------------------------------

    if (command.city !== undefined) {
      this.ensureNonEmptyValue(command.city.value, 'Session city');
    }

    // -------------------------------------------------------------------------
    // Correlation ID
    // -------------------------------------------------------------------------

    this.ensureNonEmptyValue(command.correlationId, 'Session correlation ID');

    // -------------------------------------------------------------------------
    // Causation ID
    // -------------------------------------------------------------------------

    if (command.causationId !== undefined) {
      this.ensureNonEmptyValue(command.causationId, 'Session causation ID');
    }
  }

  // ===========================================================================
  // Validation Helpers
  // ===========================================================================

  /**
   * Ensures a Date value is valid.
   */
  private ensureValidDate(value: Date, fieldName: string): void {
    if (!(value instanceof Date) || !Number.isFinite(value.getTime())) {
      throw new SessionException(`${fieldName} must be a valid date.`);
    }
  }

  /**
   * Ensures a string value is present and non-empty.
   */
  private ensureNonEmptyValue(value: unknown, fieldName: string): void {
    if (typeof value !== 'string' || value.trim().length === 0) {
      throw new SessionException(`${fieldName} must be a non-empty string.`);
    }
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default CreateSessionHandler;
