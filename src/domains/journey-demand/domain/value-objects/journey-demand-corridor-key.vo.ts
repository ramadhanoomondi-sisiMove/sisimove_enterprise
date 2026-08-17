// -----------------------------------------------------------------------------
// Journey Demand Corridor Key
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface JourneyDemandCorridorKeyProps {
  value: string;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Stable discovery/matching identifier for a Journey Demand corridor.
 *
 * This is intentionally a domain identifier rather than a foreign key to
 * JourneyCorridor.
 */
export class JourneyDemandCorridorKey extends ValueObject<JourneyDemandCorridorKeyProps> {
  constructor(value: string) {
    const normalized = value?.trim();

    if (!normalized) {
      throw new Error('Journey demand corridor key cannot be empty.');
    }

    if (normalized.length > 255) {
      throw new Error(
        'Journey demand corridor key cannot exceed 255 characters.',
      );
    }

    super({
      value: normalized,
    });
  }

  get value(): string {
    return this.props.value;
  }
}
