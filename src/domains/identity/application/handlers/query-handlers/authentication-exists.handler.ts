// src/domains/identity/application/handlers/query-handlers/authentication-exists.handler.ts

import { Inject, Injectable } from '@nestjs/common';

import { QueryHandler } from '../../../../../foundation/kernel/application/query-handler';

import { AuthenticationExistsQuery } from '../../queries/authentication-exists.query';

import type { AuthenticationRepository } from '../../../domain/repositories/authentication.repository';
import { AuthenticationId } from '../../../domain/value-objects/authentication-id.vo';

@Injectable()
export class AuthenticationExistsHandler implements QueryHandler<
  AuthenticationExistsQuery,
  boolean
> {
  constructor(
    @Inject('AuthenticationRepository')
    private readonly repository: AuthenticationRepository,
  ) {}

  async execute(query: AuthenticationExistsQuery): Promise<boolean> {
    return this.repository.existsByPublicId(
      new AuthenticationId(query.publicId),
    );
  }
}
