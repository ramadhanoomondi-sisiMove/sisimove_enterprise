// -----------------------------------------------------------------------------
// Recovery — Expire Command
// -----------------------------------------------------------------------------
//
// Application command representing the intent to expire a Recovery aggregate.
//
// Aggregate boundary:
//
// RecoveryAggregate
// └── RecoveryEntity
//
// -----------------------------------------------------------------------------
//
// Intent:
//
//     Expire Recovery
//
// The command carries the information required by the application workflow
// to identify the Recovery and provide the reference point against which
// expiration is evaluated.
//
// Expiration semantics remain entirely inside the Recovery aggregate/entity.
//
// The aggregate determines:
//
// - whether the Recovery is currently expired;
// - whether the Recovery is eligible for expiration;
// - whether a lifecycle transition is required;
// - whether RecoveryExpiredEvent should be recorded.
//
// -----------------------------------------------------------------------------
//
// Application responsibilities:
//
// The command handler is responsible for:
//
// - loading the Recovery aggregate;
// - supplying the reference date to the aggregate;
// - invoking RecoveryAggregate.expire();
// - persisting the aggregate;
//
// Domain responsibilities:
//
// The Recovery aggregate/entity is responsible for:
//
// - evaluating expiration;
// - enforcing lifecycle invariants;
// - transitioning PENDING → EXPIRED when appropriate;
// - recording RecoveryExpiredEvent when the transition occurs.
//
// -----------------------------------------------------------------------------
//
// This command does NOT:
//
// - determine whether the Recovery has expired;
// - modify Recovery status;
// - calculate expiry timestamps;
// - generate recovery tokens;
// - hash recovery tokens;
// - compare raw recovery tokens;
// - reset passwords;
// - authenticate users;
// - modify Identity;
// - modify Authentication;
// - revoke Sessions;
// - send notifications;
// - access Prisma;
// - persist the Recovery aggregate;
// - perform external side effects.
//
// -----------------------------------------------------------------------------
//
// Required inputs:
//
// - recoveryPublicId;
// - referenceDate;
// - correlationId.
//
// Optional:
//
// - causationId.
//
// -----------------------------------------------------------------------------
//
// Reference date:
//
// referenceDate represents the point in time against which the domain
// expiration rule is evaluated.
//
// It is deliberately supplied by the caller rather than created inside the
// aggregate. This makes expiration deterministic and allows scheduled,
// background, and workflow-driven expiration to use an explicit time.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Command } from '../../../../foundation/kernel/application/command';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import type { RecoveryPublicId } from '../../domain/value-objects';

// =============================================================================
// Command
// =============================================================================

/**
 * Application command representing the intent to expire a Recovery.
 *
 * The command does not determine whether expiration should occur.
 *
 * That decision belongs to RecoveryAggregate and RecoveryEntity.
 */
export class ExpireRecoveryCommand extends Command {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    /**
     * Public identity of the Recovery aggregate to evaluate for expiration.
     *
     * This is an opaque public identifier and does not expose the internal
     * persistence identity.
     */
    public readonly recoveryPublicId: RecoveryPublicId,

    /**
     * Reference timestamp used by the Recovery aggregate when evaluating
     * expiration.
     *
     * The caller supplies this value so that the domain operation can be
     * deterministic and independently testable.
     */
    public readonly referenceDate: Date,

    /**
     * Correlation identifier for the expiration operation.
     *
     * This value is propagated to RecoveryExpiredEvent when an actual
     * lifecycle transition occurs.
     */
    public readonly correlationId: string,

    /**
     * Optional identifier of the command or domain event that caused this
     * expiration command.
     *
     * This value is propagated to RecoveryExpiredEvent when supplied.
     */
    public readonly causationId?: string,
  ) {
    super();
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default ExpireRecoveryCommand;
