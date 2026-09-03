// -----------------------------------------------------------------------------
// Identity — Create Command Handler
// -----------------------------------------------------------------------------
//
// Application command handler responsible for orchestrating the complete
// Identity creation workflow.
//
// Aggregate:
//
// IdentityAggregate
// └── IdentityEntity
//     └── IdentityRoleEntity[]
//
// -----------------------------------------------------------------------------
//
// WORKFLOW
//
//     CreateIdentityCommand
//              │
//              ▼
//     CreateIdentityHandler
//              │
//        ┌─────┴─────┐
//        │           │
//      email       phone
//     uniqueness  uniqueness
//        │           │
//        └─────┬─────┘
//              │
//              ▼
//     IdentityAggregate.create()
//              │
//              │ PENDING
//              ▼
//     IdentityRepository.create()
//              │
//              ▼
//     ActivateIdentityCommand
//              │
//              ▼
//     ActivateIdentityHandler
//              │
//              ▼
//     IdentityAggregate.activate()
//              │
//              │ PENDING → ACTIVE
//              ▼
//     IdentityRepository.save()
//              │
//              ▼
//           ACTIVE
//
// -----------------------------------------------------------------------------
//
// RESPONSIBILITIES
//
// This handler:
//
// - validates application-level uniqueness;
// - creates the Identity aggregate;
// - persists the newly-created Identity;
// - constructs ActivateIdentityCommand;
// - delegates activation to ActivateIdentityHandler;
// - returns the resulting activated Identity aggregate.
//
// -----------------------------------------------------------------------------
//
// THIS HANDLER DOES NOT
//
// - implement Identity lifecycle rules;
// - directly mutate IdentityEntity;
// - call IdentityAggregate.activate();
// - construct IdentityCreatedEvent;
// - construct IdentityActivatedEvent;
// - assign activatedAt;
// - validate PENDING → ACTIVE;
// - resolve Identity lifecycle state;
// - reconstruct IdentityEmail;
// - reconstruct IdentityPhoneNumber;
// - perform DTO mapping;
// - create Authentication;
// - create Session;
// - create Device;
// - create Recovery;
// - create OTP challenges;
// - create Verification;
// - assign roles;
// - create permissions;
// - send notifications;
// - access Prisma.
//
// -----------------------------------------------------------------------------
//
// ORCHESTRATION BOUNDARY
//
// CreateIdentityHandler owns the application workflow:
//
//     CREATE → ACTIVATE
//
// ActivateIdentityHandler owns the activation application use case:
//
//     LOAD → ACTIVATE → SAVE
//
// IdentityAggregate owns the domain lifecycle transition:
//
//     PENDING → ACTIVE
//
// Therefore:
//
//     Application layer
//         = orchestration
//
//     Aggregate
//         = domain behavior and invariants
//
// -----------------------------------------------------------------------------
//
// LIFECYCLE
//
// PENDING remains the canonical initial Identity lifecycle state.
//
// IdentityAggregate.create() creates the Identity in PENDING.
//
// This handler does not redefine PENDING or make PENDING equivalent to ACTIVE.
//
// Instead, the Create Identity workflow explicitly continues with the
// Activate Identity application workflow.
//
// Therefore, when the complete Create Identity workflow succeeds:
//
//     status      = ACTIVE
//     activatedAt = <activation timestamp>
//
// -----------------------------------------------------------------------------
//
// CORRELATION / CAUSATION
//
// CreateIdentityCommand contains:
//
// - correlationId;
// - causationId.
//
// These values belong to the Create Identity application operation.
//
// ActivateIdentityCommand intentionally does NOT contain either value.
//
// Therefore this handler does not attempt to inject correlation or causation
// metadata into ActivateIdentityCommand.
//
// The activation command carries only its frozen business input:
//
//     identityPublicId
//
// If activation events require application messaging metadata, that concern
// must be handled by the application's messaging/event infrastructure rather
// than by changing the frozen ActivateIdentityCommand.
//
// -----------------------------------------------------------------------------
//
// CONCURRENCY
//
// Repository existence checks are early application-level guards.
//
// Database-level unique constraints remain the final protection against
// concurrent Identity creation.
//
// When the Create Identity use case guarantees atomic completion as ACTIVE,
// creation and activation should participate in the same application
// transaction / unit of work.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Application — Tokens
// -----------------------------------------------------------------------------

import { IDENTITY_TOKENS } from '../identity.tokens';

// -----------------------------------------------------------------------------
// Foundation — Application
// -----------------------------------------------------------------------------

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

// -----------------------------------------------------------------------------
// Identity — Commands
// -----------------------------------------------------------------------------

import type { CreateIdentityCommand } from '../commands/create-identity.command';

import { ActivateIdentityCommand } from '../commands/activate-identity.command';

// -----------------------------------------------------------------------------
// Identity — Application Handlers
// -----------------------------------------------------------------------------

import { ActivateIdentityHandler } from './activate-identity.handler';

// -----------------------------------------------------------------------------
// Identity — Aggregate
// -----------------------------------------------------------------------------

import { IdentityAggregate } from '../../domain/aggregates/identity.aggregate';

// -----------------------------------------------------------------------------
// Identity — Exceptions
// -----------------------------------------------------------------------------

import { IdentityAlreadyExistsException } from '../../domain/exceptions/identity-already-exists.exception';

import { IdentityInvariantException } from '../../domain/exceptions/identity-invariant.exception';

// -----------------------------------------------------------------------------
// Identity — Repository
// -----------------------------------------------------------------------------

import type { IdentityRepository } from '../../domain/repositories/identity.repository';

// =============================================================================
// Handler
// =============================================================================

/**
 * Orchestrates the complete Identity creation workflow.
 *
 * Application orchestration:
 *
 *     CreateIdentityCommand
 *              │
 *              ▼
 *     validate uniqueness
 *              │
 *              ▼
 *     IdentityAggregate.create()
 *              │
 *              │ PENDING
 *              ▼
 *     IdentityRepository.create()
 *              │
 *              ▼
 *     ActivateIdentityCommand
 *              │
 *              ▼
 *     ActivateIdentityHandler
 *              │
 *              ▼
 *     IdentityAggregate.activate()
 *              │
 *              │ PENDING → ACTIVE
 *              ▼
 *     IdentityRepository.save()
 *              │
 *              ▼
 *           ACTIVE
 *
 * Domain behavior remains inside IdentityAggregate.
 *
 * Cross-operation orchestration remains in this application handler.
 */
@Injectable()
export class CreateIdentityHandler implements CommandHandler<
  CreateIdentityCommand,
  IdentityAggregate
> {
  // ===========================================================================

  // Constructor
  // ===========================================================================

  public constructor(
    // -------------------------------------------------------------------------
    // Identity Repository
    // -------------------------------------------------------------------------
    //
    // Responsible for:
    //
    // - application-level uniqueness checks;
    // - persisting the newly-created Identity.
    //
    // -------------------------------------------------------------------------

    @Inject(IDENTITY_TOKENS.REPOSITORIES.IDENTITY)
    private readonly repository: IdentityRepository,

    // -------------------------------------------------------------------------
    // Activate Identity Handler
    // -------------------------------------------------------------------------
    //
    // The Create Identity workflow delegates activation to the dedicated
    // Activate Identity application handler.
    //
    // This follows the direct application-handler orchestration pattern used
    // elsewhere in the system.
    //
    // -------------------------------------------------------------------------

    @Inject(IDENTITY_TOKENS.COMMAND_HANDLERS.ACTIVATE_IDENTITY)
    private readonly activateIdentityHandler: ActivateIdentityHandler,
  ) {}

  // ===========================================================================

  // Execute
  // ===========================================================================

  /**
   * Executes the complete Identity creation workflow.
   *
   * Workflow:
   *
   *     1. Validate command presence.
   *     2. Ensure email is available.
   *     3. Ensure phone number is available.
   *     4. Create IdentityAggregate in PENDING.
   *     5. Persist the created aggregate.
   *     6. Construct ActivateIdentityCommand.
   *     7. Delegate activation to ActivateIdentityHandler.
   *     8. Return the activated aggregate.
   *
   * The handler owns orchestration only.
   *
   * IdentityAggregate owns the lifecycle transition.
   */
  public async execute(
    command: CreateIdentityCommand,
  ): Promise<IdentityAggregate> {
    // -------------------------------------------------------------------------
    // 1. Validate command
    // -------------------------------------------------------------------------

    if (command === undefined || command === null) {
      throw new IdentityInvariantException(
        'Create Identity command is required.',
      );
    }

    // -------------------------------------------------------------------------
    // 2. Ensure email is available
    // -------------------------------------------------------------------------
    //
    // This is an early application-level uniqueness guard.
    //
    // The database unique constraint remains the final concurrency safeguard.
    //
    // -------------------------------------------------------------------------

    const emailExists = await this.repository.existsByEmail(command.email);

    if (emailExists) {
      throw new IdentityAlreadyExistsException(
        `An Identity already exists with email "${command.email.toString()}".`,
      );
    }

    // -------------------------------------------------------------------------
    // 3. Ensure phone number is available
    // -------------------------------------------------------------------------

    const phoneNumberExists = await this.repository.existsByPhoneNumber(
      command.phoneNumber,
    );

    if (phoneNumberExists) {
      throw new IdentityAlreadyExistsException(
        `An Identity already exists with phone number "${command.phoneNumber.toString()}".`,
      );
    }

    // -------------------------------------------------------------------------
    // 4. Create Identity aggregate
    // -------------------------------------------------------------------------
    //
    // IdentityAggregate.create() establishes the canonical initial state:
    //
    //     PENDING
    //
    // The aggregate factory remains responsible for:
    //
    // - generating IdentityPublicId;
    // - creating IdentityEntity;
    // - establishing PENDING;
    // - validating aggregate invariants;
    // - recording IdentityCreatedEvent.
    //
    // This handler does not activate the aggregate directly.
    //
    // -------------------------------------------------------------------------

    const aggregate = IdentityAggregate.create(
      {
        email: command.email,
        phoneNumber: command.phoneNumber,
      },
      command.correlationId,
      command.causationId,
    );

    // -------------------------------------------------------------------------
    // 5. Persist newly-created Identity
    // -------------------------------------------------------------------------
    //
    // The Identity must exist in persistence before the Activate Identity
    // handler attempts to load it by IdentityPublicId.
    //
    // At this point:
    //
    //     status = PENDING
    //
    // -------------------------------------------------------------------------

    await this.repository.create(aggregate);

    // -------------------------------------------------------------------------
    // 6. Construct ActivateIdentityCommand
    // -------------------------------------------------------------------------
    //
    // ActivateIdentityCommand intentionally contains only:
    //
    //     identityPublicId
    //
    // It does NOT accept:
    //
    // - correlationId;
    // - causationId;
    // - activatedAt;
    // - status.
    //
    // Therefore the Create handler passes only the IdentityPublicId.
    //
    // -------------------------------------------------------------------------

    const activateCommand = new ActivateIdentityCommand(aggregate.publicId);

    // -------------------------------------------------------------------------
    // 7. Delegate activation
    // -------------------------------------------------------------------------
    //
    // ActivateIdentityHandler owns:
    //
    //     LOAD → ACTIVATE → SAVE
    //
    // It loads the persisted Identity aggregate, invokes:
    //
    //     aggregate.activate()
    //
    // and persists the resulting aggregate.
    //
    // This handler deliberately does NOT:
    //
    // - call aggregate.activate();
    // - assign activatedAt;
    // - validate lifecycle transitions;
    // - create IdentityActivatedEvent;
    // - save the activated aggregate.
    //
    // -------------------------------------------------------------------------

    const activatedAggregate =
      await this.activateIdentityHandler.execute(activateCommand);

    // -------------------------------------------------------------------------
    // 8. Return activated aggregate
    // -------------------------------------------------------------------------
    //
    // ActivateIdentityHandler returns the aggregate instance that it loaded,
    // activated, and persisted.
    //
    // The original `aggregate` still represents PENDING in memory.
    //
    // Therefore returning `activatedAggregate` keeps the application result
    // aligned with the final persisted lifecycle state.
    //
    // -------------------------------------------------------------------------

    return activatedAggregate;
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default CreateIdentityHandler;
