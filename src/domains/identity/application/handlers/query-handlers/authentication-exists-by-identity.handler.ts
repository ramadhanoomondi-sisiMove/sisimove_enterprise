// src/domains/identity/application/handlers/query-handlers/authentication-exists-by-identity.handler.ts

import { Inject, Injectable } from '@nestjs/common';

import type { QueryHandler } from '../../../../../foundation/kernel/application/query-handler';

import { IDENTITY_AUTHENTICATION_REPOSITORY } from '../../identity.tokens';

import { AuthenticationExistsByIdentityQuery } from '../../queries/authentication-exists-by-identity.query';

import type { AuthenticationRepository } from '../../../domain/repositories/authentication.repository';

import { IdentityId } from '../../../domain/value-objects/identity-id.vo';

@Injectable()
export class AuthenticationExistsByIdentityHandler implements QueryHandler<
  AuthenticationExistsByIdentityQuery,
  boolean
> {
  public constructor(
    @Inject(IDENTITY_AUTHENTICATION_REPOSITORY)
    private readonly repository: AuthenticationRepository,
  ) {}

  public async execute(
    query: AuthenticationExistsByIdentityQuery,
  ): Promise<boolean> {
    return this.repository.existsByIdentityId(new IdentityId(query.identityId));
  }
}
