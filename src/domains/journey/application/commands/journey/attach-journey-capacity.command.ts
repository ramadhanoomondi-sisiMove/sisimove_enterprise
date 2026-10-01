// src/domains/journey/application/commands/journey/attach-journey-capacity.command.ts

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
 * Configures the capacity of an existing Journey.
 *
 * The command intentionally does NOT receive a JourneyCapacityPublicId or
 * booked-seat state.
 *
 * JourneyCapacity is a Journey-owned child entity, so the application handler
 * is responsible for:
 *
 * 1. Loading the Journey aggregate.
 * 2. Creating a new JourneyCapacityEntity from the supplied configuration.
 * 3. Initializing booked seats to zero.
 * 4. Attaching the child to the Journey aggregate.
 * 5. Persisting the aggregate.
 *
 * The generated JourneyCapacity public ID belongs to the newly created child
 * and is therefore not supplied by the caller.
 *
 * Booked seats are operational state and are not part of the initial capacity
 * configuration.
 */
export class AttachJourneyCapacityCommand extends Command {
  public constructor(
    public readonly journeyPublicId: JourneyPublicId,
    public readonly totalSeats: number,
    public readonly correlationId: string,
    public readonly causationId?: string,
  ) {
    super();
  }
}
