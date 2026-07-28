// src/domains/identity/presentation/rest/responses/role-permission.response.ts

import { ApiProperty } from '@nestjs/swagger';

export class RolePermissionResponse {
  @ApiProperty()
  permissionPublicId!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  code!: string;

  @ApiProperty()
  resource!: string;

  @ApiProperty()
  action!: string;
}
