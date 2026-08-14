// src/domains/social/domain/value-objects/country-code.vo.ts

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

interface CountryCodeProps {
  value: string;
}

export class CountryCode extends ValueObject<CountryCodeProps> {
  private static readonly COUNTRY_CODE_REGEX = /^[A-Z]{2}$/;

  constructor(countryCode: string) {
    const normalizedCountryCode = countryCode.trim().toUpperCase();

    if (!CountryCode.COUNTRY_CODE_REGEX.test(normalizedCountryCode)) {
      throw new Error(
        `Invalid country code "${countryCode}". Expected ISO 3166-1 alpha-2 format.`,
      );
    }

    super({
      value: normalizedCountryCode,
    });
  }

  get value(): string {
    return this.props.value;
  }
}
