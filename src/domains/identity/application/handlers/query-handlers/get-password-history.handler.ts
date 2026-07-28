// src/domains/identity/application/handlers/query-handlers/get-password-history.handler.ts

import { Inject, Injectable } from '@nestjs/common';

import { QueryHandler } from '../../../../../foundation/kernel/application/query-handler';

import { GetPasswordHistoryQuery } from '../../queries/get-password-history.query';

import type { PasswordHistoryEntity } from '../../../domain/entities/password-history.entity';
import type { AuthenticationRepository } from '../../../domain/repositories/authentication.repository';

@Injectable()
export class GetPasswordHistoryHandler implements QueryHandler<
  GetPasswordHistoryQuery,
  PasswordHistoryEntity[]
> {
  constructor(
    @Inject('AuthenticationRepository')
    private readonly repository: AuthenticationRepository,
  ) {}

  async execute(
    query: GetPasswordHistoryQuery,
  ): Promise<PasswordHistoryEntity[]> {
    return this.repository.findPasswordHistory(query.authenticationId);
  }
}
