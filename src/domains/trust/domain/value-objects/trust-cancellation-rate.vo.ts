// src/domains/trust/domain/value-objects/trust-cancellation-rate.vo.ts

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

interface TrustCancellationRateProps {
  value: number;
}

export class TrustCancellationRate extends ValueObject<TrustCancellationRateProps> {
  public static readonly MIN = 0;
  public static readonly MAX = 100;

  constructor(rate: number = 0) {
    if (!Number.isFinite(rate)) {
      throw new Error(`Trust cancellation rate must be a finite number.`);
    }

    if (rate < TrustCancellationRate.MIN || rate > TrustCancellationRate.MAX) {
      throw new Error(
        `Trust cancellation rate must be between ${TrustCancellationRate.MIN} and ${TrustCancellationRate.MAX}.`,
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
    return this.props.value === TrustCancellationRate.MIN;
  }

  get isPerfect(): boolean {
    return this.props.value === TrustCancellationRate.MAX;
  }
}
