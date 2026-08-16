// src/domains/trust/application/queries/trust-profile/get-trust-profile-by-member.query.ts

import { Query } from '../../../../../foundation/kernel/application/query';

export class GetTrustProfileByMemberQuery extends Query {
  constructor(public readonly memberPublicId: string) {
    super();
  }
}
