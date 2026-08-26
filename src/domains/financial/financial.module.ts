// -----------------------------------------------------------------------------
// Financial — NestJS Module
// -----------------------------------------------------------------------------

import { Module } from '@nestjs/common';

import { IdentityModule } from '../identity/identity.module';
import { PrismaModule } from '../../infrastructure/database/prisma/prisma.module';

// -----------------------------------------------------------------------------
// Presentation — Controllers
// -----------------------------------------------------------------------------

import {
  FinancialAccountsController,
  FinancialAccountHoldsController,
  FinancialAccountWithdrawalsController,
  FinancialTransactionsController,
  FinancialPaymentsController,
  FinancialPaymentMethodsController,
  FinancialSettlementsController,
} from './presentation/rest/controllers';

// -----------------------------------------------------------------------------
// Infrastructure — Dependency Injection
// -----------------------------------------------------------------------------

import {
  FINANCIAL_ACCOUNT_PROVIDERS,
  FINANCIAL_ACCOUNT_HOLD_PROVIDERS,
  FINANCIAL_ACCOUNT_WITHDRAWAL_PROVIDERS,
  FINANCIAL_TRANSACTION_PROVIDERS,
  FINANCIAL_PAYMENT_PROVIDERS,
  FINANCIAL_PAYMENT_METHOD_PROVIDERS,
  FINANCIAL_SETTLEMENT_PROVIDERS,
} from './infrastructure/dependency-injection';

// -----------------------------------------------------------------------------
// Application — Tokens
// -----------------------------------------------------------------------------

import {
  FINANCIAL_ACCOUNT_TOKENS,
  FINANCIAL_ACCOUNT_HOLD_TOKENS,
  FINANCIAL_ACCOUNT_WITHDRAWAL_TOKENS,
  FINANCIAL_TRANSACTION_TOKENS,
  FINANCIAL_PAYMENT_TOKENS,
  FINANCIAL_PAYMENT_METHOD_TOKENS,
  FINANCIAL_SETTLEMENT_TOKENS,
} from './application';

// -----------------------------------------------------------------------------
// Application — Command Handlers
// -----------------------------------------------------------------------------

import {
  ActivateFinancialAccountHandler,
  CloseFinancialAccountHandler,
  CreateFinancialAccountHandler,
  SuspendFinancialAccountHandler,
  CancelFinancialAccountHoldHandler,
  CaptureFinancialAccountHoldHandler,
  CreateFinancialAccountHoldHandler,
  ReleaseFinancialAccountHoldHandler,
  CancelFinancialAccountWithdrawalHandler,
  CompleteFinancialAccountWithdrawalHandler,
  FailFinancialAccountWithdrawalHandler,
  ProcessFinancialAccountWithdrawalHandler,
  RequestFinancialAccountWithdrawalHandler,
  CancelFinancialTransactionHandler,
  CompleteFinancialTransactionHandler,
  CreateFinancialTransactionHandler,
  FailFinancialTransactionHandler,
  ReverseFinancialTransactionHandler,
  CancelFinancialPaymentHandler,
  CreateFinancialPaymentHandler,
  ExpireFinancialPaymentHandler,
  FailFinancialPaymentHandler,
  LinkFinancialPaymentTransactionHandler,
  ProcessFinancialPaymentHandler,
  SucceedFinancialPaymentHandler,
  AddFinancialPaymentMethodHandler,
  DeactivateFinancialPaymentMethodHandler,
  SetDefaultFinancialPaymentMethodHandler,
  AllocateFinancialSettlementItemHandler,
  CancelFinancialSettlementHandler,
  CompleteFinancialSettlementHandler,
  CreateFinancialSettlementHandler,
  FailFinancialSettlementHandler,
  ProcessFinancialSettlementHandler,
} from './application/command-handlers';

// -----------------------------------------------------------------------------
// Application — Query Handlers
// -----------------------------------------------------------------------------

import {
  GetFinancialAccountBalanceHandler,
  GetFinancialAccountHandler,
  GetFinancialAccountTransactionsHandler,
  GetFinancialAccountHoldsHandler,
  GetFinancialAccountWithdrawalHandler,
  GetFinancialAccountWithdrawalsHandler,
  GetFinancialAccountWithdrawalsByStatusHandler,
  GetFinancialTransactionHandler,
  GetFinancialPaymentHandler,
  GetDefaultFinancialPaymentMethodHandler,
  GetFinancialPaymentMethodHandler,
  GetFinancialSettlementHandler,
  GetFinancialSettlementItemsHandler,
} from './application/query-handlers';

// -----------------------------------------------------------------------------
// Module
// -----------------------------------------------------------------------------

@Module({
  imports: [IdentityModule, PrismaModule],

  controllers: [
    FinancialAccountsController,
    FinancialAccountHoldsController,
    FinancialAccountWithdrawalsController,
    FinancialTransactionsController,
    FinancialPaymentsController,
    FinancialPaymentMethodsController,
    FinancialSettlementsController,
  ],

  providers: [
    // Infrastructure
    ...FINANCIAL_ACCOUNT_PROVIDERS,
    ...FINANCIAL_ACCOUNT_HOLD_PROVIDERS,
    ...FINANCIAL_ACCOUNT_WITHDRAWAL_PROVIDERS,
    ...FINANCIAL_TRANSACTION_PROVIDERS,
    ...FINANCIAL_PAYMENT_PROVIDERS,
    ...FINANCIAL_PAYMENT_METHOD_PROVIDERS,
    ...FINANCIAL_SETTLEMENT_PROVIDERS,

    // Financial Account
    {
      provide: FINANCIAL_ACCOUNT_TOKENS.COMMAND_HANDLERS.CREATE,
      useClass: CreateFinancialAccountHandler,
    },
    {
      provide: FINANCIAL_ACCOUNT_TOKENS.COMMAND_HANDLERS.ACTIVATE,
      useClass: ActivateFinancialAccountHandler,
    },
    {
      provide: FINANCIAL_ACCOUNT_TOKENS.COMMAND_HANDLERS.SUSPEND,
      useClass: SuspendFinancialAccountHandler,
    },
    {
      provide: FINANCIAL_ACCOUNT_TOKENS.COMMAND_HANDLERS.CLOSE,
      useClass: CloseFinancialAccountHandler,
    },
    {
      provide: FINANCIAL_ACCOUNT_TOKENS.QUERY_HANDLERS.GET,
      useClass: GetFinancialAccountHandler,
    },
    {
      provide: FINANCIAL_ACCOUNT_TOKENS.QUERY_HANDLERS.GET_BALANCE,
      useClass: GetFinancialAccountBalanceHandler,
    },

    // Financial Account Hold
    {
      provide: FINANCIAL_ACCOUNT_HOLD_TOKENS.COMMAND_HANDLERS.CREATE,
      useClass: CreateFinancialAccountHoldHandler,
    },
    {
      provide: FINANCIAL_ACCOUNT_HOLD_TOKENS.COMMAND_HANDLERS.CAPTURE,
      useClass: CaptureFinancialAccountHoldHandler,
    },
    {
      provide: FINANCIAL_ACCOUNT_HOLD_TOKENS.COMMAND_HANDLERS.RELEASE,
      useClass: ReleaseFinancialAccountHoldHandler,
    },
    {
      provide: FINANCIAL_ACCOUNT_HOLD_TOKENS.COMMAND_HANDLERS.CANCEL,
      useClass: CancelFinancialAccountHoldHandler,
    },
    {
      provide: FINANCIAL_ACCOUNT_HOLD_TOKENS.QUERY_HANDLERS.GET,
      useClass: GetFinancialAccountHoldsHandler,
    },

    // Financial Account Withdrawal
    {
      provide: FINANCIAL_ACCOUNT_WITHDRAWAL_TOKENS.COMMAND_HANDLERS.REQUEST,
      useClass: RequestFinancialAccountWithdrawalHandler,
    },
    {
      provide: FINANCIAL_ACCOUNT_WITHDRAWAL_TOKENS.COMMAND_HANDLERS.PROCESS,
      useClass: ProcessFinancialAccountWithdrawalHandler,
    },
    {
      provide: FINANCIAL_ACCOUNT_WITHDRAWAL_TOKENS.COMMAND_HANDLERS.COMPLETE,
      useClass: CompleteFinancialAccountWithdrawalHandler,
    },
    {
      provide: FINANCIAL_ACCOUNT_WITHDRAWAL_TOKENS.COMMAND_HANDLERS.FAIL,
      useClass: FailFinancialAccountWithdrawalHandler,
    },
    {
      provide: FINANCIAL_ACCOUNT_WITHDRAWAL_TOKENS.COMMAND_HANDLERS.CANCEL,
      useClass: CancelFinancialAccountWithdrawalHandler,
    },
    {
      provide: FINANCIAL_ACCOUNT_WITHDRAWAL_TOKENS.QUERY_HANDLERS.GET,
      useClass: GetFinancialAccountWithdrawalHandler,
    },
    {
      provide: FINANCIAL_ACCOUNT_WITHDRAWAL_TOKENS.QUERY_HANDLERS.GET_ALL,
      useClass: GetFinancialAccountWithdrawalsHandler,
    },
    {
      provide: FINANCIAL_ACCOUNT_WITHDRAWAL_TOKENS.QUERY_HANDLERS.GET_BY_STATUS,
      useClass: GetFinancialAccountWithdrawalsByStatusHandler,
    },

    // Financial Transaction
    {
      provide: FINANCIAL_TRANSACTION_TOKENS.COMMAND_HANDLERS.CREATE,
      useClass: CreateFinancialTransactionHandler,
    },
    {
      provide: FINANCIAL_TRANSACTION_TOKENS.COMMAND_HANDLERS.COMPLETE,
      useClass: CompleteFinancialTransactionHandler,
    },
    {
      provide: FINANCIAL_TRANSACTION_TOKENS.COMMAND_HANDLERS.FAIL,
      useClass: FailFinancialTransactionHandler,
    },
    {
      provide: FINANCIAL_TRANSACTION_TOKENS.COMMAND_HANDLERS.REVERSE,
      useClass: ReverseFinancialTransactionHandler,
    },
    {
      provide: FINANCIAL_TRANSACTION_TOKENS.COMMAND_HANDLERS.CANCEL,
      useClass: CancelFinancialTransactionHandler,
    },
    {
      provide: FINANCIAL_TRANSACTION_TOKENS.QUERY_HANDLERS.GET,
      useClass: GetFinancialTransactionHandler,
    },
    {
      provide:
        FINANCIAL_TRANSACTION_TOKENS.QUERY_HANDLERS.GET_ACCOUNT_TRANSACTIONS,
      useClass: GetFinancialAccountTransactionsHandler,
    },

    // Financial Payment
    {
      provide: FINANCIAL_PAYMENT_TOKENS.COMMAND_HANDLERS.CREATE,
      useClass: CreateFinancialPaymentHandler,
    },
    {
      provide: FINANCIAL_PAYMENT_TOKENS.COMMAND_HANDLERS.PROCESS,
      useClass: ProcessFinancialPaymentHandler,
    },
    {
      provide: FINANCIAL_PAYMENT_TOKENS.COMMAND_HANDLERS.SUCCEED,
      useClass: SucceedFinancialPaymentHandler,
    },
    {
      provide: FINANCIAL_PAYMENT_TOKENS.COMMAND_HANDLERS.FAIL,
      useClass: FailFinancialPaymentHandler,
    },
    {
      provide: FINANCIAL_PAYMENT_TOKENS.COMMAND_HANDLERS.CANCEL,
      useClass: CancelFinancialPaymentHandler,
    },
    {
      provide: FINANCIAL_PAYMENT_TOKENS.COMMAND_HANDLERS.EXPIRE,
      useClass: ExpireFinancialPaymentHandler,
    },
    {
      provide: FINANCIAL_PAYMENT_TOKENS.COMMAND_HANDLERS.LINK_TRANSACTION,
      useClass: LinkFinancialPaymentTransactionHandler,
    },
    {
      provide: FINANCIAL_PAYMENT_TOKENS.QUERY_HANDLERS.GET,
      useClass: GetFinancialPaymentHandler,
    },

    // Financial Payment Method
    {
      provide: FINANCIAL_PAYMENT_METHOD_TOKENS.COMMAND_HANDLERS.ADD,
      useClass: AddFinancialPaymentMethodHandler,
    },
    {
      provide: FINANCIAL_PAYMENT_METHOD_TOKENS.COMMAND_HANDLERS.SET_DEFAULT,
      useClass: SetDefaultFinancialPaymentMethodHandler,
    },
    {
      provide: FINANCIAL_PAYMENT_METHOD_TOKENS.COMMAND_HANDLERS.DEACTIVATE,
      useClass: DeactivateFinancialPaymentMethodHandler,
    },
    {
      provide: FINANCIAL_PAYMENT_METHOD_TOKENS.QUERY_HANDLERS.GET,
      useClass: GetFinancialPaymentMethodHandler,
    },
    {
      provide: FINANCIAL_PAYMENT_METHOD_TOKENS.QUERY_HANDLERS.GET_DEFAULT,
      useClass: GetDefaultFinancialPaymentMethodHandler,
    },

    // Financial Settlement
    {
      provide: FINANCIAL_SETTLEMENT_TOKENS.COMMAND_HANDLERS.CREATE,
      useClass: CreateFinancialSettlementHandler,
    },
    {
      provide: FINANCIAL_SETTLEMENT_TOKENS.COMMAND_HANDLERS.PROCESS,
      useClass: ProcessFinancialSettlementHandler,
    },
    {
      provide: FINANCIAL_SETTLEMENT_TOKENS.COMMAND_HANDLERS.ALLOCATE_ITEM,
      useClass: AllocateFinancialSettlementItemHandler,
    },
    {
      provide: FINANCIAL_SETTLEMENT_TOKENS.COMMAND_HANDLERS.COMPLETE,
      useClass: CompleteFinancialSettlementHandler,
    },
    {
      provide: FINANCIAL_SETTLEMENT_TOKENS.COMMAND_HANDLERS.FAIL,
      useClass: FailFinancialSettlementHandler,
    },
    {
      provide: FINANCIAL_SETTLEMENT_TOKENS.COMMAND_HANDLERS.CANCEL,
      useClass: CancelFinancialSettlementHandler,
    },
    {
      provide: FINANCIAL_SETTLEMENT_TOKENS.QUERY_HANDLERS.GET,
      useClass: GetFinancialSettlementHandler,
    },
    {
      provide: FINANCIAL_SETTLEMENT_TOKENS.QUERY_HANDLERS.GET_ITEMS,
      useClass: GetFinancialSettlementItemsHandler,
    },
  ],

  exports: [
    FINANCIAL_ACCOUNT_TOKENS.REPOSITORY,
    FINANCIAL_ACCOUNT_HOLD_TOKENS.REPOSITORY,
    FINANCIAL_ACCOUNT_WITHDRAWAL_TOKENS.REPOSITORY,
    FINANCIAL_TRANSACTION_TOKENS.REPOSITORY,
    FINANCIAL_PAYMENT_TOKENS.REPOSITORY,
    FINANCIAL_PAYMENT_METHOD_TOKENS.REPOSITORY,
    FINANCIAL_SETTLEMENT_TOKENS.REPOSITORY,
  ],
})
export class FinancialModule {}

export default FinancialModule;
