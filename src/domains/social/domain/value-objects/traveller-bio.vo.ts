// src/domains/social/domain/value-objects/traveller-bio.vo.ts

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

interface TravellerBioProps {
  value: string | null;
}

export class TravellerBio extends ValueObject<TravellerBioProps> {
  private static readonly MAX_LENGTH = 500;

  constructor(bio?: string | null) {
    const normalizedBio = bio === null || bio === undefined ? null : bio.trim();

    if (
      normalizedBio !== null &&
      normalizedBio.length > TravellerBio.MAX_LENGTH
    ) {
      throw new Error(
        `Traveller bio cannot exceed ${TravellerBio.MAX_LENGTH} characters.`,
      );
    }

    super({
      value:
        normalizedBio === null || normalizedBio.length === 0
          ? null
          : normalizedBio,
    });
  }

  get value(): string | null {
    return this.props.value;
  }

  get isEmpty(): boolean {
    return this.props.value === null;
  }
}
