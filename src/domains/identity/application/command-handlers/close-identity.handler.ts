// -----------------------------------------------------------------------------
// Identity — Activate Command Handler
// -----------------------------------------------------------------------------
//
// Application command handler responsible for activating an Identity
// aggregate.
//
// Responsibilities:
//
// - Load the Identity aggregate.
// - Invoke the aggregate's activation behavior.
// - Persist the resulting aggregate state.
//
// The IdentityAggregate is responsible for:
//
// - validating the lifecycle transition;
// - enforcing Identity invariants;
// - determining the activation timestamp;
// - changing IdentityStatus to ACTIVE;
// - recording IdentityActivatedEvent.
//
// This handler does NOT:
//
// - mutate IdentityEntity directly;
// - construct IdentityEntity;
// - construct IdentityRoleEntity;
// - create authentication credentials;
// - create sessions;
// - perform verification;
// - send notifications;
// - execute external side effects.
//
// Those concerns belong to their respective application/domain boundaries.
//
// IMPORTANT:
//
// Activation requires only the IdentityPublicId carried by the command.
//
// `activatedAt` is intentionally not supplied by this handler.
//
// The activation timestamp is a domain fact describing when the activation
// mutation actually occurred. IdentityAggregate determines it when the
// mutation is performed.
//
// Correlation and causation metadata are intentionally not part of the
// activation command or activation aggregate operation.
//
// -----------------------------------------------------------------------------
//
// Flow:
//
//     ActivateIdentityCommand
//             │
//             ▼
//     IdentityRepository.findByPublicId()
//             │
//             ├── not found → throw
//             │
//             ▼
//     IdentityAggregate.activate()
//             │
//             ├── validate transition
//             ├── determine activatedAt
//             ├── change lifecycle state
//             └── record IdentityActivatedEvent
//             │
//             ▼
//     IdentityRepository.save()
//             │
//             ▼
//     IdentityAggregate
//
// -----------------------------------------------------------------------------
//
// Domain boundary:
//
// ActivateIdentityCommand already contains IdentityPublicId as a domain
// value object.
//
// Therefore:
//
// - no primitive-to-value-object conversion occurs here;
// - the handler passes command.identityPublicId directly to the repository;
// - DTO-to-domain conversion belongs before command creation.
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
// Exception
// -----------------------------------------------------------------------------

import { IdentityInvariantException } from '../../domain/exceptions/identity-invariant.exception';

// =============================================================================
// Handler
// =============================================================================

/**
 * Activates an Identity aggregate.
 *
 * The handler is intentionally thin. It performs application orchestration
 * while the IdentityAggregate remains responsible for lifecycle behavior and
 * domain invariants.
 *
 * Flow:
 *
 *     Command
 *       │
 *       ▼
 *     Load IdentityAggregate
 *       │
 *       ▼
 *     aggregate.activate()
 *       │
 *       ▼
 *     repository.save()
 *       │
 *       ▼
 *     Return aggregate
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
   * Executes the ActivateIdentityCommand.
   *
   * The command carries a domain-ready IdentityPublicId value object.
   *
   * Activation itself requires no correlation or causation metadata.
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
    // `command.identityPublicId` is already an IdentityPublicId value object.
    //
    // Do NOT reconstruct it with:
    //
    //     new IdentityPublicId(command.identityPublicId)
    //
    // The repository receives the domain value object directly.
    // -------------------------------------------------------------------------

    const identity = await this.repository.findByPublicId(
      command.identityPublicId,
    );

    // -------------------------------------------------------------------------
    // 3. Ensure aggregate exists
    // -------------------------------------------------------------------------

    if (identity === null) {
      throw new IdentityInvariantException(
        `Identity ${command.identityPublicId.value} was not found.`,
      );
    }

    // -------------------------------------------------------------------------
    // 4. Activate Identity
    // -------------------------------------------------------------------------
    //
    // All lifecycle rules remain inside IdentityAggregate.
    //
    // IdentityAggregate.activate() is responsible for:
    //
    // - validating the current status;
    // - preventing activation of CLOSED identities;
    // - treating already-ACTIVE identities idempotently;
    // - determining activatedAt;
    // - changing the lifecycle state;
    // - recording IdentityActivatedEvent.
    //
    // The handler supplies no lifecycle timestamp and no correlation metadata.
    // -------------------------------------------------------------------------

    identity.activate();

    // -------------------------------------------------------------------------
    // 5. Persist aggregate
    // -------------------------------------------------------------------------
    //
    // The repository persists the complete Identity aggregate, including its
    // aggregate-owned IdentityRoleEntity collection.
    // -------------------------------------------------------------------------

    await this.repository.save(identity);

    // -------------------------------------------------------------------------
    // 6. Return aggregate
    // -------------------------------------------------------------------------

    return identity;
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default ActivateIdentityHandler;
