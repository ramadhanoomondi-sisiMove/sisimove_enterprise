// -----------------------------------------------------------------------------
// Identity — Activate Command Handler
// -----------------------------------------------------------------------------
//
// Application command handler responsible for activating an existing
// Identity aggregate.
//
// Responsibilities:
//
// - Resolve the IdentityAggregate by public identifier.
// - Invoke IdentityAggregate.activate().
// - Allow the aggregate to enforce lifecycle invariants.
// - Allow the aggregate to determine the activation timestamp.
// - Allow the aggregate to record IdentityActivatedEvent.
// - Persist the updated aggregate.
//
// This handler does NOT:
//
// - Mutate IdentityEntity directly.
// - Construct IdentityEntity.
// - Construct IdentityRoleEntity.
// - Change IdentityStatus directly.
// - Determine activatedAt.
// - Emit domain events directly.
// - Activate authentication.
// - Create sessions.
// - Perform verification.
// - Send notifications.
// - Communicate with external systems.
//
// Domain responsibility remains inside IdentityAggregate.
//
// -----------------------------------------------------------------------------
//
// Application flow:
//
//     ActivateIdentityCommand
//              │
//              ▼
//     repository.findByPublicId()
//              │
//              ├── not found → throw
//              │
//              ▼
//     IdentityAggregate
//              │
//              ▼
//     aggregate.activate()
//              │
//              ├── lifecycle validation
//              ├── activation timestamp
//              ├── IdentityEntity mutation
//              └── IdentityActivatedEvent
//              │
//              ▼
//     repository.save()
//              │
//              ▼
//     IdentityAggregate
//
// -----------------------------------------------------------------------------
//
// Domain boundary:
//
// ActivateIdentityCommand already carries IdentityPublicId as a domain
// value object.
//
// Therefore:
//
// - the handler does NOT reconstruct IdentityPublicId;
// - the handler does NOT convert transport primitives;
// - the handler does NOT determine activation time;
// - the handler does NOT supply lifecycle timestamps;
// - the handler does NOT supply correlation or causation metadata.
//
// DTO-to-domain conversion belongs before the command reaches this handler.
//
// IdentityAggregate.activate() owns the complete activation transition,
// including determination of the activation timestamp.
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
// Foundation
// -----------------------------------------------------------------------------

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

import type { ActivateIdentityCommand } from '../commands/activate-identity.command';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import type { IdentityAggregate } from '../../domain/aggregates/identity.aggregate';

// -----------------------------------------------------------------------------
// Repository
// -----------------------------------------------------------------------------

import type { IdentityRepository } from '../../domain/repositories/identity.repository';

// -----------------------------------------------------------------------------
// Domain Exception
// -----------------------------------------------------------------------------

import { IdentityInvariantException } from '../../domain/exceptions/identity-invariant.exception';

// =============================================================================
// Handler
// =============================================================================

/**
 * Activates an existing Identity aggregate.
 *
 * The handler performs application orchestration only:
 *
 *     Command
 *       │
 *       ▼
 *     Load aggregate
 *       │
 *       ▼
 *     aggregate.activate()
 *       │
 *       ▼
 *     repository.save()
 *
 * Lifecycle validation, activation timestamp determination, lifecycle
 * mutation, and domain event recording remain inside the IdentityAggregate.
 */
@Injectable()
export class ActivateIdentityHandler implements CommandHandler<
  ActivateIdentityCommand,
  IdentityAggregate
> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    @Inject(IDENTITY_TOKENS.REPOSITORIES.IDENTITY)
    private readonly repository: IdentityRepository,
  ) {}

  // ===========================================================================
  // Execute
  // ===========================================================================

  /**
   * Executes the Activate Identity command.
   *
   * The command already contains the domain-ready IdentityPublicId value
   * object, so it is passed directly to the repository.
   *
   * The aggregate remains responsible for:
   *
   * - lifecycle validation;
   * - determining activation time;
   * - lifecycle state mutation;
   * - IdentityActivatedEvent creation.
   */
  public async execute(
    command: ActivateIdentityCommand,
  ): Promise<IdentityAggregate> {
    // -------------------------------------------------------------------------
    // 1. Command guard
    // -------------------------------------------------------------------------

    if (command === undefined) {
      throw new IdentityInvariantException(
        'Activate Identity command is required.',
      );
    }

    // -------------------------------------------------------------------------
    // 2. Load Identity aggregate
    // -------------------------------------------------------------------------
    //
    // The command already contains IdentityPublicId as a domain value object.
    //
    // No reconstruction or primitive-to-value-object conversion is performed
    // here.
    //
    // The repository returns the complete Identity aggregate, including its
    // aggregate-owned IdentityRoleEntity collection.
    // -------------------------------------------------------------------------

    const aggregate = await this.repository.findByPublicId(
      command.identityPublicId,
    );

    if (aggregate === null) {
      throw new IdentityInvariantException(
        `Identity ${command.identityPublicId.value} was not found.`,
      );
    }

    // -------------------------------------------------------------------------
    // 3. Activate Identity
    // -------------------------------------------------------------------------
    //
    // IdentityAggregate owns the lifecycle transition.
    //
    // The aggregate:
    //
    // - validates the current lifecycle state;
    // - rejects activation of CLOSED identities;
    // - determines the activation timestamp;
    // - changes IdentityEntity lifecycle state;
    // - records IdentityActivatedEvent.
    //
    // No timestamp or metadata is supplied by the handler.
    // -------------------------------------------------------------------------

    aggregate.activate();

    // -------------------------------------------------------------------------
    // 4. Persist aggregate
    // -------------------------------------------------------------------------
    //
    // The repository persists the complete Identity aggregate.
    //
    // IdentityRoleEntity instances remain owned by IdentityAggregate.
    //
    // -------------------------------------------------------------------------

    await this.repository.save(aggregate);

    // -------------------------------------------------------------------------
    // 5. Return aggregate
    // -------------------------------------------------------------------------

    return aggregate;
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default ActivateIdentityHandler;
