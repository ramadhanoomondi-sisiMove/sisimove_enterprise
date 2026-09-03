// -----------------------------------------------------------------------------
// Authentication — Activate Authentication Command Handler
// -----------------------------------------------------------------------------
//
// Application handler for activating an Authentication aggregate.
//
// Aggregate boundary:
//
// AuthenticationAggregate
// └── AuthenticationEntity
//
// Lifecycle transition:
//
//     PENDING → ACTIVE
//
// Responsibilities:
//
// - load the Authentication aggregate;
// - invoke AuthenticationAggregate.activate();
// - persist the updated aggregate;
// - return the activated aggregate.
//
// The handler does NOT:
//
// - validate Authentication lifecycle rules;
// - mutate AuthenticationEntity directly;
// - construct AuthenticationActivatedEvent;
// - validate credentials;
// - hash or compare passwords;
// - create a Session;
// - create a Device;
// - validate OTPs;
// - validate Identity domain state;
// - create Recovery records;
// - access Prisma;
// - communicate with external systems;
// - send notifications.
//
// -----------------------------------------------------------------------------
//
// Authentication lifecycle:
//
// AuthenticationAggregate.activate() owns:
//
//     PENDING → ACTIVE
//
// The aggregate:
//
// - validates the lifecycle transition;
// - delegates state mutation to AuthenticationEntity;
// - records AuthenticationActivatedEvent;
// - preserves correlation/causation metadata.
//
// The application handler only orchestrates the operation.
//
// -----------------------------------------------------------------------------
//
// Identity reference:
//
// Authentication contains an opaque cross-domain reference:
//
//     AuthenticationIdentityPublicId
//
// This handler does NOT:
//
// - load Identity;
// - validate Identity existence;
// - validate Identity status;
// - inspect Identity roles;
// - mutate Identity.
//
// -----------------------------------------------------------------------------
//
// Application flow:
//
//     ActivateAuthenticationCommand
//              │
//              ▼
// authenticationRepository.findByPublicId()
//              │
//              ├── not found → AuthenticationNotFoundException
//              │
//              ▼
//     aggregate.activate()
//              │
//              └── AuthenticationActivatedEvent
//              │
//              ▼
//     authenticationRepository.save()
//              │
//              ▼
//       return aggregate
//
// -----------------------------------------------------------------------------
//
// Return value:
//
// The activated AuthenticationAggregate is returned after successful
// persistence.
//
// This allows the controller/presentation layer to map the authoritative
// resulting aggregate state directly into an AuthenticationResponse without
// performing a second repository read.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Foundation — Application
// -----------------------------------------------------------------------------

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

// -----------------------------------------------------------------------------
// Authentication — Application Tokens
// -----------------------------------------------------------------------------

import { AUTH_TOKENS } from '../auth.tokens';

// -----------------------------------------------------------------------------
// Authentication — Command
// -----------------------------------------------------------------------------

import type { ActivateAuthenticationCommand } from '../commands/activate-authentication.command';

// -----------------------------------------------------------------------------
// Authentication — Domain Aggregate
// -----------------------------------------------------------------------------

import { AuthenticationAggregate } from '../../domain/aggregates/authentication.aggregate';

// -----------------------------------------------------------------------------
// Authentication — Domain Repository
// -----------------------------------------------------------------------------

import type { AuthenticationRepository } from '../../domain/repositories/authentication.repository';

// -----------------------------------------------------------------------------
// Authentication — Domain Exception
// -----------------------------------------------------------------------------

import { AuthenticationNotFoundException } from '../../domain/exceptions/authentication-not-found.exception';

// =============================================================================
// Handler
// =============================================================================

/**
 * Activates an existing Authentication aggregate.
 *
 * Application orchestration:
 *
 *     command
 *       ↓
 *     repository.findByPublicId()
 *       ↓
 *     aggregate.activate()
 *       ↓
 *     repository.save()
 *       ↓
 *     return aggregate
 *
 * Domain behavior remains inside AuthenticationAggregate and
 * AuthenticationEntity.
 */
@Injectable()
export class ActivateAuthenticationHandler implements CommandHandler<
  ActivateAuthenticationCommand,
  AuthenticationAggregate
> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    @Inject(AUTH_TOKENS.REPOSITORIES.AUTHENTICATION)
    private readonly authenticationRepository: AuthenticationRepository,
  ) {}

  // ===========================================================================
  // Execute
  // ===========================================================================

  /**
   * Executes the ActivateAuthenticationCommand.
   *
   * The command contains:
   *
   * - AuthenticationPublicId;
   * - correlation metadata;
   * - optional causation metadata.
   *
   * The handler loads the aggregate, invokes its domain behavior, persists
   * the resulting state, and returns the updated aggregate.
   */
  public async execute(
    command: ActivateAuthenticationCommand,
  ): Promise<AuthenticationAggregate> {
    // -------------------------------------------------------------------------
    // 1. Load Authentication aggregate
    // -------------------------------------------------------------------------
    //
    // AuthenticationPublicId is the public identity of the Authentication
    // aggregate.
    //
    // The repository returns the aggregate boundary rather than exposing the
    // underlying AuthenticationEntity to the application layer.
    // -------------------------------------------------------------------------

    const aggregate = await this.authenticationRepository.findByPublicId(
      command.authenticationPublicId,
    );

    // -------------------------------------------------------------------------
    // 2. Enforce Authentication existence
    // -------------------------------------------------------------------------
    //
    // Activation can only occur against an existing Authentication aggregate.
    // -------------------------------------------------------------------------

    if (aggregate === null) {
      throw new AuthenticationNotFoundException(
        `Authentication ${command.authenticationPublicId.value} was not found.`,
      );
    }

    // -------------------------------------------------------------------------
    // 3. Activate Authentication
    // -------------------------------------------------------------------------
    //
    // AuthenticationAggregate owns the lifecycle transition:
    //
    //     PENDING → ACTIVE
    //
    // The aggregate is responsible for:
    //
    // - validating the lifecycle transition;
    // - delegating mutation to AuthenticationEntity;
    // - recording AuthenticationActivatedEvent.
    //
    // The handler does not inspect or mutate AuthenticationEntity directly.
    // -------------------------------------------------------------------------

    aggregate.activate(command.correlationId, command.causationId);

    // -------------------------------------------------------------------------
    // 4. Persist AuthenticationAggregate
    // -------------------------------------------------------------------------
    //
    // The Authentication aggregate is the unit of persistence.
    //
    // The repository handles persistence and domain-event processing according
    // to the application's repository/event-dispatch architecture.
    // -------------------------------------------------------------------------

    await this.authenticationRepository.save(aggregate);

    // -------------------------------------------------------------------------
    // 5. Return AuthenticationAggregate
    // -------------------------------------------------------------------------
    //
    // Return the successfully persisted aggregate.
    //
    // The presentation layer can map this authoritative aggregate directly
    // into AuthenticationResponse.
    // -------------------------------------------------------------------------

    return aggregate;
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default ActivateAuthenticationHandler;
