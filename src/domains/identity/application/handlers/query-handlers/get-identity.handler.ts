// src/domains/identity/application/handlers/query-handlers/get-identity.handler.ts

import { Inject, Injectable } from '@nestjs/common';

import type { QueryHandler } from '../../../../../foundation/kernel/application/query-handler';

import { IDENTITY_REPOSITORY } from '../../identity.tokens';

import { GetIdentityQuery } from '../../queries/get-identity.query';

import { IdentityStatus } from '../../../domain/aggregates/identity.aggregate';
import { IdentityNotFoundException } from '../../../domain/exceptions/identity-not-found.exception';

import type { IdentityRepository } from '../../../domain/repositories/identity.repository';

import { IdentityId } from '../../../domain/value-objects/identity-id.vo';
import { IdentityType } from '../../../domain/value-objects/identity-type.enum';

export interface IdentityResponse {
  publicId: string;
  email: string;
  phoneNumber?: string;
  type: IdentityType;
  status: IdentityStatus;
  active: boolean;
  activatedAt?: Date;
  suspendedAt?: Date;
  closedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class GetIdentityHandler implements QueryHandler<
  GetIdentityQuery,
  IdentityResponse
> {
  public constructor(
    @Inject(IDENTITY_REPOSITORY)
    private readonly identityRepository: IdentityRepository,
  ) {}

  public async execute(query: GetIdentityQuery): Promise<IdentityResponse> {
    const identity = await this.identityRepository.findByPublicId(
      new IdentityId(query.publicId),
    );

    if (identity === null) {
      throw new IdentityNotFoundException(query.publicId);
    }

    return {
      publicId: identity.publicId.value,
      email: identity.email.value,

      ...(identity.phoneNumber !== undefined && {
        phoneNumber: identity.phoneNumber,
      }),

      type: identity.type,
      status: identity.status,
      active: identity.status === IdentityStatus.ACTIVE,

      createdAt: identity.createdAt,
      updatedAt: identity.updatedAt,

      ...(identity.activatedAt !== undefined && {
        activatedAt: identity.activatedAt,
      }),

      ...(identity.suspendedAt !== undefined && {
        suspendedAt: identity.suspendedAt,
      }),

      ...(identity.closedAt !== undefined && {
        closedAt: identity.closedAt,
      }),
    };
  }
}
