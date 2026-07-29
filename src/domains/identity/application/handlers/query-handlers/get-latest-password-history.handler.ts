// src/domains/identity/application/handlers/query-handlers/get-latest-password-history.handler.ts

import { Inject, Injectable } from '@nestjs/common';

import type { QueryHandler } from '../../../../../foundation/kernel/application/query-handler';

import { IDENTITY_AUTHENTICATION_REPOSITORY } from '../../identity.tokens';

import { GetLatestPasswordHistoryQuery } from '../../queries/get-latest-password-history.query';

import type { PasswordHistoryEntity } from '../../../domain/entities/password-history.entity';
import type { AuthenticationRepository } from '../../../domain/repositories/authentication.repository';

@Injectable()
export class GetLatestPasswordHistoryHandler implements QueryHandler<
  GetLatestPasswordHistoryQuery,
  PasswordHistoryEntity | null
> {
  public constructor(
    @Inject(IDENTITY_AUTHENTICATION_REPOSITORY)
    private readonly repository: AuthenticationRepository,
  ) {}

  public async execute(
    query: GetLatestPasswordHistoryQuery,
  ): Promise<PasswordHistoryEntity | null> {
    return this.repository.findLatestPasswordHistory(query.authenticationId);
  }
}
