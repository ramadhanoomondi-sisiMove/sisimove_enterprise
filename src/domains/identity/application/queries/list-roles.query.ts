import { Query } from '../../../../foundation/kernel/application/query';

export class ListRolesQuery extends Query {
  constructor(public readonly includeInactive = false) {
    super();

    Object.freeze(this);
  }
}
