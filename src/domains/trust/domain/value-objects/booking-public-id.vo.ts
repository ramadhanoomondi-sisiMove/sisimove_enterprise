// src/domains/trust/domain/value-objects/booking-public-id.vo.ts

import { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

export class BookingPublicId extends PublicEntityId {
  constructor(value?: string) {
    super(value, 'BKG');
  }
}
