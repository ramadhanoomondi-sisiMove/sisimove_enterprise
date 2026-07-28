// src/domains/identity/application/queries/handlers/get-verification.handler.ts

import { Inject, Injectable } from '@nestjs/common';

import { QueryHandler } from '../../../../../foundation/kernel/application/query-handler';

import type { VerificationResult } from '../../contracts/verification-result';
import type { VerificationQueryService } from '../../services/verification-query.service';

import { GetVerificationQuery } from '../../queries/get-verification.query';

@Injectable()
export class GetVerificationHandler implements QueryHandler<
  GetVerificationQuery,
  VerificationResult | null
> {
  constructor(
    @Inject('VerificationQueryService')
    private readonly queryService: VerificationQueryService,
  ) {}

  execute(query: GetVerificationQuery): Promise<VerificationResult | null> {
    return this.queryService.findByPublicId(query.verificationPublicId);
  }
}
