import { Query } from '../../../../foundation/kernel/application/query';

export class GetVerificationRequestQuery extends Query {
  constructor(public readonly requestPublicId: string) {
    super();
  }
}
