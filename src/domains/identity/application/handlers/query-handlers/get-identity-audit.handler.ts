import { Inject, Injectable } from '@nestjs/common';

import type { QueryHandler } from '../../../../../foundation/kernel/application/query-handler';

import { IDENTITY_AUDIT_REPOSITORY } from '../../identity-audit.tokens';

import { GetIdentityAuditQuery } from '../../queries/get-identity-audit.query';

import type { IdentityAuditAggregate } from '../../../domain/aggregates/identity-audit.aggregate';
import { IdentityAuditNotFoundException } from '../../../domain/exceptions/identity-audit-not-found.exception';
import type { IdentityAuditRepository } from '../../../domain/repositories/identity-audit.repository';
import { IdentityAuditId } from '../../../domain/value-objects/identity-audit-id.vo';

@Injectable()
export class GetIdentityAuditHandler implements QueryHandler<
  GetIdentityAuditQuery,
  IdentityAuditAggregate
> {
  public constructor(
    @Inject(IDENTITY_AUDIT_REPOSITORY)
    private readonly repository: IdentityAuditRepository,
  ) {}

  public async execute(
    query: GetIdentityAuditQuery,
  ): Promise<IdentityAuditAggregate> {
    const publicId = new IdentityAuditId(query.publicId);

    const audit = await this.repository.findByPublicId(publicId);

    if (audit === null) {
      throw new IdentityAuditNotFoundException(publicId.value);
    }

    return audit;
  }
}
