// -----------------------------------------------------------------------------
// Financial — NestJS Module
// -----------------------------------------------------------------------------
//
// Central NestJS module for the Financial bounded context.
//
// Registered capabilities:
//
// - Financial Account
// - Financial Account Hold
// - Financial Account Withdrawal
// - Financial Transaction
// - Financial Payment
// - Financial Payment Method
// - Financial Settlement
// - Financial Disbursement
//
// The module wires:
//
// - REST controllers;
// - infrastructure repository providers;
// - application command handlers;
// - application query handlers;
// - dependency-injection tokens.
//
// Domain behavior remains inside aggregate roots.
//
// Application handlers coordinate workflows and delegate behavior to the
// appropriate aggregates.
//
// Persistence remains behind domain repository contracts.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import { Module } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Bounded Context Modules
// -----------------------------------------------------------------------------

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
  FinancialDisbursementsController,
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
  FINANCIAL_DISBURSEMENT_PROVIDERS,
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
  FINANCIAL_DISBURSEMENT_TOKENS,
} from './application';

// -----------------------------------------------------------------------------
// Application — Command Handlers
// -----------------------------------------------------------------------------

import {
  // ---------------------------------------------------------------------------
  // Financial Account
  // ---------------------------------------------------------------------------

  ActivateFinancialAccountHandler,
  CloseFinancialAccountHandler,
  CreateFinancialAccountHandler,
  SuspendFinancialAccountHandler,

  // ---------------------------------------------------------------------------
  // Financial Account Hold
  // ---------------------------------------------------------------------------
  CancelFinancialAccountHoldHandler,
  CaptureFinancialAccountHoldHandler,
  CreateFinancialAccountHoldHandler,
  ReleaseFinancialAccountHoldHandler,

  // ---------------------------------------------------------------------------
  // Financial Account Withdrawal
  // ---------------------------------------------------------------------------
  CancelFinancialAccountWithdrawalHandler,
  CompleteFinancialAccountWithdrawalHandler,
  FailFinancialAccountWithdrawalHandler,
  ProcessFinancialAccountWithdrawalHandler,
  RequestFinancialAccountWithdrawalHandler,

  // ---------------------------------------------------------------------------
  // Financial Transaction
  // ---------------------------------------------------------------------------
  CancelFinancialTransactionHandler,
  CompleteFinancialTransactionHandler,
  CreateFinancialTransactionHandler,
  FailFinancialTransactionHandler,
  ReverseFinancialTransactionHandler,

  // ---------------------------------------------------------------------------
  // Financial Payment
  // ---------------------------------------------------------------------------
  CancelFinancialPaymentHandler,
  CreateFinancialPaymentHandler,
  ExpireFinancialPaymentHandler,
  FailFinancialPaymentHandler,
  LinkFinancialPaymentTransactionHandler,
  ProcessFinancialPaymentHandler,
  SucceedFinancialPaymentHandler,

  // ---------------------------------------------------------------------------
  // Financial Payment Method
  // ---------------------------------------------------------------------------
  AddFinancialPaymentMethodHandler,
  DeactivateFinancialPaymentMethodHandler,
  SetDefaultFinancialPaymentMethodHandler,

  // ---------------------------------------------------------------------------
  // Financial Settlement
  // ---------------------------------------------------------------------------
  AllocateFinancialSettlementItemHandler,
  CancelFinancialSettlementHandler,
  CompleteFinancialSettlementHandler,
  CreateFinancialSettlementHandler,
  FailFinancialSettlementHandler,
  ProcessFinancialSettlementHandler,

  // ---------------------------------------------------------------------------
  // Financial Disbursement
  // ---------------------------------------------------------------------------
  CreateFinancialDisbursementHandler,
  ProcessFinancialDisbursementHandler,
  CompleteFinancialDisbursementHandler,
  FailFinancialDisbursementHandler,
  CancelFinancialDisbursementHandler,
} from './application/command-handlers';

// -----------------------------------------------------------------------------
// Application — Query Handlers
// -----------------------------------------------------------------------------

import {
  // ---------------------------------------------------------------------------
  // Financial Account
  // ---------------------------------------------------------------------------

  GetFinancialAccountBalanceHandler,
  GetFinancialAccountHandler,
  GetFinancialAccountTransactionsHandler,

  // ---------------------------------------------------------------------------
  // Financial Account Hold
  // ---------------------------------------------------------------------------
  GetFinancialAccountHoldsHandler,

  // ---------------------------------------------------------------------------
  // Financial Account Withdrawal
  // ---------------------------------------------------------------------------
  GetFinancialAccountWithdrawalHandler,
  GetFinancialAccountWithdrawalsHandler,
  GetFinancialAccountWithdrawalsByStatusHandler,

  // ---------------------------------------------------------------------------
  // Financial Transaction
  // ---------------------------------------------------------------------------
  GetFinancialTransactionHandler,

  // ---------------------------------------------------------------------------
  // Financial Payment
  // ---------------------------------------------------------------------------
  GetFinancialPaymentHandler,

  // ---------------------------------------------------------------------------
  // Financial Payment Method
  // ---------------------------------------------------------------------------
  GetDefaultFinancialPaymentMethodHandler,
  GetFinancialPaymentMethodHandler,

  // ---------------------------------------------------------------------------
  // Financial Settlement
  // ---------------------------------------------------------------------------
  GetFinancialSettlementHandler,
  GetFinancialSettlementItemsHandler,

  // ---------------------------------------------------------------------------
  // Financial Disbursement
  // ---------------------------------------------------------------------------
  GetFinancialDisbursementHandler,
  GetFinancialDisbursementAttemptsHandler,
} from './application/query-handlers';

// =============================================================================
// Module
// =============================================================================

@Module({
  // ===========================================================================
  // Imports
  // ===========================================================================

  imports: [IdentityModule, PrismaModule],

  // ===========================================================================
  // Controllers
  // ===========================================================================

  controllers: [
    // -------------------------------------------------------------------------
    // Financial Account
    // -------------------------------------------------------------------------

    FinancialAccountsController,

    // -------------------------------------------------------------------------
    // Financial Account Hold
    // -------------------------------------------------------------------------

    FinancialAccountHoldsController,

    // -------------------------------------------------------------------------
    // Financial Account Withdrawal
    // -------------------------------------------------------------------------

    FinancialAccountWithdrawalsController,

    // -------------------------------------------------------------------------
    // Financial Transaction
    // -------------------------------------------------------------------------

    FinancialTransactionsController,

    // -------------------------------------------------------------------------
    // Financial Payment
    // -------------------------------------------------------------------------

    FinancialPaymentsController,

    // -------------------------------------------------------------------------
    // Financial Payment Method
    // -------------------------------------------------------------------------

    FinancialPaymentMethodsController,

    // -------------------------------------------------------------------------
    // Financial Settlement
    // -------------------------------------------------------------------------

    FinancialSettlementsController,

    // -------------------------------------------------------------------------
    // Financial Disbursement
    // -------------------------------------------------------------------------

    FinancialDisbursementsController,
  ],

  // ===========================================================================
  // Providers
  // ===========================================================================

  providers: [
    // =========================================================================
    // Infrastructure — Repository Providers
    // =========================================================================

    ...FINANCIAL_ACCOUNT_PROVIDERS,

    ...FINANCIAL_ACCOUNT_HOLD_PROVIDERS,

    ...FINANCIAL_ACCOUNT_WITHDRAWAL_PROVIDERS,

    ...FINANCIAL_TRANSACTION_PROVIDERS,

    ...FINANCIAL_PAYMENT_PROVIDERS,

    ...FINANCIAL_PAYMENT_METHOD_PROVIDERS,

    ...FINANCIAL_SETTLEMENT_PROVIDERS,

    ...FINANCIAL_DISBURSEMENT_PROVIDERS,

    // =========================================================================
    // Financial Account
    // =========================================================================

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

    // =========================================================================
    // Financial Account Hold
    // =========================================================================

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

    // =========================================================================
    // Financial Account Withdrawal
    // =========================================================================

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

    // =========================================================================
    // Financial Transaction
    // =========================================================================

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

    // =========================================================================
    // Financial Payment
    // =========================================================================

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

    // =========================================================================
    // Financial Payment Method
    // =========================================================================

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

    // =========================================================================
    // Financial Settlement
    // =========================================================================

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

    // =========================================================================
    // Financial Disbursement
    // =========================================================================

    {
      provide: FINANCIAL_DISBURSEMENT_TOKENS.COMMAND_HANDLERS.CREATE,
      useClass: CreateFinancialDisbursementHandler,
    },

    {
      provide: FINANCIAL_DISBURSEMENT_TOKENS.COMMAND_HANDLERS.PROCESS,
      useClass: ProcessFinancialDisbursementHandler,
    },

    {
      provide: FINANCIAL_DISBURSEMENT_TOKENS.COMMAND_HANDLERS.COMPLETE,
      useClass: CompleteFinancialDisbursementHandler,
    },

    {
      provide: FINANCIAL_DISBURSEMENT_TOKENS.COMMAND_HANDLERS.FAIL,
      useClass: FailFinancialDisbursementHandler,
    },

    {
      provide: FINANCIAL_DISBURSEMENT_TOKENS.COMMAND_HANDLERS.CANCEL,
      useClass: CancelFinancialDisbursementHandler,
    },

    {
      provide: FINANCIAL_DISBURSEMENT_TOKENS.QUERY_HANDLERS.GET,
      useClass: GetFinancialDisbursementHandler,
    },

    {
      provide: FINANCIAL_DISBURSEMENT_TOKENS.QUERY_HANDLERS.GET_ATTEMPTS,
      useClass: GetFinancialDisbursementAttemptsHandler,
    },
  ],

  // ===========================================================================
  // Exports
  // ===========================================================================

  exports: [
    // -------------------------------------------------------------------------
    // Financial Account
    // -------------------------------------------------------------------------

    FINANCIAL_ACCOUNT_TOKENS.REPOSITORY,

    // -------------------------------------------------------------------------
    // Financial Account Hold
    // -------------------------------------------------------------------------

    FINANCIAL_ACCOUNT_HOLD_TOKENS.REPOSITORY,

    // -------------------------------------------------------------------------
    // Financial Account Withdrawal
    // -------------------------------------------------------------------------

    FINANCIAL_ACCOUNT_WITHDRAWAL_TOKENS.REPOSITORY,

    // -------------------------------------------------------------------------
    // Financial Transaction
    // -------------------------------------------------------------------------

    FINANCIAL_TRANSACTION_TOKENS.REPOSITORY,

    // -------------------------------------------------------------------------
    // Financial Payment
    // -------------------------------------------------------------------------

    FINANCIAL_PAYMENT_TOKENS.REPOSITORY,

    // -------------------------------------------------------------------------
    // Financial Payment Method
    // -------------------------------------------------------------------------

    FINANCIAL_PAYMENT_METHOD_TOKENS.REPOSITORY,

    // -------------------------------------------------------------------------
    // Financial Settlement
    // -------------------------------------------------------------------------

    FINANCIAL_SETTLEMENT_TOKENS.REPOSITORY,

    // -------------------------------------------------------------------------
    // Financial Disbursement
    // -------------------------------------------------------------------------

    FINANCIAL_DISBURSEMENT_TOKENS.REPOSITORY,
  ],
})
export class FinancialModule {}

export default FinancialModule;
