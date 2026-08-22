// -----------------------------------------------------------------------------
// Commercial Commission Rule — Activate Command
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { Command } from '../../../../foundation/kernel/application/command';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import type { CommercialCommissionRulePublicId } from '../../domain/value-objects';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

/**
 * Command for activating a Commercial Commission Rule aggregate.
 *
 * The command carries the identity of the commission rule together with the
 * timestamp at which the activation is requested.
 *
 * The aggregate is responsible for enforcing intrinsic lifecycle rules, such
 * as preventing an already-active rule from being activated again.
 *
 * Cross-rule policies, such as effective-period overlap with another
 * commission rule of the same type, belong to the application/domain service
 * coordinating this command and are not enforced by the command itself.
 */
export class ActivateCommercialCommissionRuleCommand implements Command {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  constructor(
    /**
     * Public identity of the Commercial Commission Rule to activate.
     */
    public readonly publicId: CommercialCommissionRulePublicId,

    /**
     * Timestamp at which the activation is requested.
     */
    public readonly activatedAt: Date,

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
