
// -----------------------------------------------------------------------------
// sisiMove Admin — Financial Transactions API
// -----------------------------------------------------------------------------
//
// Protected API adapter for administrative Financial Transaction operations.
//
// Responsibilities:
// - Retrieve all Financial Transactions.
// - Retrieve one Financial Transaction by public ID.
// - Create a Financial Transaction.
// - Complete, fail, reverse, or cancel a transaction.
// - Map backend responses into frontend domain models.
//
// Architectural boundaries:
//
// Admin UI
//    │
//    ▼
// AdminFinancialTransactionsApi
//    │
//    ▼
// AuthenticatedApiClient
//    │
//    ▼
// SisiMove API
//
// This adapter does not access authSessionStorage directly.
// Authentication is delegated to AuthenticatedApiClient.
// HTTP execution is delegated to the foundation ApiClient.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Authentication — HTTP
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from '@/features/authentication/http/authenticated-api-client';

// -----------------------------------------------------------------------------
// Models — Transaction
// -----------------------------------------------------------------------------

import type {
  AdminFinancialTransaction,
} from '../models/admin-financial-transaction.model';

import {
  AdminFinancialTransactionMapper,
} from '../mappers/admin-financial-transaction.mapper';

// -----------------------------------------------------------------------------
// Models — Operations
// -----------------------------------------------------------------------------

import type {
  AdminFinancialTransactionOperationPayload,
  CompleteAdminFinancialTransactionPayload,
  FailAdminFinancialTransactionPayload,
  ReverseAdminFinancialTransactionPayload,
  CancelAdminFinancialTransactionPayload,
} from '../models/admin-financial-transaction-operations.model';

import {
  AdminFinancialTransactionOperation,
} from '../models/admin-financial-transaction.enums';

// -----------------------------------------------------------------------------
// API Response Contracts
// -----------------------------------------------------------------------------

import type {
  AdminFinancialTransactionApiResponse,
} from '../mappers/admin-financial-transaction.mapper';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

/**
 * Request body accepted by the create endpoint.
 *
 * Keep this aligned with CreateFinancialTransactionDto on the backend.
 */
export interface CreateAdminFinancialTransactionPayload {
  type: string;
  amount: string | number;
  currency: string;
  correlationId: string;

  sourceAccountType?: string;
  sourceAccountPublicId?: string;

  destinationAccountType?: string;
  destinationAccountPublicId?: string;

  referenceType?: string;
  referencePublicId?: string;

  causationId?: string;
}

/**
 * Routes exposed by the Financial Transactions controller.
 */
const FINANCIAL_TRANSACTIONS_ENDPOINT = '/financial-transactions';

// -----------------------------------------------------------------------------
// API Adapter
// -----------------------------------------------------------------------------

export class AdminFinancialTransactionsApi {
  // ===========================================================================
  // Get All Financial Transactions
  // ===========================================================================

  /**
   * Retrieves all Financial Transactions.
   *
   * GET /financial-transactions
   */
  public async getAll(): Promise<AdminFinancialTransaction[]> {
    const response =
      await authenticatedApiClient.get<
        AdminFinancialTransactionApiResponse[]
      >(FINANCIAL_TRANSACTIONS_ENDPOINT);

    return AdminFinancialTransactionMapper.toModels(response);
  }

  // ===========================================================================
  // Get Financial Transaction
  // ===========================================================================

  /**
   * Retrieves one Financial Transaction by its public ID.
   *
   * GET /financial-transactions/:transactionPublicId
   */
  public async getByPublicId(
    transactionPublicId: string,
  ): Promise<AdminFinancialTransaction | null> {
    const response =
      await authenticatedApiClient.get<
        AdminFinancialTransactionApiResponse | null
      >(
        `${FINANCIAL_TRANSACTIONS_ENDPOINT}/${encodeURIComponent(transactionPublicId)}`,
      );

    return AdminFinancialTransactionMapper.toOptionalModel(response);
  }

  // ===========================================================================
  // Create Financial Transaction
  // ===========================================================================

  /**
   * Creates a Financial Transaction.
   *
   * POST /financial-transactions
   */
  public async create(
    payload: CreateAdminFinancialTransactionPayload,
  ): Promise<AdminFinancialTransaction> {
    const response =
      await authenticatedApiClient.post<
        AdminFinancialTransactionApiResponse
      >(
        FINANCIAL_TRANSACTIONS_ENDPOINT,
        payload,
      );

    return AdminFinancialTransactionMapper.toModel(response);
  }

  // ===========================================================================
  // Complete Financial Transaction
  // ===========================================================================

  /**
   * Completes a pending Financial Transaction.
   *
   * POST /financial-transactions/:transactionPublicId/complete
   */
  public async complete(
    transactionPublicId: string,
    payload: CompleteAdminFinancialTransactionPayload,
  ): Promise<AdminFinancialTransaction> {
    return this.executeOperation(
      transactionPublicId,
      AdminFinancialTransactionOperation.COMPLETE,
      payload,
    );
  }

  // ===========================================================================
  // Fail Financial Transaction
  // ===========================================================================

  /**
   * Marks a Financial Transaction as failed.
   *
   * POST /financial-transactions/:transactionPublicId/fail
   */
  public async fail(
    transactionPublicId: string,
    payload: FailAdminFinancialTransactionPayload,
  ): Promise<AdminFinancialTransaction> {
    return this.executeOperation(
      transactionPublicId,
      AdminFinancialTransactionOperation.FAIL,
      payload,
    );
  }

  // ===========================================================================
  // Reverse Financial Transaction
  // ===========================================================================

  /**
   * Reverses a Financial Transaction.
   *
   * POST /financial-transactions/:transactionPublicId/reverse
   */
  public async reverse(
    transactionPublicId: string,
    payload: ReverseAdminFinancialTransactionPayload,
  ): Promise<AdminFinancialTransaction> {
    return this.executeOperation(
      transactionPublicId,
      AdminFinancialTransactionOperation.REVERSE,
      payload,
    );
  }

  // ===========================================================================
  // Cancel Financial Transaction
  // ===========================================================================

  /**
   * Cancels a Financial Transaction.
   *
   * POST /financial-transactions/:transactionPublicId/cancel
   */
  public async cancel(
    transactionPublicId: string,
    payload: CancelAdminFinancialTransactionPayload,
  ): Promise<AdminFinancialTransaction> {
    return this.executeOperation(
      transactionPublicId,
      AdminFinancialTransactionOperation.CANCEL,
      payload,
    );
  }

  // ===========================================================================
  // Shared Operation Execution
  // ===========================================================================

  /**
   * Executes a supported transaction lifecycle operation.
   *
   * Backend routes use the lowercase operation name.
   * The backend receives the operation-specific payload directly.
   */
  private async executeOperation(
    transactionPublicId: string,
    operation: AdminFinancialTransactionOperation,
    payload: AdminFinancialTransactionOperationPayload['payload'],
  ): Promise<AdminFinancialTransaction> {
    const path =
      `${FINANCIAL_TRANSACTIONS_ENDPOINT}/` +
      `${encodeURIComponent(transactionPublicId)}/` +
      operation.toLowerCase();

    const response =
      await authenticatedApiClient.post<
        AdminFinancialTransactionApiResponse
      >(path, payload);

    return AdminFinancialTransactionMapper.toModel(response);
  }
}

// -----------------------------------------------------------------------------
// Shared Instance
// -----------------------------------------------------------------------------

export const adminFinancialTransactionsApi =
  new AdminFinancialTransactionsApi();

export default adminFinancialTransactionsApi;
