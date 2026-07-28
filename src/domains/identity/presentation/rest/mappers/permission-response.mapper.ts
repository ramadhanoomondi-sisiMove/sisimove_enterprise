import type { Permission } from '@prisma/client';

import { PermissionResponse } from '../../../application/responses/permission.response';

export class PermissionResponseMapper {
  static toResponse(permission: Permission): PermissionResponse {
    return new PermissionResponse(
      permission.id,
      permission.publicId,

      permission.name,
      permission.code,

      permission.resource,
      permission.action,

      permission.description ?? undefined,

      permission.isSystem,
      permission.isActive,

      permission.createdAt,
      permission.updatedAt,
    );
  }

  static toResponses(permissions: readonly Permission[]): PermissionResponse[] {
    return permissions.map((permission) => this.toResponse(permission));
  }
}
