// src/domains/identity/application/handlers/query-handlers/get-authentication.handler.ts

import { Inject, Injectable } from '@nestjs/common';

import type { QueryHandler } from '../../../../../foundation/kernel/application/query-handler';

import { IDENTITY_AUTHENTICATION_REPOSITORY } from '../../identity.tokens';

import { GetAuthenticationQuery } from '../../queries/get-authentication.query';

import type { AuthenticationEntity } from '../../../domain/entities/authentication.entity';
import { AuthenticationNotFoundException } from '../../../domain/exceptions/authentication-not-found.exception';
import type { AuthenticationRepository } from '../../../domain/repositories/authentication.repository';
import { AuthenticationId } from '../../../domain/value-objects/authentication-id.vo';

@Injectable()
export class GetAuthenticationHandler implements QueryHandler<
  GetAuthenticationQuery,
  AuthenticationEntity
> {
  public constructor(
    @Inject(IDENTITY_AUTHENTICATION_REPOSITORY)
    private readonly repository: AuthenticationRepository,
  ) {}

  public async execute(
    query: GetAuthenticationQuery,
  ): Promise<AuthenticationEntity> {
    const publicId = new AuthenticationId(query.publicId);

    const authentication = await this.repository.findEntityByPublicId(publicId);

    if (authentication === null) {
      throw new AuthenticationNotFoundException(publicId.value);
    }

    return authentication;
  }
}
