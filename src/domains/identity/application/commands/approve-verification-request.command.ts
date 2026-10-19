// -----------------------------------------------------------------------------
// Verification Request — Approve Command
// -----------------------------------------------------------------------------

import type { Command } from '../../../../foundation/kernel/application/command';

import type {
  IdentityPublicId,
  VerificationPublicId,
  VerificationRequestPublicId,
} from '../../domain/value-objects';

/**
 * Command for approving a VerificationRequestEntity owned by a Verification
 * aggregate.
 *
 * The command carries the verification, request, and reviewer public IDs.
 * The application handler resolves the aggregate and delegates approval to
 * VerificationAggregate.approveRequest().
 *
 * The command does not load or mutate domain entities, persist data, emit
 * domain events, modify Identity roles, or perform external side effects.
 */
export class ApproveVerificationRequestCommand implements Command {
  public constructor(
    /**
     * Public ID of the Verification aggregate containing the request.
     */
    public readonly verificationPublicId: VerificationPublicId,

    /**
     * Public ID of the request to approve.
     */
    public readonly requestPublicId: VerificationRequestPublicId,

    /**
     * Public ID of the Identity performing the review.
     */
    public readonly reviewedByPublicId: IdentityPublicId,

    /**
     * Correlation ID for the approval operation and its domain events.
     */
    public readonly correlationId: string,

    /**
     * Optional ID of the command, event, or operation that caused this action.
     */
    public readonly causationId?: string,

    /**
     * Optional review timestamp. When omitted, the aggregate uses its
     * established default review-time behavior.
     */
    public readonly reviewedAt?: Date,
  ) {}
}

export default ApproveVerificationRequestCommand;
