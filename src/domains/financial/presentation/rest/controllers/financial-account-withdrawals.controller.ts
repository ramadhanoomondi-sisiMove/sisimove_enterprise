import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  Inject,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';

import { ApiHeader, ApiTags } from '@nestjs/swagger';

import {
  JwtAuthGuard,
  PermissionsGuard,
  RequirePermissions,
} from '../../../../../foundation/security/auth';

import type { CommandHandler } from '../../../../../foundation/kernel/application/command-handler';
import type { QueryHandler } from '../../../../../foundation/kernel/application/query-handler';

import { FINANCIAL_ACCOUNT_WITHDRAWAL_TOKENS } from '../../../application/financial-account-withdrawal.tokens';

import {
  CancelFinancialAccountWithdrawalCommand,
  CompleteFinancialAccountWithdrawalCommand,
  FailFinancialAccountWithdrawalCommand,
  ProcessFinancialAccountWithdrawalCommand,
  RequestFinancialAccountWithdrawalCommand,
} from '../../../application/commands';

import {
  GetAllFinancialAccountWithdrawalsQuery,
  GetFinancialAccountWithdrawalQuery,
  GetFinancialAccountWithdrawalsByStatusQuery,
  GetFinancialAccountWithdrawalsQuery,
} from '../../../application/queries';

import type { FinancialAccountWithdrawalAggregate } from '../../../domain/aggregates/financial-account-withdrawal.aggregate';

import {
  Currency,
  FinancialAccountPublicId,
  FinancialAccountWithdrawalDestination,
  FinancialAccountWithdrawalPublicId,
  FinancialAccountWithdrawalStatus,
  FinancialAccountWithdrawalStatusValue,
  FinancialReferencePublicId,
  FinancialReferenceType,
  Money,
} from '../../../domain/value-objects';

import {
  CancelFinancialAccountWithdrawalRequestDto,
  CompleteFinancialAccountWithdrawalRequestDto,
  FailFinancialAccountWithdrawalRequestDto,
  ProcessFinancialAccountWithdrawalRequestDto,
  RequestFinancialAccountWithdrawalRequestDto,
} from '../dto/request';

import {
  GetFinancialAccountWithdrawalQueryDto,
  GetFinancialAccountWithdrawalsByStatusQueryDto,
  GetFinancialAccountWithdrawalsQueryDto,
} from '../queries';

import { FinancialAccountWithdrawalResponseMapper } from '../mappers/financial-account-withdrawal-response.mapper';

@ApiTags('Financial Account Withdrawals')
@Controller('financial-account-withdrawals')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class FinancialAccountWithdrawalsController {
  public constructor(
    // Command handlers

    @Inject(FINANCIAL_ACCOUNT_WITHDRAWAL_TOKENS.COMMAND_HANDLERS.REQUEST)
    private readonly requestFinancialAccountWithdrawalHandler: CommandHandler<
      RequestFinancialAccountWithdrawalCommand,
      FinancialAccountWithdrawalAggregate
    >,

    @Inject(FINANCIAL_ACCOUNT_WITHDRAWAL_TOKENS.COMMAND_HANDLERS.PROCESS)
    private readonly processFinancialAccountWithdrawalHandler: CommandHandler<
      ProcessFinancialAccountWithdrawalCommand,
      FinancialAccountWithdrawalAggregate
    >,

    @Inject(FINANCIAL_ACCOUNT_WITHDRAWAL_TOKENS.COMMAND_HANDLERS.COMPLETE)
    private readonly completeFinancialAccountWithdrawalHandler: CommandHandler<
      CompleteFinancialAccountWithdrawalCommand,
      FinancialAccountWithdrawalAggregate
    >,

    @Inject(FINANCIAL_ACCOUNT_WITHDRAWAL_TOKENS.COMMAND_HANDLERS.FAIL)
    private readonly failFinancialAccountWithdrawalHandler: CommandHandler<
      FailFinancialAccountWithdrawalCommand,
      FinancialAccountWithdrawalAggregate
    >,

    @Inject(FINANCIAL_ACCOUNT_WITHDRAWAL_TOKENS.COMMAND_HANDLERS.CANCEL)
    private readonly cancelFinancialAccountWithdrawalHandler: CommandHandler<
      CancelFinancialAccountWithdrawalCommand,
      FinancialAccountWithdrawalAggregate
    >,

    // Query handlers

    @Inject(FINANCIAL_ACCOUNT_WITHDRAWAL_TOKENS.QUERY_HANDLERS.GET)
    private readonly getFinancialAccountWithdrawalHandler: QueryHandler<
      GetFinancialAccountWithdrawalQuery,
      FinancialAccountWithdrawalAggregate
    >,

    @Inject(FINANCIAL_ACCOUNT_WITHDRAWAL_TOKENS.QUERY_HANDLERS.GET_ALL)
    private readonly getFinancialAccountWithdrawalsHandler: QueryHandler<
      GetFinancialAccountWithdrawalsQuery,
      FinancialAccountWithdrawalAggregate[]
    >,

    @Inject(FINANCIAL_ACCOUNT_WITHDRAWAL_TOKENS.QUERY_HANDLERS.GET_BY_STATUS)
    private readonly getFinancialAccountWithdrawalsByStatusHandler: QueryHandler<
      GetFinancialAccountWithdrawalsByStatusQuery,
      FinancialAccountWithdrawalAggregate[]
    >,

    @Inject(FINANCIAL_ACCOUNT_WITHDRAWAL_TOKENS.QUERY_HANDLERS.GET_ALL_PLATFORM)
    private readonly getAllFinancialAccountWithdrawalsHandler: QueryHandler<
      GetAllFinancialAccountWithdrawalsQuery,
      FinancialAccountWithdrawalAggregate[]
    >,
  ) {}

  // ---------------------------------------------------------------------------
  // Get All Withdrawals Across Platform
  // ---------------------------------------------------------------------------

  @Get()
  @RequirePermissions('financial:read')
  public async getAll(): Promise<
    ReturnType<typeof FinancialAccountWithdrawalResponseMapper.toResponse>[]
  > {
    const aggregates =
      await this.getAllFinancialAccountWithdrawalsHandler.execute(
        new GetAllFinancialAccountWithdrawalsQuery(),
      );

    return FinancialAccountWithdrawalResponseMapper.fromAggregates(aggregates);
  }

  // ===========================================================================
  // Queries
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Get Withdrawals By Account And Status
  // ---------------------------------------------------------------------------

  @Get('accounts/:accountPublicId/status/:status')
  @RequirePermissions('financial:read')
  public async getByAccountAndStatus(
    @Param() params: GetFinancialAccountWithdrawalsByStatusQueryDto,
  ): Promise<
    ReturnType<typeof FinancialAccountWithdrawalResponseMapper.toResponse>[]
  > {
    const status = FinancialAccountWithdrawalStatus.create(
      params.status as FinancialAccountWithdrawalStatusValue,
    );

    const aggregates =
      await this.getFinancialAccountWithdrawalsByStatusHandler.execute(
        new GetFinancialAccountWithdrawalsByStatusQuery(
          new FinancialAccountPublicId(params.accountPublicId),
          status,
        ),
      );

    return FinancialAccountWithdrawalResponseMapper.fromAggregates(aggregates);
  }

  // ---------------------------------------------------------------------------
  // Get Withdrawals By Account
  // ---------------------------------------------------------------------------

  @Get('accounts/:accountPublicId')
  @RequirePermissions('financial:read')
  public async getByAccount(
    @Param() params: GetFinancialAccountWithdrawalsQueryDto,
  ): Promise<
    ReturnType<typeof FinancialAccountWithdrawalResponseMapper.toResponse>[]
  > {
    const aggregates = await this.getFinancialAccountWithdrawalsHandler.execute(
      new GetFinancialAccountWithdrawalsQuery(
        new FinancialAccountPublicId(params.accountPublicId),
      ),
    );

    return FinancialAccountWithdrawalResponseMapper.fromAggregates(aggregates);
  }

  // ---------------------------------------------------------------------------
  // Get Withdrawal
  // ---------------------------------------------------------------------------

  @Get(':withdrawalPublicId')
  @RequirePermissions('financial:read')
  public async get(
    @Param() params: GetFinancialAccountWithdrawalQueryDto,
  ): Promise<
    ReturnType<typeof FinancialAccountWithdrawalResponseMapper.toResponse>
  > {
    const aggregate = await this.getFinancialAccountWithdrawalHandler.execute(
      new GetFinancialAccountWithdrawalQuery(
        new FinancialAccountWithdrawalPublicId(params.withdrawalPublicId),
      ),
    );

    return FinancialAccountWithdrawalResponseMapper.toResponse(aggregate);
  }

  // ===========================================================================
  // Commands
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Request Withdrawal
  // ---------------------------------------------------------------------------

  @Post()
  @ApiHeader({
    name: 'Idempotency-Key',
    required: true,
    description:
      'Unique key for this withdrawal request. Reuse the same key when retrying the same request.',
    example: 'wdreq-01K3R8Y7Q2',
  })
  @RequirePermissions('financial-account-withdrawal:create')
  public async request(
    @Body() dto: RequestFinancialAccountWithdrawalRequestDto,
    @Headers('idempotency-key') idempotencyKey?: string,
  ): Promise<
    ReturnType<typeof FinancialAccountWithdrawalResponseMapper.toResponse>
  > {
    const normalizedIdempotencyKey = idempotencyKey?.trim();

    if (
      normalizedIdempotencyKey === undefined ||
      normalizedIdempotencyKey.length === 0 ||
      normalizedIdempotencyKey.length > 128
    ) {
      throw new BadRequestException(
        'Idempotency-Key header is required and must contain between 1 and 128 characters.',
      );
    }

    const currency = Currency.create(dto.currency);

    const amount = Money.create(dto.amount, currency);

    const destination = FinancialAccountWithdrawalDestination.create(
      dto.destinationType,
      dto.destinationValue,
    );

    const referenceType =
      dto.referenceType !== undefined
        ? FinancialReferenceType.create(dto.referenceType)
        : undefined;

    const referencePublicId =
      dto.referencePublicId !== undefined
        ? FinancialReferencePublicId.create(dto.referencePublicId)
        : undefined;

    const aggregate =
      await this.requestFinancialAccountWithdrawalHandler.execute(
        new RequestFinancialAccountWithdrawalCommand(
          new FinancialAccountPublicId(dto.accountId),
          amount,
          destination,
          dto.correlationId,
          referenceType,
          referencePublicId,
          dto.causationId,
          normalizedIdempotencyKey,
        ),
      );

    return FinancialAccountWithdrawalResponseMapper.toResponse(aggregate);
  }

  // ---------------------------------------------------------------------------
  // Process Withdrawal
  // ---------------------------------------------------------------------------

  @Post(':withdrawalPublicId/process')
  @RequirePermissions('financial-account-withdrawal:process')
  public async process(
    @Param('withdrawalPublicId') withdrawalPublicId: string,
    @Body() dto: ProcessFinancialAccountWithdrawalRequestDto,
  ): Promise<
    ReturnType<typeof FinancialAccountWithdrawalResponseMapper.toResponse>
  > {
    const aggregate =
      await this.processFinancialAccountWithdrawalHandler.execute(
        new ProcessFinancialAccountWithdrawalCommand(
          new FinancialAccountWithdrawalPublicId(withdrawalPublicId),
          dto.correlationId,
          dto.causationId,
        ),
      );

    return FinancialAccountWithdrawalResponseMapper.toResponse(aggregate);
  }

  // ---------------------------------------------------------------------------
  // Complete Withdrawal
  // ---------------------------------------------------------------------------

  @Post(':withdrawalPublicId/complete')
  @RequirePermissions('financial-account-withdrawal:complete')
  public async complete(
    @Param('withdrawalPublicId') withdrawalPublicId: string,
    @Body() dto: CompleteFinancialAccountWithdrawalRequestDto,
  ): Promise<
    ReturnType<typeof FinancialAccountWithdrawalResponseMapper.toResponse>
  > {
    const completedAt = new Date(dto.completedAt);

    const aggregate =
      await this.completeFinancialAccountWithdrawalHandler.execute(
        new CompleteFinancialAccountWithdrawalCommand(
          new FinancialAccountWithdrawalPublicId(withdrawalPublicId),
          completedAt,
          dto.correlationId,
          dto.causationId,
        ),
      );

    return FinancialAccountWithdrawalResponseMapper.toResponse(aggregate);
  }

  // ---------------------------------------------------------------------------
  // Fail Withdrawal
  // ---------------------------------------------------------------------------

  @Post(':withdrawalPublicId/fail')
  @RequirePermissions('financial-account-withdrawal:fail')
  public async fail(
    @Param('withdrawalPublicId') withdrawalPublicId: string,
    @Body() dto: FailFinancialAccountWithdrawalRequestDto,
  ): Promise<
    ReturnType<typeof FinancialAccountWithdrawalResponseMapper.toResponse>
  > {
    const failedAt = new Date(dto.failedAt);

    const aggregate = await this.failFinancialAccountWithdrawalHandler.execute(
      new FailFinancialAccountWithdrawalCommand(
        new FinancialAccountWithdrawalPublicId(withdrawalPublicId),
        dto.reason,
        failedAt,
        dto.correlationId,
        dto.causationId,
      ),
    );

    return FinancialAccountWithdrawalResponseMapper.toResponse(aggregate);
  }

  // ---------------------------------------------------------------------------
  // Cancel Withdrawal
  // ---------------------------------------------------------------------------

  @Post(':withdrawalPublicId/cancel')
  @RequirePermissions('financial-account-withdrawal:cancel')
  public async cancel(
    @Param('withdrawalPublicId') withdrawalPublicId: string,
    @Body() dto: CancelFinancialAccountWithdrawalRequestDto,
  ): Promise<
    ReturnType<typeof FinancialAccountWithdrawalResponseMapper.toResponse>
  > {
    const cancelledAt = new Date(dto.cancelledAt);

    const aggregate =
      await this.cancelFinancialAccountWithdrawalHandler.execute(
        new CancelFinancialAccountWithdrawalCommand(
          new FinancialAccountWithdrawalPublicId(withdrawalPublicId),
          dto.reason,
          cancelledAt,
          dto.correlationId,
          dto.causationId,
        ),
      );

    return FinancialAccountWithdrawalResponseMapper.toResponse(aggregate);
  }
}

export default FinancialAccountWithdrawalsController;
