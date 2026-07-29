// src/domains/identity/presentation/rest/controllers/authentication.controller.ts

import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
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

import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { PermissionsGuard } from '../../auth/permissions.guard';
import { RequirePermissions } from '../../auth/require-permissions.decorator';

import { RegisterAuthenticationHandler } from '../../../application/handlers/register-authentication.handler';
import { LoginHandler } from '../../../application/handlers/login.handler';
import { RefreshTokenHandler } from '../../../application/handlers/refresh-token.handler';
import { LogoutHandler } from '../../../application/handlers/logout.handler';
import { LogoutAllSessionsHandler } from '../../../application/handlers/logout-all-sessions.handler';
import { ChangePasswordHandler } from '../../../application/handlers/change-password.handler';
import { EnableMfaHandler } from '../../../application/handlers/enable-mfa.handler';
import { DisableMfaHandler } from '../../../application/handlers/disable-mfa.handler';
import { RotateMfaSecretHandler } from '../../../application/handlers/rotate-mfa-secret.handler';
import { LockAuthenticationHandler } from '../../../application/handlers/lock-authentication.handler';
import { UnlockAuthenticationHandler } from '../../../application/handlers/unlock-authentication.handler';
import { ExpirePasswordHandler } from '../../../application/handlers/expire-password.handler';

import { GetAuthenticationByIdentityHandler } from '../../../application/handlers/query-handlers/get-authentication-by-identity.handler';

import { RegisterAuthenticationCommand } from '../../../application/commands/register-authentication.command';
import { LoginCommand } from '../../../application/commands/login.command';
import { RefreshTokenCommand } from '../../../application/commands/refresh-token.command';
import { LogoutCommand } from '../../../application/commands/logout.command';
import { LogoutAllSessionsCommand } from '../../../application/commands/logout-all-sessions.command';
import { ChangePasswordCommand } from '../../../application/commands/change-password.command';
import { EnableMfaCommand } from '../../../application/commands/enable-mfa.command';
import { DisableMfaCommand } from '../../../application/commands/disable-mfa.command';
import { RotateMfaSecretCommand } from '../../../application/commands/rotate-mfa-secret.command';
import { LockAuthenticationCommand } from '../../../application/commands/lock-authentication.command';
import { UnlockAuthenticationCommand } from '../../../application/commands/unlock-authentication.command';
import { ExpirePasswordCommand } from '../../../application/commands/expire-password.command';

import { GetAuthenticationByIdentityQuery } from '../../../application/queries/get-authentication-by-identity.query';

import type { LoginResult } from '../../../application/contracts/login-result';

import { IdentityId } from '../../../domain/value-objects/identity-id.vo';

import { AuthenticationResponseMapper } from '../../../infrastructure/mappers/authentication.response.mapper';
import { AuthenticationResponse } from '../../../application/responses/authentication.response';

import { RegisterAuthenticationDto } from '../dto/register-authentication.dto';
import { LoginDto } from '../dto/login.dto';
import { RefreshTokenDto } from '../dto/refresh-token.dto';
import { LogoutDto } from '../dto/logout.dto';
import { LogoutAllSessionsDto } from '../dto/logout-all-sessions.dto';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { EnableMfaDto } from '../dto/enable-mfa.dto';
import { DisableMfaDto } from '../dto/disable-mfa.dto';
import { RotateMfaSecretDto } from '../dto/rotate-mfa-secret.dto';
import { LockAuthenticationDto } from '../dto/lock-authentication.dto';
import { UnlockAuthenticationDto } from '../dto/unlock-authentication.dto';
import { ExpirePasswordDto } from '../dto/expire-password.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthenticationController {
  constructor(
    private readonly registerAuthenticationHandler: RegisterAuthenticationHandler,
    private readonly loginHandler: LoginHandler,
    private readonly refreshTokenHandler: RefreshTokenHandler,
    private readonly logoutHandler: LogoutHandler,
    private readonly logoutAllSessionsHandler: LogoutAllSessionsHandler,
    private readonly getAuthenticationHandler: GetAuthenticationByIdentityHandler,
    private readonly changePasswordHandler: ChangePasswordHandler,
    private readonly expirePasswordHandler: ExpirePasswordHandler,
    private readonly enableMfaHandler: EnableMfaHandler,
    private readonly disableMfaHandler: DisableMfaHandler,
    private readonly rotateMfaSecretHandler: RotateMfaSecretHandler,
    private readonly lockAuthenticationHandler: LockAuthenticationHandler,
    private readonly unlockAuthenticationHandler: UnlockAuthenticationHandler,
    private readonly authenticationResponseMapper: AuthenticationResponseMapper,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register authentication credentials.' })
  @ApiCreatedResponse()
  async register(
    @Body() dto: RegisterAuthenticationDto,
  ): Promise<{ publicId: string }> {
    const publicId = await this.registerAuthenticationHandler.execute(
      new RegisterAuthenticationCommand(
        new IdentityId(dto.identityPublicId),
        dto.password,
        CorrelationId.generate(),
        dto.passwordExpiresAt ? new Date(dto.passwordExpiresAt) : undefined,
      ),
    );

    return { publicId };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Authenticate an identity.' })
  @ApiOkResponse()
  async login(@Body() dto: LoginDto): Promise<LoginResult> {
    return this.loginHandler.execute(
      new LoginCommand(dto.email, dto.password, CorrelationId.generate()),
    );
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token.' })
  async refresh(@Body() dto: RefreshTokenDto): Promise<LoginResult> {
    return this.refreshTokenHandler.execute(
      new RefreshTokenCommand(dto.refreshToken, CorrelationId.generate()),
    );
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout current session.' })
  async logout(@Body() dto: LogoutDto): Promise<void> {
    await this.logoutHandler.execute(
      new LogoutCommand(dto.refreshToken, CorrelationId.generate()),
    );
  }

  @Post('logout-all')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout all sessions.' })
  async logoutAll(@Body() dto: LogoutAllSessionsDto): Promise<void> {
    await this.logoutAllSessionsHandler.execute(
      new LogoutAllSessionsCommand(
        new IdentityId(dto.identityPublicId),
        CorrelationId.generate(),
      ),
    );
  }

  @Get(':identityPublicId')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('authentication.read')
  @ApiOperation({
    summary: 'Get authentication',
  })
  @ApiOkResponse({
    type: AuthenticationResponse,
  })
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse()
  @ApiNotFoundResponse()
  public async get(
    @Param('identityPublicId') identityPublicId: string,
  ): Promise<AuthenticationResponse> {
    const authentication = await this.getAuthenticationHandler.execute(
      new GetAuthenticationByIdentityQuery(
        new IdentityId(identityPublicId),
        CorrelationId.generate(),
      ),
    );

    return this.authenticationResponseMapper.toResponse(authentication);
  }

  @Patch('password')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('authentication.update')
  @ApiOperation({ summary: 'Change password.' })
  async changePassword(@Body() dto: ChangePasswordDto): Promise<void> {
    await this.changePasswordHandler.execute(
      new ChangePasswordCommand(
        new IdentityId(dto.identityPublicId),
        dto.currentPassword,
        dto.newPassword,
        new Date(),
        CorrelationId.generate(),
      ),
    );
  }

  @Patch('password/expire')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('authentication.update')
  @ApiOperation({ summary: 'Expire password.' })
  async expirePassword(@Body() dto: ExpirePasswordDto): Promise<void> {
    await this.expirePasswordHandler.execute(
      new ExpirePasswordCommand(
        new IdentityId(dto.identityPublicId),
        new Date(),
        CorrelationId.generate(),
      ),
    );
  }

  @Patch('mfa/enable')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('authentication.update')
  @ApiOperation({ summary: 'Enable multi-factor authentication.' })
  async enableMfa(@Body() dto: EnableMfaDto): Promise<void> {
    await this.enableMfaHandler.execute(
      new EnableMfaCommand(
        new IdentityId(dto.identityPublicId),
        dto.method,
        dto.secret,
        new Date(),
        CorrelationId.generate(),
      ),
    );
  }

  @Patch('mfa/disable')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('authentication.update')
  @ApiOperation({ summary: 'Disable multi-factor authentication.' })
  async disableMfa(@Body() dto: DisableMfaDto): Promise<void> {
    await this.disableMfaHandler.execute(
      new DisableMfaCommand(
        new IdentityId(dto.identityPublicId),
        new Date(),
        CorrelationId.generate(),
      ),
    );
  }

  @Patch('mfa/rotate-secret')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('authentication.update')
  @ApiOperation({ summary: 'Rotate MFA secret.' })
  async rotateSecret(@Body() dto: RotateMfaSecretDto): Promise<void> {
    await this.rotateMfaSecretHandler.execute(
      new RotateMfaSecretCommand(
        new IdentityId(dto.identityPublicId),
        dto.secret,
        new Date(),
        CorrelationId.generate(),
      ),
    );
  }

  @Patch('lock')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('authentication.lock')
  @ApiOperation({ summary: 'Lock authentication.' })
  async lock(@Body() dto: LockAuthenticationDto): Promise<void> {
    await this.lockAuthenticationHandler.execute(
      new LockAuthenticationCommand(
        new IdentityId(dto.identityPublicId),
        new Date(dto.lockedUntil),
        dto.reason,
        new Date(),
        CorrelationId.generate(),
      ),
    );
  }

  @Patch('unlock')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('authentication.unlock')
  @ApiOperation({ summary: 'Unlock authentication.' })
  async unlock(@Body() dto: UnlockAuthenticationDto): Promise<void> {
    await this.unlockAuthenticationHandler.execute(
      new UnlockAuthenticationCommand(
        new IdentityId(dto.identityPublicId),
        new Date(),
        CorrelationId.generate(),
      ),
    );
  }
}
