// src/domains/journey-boarding/application/commands/open-journey-boarding.command.ts

// -----------------------------------------------------------------------------
// Journey Boarding — Open Command
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Command } from '../../../../foundation/kernel/application/command';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

/**
 * Opens the boarding process for an existing Journey Boarding aggregate.
 *
 * The command does not contain a new lifecycle status because opening
 * boarding is an explicit domain operation.
 *
 * The aggregate is responsible for enforcing the valid transition:
 *
 * NOT_STARTED → BOARDING
 *
 * The application handler is responsible for loading the aggregate and
 * invoking the corresponding domain operation.
 *
 * `boardingStartedAt` is optional. When omitted, the domain aggregate uses
 * the current time.
 */
export class OpenJourneyBoardingCommand extends Command {
  constructor(
    // =========================================================================
    // Journey Boarding
    // =========================================================================

    /**
     * Public identifier of the Journey Boarding aggregate to open.
     *
     * This identifies the aggregate whose boarding process should transition
     * from NOT_STARTED to BOARDING.
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
    // Boarding Start Time
    // =========================================================================

    /**
     * Optional timestamp at which boarding is considered to have opened.
     *
     * When omitted, JourneyBoardingAggregate.open() defaults this value to
     * the current time.
     */
    public readonly boardingStartedAt?: Date,
  ) {
    super();
  }
}
