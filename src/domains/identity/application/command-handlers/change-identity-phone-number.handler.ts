// -----------------------------------------------------------------------------
// Identity — Change Phone Number Command Handler
// -----------------------------------------------------------------------------
//
// Application command handler responsible for changing the phone number of an
// Identity aggregate.
//
// Responsibilities:
//
// - Load the Identity aggregate.
// - Invoke the aggregate's phone-number change behavior.
// - Persist the resulting aggregate state.
//
// The IdentityAggregate is responsible for:
//
// - validating the Identity lifecycle state;
// - determining whether the phone number actually changed;
// - determining the phone-number change timestamp;
// - changing the Identity phone number;
// - recording IdentityPhoneNumberChangedEvent.
//
// This handler does NOT:
//
// - mutate IdentityEntity directly;
// - construct IdentityEntity;
// - perform phone-number verification;
// - generate or send OTP challenges;
// - authenticate the Identity;
// - create or revoke authentication credentials;
// - create or revoke sessions;
// - send notifications;
// - execute external integration side effects.
//
// Those concerns belong to their respective application/domain boundaries.
//
// IMPORTANT:
//
// `changedAt` is intentionally not supplied by this handler.
//
// The timestamp is a domain fact describing when the phone-number mutation
// actually occurred. IdentityAggregate determines it when the mutation is
// performed.
//
// -----------------------------------------------------------------------------
//
// Flow:
//
//     ChangeIdentityPhoneNumberCommand
//             │
//             ▼
//     IdentityRepository.findByPublicId()
//             │
//             ▼
//     IdentityAggregate.changePhoneNumber()
//             │
//             ├── validate lifecycle
//             ├── determine changedAt
//             ├── update phone number
//             └── record IdentityPhoneNumberChangedEvent
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

import type { ChangeIdentityPhoneNumberCommand } from '../commands/change-identity-phone-number.command';

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
 * Changes the phone number of an Identity aggregate.
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
 *     aggregate.changePhoneNumber()
 *       │
 *       ▼
 *     repository.save()
 *       │
 *       ▼
 *     Return aggregate
 */
@Injectable()
export class ChangeIdentityPhoneNumberHandler implements CommandHandler<
  ChangeIdentityPhoneNumberCommand,
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
    command: ChangeIdentityPhoneNumberCommand,
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
    // 3. Change phone number
    // -------------------------------------------------------------------------
    //
    // All phone-number change rules remain inside IdentityAggregate.
    //
    // The aggregate:
    //
    // - validates the Identity lifecycle;
    // - determines whether the new phone number differs from the current one;
    // - determines changedAt;
    // - updates the IdentityEntity;
    // - records IdentityPhoneNumberChangedEvent when appropriate.
    //
    // The handler does not construct or mutate IdentityEntity directly.
    // -------------------------------------------------------------------------

    identity.changePhoneNumber(command.phoneNumber, command.correlationId);

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

export default ChangeIdentityPhoneNumberHandler;
