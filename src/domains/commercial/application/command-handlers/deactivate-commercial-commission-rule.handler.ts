// -----------------------------------------------------------------------------
// Commercial Commission Rule — Deactivate Command Handler
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

import type { DeactivateCommercialCommissionRuleCommand } from '../commands/deactivate-commercial-commission-rule.command';

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
 * Handles deactivation of an existing Commercial Commission Rule aggregate.
 *
 * The command is expected to contain:
 *
 * - the Commercial Commission Rule public identity;
 * - the deactivation timestamp;
 * - a correlation identifier;
 * - an optional causation identifier.
 *
 * The handler is responsible for application-level orchestration:
 *
 * 1. Locate the Commercial Commission Rule aggregate.
 * 2. Ensure the aggregate exists.
 * 3. Delegate the lifecycle transition to the aggregate.
 * 4. Persist the modified aggregate.
 * 5. Return the deactivated aggregate.
 *
 * CommercialCommissionRuleAggregate.deactivate() is responsible for:
 *
 * - lifecycle transition validation;
 * - rejecting an already inactive rule;
 * - changing the entity to INACTIVE state;
 * - updating the modification timestamp;
 * - recording CommercialCommissionRuleDeactivatedEvent.
 *
 * Lifecycle invariants are intentionally not enforced directly by this
 * handler because they belong to the Commercial Commission Rule aggregate.
 */
@Injectable()
export class DeactivateCommercialCommissionRuleHandler implements CommandHandler<
  DeactivateCommercialCommissionRuleCommand,
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
    command: DeactivateCommercialCommissionRuleCommand,
  ): Promise<CommercialCommissionRuleAggregate> {
    // -------------------------------------------------------------------------
    // Commercial Commission Rule Lookup
    // -------------------------------------------------------------------------

    /**
     * The public identity remains a domain value object at the repository
     * boundary.
     *
     * It is intentionally passed directly to the repository because the
     * repository contract expects CommercialCommissionRulePublicId.
     */
    const aggregate = await this.repository.findByPublicId(command.publicId);

    // -------------------------------------------------------------------------
    // Commercial Commission Rule Existence
    // -------------------------------------------------------------------------

    /**
     * A Commercial Commission Rule must exist before it can be deactivated.
     *
     * The exception receives the primitive public identity value because
     * CommercialCommissionRuleNotFoundException accepts an optional string.
     */
    if (!aggregate) {
      throw new CommercialCommissionRuleNotFoundException(
        command.publicId.value,
      );
    }

    // -------------------------------------------------------------------------
    // Commercial Commission Rule Deactivation
    // -------------------------------------------------------------------------

    /**
     * The aggregate owns the lifecycle transition.
     *
     * CommercialCommissionRuleAggregate.deactivate() is responsible for:
     *
     * - rejecting an already inactive rule;
     * - transitioning the entity to INACTIVE;
     * - updating the modification timestamp;
     * - recording CommercialCommissionRuleDeactivatedEvent.
     */
    aggregate.deactivate(command.deactivatedAt, command.correlationId);

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

export default DeactivateCommercialCommissionRuleHandler;
