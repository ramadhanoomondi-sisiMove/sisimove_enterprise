// src/domains/identity/application/handlers/query-handlers/authentication-exists-by-identity.handler.ts

import { Inject, Injectable } from '@nestjs/common';

import { QueryHandler } from '../../../../../foundation/kernel/application/query-handler';

import { AuthenticationExistsByIdentityQuery } from '../../queries/authentication-exists-by-identity.query';

import type { AuthenticationRepository } from '../../../domain/repositories/authentication.repository';

import { IdentityId } from '../../../domain/value-objects/identity-id.vo';

@Injectable()
export class AuthenticationExistsByIdentityHandler implements QueryHandler<
  AuthenticationExistsByIdentityQuery,
  boolean
> {
  constructor(
    @Inject('AuthenticationRepository')
    private readonly repository: AuthenticationRepository,
  ) {}

  async execute(query: AuthenticationExistsByIdentityQuery): Promise<boolean> {
    return this.repository.existsByIdentityId(new IdentityId(query.identityId));
  }
}
