// src/domains/trust/domain/value-objects/trust-rating-score.vo.ts

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

interface TrustRatingScoreProps {
  value: number;
}

export class TrustRatingScore extends ValueObject<TrustRatingScoreProps> {
  public static readonly MIN = 1;
  public static readonly MAX = 5;

  constructor(score: number) {
    if (!Number.isInteger(score)) {
      throw new Error(`Trust rating score must be an integer.`);
    }

    if (score < TrustRatingScore.MIN || score > TrustRatingScore.MAX) {
      throw new Error(
        `Trust rating score must be between ${TrustRatingScore.MIN} and ${TrustRatingScore.MAX}.`,
      );
    }

    super({
      value: score,
    });
  }

  get value(): number {
    return this.props.value;
  }

  get isLowest(): boolean {
    return this.props.value === TrustRatingScore.MIN;
  }

  get isHighest(): boolean {
    return this.props.value === TrustRatingScore.MAX;
  }
}
