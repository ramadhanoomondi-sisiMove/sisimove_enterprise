// src/domains/assets/domain/exceptions/asset-domain.exception.ts

import { DomainException } from '../../../../foundation/kernel/domain/domain-exception';

export abstract class AssetDomainException extends DomainException {
  protected constructor(code: string, message: string) {
    super(code, message);

    Object.freeze(this);
  }
}
