// -----------------------------------------------------------------------------
// Verification Request — Reject Command
// -----------------------------------------------------------------------------

import type { Command } from '../../../../foundation/kernel/application/command';

import type {
  IdentityPublicId,
  VerificationPublicId,
  VerificationRequestPublicId,
} from '../../domain/value-objects';

/**
 * Command for rejecting a VerificationRequestEntity owned by a Verification
 * aggregate.
 *
 * The command carries the target Verification ID, request ID, reviewer ID,
 * rejection reason, and operation metadata.
 *
 * The application handler resolves the aggregate and delegates request
 * rejection to VerificationAggregate.rejectRequest().
 *
 * The command does not load or mutate domain entities, persist data, emit
 * domain events, modify Identity roles, or perform external side effects.
 */
export class RejectVerificationRequestCommand implements Command {
  public constructor(
    /**
     * Public ID of the Verification aggregate containing the request.
     */
    public readonly verificationPublicId: VerificationPublicId,

    /**
     * Public ID of the VerificationRequest to reject.
     */
    public readonly requestPublicId: VerificationRequestPublicId,

    /**
     * Public ID of the Identity performing the review.
     */
    public readonly reviewedByPublicId: IdentityPublicId,

    /**
     * Reason for rejecting the VerificationRequest.
     * The aggregate validates and normalizes this value.
     */
    public readonly reason: string,

    /**
     * Correlation ID for the rejection operation and resulting domain event.
     */
    public readonly correlationId: string,

    /**
     * Optional identifier of the command, event, or operation that caused
     * this rejection request.
     */
    public readonly causationId?: string,

    /**
     * Optional timestamp for the rejection review.
     */
    public readonly reviewedAt?: Date,
  ) {}
}

export default RejectVerificationRequestCommand;
