// src/domains/social/domain/value-objects/traveller-handle.vo.ts

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

interface TravellerHandleProps {
  value: string;
}

export class TravellerHandle extends ValueObject<TravellerHandleProps> {
  private static readonly HANDLE_REGEX =
    /^[a-z0-9](?:[a-z0-9_-]{1,28}[a-z0-9])?$/;

  constructor(handle: string) {
    const normalizedHandle = handle.trim().toLowerCase();

    if (
      normalizedHandle.length < 3 ||
      normalizedHandle.length > 30 ||
      !TravellerHandle.HANDLE_REGEX.test(normalizedHandle)
    ) {
      throw new Error(`Invalid traveller handle "${handle}".`);
    }

    super({
      value: normalizedHandle,
    });
  }

  get value(): string {
    return this.props.value;
  }
}
