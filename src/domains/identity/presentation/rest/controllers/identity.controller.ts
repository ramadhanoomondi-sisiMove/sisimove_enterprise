// src/domains/identity/presentation/rest/identity.controller.ts

import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { CorrelationId } from '../../../../../foundation/logging/correlation-id';

import { ActivateIdentityCommand } from '../../../application/commands/activate-identity.command';
import { RegisterIdentityCommand } from '../../../application/commands/register-identity.command';

import { ActivateIdentityHandler } from '../../../application/handlers/activate-identity.handler';
import { RegisterIdentityHandler } from '../../../application/handlers/register-identity.handler';
import { GetIdentityHandler } from '../../../application/handlers/query-handlers/get-identity.handler';

import { GetIdentityQuery } from '../../../application/queries/get-identity.query';

import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { PermissionsGuard } from '../../auth/permissions.guard';
import { RequirePermissions } from '../../auth/require-permissions.decorator';

import { RegisterIdentityDto } from '../dto/register-identity.dto';

import { IdentityResponse } from '../responses/identity.response';

@ApiTags('Identity')
@Controller('identities')
export class IdentityController {
  constructor(
    private readonly registerIdentityHandler: RegisterIdentityHandler,
    private readonly activateIdentityHandler: ActivateIdentityHandler,
    private readonly getIdentityHandler: GetIdentityHandler,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new identity.' })
  @ApiCreatedResponse({
    description: 'Identity registered successfully.',
  })
  async register(
    @Body() dto: RegisterIdentityDto,
  ): Promise<{ publicId: string }> {
    const publicId = await this.registerIdentityHandler.execute(
      new RegisterIdentityCommand(
        dto.type,
        dto.email,
        dto.phoneNumber,
        dto.password,
        CorrelationId.generate(),
      ),
    );

    return { publicId };
  }

  @Post(':publicId/activate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Activate an identity.' })
  @ApiOkResponse({
    description: 'Identity activated successfully.',
  })
  @ApiNotFoundResponse()
  async activate(
    @Param('publicId') publicId: string,
  ): Promise<{ message: string }> {
    await this.activateIdentityHandler.execute(
      new ActivateIdentityCommand(publicId, CorrelationId.generate()),
    );

    return {
      message: 'Identity activated successfully.',
    };
  }

  @Get(':publicId')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @RequirePermissions('identity.read')
  @ApiOperation({ summary: 'Get an identity.' })
  @ApiOkResponse({
    type: IdentityResponse,
  })
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse()
  @ApiNotFoundResponse()
  async get(@Param('publicId') publicId: string): Promise<IdentityResponse> {
    return this.getIdentityHandler.execute(
      new GetIdentityQuery(publicId, CorrelationId.generate()),
    );
  }
}
