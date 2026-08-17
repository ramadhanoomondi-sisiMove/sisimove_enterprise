// -----------------------------------------------------------------------------
// Journey Demand ID
// -----------------------------------------------------------------------------

import { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

/**
 * Strongly typed identifier for the Journey Demand aggregate.
 *
 * This represents the internal domain identity (`id`), not the externally
 * exposed `publicId`.
 */
export class JourneyDemandId extends UniqueEntityId {}
