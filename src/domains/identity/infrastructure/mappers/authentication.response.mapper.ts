// src/domains/identity/presentation/rest/mappers/authentication.response.mapper.ts

import { Injectable } from '@nestjs/common';

import type { AuthenticationEntity } from '../../domain/entities/authentication.entity';

import { MfaStatus } from '../../domain/value-objects/mfa-status.enum';

import { AuthenticationResponse } from '../../application/responses/authentication.response';

@Injectable()
export class AuthenticationResponseMapper {
  public toResponse(
    authentication: AuthenticationEntity,
  ): AuthenticationResponse {
    const response = new AuthenticationResponse();

    response.publicId = authentication.publicId.value;

    response.status = authentication.status;

    response.passwordVersion = authentication.passwordVersion;
    response.passwordMustChange = authentication.passwordMustChange;

    if (authentication.passwordChangedAt !== undefined) {
      response.passwordChangedAt = authentication.passwordChangedAt;
    }

    if (authentication.passwordExpiresAt !== undefined) {
      response.passwordExpiresAt = authentication.passwordExpiresAt;
    }

    response.failedAuthenticationCount =
      authentication.failedAuthenticationCount;

    if (authentication.lastAuthenticatedAt !== undefined) {
      response.lastAuthenticatedAt = authentication.lastAuthenticatedAt;
    }

    response.locked =
      authentication.lockedAt !== undefined ||
      authentication.lockedUntil !== undefined;

    if (authentication.lockedAt !== undefined) {
      response.lockedAt = authentication.lockedAt;
    }

    if (authentication.lockedUntil !== undefined) {
      response.lockedUntil = authentication.lockedUntil;
    }

    if (authentication.lockReason !== undefined) {
      response.lockReason = authentication.lockReason;
    }

    response.mfaStatus = authentication.mfaStatus;

    if (authentication.mfaMethod !== undefined) {
      response.mfaMethod = authentication.mfaMethod;
    }

    response.mfaEnabled = authentication.mfaStatus === MfaStatus.ENABLED;

    if (authentication.mfaEnabledAt !== undefined) {
      response.mfaEnabledAt = authentication.mfaEnabledAt;
    }

    response.createdAt = authentication.createdAt;
    response.updatedAt = authentication.updatedAt;

    return response;
  }

  public toResponses(
    authentications: readonly AuthenticationEntity[],
  ): AuthenticationResponse[] {
    return authentications.map((authentication) =>
      this.toResponse(authentication),
    );
  }
}
