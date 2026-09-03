// -----------------------------------------------------------------------------
// Recovery — Cancel Command
// -----------------------------------------------------------------------------
//
// Application command for cancelling a Recovery aggregate.
//
// The command represents the application-level intent:
//
//     Cancel Recovery
//
// The command identifies the Recovery aggregate and supplies the domain-ready
// cancellation timestamp.
//
// The Recovery aggregate determines whether cancellation is permitted.
//
// The command handler is responsible for:
//
// - loading the Recovery aggregate;
// - invoking RecoveryAggregate.cancel();
// - persisting the aggregate;
// - publishing resulting domain events.
//
// This command does NOT:
//
// - reset passwords;
// - authenticate users;
// - generate recovery tokens;
// - compare recovery tokens;
// - modify Authentication directly;
// - revoke Sessions directly;
// - send notifications;
// - perform external side effects.
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
  RecoveryCancelledAt,
} from '../../domain/value-objects';

// =============================================================================
// Command
// =============================================================================

/**
 * Command for cancelling an existing Recovery aggregate.
 *
 * Required domain inputs:
 *
 * - recoveryPublicId;
 * - cancelledAt;
 * - correlationId.
 */
export class CancelRecoveryCommand extends Command {
  constructor(
    /**
     * Public identity of the Recovery aggregate to cancel.
     */
    public readonly recoveryPublicId: RecoveryPublicId,

    /**
     * Timestamp at which the Recovery is cancelled.
     */
    public readonly cancelledAt: RecoveryCancelledAt,

    /**
     * Correlation identifier for the cancellation operation.
     */
    public readonly correlationId: string,

    /**
     * Optional identifier of the command or domain event that caused this
     * command.
     */
    public readonly causationId?: string,
  ) {
    super();
  }
}
