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
// - dependency-injection tokens;
// - platform financial account provisioning.
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

import { AccountingModule } from '../accounting/accounting.module';

import { PrismaModule } from '../../infrastructure/database/prisma/prisma.module';

// -----------------------------------------------------------------------------
// M-PESA Integration
// -----------------------------------------------------------------------------

import { MpesaModule } from '../financial-payment-providers/infrastructure/mpesa/mpesa.module';

import { MpesaCallbackService } from '../financial-payment-providers/infrastructure/mpesa/payments/mpesa-callback.service';

import { QueryMpesaPaymentStatusService } from '../financial-payment-providers/infrastructure/mpesa/payments/query-mpesa-payment-status.service';

import { FinancialPaymentProvidersModule } from '../financial-payment-providers/financial-payment-providers.module';

import { FINANCIAL_PAYMENT_CALLBACK_PROVIDERS } from '../financial-payment-providers/infrastructure/dependency-injection';

import { MpesaB2CCallbackService } from '../financial-payment-providers/infrastructure/mpesa/b2c/services/mpesa-b2c-callback.service';

import { MpesaB2CDisbursementService } from '../financial-payment-providers/infrastructure/mpesa/b2c/services/mpesa-b2c-disbursement.service';

import { MpesaB2CCallbackController } from '../financial-payment-providers/infrastructure/mpesa/b2c/controllers/mpesa-b2c-callback.controller';
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

import { MpesaCallbackController } from '../financial-payment-providers/infrastructure/mpesa/payments/mpesa-callback.controller';

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
  FINANCIAL_DISBURSEMENT_CALLBACK_PROVIDERS,
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
  FINANCIAL_DISBURSEMENT_CALLBACK_TOKENS,
} from './application';

// -----------------------------------------------------------------------------
// Application — Services
// -----------------------------------------------------------------------------

import { PlatformFinancialAccountsProvisioner } from './application/services/platform-financial-accounts-provisioner';

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
  PostSuccessfulFinancialPaymentHandler,

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
  GetMyFinancialAccountHandler,
  GetFinancialAccountTransactionsHandler,
  GetFinancialAccountsHandler,

  // ---------------------------------------------------------------------------
  // Financial Account Hold
  // ---------------------------------------------------------------------------
  GetAllFinancialAccountHoldsHandler,
  GetFinancialAccountHoldsHandler,

  // ---------------------------------------------------------------------------
  // Financial Account Withdrawal
  // ---------------------------------------------------------------------------
  GetAllFinancialAccountWithdrawalsHandler,
  GetFinancialAccountWithdrawalHandler,
  GetFinancialAccountWithdrawalsHandler,
  GetFinancialAccountWithdrawalsByStatusHandler,

  // ---------------------------------------------------------------------------
  // Financial Transaction
  // ---------------------------------------------------------------------------
  GetFinancialTransactionHandler,
  GetAllFinancialTransactionsHandler,

  // ---------------------------------------------------------------------------
  // Financial Payment
  // ---------------------------------------------------------------------------
  GetFinancialPaymentHandler,
  GetAllFinancialPaymentsQueryHandler,

  // ---------------------------------------------------------------------------
  // Financial Payment Method
  // ---------------------------------------------------------------------------
  // ---------------------------------------------------------------------------
  // Financial Payment Method
  // ---------------------------------------------------------------------------
  GetAccountFinancialPaymentMethodsHandler,
  GetDefaultFinancialPaymentMethodHandler,
  GetFinancialPaymentMethodHandler,
  GetAllFinancialPaymentMethodsHandler,

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
  CountFinancialPaymentsQueryHandler,
} from './application/query-handlers';
import { EventRehydratorRegistry } from '../../infrastructure/events/event-rehydrator.registry';
import { FinancialPaymentCreatedSubscriber } from './application/subscribers/financial-payment-created.subscriber';
import { FinancialPaymentSucceededSubscriber } from './application/subscribers/financial-payment-succeeded.subscriber';
import { FinancialEventRegistry } from './domain/events/registry/financial-event.registry';
import { FinancialAccountWithdrawalProcessingSubscriber } from './application/subscribers/financial-account-withdrawal-processing.subscriber';

import { FinancialAccountWithdrawalRequestedSubscriber } from './application/subscribers/financial-account-withdrawal-requested.subscriber';

import { FinancialDisbursementCreatedSubscriber } from './application/subscribers/financial-disbursement-created.subscriber';

import { FinancialDisbursementAttemptSucceededSubscriber } from './application/subscribers/financial-disbursement-attempt-succeeded-subscriber';
// =============================================================================
// Module
// =============================================================================

@Module({
  // ===========================================================================
  // Imports
  // ===========================================================================

  imports: [
    IdentityModule,
    AccountingModule,
    PrismaModule,
    MpesaModule,
    FinancialPaymentProvidersModule,
  ],
  // ===========================================================================
  // Controllers
  // ===========================================================================

  controllers: [
    FinancialAccountsController,
    FinancialAccountHoldsController,
    FinancialAccountWithdrawalsController,
    FinancialTransactionsController,
    FinancialPaymentsController,
    FinancialPaymentMethodsController,
    FinancialSettlementsController,
    FinancialDisbursementsController,

    // M-PESA Callbacks
    MpesaCallbackController,
    MpesaB2CCallbackController,
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
    ...FINANCIAL_DISBURSEMENT_CALLBACK_PROVIDERS,
    ...FINANCIAL_PAYMENT_CALLBACK_PROVIDERS,

    // =========================================================================
    // Application — System Financial Account Provisioning
    // =========================================================================

    PlatformFinancialAccountsProvisioner,
    QueryMpesaPaymentStatusService,

    // M-PESA — Disbursement and Callback Processing
    // -------------------------------------------------------------------------

    MpesaCallbackService,
    MpesaB2CDisbursementService,
    MpesaB2CCallbackService,

    // -------------------------------------------------------------------------
    // Financial Payment — Event Subscribers
    // -------------------------------------------------------------------------

    FinancialPaymentCreatedSubscriber,
    FinancialPaymentSucceededSubscriber,

    // Financial Account Withdrawal — Event Subscribers

    FinancialAccountWithdrawalRequestedSubscriber,
    FinancialAccountWithdrawalProcessingSubscriber,

    // Financial Disbursement — Event Subscribers

    FinancialDisbursementCreatedSubscriber,
    FinancialDisbursementAttemptSucceededSubscriber,

    // Financial Payment — Event Subscribers

    FinancialPaymentCreatedSubscriber,
    FinancialPaymentSucceededSubscriber,
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
      provide: FINANCIAL_ACCOUNT_HOLD_TOKENS.QUERY_HANDLERS.GET_ALL,
      useClass: GetAllFinancialAccountHoldsHandler,
    },
    {
      provide: FINANCIAL_ACCOUNT_TOKENS.QUERY_HANDLERS.GET_ME,
      useClass: GetMyFinancialAccountHandler,
    },

    {
      provide: FINANCIAL_ACCOUNT_TOKENS.QUERY_HANDLERS.GET_BALANCE,
      useClass: GetFinancialAccountBalanceHandler,
    },
    {
      provide: FINANCIAL_ACCOUNT_TOKENS.QUERY_HANDLERS.GET_ALL,
      useClass: GetFinancialAccountsHandler,
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
    {
      provide:
        FINANCIAL_ACCOUNT_WITHDRAWAL_TOKENS.QUERY_HANDLERS.GET_ALL_PLATFORM,
      useClass: GetAllFinancialAccountWithdrawalsHandler,
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
      provide: FINANCIAL_TRANSACTION_TOKENS.QUERY_HANDLERS.GET_ALL,
      useClass: GetAllFinancialTransactionsHandler,
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
    {
      provide: FINANCIAL_PAYMENT_TOKENS.QUERY_HANDLERS.GET_ALL,
      useClass: GetAllFinancialPaymentsQueryHandler,
    },
    {
      provide: FinancialEventRegistry,
      useFactory: (registry: EventRehydratorRegistry) => {
        const financialPaymentRegistry = new FinancialEventRegistry();

        registry.register(financialPaymentRegistry);

        return financialPaymentRegistry;
      },
      inject: [EventRehydratorRegistry],
    },
    {
      provide: FINANCIAL_PAYMENT_TOKENS.COMMAND_HANDLERS.POST_SUCCESSFUL,
      useClass: PostSuccessfulFinancialPaymentHandler,
    },
    // =========================================================================
    // Financial Payment Method
    // =========================================================================

    {
      provide: FINANCIAL_PAYMENT_METHOD_TOKENS.COMMAND_HANDLERS.ADD,
      useClass: AddFinancialPaymentMethodHandler,
    },
    {
      provide: FINANCIAL_PAYMENT_METHOD_TOKENS.QUERY_HANDLERS.GET_ALL,
      useClass: GetAllFinancialPaymentMethodsHandler,
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
    {
      provide: FINANCIAL_PAYMENT_METHOD_TOKENS.QUERY_HANDLERS.GET_ACCOUNT,
      useClass: GetAccountFinancialPaymentMethodsHandler,
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
    {
      provide: FINANCIAL_PAYMENT_TOKENS.QUERY_HANDLERS.COUNT,
      useClass: CountFinancialPaymentsQueryHandler,
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
  //
  // The Financial bounded context normally exposes repository contracts to
  // other modules that need to coordinate directly with Financial aggregates.
  //
  // Registration is a cross-bounded-context application workflow that also
  // needs to initialize the user's FinancialAccount. Therefore the specific
  // Financial Account creation command handler is exposed as an application
  // capability.
  //
  // We deliberately export only the handler required by the registration
  // workflow rather than exposing every Financial command handler.
  //
  // ===========================================================================

  exports: [
    // -------------------------------------------------------------------------
    // Financial Account
    // -------------------------------------------------------------------------

    FINANCIAL_ACCOUNT_TOKENS.REPOSITORY,

    FINANCIAL_ACCOUNT_TOKENS.COMMAND_HANDLERS.CREATE,

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
    FINANCIAL_DISBURSEMENT_CALLBACK_TOKENS.REPOSITORY,
  ],
})
export class FinancialModule {}

export default FinancialModule;
