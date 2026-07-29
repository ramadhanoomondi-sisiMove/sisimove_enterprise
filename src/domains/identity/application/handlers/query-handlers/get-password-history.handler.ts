// src/domains/identity/application/handlers/query-handlers/get-password-history.handler.ts

import { Inject, Injectable } from '@nestjs/common';

import type { QueryHandler } from '../../../../../foundation/kernel/application/query-handler';

import { IDENTITY_AUTHENTICATION_REPOSITORY } from '../../identity.tokens';

import { GetPasswordHistoryQuery } from '../../queries/get-password-history.query';

import type { PasswordHistoryEntity } from '../../../domain/entities/password-history.entity';
import type { AuthenticationRepository } from '../../../domain/repositories/authentication.repository';

@Injectable()
export class GetPasswordHistoryHandler implements QueryHandler<
  GetPasswordHistoryQuery,
  PasswordHistoryEntity[]
> {
  public constructor(
    @Inject(IDENTITY_AUTHENTICATION_REPOSITORY)
    private readonly repository: AuthenticationRepository,
  ) {}

  public async execute(
    query: GetPasswordHistoryQuery,
  ): Promise<PasswordHistoryEntity[]> {
    return this.repository.findPasswordHistory(query.authenticationId);
  }
}
