// src/domains/identity/application/queries/handlers/get-verification-request.handler.ts

import { Inject, Injectable } from '@nestjs/common';

import type { QueryHandler } from '../../../../../foundation/kernel/application/query-handler';

import { IDENTITY_VERIFICATION_QUERY_SERVICE } from '../../identity.tokens';

import type { VerificationRequestResult } from '../../contracts/verification-request-result';
import { GetVerificationRequestQuery } from '../../queries/get-verification-request.query';
import type { VerificationQueryService } from '../../services/verification-query.service';

@Injectable()
export class GetVerificationRequestHandler implements QueryHandler<
  GetVerificationRequestQuery,
  VerificationRequestResult | null
> {
  public constructor(
    @Inject(IDENTITY_VERIFICATION_QUERY_SERVICE)
    private readonly queryService: VerificationQueryService,
  ) {}

  public async execute(
    query: GetVerificationRequestQuery,
  ): Promise<VerificationRequestResult | null> {
    return this.queryService.findRequest(query.requestPublicId);
  }
}
