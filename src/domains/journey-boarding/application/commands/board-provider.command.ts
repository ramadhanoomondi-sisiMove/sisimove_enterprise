// src/domains/journey-boarding/application/commands/board-provider.command.ts

// -----------------------------------------------------------------------------
// Journey Boarding — Board Provider Command
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Command } from '../../../../foundation/kernel/application/command';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

/**
 * Boards the provider participating in a Journey Boarding process.
 *
 * The command represents the explicit provider boarding action.
 *
 * The Journey Boarding aggregate is responsible for enforcing the domain
 * invariants and participant lifecycle transition:
 *
 * EXPECTED → BOARDED
 *
 * The aggregate additionally verifies that:
 *
 * - boarding modification is currently allowed;
 * - Journey Boarding is in BOARDING state;
 * - the provider participant exists;
 * - the provider has not already boarded;
 * - the provider participant is EXPECTED;
 * - the provider participant matches the Journey Boarding provider.
 *
 * The resulting JourneyBoardingProviderBoardedEvent is recorded by the
 * aggregate.
 */
export class BoardProviderCommand extends Command {
  constructor(
    // =========================================================================
    // Journey Boarding
    // =========================================================================

    /**
     * Public identifier of the Journey Boarding aggregate.
     *
     * This identifies the boarding process in which the provider is boarding.
     */
    public readonly journeyBoardingPublicId: string,

    // =========================================================================
    // Correlation
    // =========================================================================

    /**
     * Correlation identifier used to trace the command and resulting domain
     * event through the application workflow.
     */
    public readonly correlationId: string,

    // =========================================================================
    // Causation
    // =========================================================================

    /**
     * Optional identifier of the command or event that caused this command.
     */
    public readonly causationId?: string,

    // =========================================================================
    // Boarding Time
    // =========================================================================

    /**
     * Optional timestamp at which the provider physically boarded.
     *
     * When omitted, the domain operation uses the current time.
     */
    public readonly boardedAt?: Date,
  ) {
    super();
  }
}
