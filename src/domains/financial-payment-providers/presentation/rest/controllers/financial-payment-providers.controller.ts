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
      Configures SisiMove's M-PESA integration for two purposes only:

      1. TOP-UP:
         - STK Push: customer pays SisiMove through a phone prompt.
         - C2B: customer pays SisiMove through PayBill or Buy Goods.

      2. WITHDRAWAL:
         - B2C: SisiMove sends a customer's available funds to the customer.

      Credentials are encrypted before persistence and are never returned.

      FinancialModule remains responsible for authorizing withdrawals,
      updating available balances, posting ledger entries and reconciliation.
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
    // 1. Validate optional C2B configuration
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
      const businessType = dto.c2bBusinessType;

      if (businessType !== 'PAYBILL' && businessType !== 'BUY_GOODS') {
        throw new BadRequestException(
          'C2B business type must be PAYBILL or BUY_GOODS.',
        );
      }

      c2b = {
        shortcode: dto.c2bShortcode!,
        businessType,
      };
    }

    // -------------------------------------------------------------------------
    // 2. Validate optional B2C withdrawal configuration
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

    const b2c = hasB2CConfiguration
      ? {
          shortcode: dto.b2cShortcode!,
          initiatorName: dto.initiatorName!,
          securityCredential: dto.securityCredential!,
        }
      : undefined;

    // -------------------------------------------------------------------------
    // 3. Validate required STK/shared configuration
    // -------------------------------------------------------------------------

    if (
      !dto.consumerKey?.trim() ||
      !dto.consumerSecret?.trim() ||
      !dto.shortcode?.trim() ||
      !dto.passkey?.trim()
    ) {
      throw new BadRequestException(
        'Consumer Key, Consumer Secret, STK Shortcode and STK Passkey are required.',
      );
    }

    // -------------------------------------------------------------------------
    // 4. Create configuration command
    // -------------------------------------------------------------------------

    const command = new ConfigureMpesaCommand(
      new FinancialPaymentProviderPublicId(providerPublicId),
      FinancialPaymentProviderEnvironment.create(dto.environment),

      // Shared Daraja authentication.
      dto.consumerKey,
      dto.consumerSecret,

      // STK Push top-up configuration.
      dto.shortcode,
      dto.passkey,

      // Audit metadata.
      new Date(),
      randomUUID(),
      undefined,

      // Optional C2B top-up configuration.
      c2b,

      // Optional B2C available-funds withdrawal configuration.
      b2c,
    );

    // -------------------------------------------------------------------------
    // 5. Execute configuration
    // -------------------------------------------------------------------------

    const reference = await this.configureMpesaHandler.execute(command);

    return {
      configurationReference: reference,
      message:
        'M-PESA credentials saved securely. Connection validation is still pending.',
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
