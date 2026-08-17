// -----------------------------------------------------------------------------
// Journey Demand Timezone
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface JourneyDemandTimezoneProps {
  value: string;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * IANA timezone identifier used by Journey Demand scheduling.
 *
 * The domain stores the identifier rather than embedding timezone behavior
 * into the value object.
 */
export class JourneyDemandTimezone extends ValueObject<JourneyDemandTimezoneProps> {
  constructor(timezone: string = 'Africa/Nairobi') {
    const normalized = timezone?.trim();

    if (!normalized) {
      throw new Error('Journey demand timezone cannot be empty.');
    }

    if (normalized.length > 100) {
      throw new Error('Journey demand timezone cannot exceed 100 characters.');
    }

    super({
      value: normalized,
    });
  }

  get value(): string {
    return this.props.value;
  }

  get isAfricaNairobi(): boolean {
    return this.props.value === 'Africa/Nairobi';
  }
}
