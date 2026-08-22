// -----------------------------------------------------------------------------
// Commercial Commission Rule — Deactivate Command
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
 * Command for deactivating a Commercial Commission Rule aggregate.
 *
 * The command identifies the commission rule through its public identifier and
 * carries the timestamp at which the deactivation is requested.
 *
 * Intrinsic lifecycle validation remains within the Commercial Commission Rule
 * aggregate and entity.
 *
 * The aggregate prevents invalid lifecycle transitions such as attempting to
 * deactivate an already-inactive rule.
 *
 * Cross-rule concerns are intentionally outside this command and aggregate.
 */
export class DeactivateCommercialCommissionRuleCommand implements Command {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  constructor(
    /**
     * Public identity of the Commercial Commission Rule to deactivate.
     */
    public readonly publicId: CommercialCommissionRulePublicId,

    /**
     * Timestamp at which the deactivation is requested.
     */
    public readonly deactivatedAt: Date,

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
