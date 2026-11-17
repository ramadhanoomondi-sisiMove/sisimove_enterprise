import { randomUUID } from 'node:crypto';

import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import {
  JwtAuthGuard,
  PermissionsGuard,
  RequirePermissions,
} from '../../../../../foundation/security/auth';

import type { CommandHandler } from '../../../../../foundation/kernel/application/command-handler';
import type { QueryHandler } from '../../../../../foundation/kernel/application/query-handler';

import { FINANCIAL_PAYMENT_PROVIDER_TOKENS } from '../../../application/financial-payment-providers.tokens';

import {
  ChangeFinancialPaymentProviderStatusCommand,
  ConfigureMpesaCommand,
  CreateFinancialPaymentProviderCommand,
  DisableFinancialPaymentProviderCapabilityCommand,
  DisableFinancialPaymentProviderCommand,
  EnableFinancialPaymentProviderCapabilityCommand,
  EnableFinancialPaymentProviderCommand,
  UpdateFinancialPaymentProviderCommand,
} from '../../../application/commands';

import {
  GetAvailableFinancialPaymentProvidersQuery,
  GetFinancialPaymentProviderByCodeQuery,
  GetFinancialPaymentProviderQuery,
  GetFinancialPaymentProvidersQuery,
} from '../../../application/queries';

import type { FinancialPaymentProviderAggregate } from '../../../domain/aggregates/financial-payment-provider.aggregate';

import {
  FinancialPaymentProviderCapabilityType,
  FinancialPaymentProviderCode,
  FinancialPaymentProviderConfigurationReference,
  FinancialPaymentProviderEnvironment,
  FinancialPaymentProviderName,
  FinancialPaymentProviderPublicId,
  FinancialPaymentProviderStatus,
  FinancialPaymentProviderStatusValue,
  FinancialPaymentProviderType,
} from '../../../domain/value-objects';

import {
  ChangeFinancialPaymentProviderStatusRequestDto,
  ConfigureMpesaRequestDto,
  CreateFinancialPaymentProviderRequestDto,
  UpdateFinancialPaymentProviderRequestDto,
} from '../dto/request';

import { GetFinancialPaymentProvidersQueryDto } from '../dto/queries';

import type { FinancialPaymentProviderResponse } from '../mappers/financial-payment-provider.response.mapper';

import { FinancialPaymentProviderResponseMapper } from '../mappers/financial-payment-provider.response.mapper';

import { FinancialPaymentProviderConfigurationService } from '../../../application/services/financial-payment-provider-configuration.service';
// =============================================================================
// M-PESA Configuration Types
// =============================================================================

type MpesaC2BBusinessType = 'PAYBILL' | 'BUY_GOODS';

// =============================================================================
// Controller
// =============================================================================

@ApiTags('Financial Payment Providers')
@Controller('financial-payment-providers')
export class FinancialPaymentProvidersController {
  public constructor(
    // Command handlers
    @Inject(FINANCIAL_PAYMENT_PROVIDER_TOKENS.COMMAND_HANDLERS.CREATE)
    private readonly createHandler: CommandHandler<
      CreateFinancialPaymentProviderCommand,
      FinancialPaymentProviderAggregate
    >,

    @Inject(FINANCIAL_PAYMENT_PROVIDER_TOKENS.COMMAND_HANDLERS.UPDATE)
    private readonly updateHandler: CommandHandler<
      UpdateFinancialPaymentProviderCommand,
      FinancialPaymentProviderAggregate
    >,

    @Inject(FINANCIAL_PAYMENT_PROVIDER_TOKENS.COMMAND_HANDLERS.ENABLE)
    private readonly enableHandler: CommandHandler<
      EnableFinancialPaymentProviderCommand,
      FinancialPaymentProviderAggregate
    >,

    @Inject(FINANCIAL_PAYMENT_PROVIDER_TOKENS.COMMAND_HANDLERS.DISABLE)
    private readonly disableHandler: CommandHandler<
      DisableFinancialPaymentProviderCommand,
      FinancialPaymentProviderAggregate
    >,

    @Inject(FINANCIAL_PAYMENT_PROVIDER_TOKENS.COMMAND_HANDLERS.CHANGE_STATUS)
    private readonly changeStatusHandler: CommandHandler<
      ChangeFinancialPaymentProviderStatusCommand,
      FinancialPaymentProviderAggregate
    >,

    @Inject(
      FINANCIAL_PAYMENT_PROVIDER_TOKENS.COMMAND_HANDLERS.ENABLE_CAPABILITY,
    )
    private readonly enableCapabilityHandler: CommandHandler<
      EnableFinancialPaymentProviderCapabilityCommand,
      FinancialPaymentProviderAggregate
    >,

    @Inject(
      FINANCIAL_PAYMENT_PROVIDER_TOKENS.COMMAND_HANDLERS.DISABLE_CAPABILITY,
    )
    private readonly disableCapabilityHandler: CommandHandler<
      DisableFinancialPaymentProviderCapabilityCommand,
      FinancialPaymentProviderAggregate
    >,

    @Inject(FINANCIAL_PAYMENT_PROVIDER_TOKENS.COMMAND_HANDLERS.CONFIGURE_MPESA)
    private readonly configureMpesaHandler: CommandHandler<
      ConfigureMpesaCommand,
      string
    >,

    // Query handlers
    @Inject(FINANCIAL_PAYMENT_PROVIDER_TOKENS.QUERY_HANDLERS.GET)
    private readonly getHandler: QueryHandler<
      GetFinancialPaymentProviderQuery,
      FinancialPaymentProviderAggregate
    >,

    @Inject(FINANCIAL_PAYMENT_PROVIDER_TOKENS.QUERY_HANDLERS.GET_ALL)
    private readonly getAllHandler: QueryHandler<
      GetFinancialPaymentProvidersQuery,
      FinancialPaymentProviderAggregate[]
    >,

    @Inject(FINANCIAL_PAYMENT_PROVIDER_TOKENS.QUERY_HANDLERS.GET_BY_CODE)
    private readonly getByCodeHandler: QueryHandler<
      GetFinancialPaymentProviderByCodeQuery,
      FinancialPaymentProviderAggregate
    >,

    @Inject(FINANCIAL_PAYMENT_PROVIDER_TOKENS.QUERY_HANDLERS.GET_AVAILABLE)
    private readonly getAvailableHandler: QueryHandler<
      GetAvailableFinancialPaymentProvidersQuery,
      FinancialPaymentProviderAggregate[]
    >,
    private readonly configurationService: FinancialPaymentProviderConfigurationService,
  ) {}

  // ===========================================================================
  // Queries
  // ===========================================================================

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'List financial payment providers',
    description:
      'Returns financial payment providers, optionally filtered by type, status, environment, and operational state.',
  })
  @Get()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('admin:read')
  public async getAll(
    @Query() filters: GetFinancialPaymentProvidersQueryDto,
  ): Promise<FinancialPaymentProviderResponse[]> {
    const aggregates = await this.getAllHandler.execute(
      new GetFinancialPaymentProvidersQuery(),
    );

    const filtered = aggregates.filter((aggregate) => {
      if (filters.type !== undefined && aggregate.type.value !== filters.type) {
        return false;
      }

      if (
        filters.status !== undefined &&
        aggregate.status.value !==
          FinancialPaymentProviderStatusValue[
            filters.status as keyof typeof FinancialPaymentProviderStatusValue
          ]
      ) {
        return false;
      }

      if (
        filters.environment !== undefined &&
        aggregate.environment.value !== filters.environment
      ) {
        return false;
      }

      if (
        filters.operational !== undefined &&
        aggregate.isOperational !== filters.operational
      ) {
        return false;
      }

      return true;
    });

    return filtered.map((aggregate) =>
      FinancialPaymentProviderResponseMapper.toResponse(aggregate),
    );
  }

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Get a financial payment provider by code',
    description: 'Returns a provider using its unique business code.',
  })
  @ApiParam({
    name: 'code',
    type: String,
    required: true,
    description: 'Unique financial payment provider code.',
    example: 'MPESA',
  })
  @Get('by-code/:code')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('admin:read')
  public async getByCode(
    @Param('code') code: string,
  ): Promise<FinancialPaymentProviderResponse> {
    const providerCode = FinancialPaymentProviderCode.create(code);

    const query = new GetFinancialPaymentProviderByCodeQuery(providerCode);

    const aggregate = await this.getByCodeHandler.execute(query);

    return FinancialPaymentProviderResponseMapper.toResponse(aggregate);
  }

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'List available financial payment providers',
    description:
      'Returns enabled and operational providers available for users adding a payment method.',
  })
  @Get('available')
  @UseGuards(JwtAuthGuard)
  public async getAvailable(): Promise<
    {
      publicId: string;
      code: string;
      name: string;
      type: string;
    }[]
  > {
    const aggregates = await this.getAvailableHandler.execute(
      new GetAvailableFinancialPaymentProvidersQuery(),
    );

    return aggregates.map((aggregate) => ({
      publicId: aggregate.publicId.value,
      code: aggregate.code.value,
      name: aggregate.name.value,
      type: aggregate.type.value,
    }));
  }

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Get a financial payment provider',
    description: 'Returns a provider by its public ID.',
  })
  @ApiParam({
    name: 'providerPublicId',
    type: String,
    required: true,
    description: 'Public ID of the financial payment provider.',
    example: 'FPP-XXXXXXXX',
  })
  @Get(':providerPublicId')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('admin:read')
  public async get(
    @Param('providerPublicId') providerPublicId: string,
  ): Promise<FinancialPaymentProviderResponse> {
    const query = new GetFinancialPaymentProviderQuery(
      new FinancialPaymentProviderPublicId(providerPublicId),
    );

    const aggregate = await this.getHandler.execute(query);

    return FinancialPaymentProviderResponseMapper.toResponse(aggregate);
  }

  // ===========================================================================
  // Commands
  // ===========================================================================

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Create a financial payment provider',
    description: 'Creates a provider and registers its supported capabilities.',
  })
  @Post()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('admin:read')
  public async create(
    @Body() dto: CreateFinancialPaymentProviderRequestDto,
  ): Promise<FinancialPaymentProviderResponse> {
    const configurationReference =
      dto.configurationReference !== undefined
        ? FinancialPaymentProviderConfigurationReference.create(
            dto.configurationReference,
          )
        : undefined;

    const capabilities = (dto.capabilities ?? []).map((capability) => ({
      type: FinancialPaymentProviderCapabilityType.create(capability.type),
      isSupported: capability.isSupported,
    }));

    const command = new CreateFinancialPaymentProviderCommand(
      FinancialPaymentProviderCode.create(dto.code),
      FinancialPaymentProviderName.create(dto.name),
      FinancialPaymentProviderType.create(dto.type),
      FinancialPaymentProviderEnvironment.create(dto.environment),
      new Date(),
      randomUUID(),
      dto.description,
      configurationReference,
      undefined,
      capabilities,
    );

    const aggregate = await this.createHandler.execute(command);

    return FinancialPaymentProviderResponseMapper.toResponse(aggregate);
  }

  // ===========================================================================
  // Configure M-PESA
  // ===========================================================================

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Configure M-PESA Daraja credentials',
    description: `
      Configures SisiMove's M-PESA integration for two purposes:

      1. TOP-UP:
         - STK Push: customer pays SisiMove through a phone prompt.
         - C2B: customer pays SisiMove through PayBill or Buy Goods.

      2. WITHDRAWAL:
         - B2C: SisiMove sends a customer's available funds to the customer.

      Credentials are encrypted before persistence and are never returned.

      FinancialModule remains responsible for authorizing withdrawals,
      financial posting, balances and reconciliation.
      M-PESA callbacks report external provider events only.
    `,
  })
  @ApiParam({
    name: 'providerPublicId',
    type: String,
    required: true,
    description: 'Public ID of the M-PESA provider.',
  })
  @Post(':providerPublicId/configuration')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('financial:manage')
  public async configureMpesa(
    @Param('providerPublicId') providerPublicId: string,
    @Body() dto: ConfigureMpesaRequestDto,
  ): Promise<{ configurationReference: string; message: string }> {
    // -------------------------------------------------------------------------
    // 1. Validate required STK/shared Daraja configuration
    // -------------------------------------------------------------------------

    const requiredFields = {
      consumerKey: dto.consumerKey,
      consumerSecret: dto.consumerSecret,
      shortcode: dto.shortcode,
      passkey: dto.passkey,
    };

    for (const [field, value] of Object.entries(requiredFields)) {
      if (typeof value !== 'string' || value.trim().length === 0) {
        throw new BadRequestException(
          `${field} is required and cannot be empty.`,
        );
      }
    }

    // -------------------------------------------------------------------------
    // 2. Validate optional C2B configuration
    // -------------------------------------------------------------------------

    const hasC2BShortcode = dto.c2bShortcode !== undefined;
    const hasC2BBusinessType = dto.c2bBusinessType !== undefined;

    if (hasC2BShortcode !== hasC2BBusinessType) {
      throw new BadRequestException(
        'C2B configuration requires both c2bShortcode and c2bBusinessType.',
      );
    }

    let c2b:
      | {
          shortcode: string;
          businessType: MpesaC2BBusinessType;
        }
      | undefined;

    if (hasC2BShortcode && hasC2BBusinessType) {
      if (!dto.c2bShortcode?.trim()) {
        throw new BadRequestException('C2B shortcode cannot be empty.');
      }

      const businessType = dto.c2bBusinessType;

      if (businessType !== 'PAYBILL' && businessType !== 'BUY_GOODS') {
        throw new BadRequestException(
          'C2B business type must be PAYBILL or BUY_GOODS.',
        );
      }

      c2b = {
        shortcode: dto.c2bShortcode.trim(),
        businessType,
      };
    }

    // -------------------------------------------------------------------------
    // 3. Validate optional B2C withdrawal configuration
    // -------------------------------------------------------------------------

    const b2cFields = [
      dto.b2cShortcode,
      dto.initiatorName,
      dto.securityCredential,
    ];

    const suppliedB2CFields = b2cFields.filter(
      (value) => value !== undefined,
    ).length;

    const hasB2CConfiguration = suppliedB2CFields > 0;

    if (hasB2CConfiguration && suppliedB2CFields !== 3) {
      throw new BadRequestException(
        'B2C withdrawal configuration requires b2cShortcode, initiatorName and securityCredential.',
      );
    }

    let b2c:
      | {
          shortcode: string;
          initiatorName: string;
          securityCredential: string;
        }
      | undefined;

    if (hasB2CConfiguration) {
      if (
        !dto.b2cShortcode?.trim() ||
        !dto.initiatorName?.trim() ||
        !dto.securityCredential?.trim()
      ) {
        throw new BadRequestException(
          'B2C shortcode, initiator name and security credential cannot be empty.',
        );
      }

      if (dto.initiatorName.trim().length > 100) {
        throw new BadRequestException(
          'B2C initiator name cannot exceed 100 characters.',
        );
      }

      b2c = {
        shortcode: dto.b2cShortcode.trim(),
        initiatorName: dto.initiatorName.trim(),
        securityCredential: dto.securityCredential.trim(),
      };
    }

    // -------------------------------------------------------------------------
    // 4. Create Configure M-PESA Command
    // -------------------------------------------------------------------------
    //
    // Constructor order must remain aligned with ConfigureMpesaCommand:
    //
    // 1. providerPublicId
    // 2. environment
    // 3. consumerKey
    // 4. consumerSecret
    // 5. shortcode
    // 6. passkey
    // 7. createdAt
    // 8. correlationId
    // 9. causationId
    // 10. c2b
    // 11. b2c
    //
    // -------------------------------------------------------------------------

    const command = new ConfigureMpesaCommand(
      new FinancialPaymentProviderPublicId(providerPublicId),
      FinancialPaymentProviderEnvironment.create(dto.environment),

      dto.consumerKey.trim(),
      dto.consumerSecret.trim(),

      dto.shortcode.trim(),
      dto.passkey.trim(),

      new Date(),
      randomUUID(),
      undefined,

      c2b,
      b2c,
    );

    // -------------------------------------------------------------------------
    // 5. Execute Configuration
    // -------------------------------------------------------------------------

    const reference = await this.configureMpesaHandler.execute(command);

    return {
      configurationReference: reference,
      message:
        'M-PESA credentials saved securely. Connection validation is still pending.',
    };
  }

  // ===========================================================================
  // M-PESA Configuration Status
  // ===========================================================================

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Get M-PESA configuration status',
    description: `
      Returns non-sensitive configuration status for M-PESA.

      Reports whether shared Daraja authentication, STK Push,
      C2B and B2C credentials have been configured.

      Credentials and encrypted secrets are never returned.
      Status is reported separately for Sandbox and Production.
    `,
  })
  @ApiParam({
    name: 'providerPublicId',
    type: String,
    required: true,
    description: 'Public ID of the M-PESA provider.',
  })
  @Get(':providerPublicId/configuration-status')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('admin:read')
  public async getMpesaConfigurationStatus(
    @Param('providerPublicId') providerPublicId: string,
    @Query('environment') environment: string,
  ): Promise<{
    environment: string;
    sharedAuthenticationConfigured: boolean;
    stkPushConfigured: boolean;
    c2bConfigured: boolean;
    b2cConfigured: boolean;
  }> {
    if (environment !== 'SANDBOX' && environment !== 'PRODUCTION') {
      throw new BadRequestException(
        'Environment must be SANDBOX or PRODUCTION.',
      );
    }

    const provider = await this.getHandler.execute(
      new GetFinancialPaymentProviderQuery(
        new FinancialPaymentProviderPublicId(providerPublicId),
      ),
    );

    if (provider.code.value !== 'MPESA') {
      throw new BadRequestException(
        'Configuration status is only available for M-PESA.',
      );
    }

    const configuration = await this.configurationService.getConfiguration(
      provider.id.toString(),
      FinancialPaymentProviderEnvironment.create(environment),
    );

    const hasValue = (key: string): boolean =>
      typeof configuration?.[key] === 'string' &&
      configuration[key].trim().length > 0;

    const sharedAuthenticationConfigured =
      hasValue('consumerKey') && hasValue('consumerSecret');

    const stkPushConfigured =
      sharedAuthenticationConfigured &&
      hasValue('shortcode') &&
      hasValue('passkey');

    const c2bConfigured =
      hasValue('c2bShortcode') &&
      (configuration?.c2bBusinessType === 'PAYBILL' ||
        configuration?.c2bBusinessType === 'BUY_GOODS');

    const b2cConfigured =
      hasValue('b2cShortcode') &&
      hasValue('initiatorName') &&
      hasValue('securityCredential');

    return {
      environment,
      sharedAuthenticationConfigured,
      stkPushConfigured,
      c2bConfigured,
      b2cConfigured,
    };
  }

  // ===========================================================================
  // Update Provider Details
  // ===========================================================================

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Update provider details',
    description: 'Updates the name of an existing provider.',
  })
  @ApiParam({
    name: 'providerPublicId',
    type: String,
    required: true,
    description: 'Public ID of the provider to update.',
  })
  @Patch(':providerPublicId')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('admin:read')
  public async update(
    @Param('providerPublicId') providerPublicId: string,
    @Body() dto: UpdateFinancialPaymentProviderRequestDto,
  ): Promise<FinancialPaymentProviderResponse> {
    const command = new UpdateFinancialPaymentProviderCommand(
      new FinancialPaymentProviderPublicId(providerPublicId),
      FinancialPaymentProviderName.create(dto.name),
      new Date(),
      randomUUID(),
      dto.causationId,
    );

    const aggregate = await this.updateHandler.execute(command);

    return FinancialPaymentProviderResponseMapper.toResponse(aggregate);
  }

  // ===========================================================================
  // Enable Provider
  // ===========================================================================

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Enable a financial payment provider',
    description: 'Enables the specified provider.',
  })
  @ApiParam({
    name: 'providerPublicId',
    type: String,
    required: true,
    description: 'Public ID of the provider.',
  })
  @Post(':providerPublicId/enable')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('admin:read')
  public async enable(
    @Param('providerPublicId') providerPublicId: string,
  ): Promise<FinancialPaymentProviderResponse> {
    const command = new EnableFinancialPaymentProviderCommand(
      new FinancialPaymentProviderPublicId(providerPublicId),
      new Date(),
      randomUUID(),
    );

    const aggregate = await this.enableHandler.execute(command);

    return FinancialPaymentProviderResponseMapper.toResponse(aggregate);
  }

  // ===========================================================================
  // Disable Provider
  // ===========================================================================

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Disable a financial payment provider',
    description: 'Disables the specified provider.',
  })
  @ApiParam({
    name: 'providerPublicId',
    type: String,
    required: true,
    description: 'Public ID of the provider.',
  })
  @Post(':providerPublicId/disable')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('admin:read')
  public async disable(
    @Param('providerPublicId') providerPublicId: string,
  ): Promise<FinancialPaymentProviderResponse> {
    const command = new DisableFinancialPaymentProviderCommand(
      new FinancialPaymentProviderPublicId(providerPublicId),
      new Date(),
      randomUUID(),
    );

    const aggregate = await this.disableHandler.execute(command);

    return FinancialPaymentProviderResponseMapper.toResponse(aggregate);
  }

  // ===========================================================================
  // Change Provider Status
  // ===========================================================================

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Change provider integration status',
    description: 'Changes the integration status of a provider.',
  })
  @ApiParam({
    name: 'providerPublicId',
    type: String,
    required: true,
    description: 'Public ID of the provider.',
  })
  @Post(':providerPublicId/status')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('admin:read')
  public async changeStatus(
    @Param('providerPublicId') providerPublicId: string,
    @Body() dto: ChangeFinancialPaymentProviderStatusRequestDto,
  ): Promise<FinancialPaymentProviderResponse> {
    const statusValue = Object.values(FinancialPaymentProviderStatusValue).find(
      (value) => String(value) === dto.status,
    );

    if (statusValue === undefined) {
      throw new BadRequestException(
        `Invalid financial payment provider status: ${dto.status}`,
      );
    }

    const status = FinancialPaymentProviderStatus.create(statusValue);

    const command = new ChangeFinancialPaymentProviderStatusCommand(
      new FinancialPaymentProviderPublicId(providerPublicId),
      status,
      new Date(),
      randomUUID(),
      dto.causationId,
    );

    const aggregate = await this.changeStatusHandler.execute(command);

    return FinancialPaymentProviderResponseMapper.toResponse(aggregate);
  }

  // ===========================================================================
  // Enable Provider Capability
  // ===========================================================================

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Enable a provider capability',
    description: 'Enables a supported capability for a provider.',
  })
  @ApiParam({
    name: 'providerPublicId',
    type: String,
    required: true,
    description: 'Public ID of the provider.',
  })
  @ApiParam({
    name: 'capabilityType',
    type: String,
    required: true,
    description: 'Capability to enable.',
    example: 'INITIATE_PAYMENT',
  })
  @Post(':providerPublicId/capabilities/:capabilityType/enable')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('admin:read')
  public async enableCapability(
    @Param('providerPublicId') providerPublicId: string,
    @Param('capabilityType') capabilityType: string,
  ): Promise<FinancialPaymentProviderResponse> {
    const command = new EnableFinancialPaymentProviderCapabilityCommand(
      new FinancialPaymentProviderPublicId(providerPublicId),
      FinancialPaymentProviderCapabilityType.create(capabilityType),
      new Date(),
      randomUUID(),
    );

    const aggregate = await this.enableCapabilityHandler.execute(command);

    return FinancialPaymentProviderResponseMapper.toResponse(aggregate);
  }

  // ===========================================================================
  // Disable Provider Capability
  // ===========================================================================

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Disable a provider capability',
    description: 'Disables a capability for a provider.',
  })
  @ApiParam({
    name: 'providerPublicId',
    type: String,
    required: true,
    description: 'Public ID of the provider.',
  })
  @ApiParam({
    name: 'capabilityType',
    type: String,
    required: true,
    description: 'Capability to disable.',
    example: 'INITIATE_PAYMENT',
  })
  @Post(':providerPublicId/capabilities/:capabilityType/disable')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('admin:read')
  public async disableCapability(
    @Param('providerPublicId') providerPublicId: string,
    @Param('capabilityType') capabilityType: string,
  ): Promise<FinancialPaymentProviderResponse> {
    const command = new DisableFinancialPaymentProviderCapabilityCommand(
      new FinancialPaymentProviderPublicId(providerPublicId),
      FinancialPaymentProviderCapabilityType.create(capabilityType),
      new Date(),
      randomUUID(),
    );

    const aggregate = await this.disableCapabilityHandler.execute(command);

    return FinancialPaymentProviderResponseMapper.toResponse(aggregate);
  }
}

export default FinancialPaymentProvidersController;
