// src/domains/identity/application/handlers/query-handlers/get-latest-password-history.handler.ts

import { Inject, Injectable } from '@nestjs/common';

import { QueryHandler } from '../../../../../foundation/kernel/application/query-handler';

import { GetLatestPasswordHistoryQuery } from '../../queries/get-latest-password-history.query';

import type { PasswordHistoryEntity } from '../../../domain/entities/password-history.entity';
import type { AuthenticationRepository } from '../../../domain/repositories/authentication.repository';

@Injectable()
export class GetLatestPasswordHistoryHandler implements QueryHandler<
  GetLatestPasswordHistoryQuery,
  PasswordHistoryEntity | null
> {
  constructor(
    @Inject('AuthenticationRepository')
    private readonly repository: AuthenticationRepository,
  ) {}

  async execute(
    query: GetLatestPasswordHistoryQuery,
  ): Promise<PasswordHistoryEntity | null> {
    return this.repository.findLatestPasswordHistory(query.authenticationId);
  }
}
