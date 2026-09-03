// -----------------------------------------------------------------------------
// Identity — Change Email Command Handler
// -----------------------------------------------------------------------------
//
// Application command handler responsible for changing the email address of
// an Identity aggregate.
//
// Responsibilities:
//
// - Load the Identity aggregate.
// - Invoke the aggregate's email-change behavior.
// - Persist the resulting aggregate state.
//
// The IdentityAggregate is responsible for:
//
// - validating the Identity lifecycle state;
// - determining whether the email actually changed;
// - determining the email-change timestamp;
// - changing the Identity email;
// - recording IdentityEmailChangedEvent.
//
// This handler does NOT:
//
// - mutate IdentityEntity directly;
// - construct IdentityEntity;
// - perform email verification;
// - create or revoke authentication credentials;
// - create or revoke sessions;
// - send email;
// - execute notification/integration side effects;
// - perform external operations.
//
// Those concerns belong to their respective application/domain boundaries.
//
// IMPORTANT:
//
// `changedAt` is intentionally not supplied by this handler.
//
// The timestamp is a domain fact describing when the email mutation actually
// occurred. IdentityAggregate determines it when the mutation is performed.
//
// -----------------------------------------------------------------------------
//
// Flow:
//
//     ChangeIdentityEmailCommand
//             │
//             ▼
//     IdentityRepository.findByPublicId()
//             │
//             ▼
//     IdentityAggregate.changeEmail()
//             │
//             ├── validate lifecycle
//             ├── determine changedAt
//             ├── update email
//             └── record IdentityEmailChangedEvent
//             │
//             ▼
//     IdentityRepository.save()
//             │
//             ▼
//     IdentityAggregate
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

import type { ChangeIdentityEmailCommand } from '../commands/change-identity-email.command';

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
 * Changes the email address of an Identity aggregate.
 *
 * The handler intentionally performs only application orchestration.
 *
 * Domain behavior remains inside IdentityAggregate.
 *
 * Flow:
 *
 *     Command
 *       │
 *       ▼
 *     Load IdentityAggregate
 *       │
 *       ▼
 *     aggregate.changeEmail()
 *       │
 *       ▼
 *     repository.save()
 *       │
 *       ▼
 *     Return aggregate
 */
@Injectable()
export class ChangeIdentityEmailHandler implements CommandHandler<
  ChangeIdentityEmailCommand,
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

  public async execute(
    command: ChangeIdentityEmailCommand,
  ): Promise<IdentityAggregate> {
    // -------------------------------------------------------------------------
    // 1. Load Identity aggregate
    // -------------------------------------------------------------------------
    //
    // The command already contains the domain IdentityPublicId value object.
    // No persistence identifier is exposed to the application workflow.
    // -------------------------------------------------------------------------

    const identity = await this.repository.findByPublicId(
      command.identityPublicId,
    );

    // -------------------------------------------------------------------------
    // 2. Ensure aggregate exists
    // -------------------------------------------------------------------------

    if (identity === null) {
      throw new IdentityInvariantException(
        `Identity ${command.identityPublicId.value} was not found.`,
      );
    }

    // -------------------------------------------------------------------------
    // 3. Change email
    // -------------------------------------------------------------------------
    //
    // All email-change domain rules remain inside IdentityAggregate.
    //
    // The aggregate:
    //
    // - validates the Identity lifecycle;
    // - determines whether the new email differs from the current email;
    // - determines changedAt;
    // - updates the IdentityEntity;
    // - records IdentityEmailChangedEvent when appropriate.
    //
    // The handler does not construct or mutate IdentityEntity directly.
    // -------------------------------------------------------------------------

    identity.changeEmail(command.email, command.correlationId);

    // -------------------------------------------------------------------------
    // 4. Persist aggregate
    // -------------------------------------------------------------------------
    //
    // The repository persists the complete Identity aggregate, including
    // aggregate-owned IdentityRoleEntity instances.
    // -------------------------------------------------------------------------

    await this.repository.save(identity);

    // -------------------------------------------------------------------------
    // 5. Return aggregate
    // -------------------------------------------------------------------------

    return identity;
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default ChangeIdentityEmailHandler;
