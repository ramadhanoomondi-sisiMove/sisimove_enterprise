import { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

export class VerificationId extends PublicEntityId {
  constructor(value?: string) {
    super(value, 'VRF');
  }
}
