// src/domains/trust/application/queries/trust-badge/get-trust-badges-by-asset.query.ts

import { Query } from '../../../../../foundation/kernel/application/query';

export class GetTrustBadgesByAssetQuery extends Query {
  constructor(public readonly assetPublicId: string) {
    super();
  }
}
