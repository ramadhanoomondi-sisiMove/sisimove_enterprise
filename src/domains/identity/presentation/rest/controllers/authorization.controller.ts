// src/domains/identity/presentation/rest/controllers/authorization.controller.ts

import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { CorrelationId } from '../../../../../foundation/logging/correlation-id';

// -----------------------------------------------------------------------------
// Guards & Decorators
// -----------------------------------------------------------------------------

import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { PermissionsGuard } from '../../auth/permissions.guard';
import { RequirePermissions } from '../../auth/require-permissions.decorator';

// -----------------------------------------------------------------------------
// DTOs
// -----------------------------------------------------------------------------

import { CreateRoleDto } from '../dto/create-role.dto';
import { RenameRoleDto } from '../dto/rename-role.dto';
import { ChangeRoleDescriptionDto } from '../dto/change-role-description.dto';
import { ChangeRoleDisplayOrderDto } from '../dto/change-role-display-order.dto';

// -----------------------------------------------------------------------------
// Commands
// -----------------------------------------------------------------------------

import { CreateRoleCommand } from '../../../application/commands/create-role.command';
import { RenameRoleCommand } from '../../../application/commands/rename-role.command';
import { ChangeRoleDescriptionCommand } from '../../../application/commands/change-role-description.command';
import { ChangeRoleDisplayOrderCommand } from '../../../application/commands/change-role-display-order.command';
import { ActivateRoleCommand } from '../../../application/commands/activate-role.command';
import { DeactivateRoleCommand } from '../../../application/commands/deactivate-role.command';
import { AssignPermissionToRoleCommand } from '../../../application/commands/assign-permission-to-role.command';
import { RemovePermissionFromRoleCommand } from '../../../application/commands/remove-permission-from-role.command';

// -----------------------------------------------------------------------------
// Queries
// -----------------------------------------------------------------------------

import { GetRoleQuery } from '../../../application/queries/get-role.query';
import { ListRolesQuery } from '../../../application/queries/list-roles.query';
import { GetPermissionQuery } from '../../../application/queries/get-permission.query';
import { ListPermissionsQuery } from '../../../application/queries/list-permissions.query';

// -----------------------------------------------------------------------------
// Command Handlers
// -----------------------------------------------------------------------------

import { CreateRoleHandler } from '../../../application/handlers/create-role.handler';
import { RenameRoleHandler } from '../../../application/handlers/rename-role.handler';
import { ChangeRoleDescriptionHandler } from '../../../application/handlers/change-role-description.handler';
import { ChangeRoleDisplayOrderHandler } from '../../../application/handlers/change-role-display-order.handler';
import { ActivateRoleHandler } from '../../../application/handlers/activate-role.handler';
import { DeactivateRoleHandler } from '../../../application/handlers/deactivate-role.handler';
import { AssignPermissionToRoleHandler } from '../../../application/handlers/assign-permission-to-role.handler';
import { RemovePermissionFromRoleHandler } from '../../../application/handlers/remove-permission-from-role.handler';

// -----------------------------------------------------------------------------
// Query Handlers
// -----------------------------------------------------------------------------

import { GetRoleHandler } from '../../../application/handlers/query-handlers/get-role.handler';
import { ListRolesHandler } from '../../../application/handlers/query-handlers/list-roles.handler';
import { GetPermissionHandler } from '../../../application/handlers/query-handlers/get-permission.handler';
import { ListPermissionsHandler } from '../../../application/handlers/query-handlers/list-permissions.handler';

// -----------------------------------------------------------------------------
// Responses
// -----------------------------------------------------------------------------

import { PermissionResponse } from '../../../application/responses/permission.response';
import { RoleResponse } from '../../../application/responses/role.response';

@ApiTags('Authorization')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('authorization')
export class AuthorizationController {
  constructor(
    // -----------------------------------------------------------------------
    // Command Handlers
    // -----------------------------------------------------------------------

    private readonly createRoleHandler: CreateRoleHandler,
    private readonly renameRoleHandler: RenameRoleHandler,
    private readonly changeRoleDescriptionHandler: ChangeRoleDescriptionHandler,
    private readonly changeRoleDisplayOrderHandler: ChangeRoleDisplayOrderHandler,
    private readonly activateRoleHandler: ActivateRoleHandler,
    private readonly deactivateRoleHandler: DeactivateRoleHandler,
    private readonly assignPermissionToRoleHandler: AssignPermissionToRoleHandler,
    private readonly removePermissionFromRoleHandler: RemovePermissionFromRoleHandler,

    // -----------------------------------------------------------------------
    // Query Handlers
    // -----------------------------------------------------------------------

    private readonly getRoleHandler: GetRoleHandler,
    private readonly listRolesHandler: ListRolesHandler,
    private readonly getPermissionHandler: GetPermissionHandler,
    private readonly listPermissionsHandler: ListPermissionsHandler,
  ) {}

  // --------------------------------------------------------------------------
  // Role Queries
  // --------------------------------------------------------------------------

  @Get('roles')
  @RequirePermissions('authorization.role.read')
  @ApiOperation({
    summary: 'List roles',
  })
  @ApiOkResponse({
    type: RoleResponse,
    isArray: true,
  })
  async listRoles(
    @Query('includeInactive') includeInactive?: string,
  ): Promise<RoleResponse[]> {
    return this.listRolesHandler.execute(
      new ListRolesQuery(includeInactive === 'true'),
    );
  }

  @Get('roles/:publicId')
  @RequirePermissions('authorization.role.read')
  @ApiOperation({
    summary: 'Get role',
  })
  @ApiOkResponse({
    type: RoleResponse,
  })
  async getRole(@Param('publicId') publicId: string): Promise<RoleResponse> {
    return this.getRoleHandler.execute(new GetRoleQuery(publicId));
  }

  // --------------------------------------------------------------------------
  // Permission Queries
  // --------------------------------------------------------------------------

  @Get('permissions')
  @RequirePermissions('authorization.permission.read')
  @ApiOperation({
    summary: 'List permissions',
  })
  @ApiOkResponse({
    type: PermissionResponse,
    isArray: true,
  })
  async listPermissions(
    @Query('includeInactive') includeInactive?: string,
  ): Promise<readonly PermissionResponse[]> {
    return this.listPermissionsHandler.execute(
      new ListPermissionsQuery(includeInactive === 'true'),
    );
  }

  @Get('permissions/:publicId')
  @RequirePermissions('authorization.permission.read')
  @ApiOperation({
    summary: 'Get permission',
  })
  @ApiOkResponse({
    type: PermissionResponse,
  })
  async getPermission(
    @Param('publicId') publicId: string,
  ): Promise<PermissionResponse> {
    return this.getPermissionHandler.execute(new GetPermissionQuery(publicId));
  }

  // --------------------------------------------------------------------------
  // Role Commands
  // --------------------------------------------------------------------------
  @Post('roles')
  @RequirePermissions('authorization.role.create')
  @ApiOperation({
    summary: 'Create role',
  })
  @ApiCreatedResponse()
  async createRole(@Body() dto: CreateRoleDto): Promise<void> {
    await this.createRoleHandler.execute(
      new CreateRoleCommand(
        dto.name,
        dto.code,
        dto.description,
        dto.displayOrder,
        CorrelationId.generate(),
      ),
    );
  }

  // --------------------------------------------------------------------------
  // Rename Role
  // --------------------------------------------------------------------------

  @Patch('roles/:publicId/name')
  @RequirePermissions('authorization.role.update')
  @ApiOperation({
    summary: 'Rename role',
  })
  @ApiNoContentResponse()
  @HttpCode(HttpStatus.NO_CONTENT)
  async renameRole(
    @Param('publicId') publicId: string,
    @Body() dto: RenameRoleDto,
  ): Promise<void> {
    await this.renameRoleHandler.execute(
      new RenameRoleCommand(publicId, dto.name, CorrelationId.generate()),
    );
  }

  // --------------------------------------------------------------------------
  // Change Description
  // --------------------------------------------------------------------------

  @Patch('roles/:publicId/description')
  @RequirePermissions('authorization.role.update')
  @ApiOperation({
    summary: 'Change role description',
  })
  @ApiNoContentResponse()
  @HttpCode(HttpStatus.NO_CONTENT)
  async changeDescription(
    @Param('publicId') publicId: string,
    @Body() dto: ChangeRoleDescriptionDto,
  ): Promise<void> {
    await this.changeRoleDescriptionHandler.execute(
      new ChangeRoleDescriptionCommand(
        publicId,
        dto.description,
        CorrelationId.generate(),
      ),
    );
  }

  // --------------------------------------------------------------------------
  // Change Display Order
  // --------------------------------------------------------------------------

  @Patch('roles/:publicId/display-order')
  @RequirePermissions('authorization.role.update')
  @ApiOperation({
    summary: 'Change role display order',
  })
  @ApiNoContentResponse()
  @HttpCode(HttpStatus.NO_CONTENT)
  async changeDisplayOrder(
    @Param('publicId') publicId: string,
    @Body() dto: ChangeRoleDisplayOrderDto,
  ): Promise<void> {
    await this.changeRoleDisplayOrderHandler.execute(
      new ChangeRoleDisplayOrderCommand(
        publicId,
        dto.displayOrder,
        CorrelationId.generate(),
      ),
    );
  }

  // --------------------------------------------------------------------------
  // Activate Role
  // --------------------------------------------------------------------------

  @Patch('roles/:publicId/activate')
  @RequirePermissions('authorization.role.activate')
  @ApiOperation({
    summary: 'Activate role',
  })
  @ApiNoContentResponse()
  @HttpCode(HttpStatus.NO_CONTENT)
  async activateRole(@Param('publicId') publicId: string): Promise<void> {
    await this.activateRoleHandler.execute(
      new ActivateRoleCommand(publicId, CorrelationId.generate()),
    );
  }

  // --------------------------------------------------------------------------
  // Deactivate Role
  // --------------------------------------------------------------------------

  @Patch('roles/:publicId/deactivate')
  @RequirePermissions('authorization.role.deactivate')
  @ApiOperation({
    summary: 'Deactivate role',
  })
  @ApiNoContentResponse()
  @HttpCode(HttpStatus.NO_CONTENT)
  async deactivateRole(@Param('publicId') publicId: string): Promise<void> {
    await this.deactivateRoleHandler.execute(
      new DeactivateRoleCommand(publicId, CorrelationId.generate()),
    );
  }

  // --------------------------------------------------------------------------
  // Role Permission Management
  // --------------------------------------------------------------------------

  @Put('roles/:rolePublicId/permissions/:permissionPublicId')
  @RequirePermissions('authorization.role.permission.assign')
  @ApiOperation({
    summary: 'Assign permission to role',
  })
  @ApiNoContentResponse()
  @HttpCode(HttpStatus.NO_CONTENT)
  async assignPermission(
    @Param('rolePublicId') rolePublicId: string,
    @Param('permissionPublicId') permissionPublicId: string,
  ): Promise<void> {
    await this.assignPermissionToRoleHandler.execute(
      new AssignPermissionToRoleCommand(
        rolePublicId,
        permissionPublicId,
        CorrelationId.generate(),
      ),
    );
  }

  // --------------------------------------------------------------------------
  // Remove Permission from Role
  // --------------------------------------------------------------------------

  @Delete('roles/:rolePublicId/permissions/:permissionPublicId')
  @RequirePermissions('authorization.role.permission.remove')
  @ApiOperation({
    summary: 'Remove permission from role',
  })
  @ApiNoContentResponse()
  @HttpCode(HttpStatus.NO_CONTENT)
  async removePermission(
    @Param('rolePublicId') rolePublicId: string,
    @Param('permissionPublicId') permissionPublicId: string,
  ): Promise<void> {
    await this.removePermissionFromRoleHandler.execute(
      new RemovePermissionFromRoleCommand(
        rolePublicId,
        permissionPublicId,
        CorrelationId.generate(),
      ),
    );
  }
}
