// src/domains/journey/application/commands/journey/attach-journey-corridor.command.ts

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Command } from '../../../../../foundation/kernel/application/command';

// -----------------------------------------------------------------------------
// Domain
// -----------------------------------------------------------------------------

import type { JourneyPublicId } from '../../../domain/value-objects/journey-public-id.vo';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

/**
 * Configures the corridor of an existing Journey.
 *
 * JourneyCorridor is a Journey-owned child entity. Therefore this command
 * carries the corridor configuration required to create that child.
 *
 * The application handler is responsible for:
 *
 * 1. Resolving the Journey aggregate.
 * 2. Creating a JourneyCorridorEntity from this configuration.
 * 3. Attaching the corridor to the Journey aggregate.
 * 4. Persisting the aggregate.
 *
 * The caller does not provide a JourneyCorridorPublicId because the public
 * identity belongs to the newly created child entity.
 */
export class AttachJourneyCorridorCommand extends Command {
  public constructor(
    public readonly journeyPublicId: JourneyPublicId,
    public readonly originName: string,
    public readonly originLatitude: number,
    public readonly originLongitude: number,
    public readonly destinationName: string,
    public readonly destinationLatitude: number,
    public readonly destinationLongitude: number,
    public readonly correlationId: string,
    public readonly causationId?: string,
  ) {
    super();
  }
}
