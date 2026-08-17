// -----------------------------------------------------------------------------
// Journey Demand Status
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Status
// -----------------------------------------------------------------------------

export enum JourneyDemandStatus {
  DRAFT = 'DRAFT',
  OPEN = 'OPEN',
  MATCHED = 'MATCHED',
  CONVERTED = 'CONVERTED',
  FULFILLED = 'FULFILLED',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED',
}

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface JourneyDemandStatusProps {
  value: JourneyDemandStatus;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

export class JourneyDemandStatusValueObject extends ValueObject<JourneyDemandStatusProps> {
  constructor(status: JourneyDemandStatus = JourneyDemandStatus.DRAFT) {
    if (!Object.values(JourneyDemandStatus).includes(status)) {
      throw new Error(`Invalid journey demand status "${status}".`);
    }

    super({
      value: status,
    });
  }

  // ---------------------------------------------------------------------------
  // Accessors
  // ---------------------------------------------------------------------------

  get value(): JourneyDemandStatus {
    return this.props.value;
  }

  // ---------------------------------------------------------------------------
  // State predicates
  // ---------------------------------------------------------------------------

  get isDraft(): boolean {
    return this.props.value === JourneyDemandStatus.DRAFT;
  }

  get isOpen(): boolean {
    return this.props.value === JourneyDemandStatus.OPEN;
  }

  get isMatched(): boolean {
    return this.props.value === JourneyDemandStatus.MATCHED;
  }

  get isConverted(): boolean {
    return this.props.value === JourneyDemandStatus.CONVERTED;
  }

  get isFulfilled(): boolean {
    return this.props.value === JourneyDemandStatus.FULFILLED;
  }

  get isCancelled(): boolean {
    return this.props.value === JourneyDemandStatus.CANCELLED;
  }

  get isExpired(): boolean {
    return this.props.value === JourneyDemandStatus.EXPIRED;
  }

  // ---------------------------------------------------------------------------
  // Lifecycle predicates
  // ---------------------------------------------------------------------------

  get isTerminal(): boolean {
    return (
      this.props.value === JourneyDemandStatus.FULFILLED ||
      this.props.value === JourneyDemandStatus.CANCELLED ||
      this.props.value === JourneyDemandStatus.EXPIRED
    );
  }

  get canBePublished(): boolean {
    return this.props.value === JourneyDemandStatus.DRAFT;
  }

  get canBeMatched(): boolean {
    return this.props.value === JourneyDemandStatus.OPEN;
  }

  get canBeConverted(): boolean {
    return this.props.value === JourneyDemandStatus.MATCHED;
  }

  get canBeFulfilled(): boolean {
    return this.props.value === JourneyDemandStatus.CONVERTED;
  }

  get canBeCancelled(): boolean {
    return (
      this.props.value === JourneyDemandStatus.DRAFT ||
      this.props.value === JourneyDemandStatus.OPEN ||
      this.props.value === JourneyDemandStatus.MATCHED
    );
  }

  get canBeExpired(): boolean {
    return this.props.value === JourneyDemandStatus.OPEN;
  }
}
