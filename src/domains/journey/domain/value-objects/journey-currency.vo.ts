// src/domains/journey/domain/value-objects/journey-currency.vo.ts

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

interface JourneyCurrencyProps {
  value: string;
}

export class JourneyCurrency extends ValueObject<JourneyCurrencyProps> {
  public static readonly DEFAULT = 'KES';
  public static readonly LENGTH = 3;

  constructor(currency: string = JourneyCurrency.DEFAULT) {
    const normalizedCurrency = currency.trim().toUpperCase();

    if (normalizedCurrency.length !== JourneyCurrency.LENGTH) {
      throw new Error(
        'Journey currency must be a valid three-letter currency code.',
      );
    }

    if (!/^[A-Z]{3}$/.test(normalizedCurrency)) {
      throw new Error(
        'Journey currency must contain only three uppercase letters.',
      );
    }

    super({
      value: normalizedCurrency,
    });
  }

  get value(): string {
    return this.props.value;
  }

  get isKenyanShilling(): boolean {
    return this.props.value === JourneyCurrency.DEFAULT;
  }
}
