// src/domains/social/application/queries/get-traveller-profile-corridor.query.ts

import { Query } from '../../../../foundation/kernel/application/query';

export class GetTravellerProfileCorridorQuery extends Query {
  constructor(public readonly corridorId: string) {
    super();
  }
}
