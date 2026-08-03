import { AssetDomainException } from '../asset-domain.exception';

export class InvalidModerationReasonException extends AssetDomainException {
  constructor(message: string) {
    super('INVALID_MODERATION_REASON', message);

    Object.freeze(this);
  }
}
