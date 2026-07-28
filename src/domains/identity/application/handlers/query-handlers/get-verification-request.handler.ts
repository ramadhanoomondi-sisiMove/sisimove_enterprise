// src/domains/identity/application/queries/handlers/get-verification-request.handler.ts

import { Inject, Injectable } from '@nestjs/common';

import { QueryHandler } from '../../../../../foundation/kernel/application/query-handler';

import type { VerificationRequestResult } from '../../contracts/verification-request-result';

import { GetVerificationRequestQuery } from '../../queries/get-verification-request.query';
import type { VerificationQueryService } from '../../services/verification-query.service';

@Injectable()
export class GetVerificationRequestHandler implements QueryHandler<
  GetVerificationRequestQuery,
  VerificationRequestResult | null
> {
  constructor(
    @Inject('VerificationQueryService')
    private readonly queryService: VerificationQueryService,
  ) {}

  async execute(
    query: GetVerificationRequestQuery,
  ): Promise<VerificationRequestResult | null> {
    return this.queryService.findRequest(query.requestPublicId);
  }
}
