// -----------------------------------------------------------------------------
// Financial Payment Providers — HTTP Controller
// -----------------------------------------------------------------------------

import { randomUUID } from 'node:crypto';

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

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

// -----------------------------------------------------------------------------
// Swagger
// -----------------------------------------------------------------------------

import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

// -----------------------------------------------------------------------------
// Foundation — Security
// -----------------------------------------------------------------------------

import {
  JwtAuthGuard,
  PermissionsGuard,
  RequirePermissions,
} from '../../../../../foundation/security/auth';

// -----------------------------------------------------------------------------
// Foundation — Application
// -----------------------------------------------------------------------------

import type { CommandHandler } from '../../../../../foundation/kernel/application/command-handler';
import type { QueryHandler } from '../../../../../foundation/kernel/application/query-handler';

// -----------------------------------------------------------------------------
// Application — Tokens
// -----------------------------------------------------------------------------

import { FINANCIAL_PAYMENT_PROVIDER_TOKENS } from '../../../application/financial-payment-providers.tokens';

// -----------------------------------------------------------------------------
// Application — Commands
// -----------------------------------------------------------------------------

import {
  ChangeFinancialPaymentProviderStatusCommand,
  CreateFinancialPaymentProviderCommand,
  DisableFinancialPaymentProviderCapabilityCommand,
  DisableFinancialPaymentProviderCommand,
  EnableFinancialPaymentProviderCapabilityCommand,
  EnableFinancialPaymentProviderCommand,
  UpdateFinancialPaymentProviderCommand,
} from '../../../application/commands';

// -----------------------------------------------------------------------------
// Application — Queries
// -----------------------------------------------------------------------------

import {
  GetFinancialPaymentProviderByCodeQuery,
  GetFinancialPaymentProviderQuery,
  GetFinancialPaymentProvidersQuery,
} from '../../../application/queries';

// -----------------------------------------------------------------------------
// Domain — Aggregate
// -----------------------------------------------------------------------------

import type { FinancialPaymentProviderAggregate } from '../../../domain/aggregates/financial-payment-provider.aggregate';

// -----------------------------------------------------------------------------
// Domain — Value Objects
// -----------------------------------------------------------------------------

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

// -----------------------------------------------------------------------------
// Presentation — Request DTOs
// -----------------------------------------------------------------------------

import {
  ChangeFinancialPaymentProviderStatusRequestDto,
  CreateFinancialPaymentProviderRequestDto,
  UpdateFinancialPaymentProviderRequestDto,
} from '../dto/request';

// -----------------------------------------------------------------------------
// Presentation — Query DTOs
// -----------------------------------------------------------------------------

import { GetFinancialPaymentProvidersQueryDto } from '../dto/queries';

// -----------------------------------------------------------------------------
// Presentation — Response Models
// -----------------------------------------------------------------------------

import type { FinancialPaymentProviderResponse } from '../mappers/financial-payment-provider.response.mapper';

// -----------------------------------------------------------------------------
// Presentation — Response Mapper
// -----------------------------------------------------------------------------

import { FinancialPaymentProviderResponseMapper } from '../mappers/financial-payment-provider.response.mapper';

// =============================================================================
// Controller
// =============================================================================

@ApiTags('Financial Payment Providers')
@Controller('financial-payment-providers')
export class FinancialPaymentProvidersController {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    // -------------------------------------------------------------------------
    // Command Handlers
    // -------------------------------------------------------------------------

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

    // -------------------------------------------------------------------------
    // Query Handlers
    // -------------------------------------------------------------------------

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
  ) {}

  // ===========================================================================
  // Queries
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Get All Providers
  // ---------------------------------------------------------------------------

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

  // ---------------------------------------------------------------------------
  // Get Provider By Code
  // ---------------------------------------------------------------------------

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

  // ---------------------------------------------------------------------------
  // Get Provider By Public ID
  // ---------------------------------------------------------------------------

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

  // ---------------------------------------------------------------------------
  // Create Provider
  // ---------------------------------------------------------------------------

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Create a financial payment provider',
    description: 'Creates a provider using the supplied configuration.',
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

    const command = new CreateFinancialPaymentProviderCommand(
      FinancialPaymentProviderCode.create(dto.code),
      FinancialPaymentProviderName.create(dto.name),
      FinancialPaymentProviderType.create(dto.type),
      FinancialPaymentProviderEnvironment.create(dto.environment),
      new Date(),
      randomUUID(),
      dto.description,
      configurationReference,
    );

    const aggregate = await this.createHandler.execute(command);

    return FinancialPaymentProviderResponseMapper.toResponse(aggregate);
  }

  // ---------------------------------------------------------------------------
  // Update Provider Details
  // ---------------------------------------------------------------------------

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

  // ---------------------------------------------------------------------------
  // Enable Provider
  // ---------------------------------------------------------------------------

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

  // ---------------------------------------------------------------------------
  // Disable Provider
  // ---------------------------------------------------------------------------

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

  // ---------------------------------------------------------------------------
  // Change Provider Status
  // ---------------------------------------------------------------------------

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

  // ---------------------------------------------------------------------------
  // Enable Provider Capability
  // ---------------------------------------------------------------------------

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

  // ---------------------------------------------------------------------------
  // Disable Provider Capability
  // ---------------------------------------------------------------------------

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

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default FinancialPaymentProvidersController;
