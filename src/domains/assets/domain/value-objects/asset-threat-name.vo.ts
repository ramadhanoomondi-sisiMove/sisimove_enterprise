// src/domains/assets/domain/value-objects/asset-threat-name.vo.ts

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

import { InvalidAssetThreatNameException } from '../exceptions';

interface AssetThreatNameProps {
  value: string;
}

export class AssetThreatName extends ValueObject<AssetThreatNameProps> {
  public static readonly MAX_LENGTH = 255;

  constructor(value: string) {
    const normalized = value.trim();

    AssetThreatName.validate(normalized);

    super({
      value: normalized,
    });

    Object.freeze(this);
  }

  get value(): string {
    return this.props.value;
  }

  public override toString(): string {
    return this.value;
  }

  private static validate(value: string): void {
    if (value.length === 0 || value.length > AssetThreatName.MAX_LENGTH) {
      throw new InvalidAssetThreatNameException();
    }
  }
}
