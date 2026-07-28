import { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

export class VerificationRequestId extends PublicEntityId {
  constructor(value?: string) {
    super(value, 'VRQ');
  }
}
