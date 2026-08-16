// src/domains/journey/domain/value-objects/journey-schedule-public-id.vo.ts

import { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

export class JourneySchedulePublicId extends PublicEntityId {
  constructor(value?: string) {
    super(value, 'JSC');
  }
}
