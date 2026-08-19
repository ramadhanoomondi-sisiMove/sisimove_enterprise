// src/domains/journey-boarding/application/commands/create-journey-boarding.command.ts

// -----------------------------------------------------------------------------
// Journey Boarding — Create Command
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Command } from '../../../../foundation/kernel/application/command';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import type {
  JourneyBoardingJourneyId,
  JourneyBoardingProviderPublicId,
} from '../../domain/value-objects';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

/**
 * Creates a new Journey Boarding aggregate.
 *
 * The command receives the cross-domain identities required to establish
 * the Journey Boarding aggregate:
 *
 * - Journey reference
 * - Provider reference
 *
 * The Journey Boarding lifecycle starts in `NOT_STARTED`.
 *
 * Participants, boarding events, timestamps, and aggregate version are
 * established by the domain aggregate and its application workflow.
 */
export class CreateJourneyBoardingCommand extends Command {
  constructor(
    // -------------------------------------------------------------------------
    // Journey
    // -------------------------------------------------------------------------

    /**
     * Public identifier of the Journey for which boarding is being created.
     *
     * References Journey.publicId across the bounded-context boundary.
     */
    public readonly journeyId: JourneyBoardingJourneyId,

    // -------------------------------------------------------------------------
    // Provider
    // -------------------------------------------------------------------------

    /**
     * Public identifier of the provider responsible for the Journey.
     *
     * References the provider/member identity across the bounded-context
     * boundary.
     */
    public readonly providerPublicId: JourneyBoardingProviderPublicId,

    // -------------------------------------------------------------------------
    // Correlation
    // -------------------------------------------------------------------------

    /**
     * Correlation identifier for distributed tracing and workflow tracking.
     */
    public readonly correlationId: string,

    // -------------------------------------------------------------------------
    // Causation
    // -------------------------------------------------------------------------

    /**
     * Identifier of the command or event that caused this command, when
     * applicable.
     */
    public readonly causationId?: string,
  ) {
    super();
  }
}
