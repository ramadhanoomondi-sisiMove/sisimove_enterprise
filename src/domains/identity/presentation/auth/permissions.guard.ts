// src/domains/identity/presentation/auth/permissions.guard.ts

import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { CorrelationId } from '../../../../foundation/logging/correlation-id';

import { GetIdentityPermissionsHandler } from '../../application/handlers/query-handlers/get-identity-permissions.handler';
import { GetIdentityRolesHandler } from '../../application/handlers/query-handlers/get-identity-roles.handler';

import { GetIdentityPermissionsQuery } from '../../application/queries/get-identity-permissions.query';
import { GetIdentityRolesQuery } from '../../application/queries/get-identity-roles.query';

import { PERMISSIONS_KEY } from './require-permissions.decorator';

interface JwtPayload {
  sub: string; // Database UUID
  publicId: string; // Public identity ID (IDT-XXXX)
  email: string;
  type: string;
}

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly getIdentityPermissionsHandler: GetIdentityPermissionsHandler,
    private readonly getIdentityRolesHandler: GetIdentityRolesHandler,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    // No permission metadata means the endpoint is authenticated-only.
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<{
      user?: JwtPayload;
    }>();

    const user = request.user;

    if (!user) {
      throw new ForbiddenException('Authentication required.');
    }

    const correlationId = CorrelationId.generate();

    //
    // SUPER_ADMIN bypass
    // GetIdentityRolesQuery expects the PUBLIC identity ID.
    //
    const roles = await this.getIdentityRolesHandler.execute(
      new GetIdentityRolesQuery(user.publicId, correlationId),
    );

    const isSuperAdmin = roles.some((role) => role.roleCode === 'SUPER_ADMIN');

    if (isSuperAdmin) {
      return true;
    }

    //
    // Permission evaluation
    // GetIdentityPermissionsQuery currently expects the DATABASE identity ID.
    //
    const permissions = await this.getIdentityPermissionsHandler.execute(
      new GetIdentityPermissionsQuery(user.sub, correlationId),
    );

    const hasAllPermissions = requiredPermissions.every((permission) =>
      permissions.includes(permission),
    );

    if (!hasAllPermissions) {
      throw new ForbiddenException(
        'You do not have permission to perform this action.',
      );
    }

    return true;
  }
}
