// -----------------------------------------------------------------------------
// Commercial Commission Rule — Create Command
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { Command } from '../../../../foundation/kernel/application/command';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import type {
  CommercialCommissionRuleEffectiveFrom,
  CommercialCommissionRuleEffectiveTo,
  CommercialCommissionRuleVersion,
  CommercialCommissionType,
  CommercialCommissionPercentage,
} from '../../domain/value-objects';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

/**
 * Command for creating a Commercial Commission Rule aggregate.
 *
 * The command carries domain-ready value objects rather than raw transport
 * values. DTO-to-domain conversion belongs to the presentation/application
 * boundary.
 *
 * A newly created Commercial Commission Rule begins in INACTIVE state.
 *
 * The initial rule version is established by the domain entity unless an
 * explicit version is supplied by the application use case.
 *
 * Cross-rule validation, including effective-period overlap detection, is
 * intentionally not performed by this command. Such validation belongs to the
 * application/domain service coordinating the rule repository.
 */
export class CreateCommercialCommissionRuleCommand implements Command {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  constructor(
    /**
     * Commission type governed by the rule.
     */
    public readonly type: CommercialCommissionType,

    /**
     * Commission percentage applied by the rule.
     */
    public readonly percentage: CommercialCommissionPercentage,

    /**
     * Timestamp from which the rule becomes effective.
     */
    public readonly effectiveFrom: CommercialCommissionRuleEffectiveFrom,

    /**
     * Optional timestamp at which the rule ceases to be effective.
     *
     * Undefined represents an open-ended rule.
     */
    public readonly effectiveTo:
      CommercialCommissionRuleEffectiveTo | undefined,

    /**
     * Version of the commercial commission policy.
     */
    public readonly version: CommercialCommissionRuleVersion,

    /**
     * Correlation identifier used to trace the command and resulting domain
     * event through the application workflow.
     */
    public readonly correlationId: string,

    /**
     * Optional causation identifier identifying the command or event that
     * caused this command.
     */
    public readonly causationId?: string,
  ) {}
}
