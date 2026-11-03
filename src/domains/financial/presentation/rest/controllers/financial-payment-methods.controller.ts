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
// A Financial Account does NOT require a Payment Method.
//
// Consequently, GET default must support a null result.
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
  CurrentIdentity,
  JwtAuthGuard,
  PermissionsGuard,
  RequirePermissions,
  type AuthenticatedIdentity,
} from '../../../../../foundation/security/auth';

// -----------------------------------------------------------------------------
// Foundation — Application
// -----------------------------------------------------------------------------

import type { CommandHandler } from '../../../../../foundation/kernel/application/command-handler';

import type { QueryHandler } from '../../../../../foundation/kernel/application/query-handler';

// -----------------------------------------------------------------------------
// Application — Tokens
// -----------------------------------------------------------------------------

import { FINANCIAL_ACCOUNT_TOKENS } from '../../../application/financial-account.tokens';

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
  GetAccountFinancialPaymentMethodsQuery,
  GetAllFinancialPaymentMethodsQuery,
  GetDefaultFinancialPaymentMethodQuery,
  GetFinancialPaymentMethodQuery,
  GetMyFinancialAccountQuery,
} from '../../../application/queries';

// -----------------------------------------------------------------------------
// Domain — Aggregates
// -----------------------------------------------------------------------------

import type { FinancialAccountAggregate } from '../../../domain/aggregates/financial-account.aggregate';

import type { FinancialPaymentMethodAggregate } from '../../../domain/aggregates/financial-payment-method.aggregate';

// -----------------------------------------------------------------------------
// Domain — Value Objects
// -----------------------------------------------------------------------------

import {
  FinancialAccountOwnerPublicId,
  FinancialAccountPublicId,
  FinancialPaymentMethodPhoneNumber,
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

// =============================================================================
// Controller
// =============================================================================

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
    // Financial Account Query Handlers
    // -------------------------------------------------------------------------

    @Inject(FINANCIAL_ACCOUNT_TOKENS.QUERY_HANDLERS.GET_ME)
    private readonly getMyFinancialAccountHandler: QueryHandler<
      GetMyFinancialAccountQuery,
      FinancialAccountAggregate
    >,

    // -------------------------------------------------------------------------
    // Financial Payment Method Query Handlers
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

    @Inject(FINANCIAL_PAYMENT_METHOD_TOKENS.QUERY_HANDLERS.GET_ALL)
    private readonly getAllFinancialPaymentMethodsHandler: QueryHandler<
      GetAllFinancialPaymentMethodsQuery,
      FinancialPaymentMethodAggregate[]
    >,

    @Inject(FINANCIAL_PAYMENT_METHOD_TOKENS.QUERY_HANDLERS.GET_ACCOUNT)
    private readonly getAccountFinancialPaymentMethodsHandler: QueryHandler<
      GetAccountFinancialPaymentMethodsQuery,
      FinancialPaymentMethodAggregate[]
    >,
  ) {}

  // ===========================================================================
  // Queries
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Get All Financial Payment Methods — Admin
  // ---------------------------------------------------------------------------

  @Get()
  @RequirePermissions('admin:read')
  public async getAll(): Promise<
    ReturnType<typeof FinancialPaymentMethodResponseMapper.toResponse>[]
  > {
    const aggregates = await this.getAllFinancialPaymentMethodsHandler.execute(
      new GetAllFinancialPaymentMethodsQuery(),
    );

    return FinancialPaymentMethodResponseMapper.fromAggregates(aggregates);
  }

  // ---------------------------------------------------------------------------
  // Get My Financial Payment Methods
  // ---------------------------------------------------------------------------
  //
  // Resolves the Financial Account from the authenticated Identity.
  //
  // The client cannot supply an account ID.
  //
  // This ensures that members can retrieve only payment methods belonging
  // to their own Financial Account.
  //
  // ---------------------------------------------------------------------------

  @Get('me')
  public async getMine(
    @CurrentIdentity() identity: AuthenticatedIdentity,
  ): Promise<
    ReturnType<typeof FinancialPaymentMethodResponseMapper.toResponse>[]
  > {
    // -------------------------------------------------------------------------
    // Resolve the authenticated member's Financial Account
    // -------------------------------------------------------------------------

    const account = await this.getMyFinancialAccountHandler.execute(
      new GetMyFinancialAccountQuery(
        FinancialAccountOwnerPublicId.create(identity.identityPublicId),
      ),
    );

    // -------------------------------------------------------------------------
    // Retrieve payment methods belonging to that account
    // -------------------------------------------------------------------------

    const aggregates =
      await this.getAccountFinancialPaymentMethodsHandler.execute(
        new GetAccountFinancialPaymentMethodsQuery(account.publicId),
      );

    // -------------------------------------------------------------------------
    // Response
    // -------------------------------------------------------------------------

    return FinancialPaymentMethodResponseMapper.fromAggregates(aggregates);
  }

  // ---------------------------------------------------------------------------
  // Get Financial Payment Method — Admin
  // ---------------------------------------------------------------------------

  @Get(':paymentMethodPublicId')
  @RequirePermissions('admin:read')
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
  //
  // A Financial Account may have no Payment Method and therefore no default.
  //
  // The application/query layer must return null in that case.
  //
  // ---------------------------------------------------------------------------

  @Get('accounts/:accountPublicId/default')
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
  public async add(
    @Body() dto: AddFinancialPaymentMethodDto,
  ): Promise<
    ReturnType<typeof FinancialPaymentMethodResponseMapper.toResponse>
  > {
    // -------------------------------------------------------------------------
    // M-PESA Phone Number
    // -------------------------------------------------------------------------

    const phoneNumber = FinancialPaymentMethodPhoneNumber.create(
      dto.phoneNumber,
    );

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
        // Financial Account
        new FinancialAccountPublicId(dto.accountId),

        // Payment Method Type
        FinancialPaymentMethodType.create(dto.type),

        // Provider
        FinancialProvider.create(dto.provider),

        // Correlation
        dto.correlationId,

        // M-PESA Phone Number
        phoneNumber,

        // Provider Reference
        providerReference,

        // Display Name
        dto.displayName,

        // Last Four
        dto.lastFour,

        // Default
        dto.isDefault,

        // Causation
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
  public async setDefault(
    @CurrentIdentity() identity: AuthenticatedIdentity,
    @Param('paymentMethodPublicId') paymentMethodPublicId: string,
    @Body() dto: SetDefaultFinancialPaymentMethodDto,
  ): Promise<
    ReturnType<typeof FinancialPaymentMethodResponseMapper.toResponse>
  > {
    // Resolve the account from the authenticated identity.
    const account = await this.getMyFinancialAccountHandler.execute(
      new GetMyFinancialAccountQuery(
        FinancialAccountOwnerPublicId.create(identity.identityPublicId),
      ),
    );

    const aggregate =
      await this.setDefaultFinancialPaymentMethodHandler.execute(
        new SetDefaultFinancialPaymentMethodCommand(
          new FinancialPaymentMethodPublicId(paymentMethodPublicId),
          account.publicId,
          dto.correlationId,
          dto.causationId,
          dto.defaultedAt !== undefined ? new Date(dto.defaultedAt) : undefined,
        ),
      );

    return FinancialPaymentMethodResponseMapper.toResponse(aggregate);
  }

  // ---------------------------------------------------------------------------
  // Deactivate Financial Payment Method
  // ---------------------------------------------------------------------------

  // ---------------------------------------------------------------------------
  // Deactivate Financial Payment Method
  // ---------------------------------------------------------------------------

  @Post(':paymentMethodPublicId/deactivate')
  public async deactivate(
    @CurrentIdentity() identity: AuthenticatedIdentity,
    @Param('paymentMethodPublicId') paymentMethodPublicId: string,
    @Body() dto: DeactivateFinancialPaymentMethodDto,
  ): Promise<
    ReturnType<typeof FinancialPaymentMethodResponseMapper.toResponse>
  > {
    const account = await this.getMyFinancialAccountHandler.execute(
      new GetMyFinancialAccountQuery(
        FinancialAccountOwnerPublicId.create(identity.identityPublicId),
      ),
    );

    const aggregate =
      await this.deactivateFinancialPaymentMethodHandler.execute(
        new DeactivateFinancialPaymentMethodCommand(
          new FinancialPaymentMethodPublicId(paymentMethodPublicId),
          account.publicId,
          dto.correlationId,
          dto.causationId,
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
