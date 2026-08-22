// -----------------------------------------------------------------------------
// Commercial Earning Commission — Create Command
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { Command } from '../../../../foundation/kernel/application/command';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import type {
  CommercialCommissionRulePublicId,
  CommercialEarningCommissionAmount,
  CommercialEarningCommissionBaseAmount,
  CommercialEarningCommissionCurrency,
  CommercialEarningCommissionJourneyPublicId,
  CommercialEarningCommissionNetAmount,
  CommercialEarningCommissionPercentage,
  CommercialEarningCommissionProviderPublicId,
  CommercialEarningCommissionSettlementPublicId,
} from '../../domain/value-objects';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

/**
 * Command for creating a Commercial Earning Commission aggregate.
 *
 * A Commercial Earning Commission represents the platform commission assessed
 * against a provider's earning from a Journey Settlement.
 *
 * The command carries domain-ready value objects rather than raw transport
 * values. DTO-to-domain conversion belongs to the presentation/application
 * boundary.
 *
 * The command captures the complete commercial earning assessment snapshot:
 *
 * - Commercial Commission Rule reference;
 * - Journey reference;
 * - Settlement reference;
 * - Provider reference;
 * - commission percentage;
 * - provider earning before commission;
 * - commission amount retained by the platform;
 * - provider net earning after commission;
 * - currency.
 *
 * These values become historical snapshots on the Commercial Earning
 * Commission entity. They remain stable even when the underlying Commercial
 * Commission Rule changes later.
 *
 * A newly created Commercial Earning Commission always begins in PENDING
 * state.
 *
 * Assessment and cancellation are handled by their respective commands.
 *
 * The command does not own or modify:
 *
 * - Journey;
 * - Journey Settlement;
 * - Identity / Provider;
 * - Commercial Commission Rule;
 * - Wallet;
 * - Disbursement;
 * - Treasury;
 * - Accounting.
 *
 * Those concepts belong to other bounded contexts or independent aggregates
 * and are represented through public identifiers.
 */
export class CreateCommercialEarningCommissionCommand implements Command {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  constructor(
    /**
     * Public identity of the Commercial Commission Rule used to produce this
     * earning commission assessment.
     *
     * The rule reference is retained as a historical reference to the
     * commercial policy used when the assessment was produced.
     */
    public readonly commissionRulePublicId: CommercialCommissionRulePublicId,

    /**
     * Public identity of the Journey whose provider earning is subject to the
     * commission.
     */
    public readonly journeyPublicId: CommercialEarningCommissionJourneyPublicId,

    /**
     * Public identity of the Settlement from which the provider earning was
     * derived.
     */
    public readonly settlementPublicId: CommercialEarningCommissionSettlementPublicId,

    /**
     * Public identity of the provider whose earning is subject to the
     * commission.
     *
     * Identity belongs to the Identity bounded context and is represented here
     * only through its public identifier.
     */
    public readonly providerPublicId: CommercialEarningCommissionProviderPublicId,

    /**
     * Commission percentage captured as part of the earning assessment
     * snapshot.
     */
    public readonly percentage: CommercialEarningCommissionPercentage,

    /**
     * Provider earning before the Commercial commission.
     */
    public readonly baseAmount: CommercialEarningCommissionBaseAmount,

    /**
     * Commission amount retained by the platform.
     *
     * This is a persisted historical assessment snapshot and is not
     * recalculated by the aggregate lifecycle.
     */
    public readonly commissionAmount: CommercialEarningCommissionAmount,

    /**
     * Provider earning remaining after the Commercial commission.
     *
     * This is a persisted historical assessment snapshot and has its own
     * domain value object because net-earning invariants are distinct from
     * commission-amount invariants.
     */
    public readonly netAmount: CommercialEarningCommissionNetAmount,

    /**
     * Currency in which the earning commission assessment is denominated.
     */
    public readonly currency: CommercialEarningCommissionCurrency,

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
