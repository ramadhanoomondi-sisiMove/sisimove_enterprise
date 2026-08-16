// src/domains/journey/domain/value-objects/journey-waypoint-sequence.vo.ts

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface JourneyWaypointSequenceProps {
  value: number;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

export class JourneyWaypointSequence extends ValueObject<JourneyWaypointSequenceProps> {
  constructor(sequence: number) {
    if (!Number.isInteger(sequence) || sequence < 0) {
      throw new Error(
        'Journey waypoint sequence must be a non-negative integer.',
      );
    }

    super({
      value: sequence,
    });
  }

  get value(): number {
    return this.props.value;
  }

  get isFirst(): boolean {
    return this.props.value === 0;
  }

  get isAfterFirst(): boolean {
    return this.props.value > 0;
  }
}
