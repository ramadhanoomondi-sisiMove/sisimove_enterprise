// -----------------------------------------------------------------------------
// Financial Payment Method — HTTP Controller
// -----------------------------------------------------------------------------
//
// REST controller for Financial Payment Method operations.
//
// Aggregate:
//
// FinancialPaymentMethodAggregate
// └── FinancialPaymentMethodEntity
//
// The controller is responsible only for:
// - HTTP transport;
// - DTO validation;
// - conversion from transport primitives to domain value objects;
// - dispatching application commands and queries.
//
// Domain behavior remains inside FinancialPaymentMethodAggregate.
// Application orchestration remains inside command/query handlers.
// Persistence remains behind FinancialPaymentMethodRepository.
//
// Financial Payment Methods are owned by a Financial Account through an
// opaque Financial Account reference.
//
// The controller does NOT:
// - execute payment provider operations;
// - store or handle raw payment credentials;
// - execute Financial Payments;
// - modify Financial Account balances;
// - create Financial Transactions.
//
// Provider operations belong to the integration boundary.
// Payment execution belongs to the Financial Payment boundary.
// Persistence belongs to the repository/infrastructure boundary.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';

// -----------------------------------------------------------------------------
// Swagger
// -----------------------------------------------------------------------------

import { ApiTags } from '@nestjs/swagger';

// -----------------------------------------------------------------------------
// Identity — Authentication & Authorization
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

import { FINANCIAL_PAYMENT_METHOD_TOKENS } from '../../../application/financial-payment-method.tokens';

// -----------------------------------------------------------------------------
// Application — Commands
// -----------------------------------------------------------------------------

import {
  AddFinancialPaymentMethodCommand,
  DeactivateFinancialPaymentMethodCommand,
  SetDefaultFinancialPaymentMethodCommand,
} from '../../../application/commands';

// -----------------------------------------------------------------------------
// Application — Queries
// -----------------------------------------------------------------------------

import {
  GetDefaultFinancialPaymentMethodQuery,
  GetFinancialPaymentMethodQuery,
} from '../../../application/queries';

// -----------------------------------------------------------------------------
// Domain — Aggregate
// -----------------------------------------------------------------------------

import type { FinancialPaymentMethodAggregate } from '../../../domain/aggregates/financial-payment-method.aggregate';

// -----------------------------------------------------------------------------
// Domain — Value Objects
// -----------------------------------------------------------------------------

import {
  FinancialAccountPublicId,
  FinancialPaymentMethodPublicId,
  FinancialPaymentMethodType,
  FinancialProvider,
  FinancialProviderReference,
} from '../../../domain/value-objects';

// -----------------------------------------------------------------------------
// Presentation — Request DTOs
// -----------------------------------------------------------------------------

import {
  AddFinancialPaymentMethodDto,
  DeactivateFinancialPaymentMethodDto,
  SetDefaultFinancialPaymentMethodDto,
} from '../dto/request';

// -----------------------------------------------------------------------------
// Presentation — Response Mapper
// -----------------------------------------------------------------------------

import { FinancialPaymentMethodResponseMapper } from '../mappers/financial-payment-method.response.mapper';

// -----------------------------------------------------------------------------
// Controller
// -----------------------------------------------------------------------------

@ApiTags('Financial Payment Methods')
@Controller('financial-payment-methods')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class FinancialPaymentMethodsController {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    // -------------------------------------------------------------------------
    // Command Handlers
    // -------------------------------------------------------------------------

    @Inject(FINANCIAL_PAYMENT_METHOD_TOKENS.COMMAND_HANDLERS.ADD)
    private readonly addFinancialPaymentMethodHandler: CommandHandler<
      AddFinancialPaymentMethodCommand,
      FinancialPaymentMethodAggregate
    >,

    @Inject(FINANCIAL_PAYMENT_METHOD_TOKENS.COMMAND_HANDLERS.SET_DEFAULT)
    private readonly setDefaultFinancialPaymentMethodHandler: CommandHandler<
      SetDefaultFinancialPaymentMethodCommand,
      FinancialPaymentMethodAggregate
    >,

    @Inject(FINANCIAL_PAYMENT_METHOD_TOKENS.COMMAND_HANDLERS.DEACTIVATE)
    private readonly deactivateFinancialPaymentMethodHandler: CommandHandler<
      DeactivateFinancialPaymentMethodCommand,
      FinancialPaymentMethodAggregate
    >,

    // -------------------------------------------------------------------------
    // Query Handlers
    // -------------------------------------------------------------------------

    @Inject(FINANCIAL_PAYMENT_METHOD_TOKENS.QUERY_HANDLERS.GET)
    private readonly getFinancialPaymentMethodHandler: QueryHandler<
      GetFinancialPaymentMethodQuery,
      FinancialPaymentMethodAggregate | null
    >,

    @Inject(FINANCIAL_PAYMENT_METHOD_TOKENS.QUERY_HANDLERS.GET_DEFAULT)
    private readonly getDefaultFinancialPaymentMethodHandler: QueryHandler<
      GetDefaultFinancialPaymentMethodQuery,
      FinancialPaymentMethodAggregate | null
    >,
  ) {}

  // ===========================================================================
  // Queries
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Get Financial Payment Method
  // ---------------------------------------------------------------------------

  @Get(':paymentMethodPublicId')
  @RequirePermissions('financial-payment-method:read')
  public async get(
    @Param('paymentMethodPublicId') paymentMethodPublicId: string,
  ): Promise<ReturnType<
    typeof FinancialPaymentMethodResponseMapper.toResponse
  > | null> {
    const aggregate = await this.getFinancialPaymentMethodHandler.execute(
      new GetFinancialPaymentMethodQuery(
        new FinancialPaymentMethodPublicId(paymentMethodPublicId),
      ),
    );

    if (aggregate === null) {
      return null;
    }

    return FinancialPaymentMethodResponseMapper.toResponse(aggregate);
  }

  // ---------------------------------------------------------------------------
  // Get Default Financial Payment Method
  // ---------------------------------------------------------------------------

  @Get('accounts/:accountPublicId/default')
  @RequirePermissions('financial-payment-method:read')
  public async getDefault(
    @Param('accountPublicId') accountPublicId: string,
  ): Promise<ReturnType<
    typeof FinancialPaymentMethodResponseMapper.toResponse
  > | null> {
    const aggregate =
      await this.getDefaultFinancialPaymentMethodHandler.execute(
        new GetDefaultFinancialPaymentMethodQuery(
          new FinancialAccountPublicId(accountPublicId),
        ),
      );

    if (aggregate === null) {
      return null;
    }

    return FinancialPaymentMethodResponseMapper.toResponse(aggregate);
  }

  // ===========================================================================
  // Commands
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Add Financial Payment Method
  // ---------------------------------------------------------------------------

  @Post()
  @RequirePermissions('financial-payment-method:create')
  public async add(
    @Body() dto: AddFinancialPaymentMethodDto,
  ): Promise<
    ReturnType<typeof FinancialPaymentMethodResponseMapper.toResponse>
  > {
    // -------------------------------------------------------------------------
    // Provider Reference
    // -------------------------------------------------------------------------

    const providerReference =
      dto.providerReference !== undefined
        ? FinancialProviderReference.create(dto.providerReference)
        : undefined;

    // -------------------------------------------------------------------------
    // Add Payment Method
    // -------------------------------------------------------------------------

    const aggregate = await this.addFinancialPaymentMethodHandler.execute(
      new AddFinancialPaymentMethodCommand(
        // ---------------------------------------------------------------------
        // Financial Account
        // ---------------------------------------------------------------------

        new FinancialAccountPublicId(dto.accountId),

        // ---------------------------------------------------------------------
        // Payment Method Type
        // ---------------------------------------------------------------------

        FinancialPaymentMethodType.create(dto.type),

        // ---------------------------------------------------------------------
        // Provider
        // ---------------------------------------------------------------------

        FinancialProvider.create(dto.provider),

        // ---------------------------------------------------------------------
        // Correlation
        // ---------------------------------------------------------------------

        dto.correlationId,

        // ---------------------------------------------------------------------
        // Provider Reference
        // ---------------------------------------------------------------------

        providerReference,

        // ---------------------------------------------------------------------
        // Display Name
        // ---------------------------------------------------------------------

        dto.displayName,

        // ---------------------------------------------------------------------
        // Last Four
        // ---------------------------------------------------------------------

        dto.lastFour,

        // ---------------------------------------------------------------------
        // Default
        // ---------------------------------------------------------------------

        dto.isDefault,

        // ---------------------------------------------------------------------
        // Causation
        // ---------------------------------------------------------------------

        dto.causationId,
      ),
    );

    // -------------------------------------------------------------------------
    // Response
    // -------------------------------------------------------------------------

    return FinancialPaymentMethodResponseMapper.toResponse(aggregate);
  }

  // ---------------------------------------------------------------------------
  // Set Default Financial Payment Method
  // ---------------------------------------------------------------------------

  @Post(':paymentMethodPublicId/default')
  @RequirePermissions('financial-payment-method:set-default')
  public async setDefault(
    @Param('paymentMethodPublicId') paymentMethodPublicId: string,
    @Body() dto: SetDefaultFinancialPaymentMethodDto,
  ): Promise<
    ReturnType<typeof FinancialPaymentMethodResponseMapper.toResponse>
  > {
    const aggregate =
      await this.setDefaultFinancialPaymentMethodHandler.execute(
        new SetDefaultFinancialPaymentMethodCommand(
          // Payment Method Public ID
          new FinancialPaymentMethodPublicId(paymentMethodPublicId),

          // Correlation
          dto.correlationId,

          // Causation
          dto.causationId,

          // Defaulted At
          dto.defaultedAt !== undefined ? new Date(dto.defaultedAt) : undefined,
        ),
      );

    return FinancialPaymentMethodResponseMapper.toResponse(aggregate);
  }

  // ---------------------------------------------------------------------------
  // Deactivate Financial Payment Method
  // ---------------------------------------------------------------------------

  @Post(':paymentMethodPublicId/deactivate')
  @RequirePermissions('financial-payment-method:deactivate')
  public async deactivate(
    @Param('paymentMethodPublicId') paymentMethodPublicId: string,
    @Body() dto: DeactivateFinancialPaymentMethodDto,
  ): Promise<
    ReturnType<typeof FinancialPaymentMethodResponseMapper.toResponse>
  > {
    const aggregate =
      await this.deactivateFinancialPaymentMethodHandler.execute(
        new DeactivateFinancialPaymentMethodCommand(
          // Payment Method Public ID
          new FinancialPaymentMethodPublicId(paymentMethodPublicId),

          // Correlation
          dto.correlationId,

          // Causation
          dto.causationId,

          // Deactivated At
          dto.deactivatedAt !== undefined
            ? new Date(dto.deactivatedAt)
            : undefined,
        ),
      );

    return FinancialPaymentMethodResponseMapper.toResponse(aggregate);
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default FinancialPaymentMethodsController;
