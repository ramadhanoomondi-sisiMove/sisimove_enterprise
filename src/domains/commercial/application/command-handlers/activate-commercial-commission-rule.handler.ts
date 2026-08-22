// -----------------------------------------------------------------------------
// Commercial Commission Rule — Activate Command Handler
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

import type { ActivateCommercialCommissionRuleCommand } from '../commands/activate-commercial-commission-rule.command';

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
 * Handles activation of a Commercial Commission Rule aggregate.
 *
 * The handler is responsible for application-level orchestration:
 *
 * 1. Locate the Commercial Commission Rule aggregate by public identity.
 * 2. Ensure the aggregate exists.
 * 3. Delegate activation to the aggregate.
 * 4. Persist the updated aggregate.
 * 5. Return the activated aggregate.
 *
 * The aggregate is responsible for enforcing intrinsic lifecycle invariants,
 * including preventing activation of an already-active rule.
 *
 * Cross-rule policies, such as effective-period overlap with another
 * Commercial Commission Rule of the same type, are intentionally not
 * enforced directly by this handler. Such policies require coordination
 * across multiple aggregates and belong to the appropriate application/domain
 * policy.
 */
@Injectable()
export class ActivateCommercialCommissionRuleHandler implements CommandHandler<
  ActivateCommercialCommissionRuleCommand,
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
    command: ActivateCommercialCommissionRuleCommand,
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
    // Activation
    // -------------------------------------------------------------------------

    /**
     * The aggregate owns the lifecycle transition and intrinsic activation
     * invariants.
     *
     * The activation timestamp is supplied explicitly so the transition
     * remains deterministic and auditable.
     *
     * The correlation identifier is passed to the aggregate so the resulting
     * domain event can participate in the application's tracing chain.
     */
    aggregate.activate(command.activatedAt, command.correlationId);

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

export default ActivateCommercialCommissionRuleHandler;
