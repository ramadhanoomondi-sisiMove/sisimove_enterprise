// src/domains/journey/application/commands/journey/expire-journey.command.ts

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Command } from '../../../../../foundation/kernel/application/command';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

export class ExpireJourneyCommand extends Command {
  constructor(
    /**
     * Public identifier of the Journey to expire.
     */
    public readonly journeyPublicId: string,

    /**
     * Correlation identifier for distributed tracing.
     */
    public readonly correlationId: string,

    /**
     * Causation identifier for distributed tracing.
     */
    public readonly causationId?: string,

    /**
     * Effective expiration timestamp.
     *
     * Defaults to the handler execution time when omitted.
     */
    public readonly expiredAt?: Date,
  ) {
    super();
  }
}
