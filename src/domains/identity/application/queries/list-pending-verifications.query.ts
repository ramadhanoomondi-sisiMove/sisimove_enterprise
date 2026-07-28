import { Query } from '../../../../foundation/kernel/application/query';

export class ListPendingVerificationsQuery extends Query {
  constructor(
    public readonly page = 1,
    public readonly limit = 20,
  ) {
    super();
  }
}
