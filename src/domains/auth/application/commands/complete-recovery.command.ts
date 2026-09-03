// -----------------------------------------------------------------------------
// Recovery — Complete Command
// -----------------------------------------------------------------------------
//
// Application command representing the intent to complete an existing
// Recovery aggregate.
//
// Aggregate boundary:
//
// RecoveryAggregate
// └── RecoveryEntity
//
// -----------------------------------------------------------------------------
//
// Command intent:
//
//     Complete Recovery
//
// The command identifies the Recovery aggregate and supplies the
// domain-ready completion timestamp.
//
// The Recovery aggregate determines whether the Recovery is eligible to
// transition from its current lifecycle state to COMPLETED.
//
// -----------------------------------------------------------------------------
//
// Application responsibilities:
//
// The command handler is responsible for:
//
// - loading the Recovery aggregate;
// - validating that the Recovery exists;
// - invoking RecoveryAggregate.complete();
// - persisting the updated Recovery aggregate;
// - allowing the aggregate to record RecoveryCompletedEvent;
// - publishing resulting domain events through the application/infrastructure
//   event pipeline.
//
// -----------------------------------------------------------------------------
//
// Domain responsibilities:
//
// RecoveryEntity is responsible for:
//
// - enforcing Recovery lifecycle rules;
// - determining whether the Recovery can be completed;
// - transitioning the Recovery to COMPLETED;
// - recording completedAt;
// - maintaining Recovery invariants.
//
// RecoveryAggregate is responsible for:
//
// - protecting the aggregate boundary;
// - coordinating the completion transition;
// - recording RecoveryCompletedEvent;
// - preserving correlation/causation metadata.
//
// -----------------------------------------------------------------------------
//
// This command does NOT:
//
// - reset passwords directly;
// - restore accounts directly;
// - authenticate users;
// - generate recovery tokens;
// - hash recovery tokens;
// - compare raw recovery tokens;
// - modify Authentication directly;
// - revoke Sessions directly;
// - send notifications;
// - access Prisma;
// - perform external side effects.
//
// Password-reset execution, account restoration, authentication changes,
// session revocation, notification delivery, and other cross-aggregate
// orchestration belong to the appropriate application/infrastructure
// boundaries.
//
// -----------------------------------------------------------------------------
//
// Security boundary:
//
// No raw recovery-token material is carried by this command.
//
// Token generation, hashing, comparison, and validation belong to the
// appropriate security/application boundary.
//
// -----------------------------------------------------------------------------
//
// Completion flow:
//
//     Application Workflow
//            │
//            │ CompleteRecoveryCommand
//            ▼
//     CompleteRecoveryHandler
//            │
//            ├── load RecoveryAggregate
//            │
//            ├── RecoveryAggregate.complete()
//            │        │
//            │        └── RecoveryEntity.complete()
//            │
//            ├── RecoveryCompletedEvent recorded
//            │
//            └── repository.save()
//            │
//            ▼
//       Recovery persisted
//
// -----------------------------------------------------------------------------
//
// Event rule:
//
// RecoveryCompletedEvent is created by RecoveryAggregate.
//
// The command carries operation metadata only.
//
// The command handler must not construct the domain event directly.
//
// -----------------------------------------------------------------------------
//
// Timestamp boundary:
//
// completedAt is supplied as a domain value object.
//
// The command therefore does not accept or construct a raw Date for the
// completion timestamp.
//
// Validation of the timestamp's domain semantics belongs to
// RecoveryCompletedAt and RecoveryEntity.
//
// -----------------------------------------------------------------------------
//
// Correlation / causation:
//
// correlationId is required and identifies the overall operation.
//
// causationId is optional and identifies the command, event, or operation
// that caused this completion request.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Command } from '../../../../foundation/kernel/application/command';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import type {
  RecoveryPublicId,
  RecoveryCompletedAt,
} from '../../domain/value-objects';

// =============================================================================
// Command
// =============================================================================

/**
 * Command representing the application-level intent to complete an existing
 * Recovery aggregate.
 *
 * The command does not contain or determine the Recovery lifecycle status.
 *
 * RecoveryAggregate and RecoveryEntity determine whether the Recovery is
 * eligible for completion and enforce the transition to COMPLETED.
 */
export class CompleteRecoveryCommand extends Command {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    /**
     * Public identity of the Recovery aggregate to complete.
     */
    public readonly recoveryPublicId: RecoveryPublicId,

    /**
     * Domain-ready timestamp at which the Recovery is completed.
     *
     * The value object owns timestamp-specific validation.
     */
    public readonly completedAt: RecoveryCompletedAt,

    /**
     * Correlation identifier for the completion operation.
     *
     * Required because the resulting RecoveryCompletedEvent requires
     * correlation metadata.
     */
    public readonly correlationId: string,

    /**
     * Optional causation identifier.
     *
     * Identifies the command, event, or operation that caused this
     * completion request.
     */
    public readonly causationId?: string,
  ) {
    super();
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default CompleteRecoveryCommand;
