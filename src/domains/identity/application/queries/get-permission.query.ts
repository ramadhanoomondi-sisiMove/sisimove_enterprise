import { Query } from '../../../../foundation/kernel/application/query';

export class GetPermissionQuery extends Query {
  constructor(public readonly permissionId: string) {
    super();

    Object.freeze(this);
  }
}
