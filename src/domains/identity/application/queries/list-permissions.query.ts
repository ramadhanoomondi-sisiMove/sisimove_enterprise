import { Query } from '../../../../foundation/kernel/application/query';

export class ListPermissionsQuery extends Query {
  constructor(public readonly includeInactive = false) {
    super();

    Object.freeze(this);
  }
}
