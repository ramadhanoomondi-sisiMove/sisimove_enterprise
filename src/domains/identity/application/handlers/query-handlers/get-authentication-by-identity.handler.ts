// src/domains/identity/application/handlers/query-handlers/get-authentication-by-identity.handler.ts

import { Inject, Injectable } from '@nestjs/common';

import type { QueryHandler } from '../../../../../foundation/kernel/application/query-handler';

import { IDENTITY_AUTHENTICATION_REPOSITORY } from '../../identity.tokens';

import { GetAuthenticationByIdentityQuery } from '../../queries/get-authentication-by-identity.query';

import type { AuthenticationEntity } from '../../../domain/entities/authentication.entity';
import { AuthenticationNotFoundException } from '../../../domain/exceptions/authentication-not-found.exception';
import type { AuthenticationRepository } from '../../../domain/repositories/authentication.repository';

@Injectable()
export class GetAuthenticationByIdentityHandler implements QueryHandler<
  GetAuthenticationByIdentityQuery,
  AuthenticationEntity
> {
  public constructor(
    @Inject(IDENTITY_AUTHENTICATION_REPOSITORY)
    private readonly repository: AuthenticationRepository,
  ) {}

  public async execute(
    query: GetAuthenticationByIdentityQuery,
  ): Promise<AuthenticationEntity> {
    const authentication = await this.repository.findEntityByIdentityId(
      query.identityId,
    );

    if (authentication === null) {
      throw new AuthenticationNotFoundException(query.identityId.value);
    }

    return authentication;
  }
}
