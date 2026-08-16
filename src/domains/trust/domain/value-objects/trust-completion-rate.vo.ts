// src/domains/trust/domain/value-objects/trust-completion-rate.vo.ts

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

interface TrustCompletionRateProps {
  value: number;
}

export class TrustCompletionRate extends ValueObject<TrustCompletionRateProps> {
  public static readonly MIN = 0;
  public static readonly MAX = 100;

  constructor(rate: number = 0) {
    if (!Number.isFinite(rate)) {
      throw new Error(`Trust completion rate must be a finite number.`);
    }

    if (rate < TrustCompletionRate.MIN || rate > TrustCompletionRate.MAX) {
      throw new Error(
        `Trust completion rate must be between ${TrustCompletionRate.MIN} and ${TrustCompletionRate.MAX}.`,
      );
    }

    const normalizedRate = Number(rate.toFixed(2));

    super({
      value: normalizedRate,
    });
  }

  get value(): number {
    return this.props.value;
  }

  get isZero(): boolean {
    return this.props.value === TrustCompletionRate.MIN;
  }

  get isComplete(): boolean {
    return this.props.value === TrustCompletionRate.MAX;
  }
}
