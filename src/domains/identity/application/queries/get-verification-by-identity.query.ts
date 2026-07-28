import { Query } from '../../../../foundation/kernel/application/query';

export class GetVerificationByIdentityQuery extends Query {
  constructor(public readonly identityPublicId: string) {
    super();
  }
}
