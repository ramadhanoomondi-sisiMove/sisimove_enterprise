import { AssetDomainException } from '../asset-domain.exception';

export class InvalidModerationConfidenceException extends AssetDomainException {
  constructor(message: string) {
    super('INVALID_MODERATION_CONFIDENCE', message);

    Object.freeze(this);
  }
}
