// -----------------------------------------------------------------------------
// Commercial Commission Rule — Update Command Handler
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Application — Tokens
// -----------------------------------------------------------------------------

import { COMMERCIAL_COMMISSION_RULE_TOKENS } from '../commercial-commission-rule.tokens';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

import type { UpdateCommercialCommissionRuleCommand } from '../commands/update-commercial-commission-rule.command';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import { CommercialCommissionRuleAggregate } from '../../domain/aggregates/commercial-commission-rule.aggregate';

// -----------------------------------------------------------------------------
// Repository
// -----------------------------------------------------------------------------

import type { CommercialCommissionRuleRepository } from '../../domain/repositories/commercial-commission-rule.repository';

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { CommercialCommissionRuleNotFoundException } from '../../domain/exceptions';

// -----------------------------------------------------------------------------
// Handler
// -----------------------------------------------------------------------------

/**
 * Handles updates to a Commercial Commission Rule aggregate.
 *
 * The handler is responsible for application-level orchestration:
 *
 * 1. Locate the Commercial Commission Rule aggregate by public identity.
 * 2. Ensure the aggregate exists.
 * 3. Delegate the configuration update to the aggregate.
 * 4. Persist the updated aggregate.
 * 5. Return the updated aggregate.
 *
 * The aggregate delegates intrinsic configuration validation to the owned
 * entity and is responsible for enforcing lifecycle invariants such as
 * preventing modification of an active rule.
 *
 * Cross-rule policies, such as commission type/version uniqueness and
 * effective-period overlap with another rule, require coordination across
 * multiple aggregates and are intentionally not enforced directly by the
 * aggregate.
 */
@Injectable()
export class UpdateCommercialCommissionRuleHandler implements CommandHandler<
  UpdateCommercialCommissionRuleCommand,
  CommercialCommissionRuleAggregate
> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    @Inject(COMMERCIAL_COMMISSION_RULE_TOKENS.REPOSITORY)
    private readonly repository: CommercialCommissionRuleRepository,
  ) {}

  // ===========================================================================
  // Execute
  // ===========================================================================

  public async execute(
    command: UpdateCommercialCommissionRuleCommand,
  ): Promise<CommercialCommissionRuleAggregate> {
    // -------------------------------------------------------------------------
    // Commercial Commission Rule Lookup
    // -------------------------------------------------------------------------

    const aggregate = await this.repository.findByPublicId(command.publicId);

    // -------------------------------------------------------------------------
    // Existence
    // -------------------------------------------------------------------------

    if (!aggregate) {
      throw new CommercialCommissionRuleNotFoundException(
        command.publicId.value,
      );
    }

    // -------------------------------------------------------------------------
    // Update
    // -------------------------------------------------------------------------

    /**
     * The aggregate owns the update operation and delegates intrinsic
     * validation to the Commercial Commission Rule entity.
     *
     * The aggregate also records CommercialCommissionRuleUpdatedEvent.
     */
    aggregate.update(
      command.type,
      command.percentage,
      command.effectiveFrom,
      command.effectiveTo,
      command.version,
      command.updatedAt,
      command.correlationId,
    );

    // -------------------------------------------------------------------------
    // Persistence
    // -------------------------------------------------------------------------

    await this.repository.save(aggregate);

    // -------------------------------------------------------------------------
    // Result
    // -------------------------------------------------------------------------

    return aggregate;
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default UpdateCommercialCommissionRuleHandler;
