import { Query } from '../../../../foundation/kernel/application/query';

export class GetVerificationQuery extends Query {
  constructor(public readonly verificationPublicId: string) {
    super();
  }
}
