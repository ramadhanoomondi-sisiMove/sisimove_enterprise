// -----------------------------------------------------------------------------
// Commercial Commission Rule — Create Command Handler
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

import type { CreateCommercialCommissionRuleCommand } from '../commands/create-commercial-commission-rule.command';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import { CommercialCommissionRuleAggregate } from '../../domain/aggregates/commercial-commission-rule.aggregate';

// -----------------------------------------------------------------------------
// Entity
// -----------------------------------------------------------------------------

import { CommercialCommissionRuleEntity } from '../../domain/entities/commercial-commission-rule.entity';

// -----------------------------------------------------------------------------
// Repository
// -----------------------------------------------------------------------------

import type { CommercialCommissionRuleRepository } from '../../domain/repositories/commercial-commission-rule.repository';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import { CommercialCommissionRulePublicId } from '../../domain/value-objects/commercial-commission-rule-public-id.vo';

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { CommercialCommissionRuleAlreadyExistsException } from '../../domain/exceptions';

// -----------------------------------------------------------------------------
// Handler
// -----------------------------------------------------------------------------

/**
 * Handles creation of a Commercial Commission Rule aggregate.
 *
 * The command is expected to contain already validated domain value objects
 * for:
 *
 * - commission type;
 * - commission percentage;
 * - effective-from timestamp;
 * - optional effective-to timestamp;
 * - commission rule version.
 *
 * The handler is responsible for application-level orchestration:
 *
 * 1. Generate the Commercial Commission Rule public identity.
 * 2. Ensure the commission type/version combination does not already exist.
 * 3. Create the Commercial Commission Rule entity in INACTIVE state.
 * 4. Create the Commercial Commission Rule aggregate.
 * 5. Persist the aggregate.
 * 6. Return the created aggregate.
 *
 * CommercialCommissionRuleAggregate.create() is responsible for:
 *
 * - aggregate creation;
 * - creation invariant enforcement;
 * - recording CommercialCommissionRuleCreatedEvent.
 *
 * Cross-rule effective-period validation is intentionally not performed
 * directly by this handler. That concern requires comparison against other
 * Commercial Commission Rule aggregates and belongs to the coordinating
 * application/domain policy.
 */
@Injectable()
export class CreateCommercialCommissionRuleHandler implements CommandHandler<
  CreateCommercialCommissionRuleCommand,
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
    command: CreateCommercialCommissionRuleCommand,
  ): Promise<CommercialCommissionRuleAggregate> {
    // -------------------------------------------------------------------------
    // Commission Policy Version Uniqueness
    // -------------------------------------------------------------------------

    /**
     * A Commercial Commission Rule is uniquely identified by:
     *
     *   commission type + version
     *
     * This invariant requires repository knowledge because it cannot be
     * established by the entity in isolation.
     */
    const alreadyExists = await this.repository.existsByTypeAndVersion(
      command.type,
      command.version.value,
    );

    if (alreadyExists) {
      throw new CommercialCommissionRuleAlreadyExistsException(
        command.type.value,
        command.version.value,
      );
    }

    // -------------------------------------------------------------------------
    // Commercial Commission Rule Public Identity
    // -------------------------------------------------------------------------

    const commercialCommissionRulePublicId =
      new CommercialCommissionRulePublicId();

    // -------------------------------------------------------------------------
    // Commercial Commission Rule Entity
    // -------------------------------------------------------------------------

    /**
     * A newly created Commercial Commission Rule always starts in INACTIVE
     * state.
     *
     * Activation is an explicit lifecycle operation and is intentionally not
     * performed by the creation command.
     *
     * Effective-period overlap validation is intentionally deferred to the
     * coordinating application/domain policy because it requires comparison
     * against other Commercial Commission Rule aggregates.
     */
    const commercialCommissionRule = CommercialCommissionRuleEntity.create({
      publicId: commercialCommissionRulePublicId,

      type: command.type,

      percentage: command.percentage,

      effectiveFrom: command.effectiveFrom,

      effectiveTo: command.effectiveTo,

      version: command.version,
    });

    // -------------------------------------------------------------------------
    // Commercial Commission Rule Aggregate
    // -------------------------------------------------------------------------

    /**
     * CommercialCommissionRuleAggregate.create() records the
     * CommercialCommissionRuleCreatedEvent internally.
     *
     * Correlation and causation identifiers are passed through so the
     * resulting domain event participates in the application's distributed
     * tracing and causation chain.
     */
    const aggregate = CommercialCommissionRuleAggregate.create(
      commercialCommissionRule,
      command.correlationId,
      command.causationId,
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

export default CreateCommercialCommissionRuleHandler;
