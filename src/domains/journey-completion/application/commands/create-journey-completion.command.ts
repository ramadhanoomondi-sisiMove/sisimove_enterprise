// -----------------------------------------------------------------------------
// Journey Completion — Create Command
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { Command } from '../../../../foundation/kernel/application/command';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import type {
  JourneyCompletionJourneyPublicId,
  JourneyCompletionProviderPublicId,
} from '../../domain/value-objects';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

/**
 * Command for creating a Journey Completion aggregate.
 *
 * The command carries domain-ready value objects rather than raw transport
 * values. DTO-to-domain conversion belongs to the presentation/application
 * boundary.
 *
 * A newly created Journey Completion always begins in PENDING state.
 *
 * Confirmations and disputes are intentionally not part of this command.
 */
export class CreateJourneyCompletionCommand implements Command {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  constructor(
    public readonly journeyPublicId: JourneyCompletionJourneyPublicId,
    public readonly providerPublicId: JourneyCompletionProviderPublicId,
    public readonly requiredConfirmations: number,
    public readonly correlationId: string,
    public readonly causationId?: string,
  ) {}
}
