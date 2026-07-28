import { Query } from '../../../../foundation/kernel/application/query';

import type { VerificationStatus } from '../../domain/enums/verification-status.enum';
import type { VerificationLevel } from '../../domain/enums/verification-level.enum';

export class ListVerificationsQuery extends Query {
  constructor(
    public readonly status?: VerificationStatus,
    public readonly level?: VerificationLevel,
    public readonly page = 1,
    public readonly limit = 20,
  ) {
    super();
  }
}
