// src/domains/journey/domain/value-objects/journey-asset-sort-order.vo.ts

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

interface JourneyAssetSortOrderProps {
  value: number;
}

export class JourneyAssetSortOrder extends ValueObject<JourneyAssetSortOrderProps> {
  constructor(sortOrder: number = 0) {
    if (!Number.isInteger(sortOrder) || sortOrder < 0) {
      throw new Error(
        'Journey asset sort order must be a non-negative integer.',
      );
    }

    super({
      value: sortOrder,
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
