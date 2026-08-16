// src/domains/journey/domain/value-objects/journey-asset-type.vo.ts

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Journey Asset Type
// -----------------------------------------------------------------------------

export enum JourneyAssetType {
  COVER = 'COVER',
  VEHICLE = 'VEHICLE',
  GALLERY = 'GALLERY',
}

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface JourneyAssetTypeProps {
  value: JourneyAssetType;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

export class JourneyAssetTypeValueObject extends ValueObject<JourneyAssetTypeProps> {
  constructor(type: JourneyAssetType) {
    if (!Object.values(JourneyAssetType).includes(type)) {
      throw new Error(`Invalid journey asset type "${type}".`);
    }

    super({
      value: type,
    });
  }

  get value(): JourneyAssetType {
    return this.props.value;
  }

  get isCover(): boolean {
    return this.props.value === JourneyAssetType.COVER;
  }

  get isVehicle(): boolean {
    return this.props.value === JourneyAssetType.VEHICLE;
  }

  get isGallery(): boolean {
    return this.props.value === JourneyAssetType.GALLERY;
  }
}
