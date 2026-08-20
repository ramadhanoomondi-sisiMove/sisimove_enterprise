// src/domains/journey-completion/application/commands/review-journey-completion-dispute.command.ts

// -----------------------------------------------------------------------------
// Journey Completion — Review Dispute Command
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { Command } from '../../../../foundation/kernel/application/command';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import type { JourneyCompletionDisputePublicId } from '../../domain/value-objects';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

/**
 * Command requesting that an open Journey Completion dispute be placed
 * under review.
 *
 * The command carries domain-ready value objects. External request DTO
 * validation and conversion belong to the presentation/application boundary.
 *
 * The command does not contain a repository token or infrastructure concern.
 */
export class ReviewJourneyCompletionDisputeCommand implements Command {
  // ===========================================================================

  // Constructor

  // ===========================================================================

  constructor(
    public readonly disputePublicId: JourneyCompletionDisputePublicId,
    public readonly correlationId: string,
    public readonly causationId?: string,
    public readonly underReviewAt?: Date,
  ) {}
}
