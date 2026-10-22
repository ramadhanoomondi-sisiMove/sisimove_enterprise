// -----------------------------------------------------------------------------
// Application — Get Trust Profiles Page Query
// -----------------------------------------------------------------------------

import { Query } from '../../../../../foundation/kernel/application/query';

import type { TrustProfileStatusValueObject } from '../../../domain/value-objects/trust-profile-status.vo';

import type { TrustVerificationLevelValueObject } from '../../../domain/value-objects/trust-verification-level.vo';

export class GetTrustProfilesPageQuery extends Query {
  public constructor(
    public readonly page: number = 1,
    public readonly pageSize: number = 20,
    public readonly status?: TrustProfileStatusValueObject,
    public readonly verificationLevel?: TrustVerificationLevelValueObject,
  ) {
    super();
  }
}
