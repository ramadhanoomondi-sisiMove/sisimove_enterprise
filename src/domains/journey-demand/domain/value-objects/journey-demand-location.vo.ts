// -----------------------------------------------------------------------------
// Journey Demand Location
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface JourneyDemandLocationProps {
  value: string;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Human-readable origin/destination/waypoint location name.
 */
export class JourneyDemandLocation extends ValueObject<JourneyDemandLocationProps> {
  constructor(value: string) {
    const normalized = value?.trim();

    if (!normalized) {
      throw new Error('Journey demand location cannot be empty.');
    }

    if (normalized.length > 255) {
      throw new Error('Journey demand location cannot exceed 255 characters.');
    }

    super({
      value: normalized,
    });
  }

  get value(): string {
    return this.props.value;
  }
}
