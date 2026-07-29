// src/domains/identity/application/queries/handlers/get-verification.handler.ts

import { Inject, Injectable } from '@nestjs/common';

import type { QueryHandler } from '../../../../../foundation/kernel/application/query-handler';

import { IDENTITY_VERIFICATION_QUERY_SERVICE } from '../../identity.tokens';

import type { VerificationResult } from '../../contracts/verification-result';
import { GetVerificationQuery } from '../../queries/get-verification.query';
import type { VerificationQueryService } from '../../services/verification-query.service';

@Injectable()
export class GetVerificationHandler implements QueryHandler<
  GetVerificationQuery,
  VerificationResult | null
> {
  public constructor(
    @Inject(IDENTITY_VERIFICATION_QUERY_SERVICE)
    private readonly queryService: VerificationQueryService,
  ) {}

  public execute(
    query: GetVerificationQuery,
  ): Promise<VerificationResult | null> {
    return this.queryService.findByPublicId(query.verificationPublicId);
  }
}
