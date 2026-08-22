// -----------------------------------------------------------------------------
// Commercial Commission Rule — Update Command
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
  CommercialCommissionRulePublicId,
  CommercialCommissionRuleVersion,
  CommercialCommissionPercentage,
  CommercialCommissionType,
} from '../../domain/value-objects';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

/**
 * Command for updating a Commercial Commission Rule aggregate.
 *
 * The command carries domain-ready value objects rather than raw transport
 * values. DTO-to-domain conversion belongs to the presentation/application
 * boundary.
 *
 * The commission rule aggregate delegates intrinsic validation to the
 * Commercial Commission Rule entity.
 *
 * Active rules cannot be modified. The domain entity enforces that invariant.
 *
 * Cross-rule concerns, such as effective-period overlap with another rule of
 * the same commission type, are intentionally handled outside this command
 * and aggregate.
 */
export class UpdateCommercialCommissionRuleCommand implements Command {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  constructor(
    /**
     * Public identity of the Commercial Commission Rule being updated.
     */
    public readonly publicId: CommercialCommissionRulePublicId,

    /**
     * Commission type governed by the rule.
     */
    public readonly type: CommercialCommissionType,

    /**
     * Commission percentage defined by the updated rule.
     */
    public readonly percentage: CommercialCommissionPercentage,

    /**
     * Timestamp from which the updated rule becomes effective.
     */
    public readonly effectiveFrom: CommercialCommissionRuleEffectiveFrom,

    /**
     * Optional timestamp at which the updated rule ceases to be effective.
     *
     * Undefined represents an open-ended rule.
     */
    public readonly effectiveTo:
      CommercialCommissionRuleEffectiveTo | undefined,

    /**
     * Version of the updated commercial commission policy.
     */
    public readonly version: CommercialCommissionRuleVersion,

    /**
     * Timestamp at which the update is applied.
     */
    public readonly updatedAt: Date,

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
