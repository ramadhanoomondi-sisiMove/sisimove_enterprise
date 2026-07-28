import { Query } from '../../../../foundation/kernel/application/query';

export class GetRoleQuery extends Query {
  constructor(public readonly roleId: string) {
    super();

    Object.freeze(this);
  }
}
