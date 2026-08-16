// src/domains/journey/application/commands/journey/publish-journey.command.ts

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Command } from '../../../../../foundation/kernel/application/command';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

export class PublishJourneyCommand extends Command {
  constructor(
    /**
     * Public identifier of the Journey to publish.
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
     * Effective publication timestamp.
     *
     * Defaults to the handler execution time when omitted.
     */
    public readonly publishedAt?: Date,
  ) {
    super();
  }
}
