// src/domains/trust/domain/value-objects/provider-cancellations.vo.ts

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

interface ProviderCancellationsProps {
  value: number;
}

export class ProviderCancellations extends ValueObject<ProviderCancellationsProps> {
  constructor(count: number = 0) {
    if (!Number.isInteger(count) || count < 0) {
      throw new Error(`Provider cancellations must be a non-negative integer.`);
    }

    super({
      value: count,
    });
  }

  get value(): number {
    return this.props.value;
  }

  get isEmpty(): boolean {
    return this.props.value === 0;
  }

  get hasCancellations(): boolean {
    return this.props.value > 0;
  }
}
