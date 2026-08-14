// src/domains/social/application/queries/get-traveller-profile-by-handle.query.ts

import { Query } from '../../../../foundation/kernel/application/query';

export class GetTravellerProfileByHandleQuery extends Query {
  constructor(public readonly handle: string) {
    super();
  }
}
