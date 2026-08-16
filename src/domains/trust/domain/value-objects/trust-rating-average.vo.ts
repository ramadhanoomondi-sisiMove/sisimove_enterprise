// src/domains/trust/domain/value-objects/trust-rating-average.vo.ts

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

interface TrustRatingAverageProps {
  value: number;
}

export class TrustRatingAverage extends ValueObject<TrustRatingAverageProps> {
  public static readonly MIN = 0;
  public static readonly MAX = 5;

  constructor(average: number) {
    if (!Number.isFinite(average)) {
      throw new Error(`Trust rating average must be a finite number.`);
    }

    if (average < TrustRatingAverage.MIN || average > TrustRatingAverage.MAX) {
      throw new Error(
        `Trust rating average must be between ${TrustRatingAverage.MIN} and ${TrustRatingAverage.MAX}.`,
      );
    }

    const normalizedAverage = Number(average.toFixed(2));

    super({
      value: normalizedAverage,
    });
  }

  get value(): number {
    return this.props.value;
  }

  get hasRatings(): boolean {
    return this.props.value > 0;
  }

  get isPerfect(): boolean {
    return this.props.value === TrustRatingAverage.MAX;
  }

  get isZero(): boolean {
    return this.props.value === TrustRatingAverage.MIN;
  }
}
