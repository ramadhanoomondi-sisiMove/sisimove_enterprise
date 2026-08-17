// -----------------------------------------------------------------------------
// Journey Demand Sequence
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface JourneyDemandSequenceProps {
  value: number;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Ordered position of a waypoint within a Journey Demand corridor.
 */
export class JourneyDemandSequence extends ValueObject<JourneyDemandSequenceProps> {
  constructor(sequence: number) {
    if (!Number.isInteger(sequence) || sequence < 0) {
      throw new Error(
        'Journey demand waypoint sequence must be a non-negative integer.',
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

  get isOrdered(): boolean {
    return this.props.value > 0;
  }
}
