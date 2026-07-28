import { Query } from '../../../../foundation/kernel/application/query';

import type { VerificationRequestStatus } from '../../domain/enums/verification-request-status.enum';
import type { VerificationRequestType } from '../../domain/enums/verification-request-type.enum';

export class ListVerificationRequestsQuery extends Query {
  constructor(
    public readonly verificationPublicId: string,
    public readonly status?: VerificationRequestStatus,
    public readonly type?: VerificationRequestType,
    public readonly page = 1,
    public readonly limit = 20,
  ) {
    super();
  }
}
