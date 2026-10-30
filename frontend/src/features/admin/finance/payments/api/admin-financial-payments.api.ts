// -----------------------------------------------------------------------------
// sisiMove Admin — Financial Payments API
// -----------------------------------------------------------------------------
//
// Protected API adapter for administrative Financial Payment operations.
//
// Responsibilities:
// - Retrieve all Financial Payments.
// - Retrieve one Financial Payment by public ID.
// - Count Financial Payments.
// - Create a Financial Payment.
// - Process, succeed, fail, cancel, or expire a payment.
// - Link a Financial Payment to a Financial Transaction.
// - Map backend responses into frontend models.
//
// Architectural boundaries:
//
// Admin UI
//    │
//    ▼
// AdminFinancialPaymentsApi
//    │
//    ▼
// AuthenticatedApiClient
//    │
//    ▼
// SisiMove API
//
// Authentication is delegated to AuthenticatedApiClient.
// HTTP execution is delegated to the foundation API client.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Authentication — HTTP
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from '@/features/authentication/http/authenticated-api-client';

// -----------------------------------------------------------------------------
// Models — Financial Payment
// -----------------------------------------------------------------------------

import type {
  AdminFinancialPayment,
} from '../models/admin-financial-payment.model';

// -----------------------------------------------------------------------------
// Mappers — Financial Payment
// -----------------------------------------------------------------------------

import {
  mapAdminFinancialPayment,
  mapAdminFinancialPayments,
  type AdminFinancialPaymentResponse,
} from '../mappers/admin-financial-payment.mapper';

// -----------------------------------------------------------------------------
// API Endpoints
// -----------------------------------------------------------------------------

import {
  ADMIN_FINANCIAL_PAYMENTS_ENDPOINTS,
} from './admin-financial-payments.endpoints';

// -----------------------------------------------------------------------------
// Request Contracts
// -----------------------------------------------------------------------------

/**
 * Request body accepted by the backend create-payment endpoint.
 *
 * Keep aligned with CreateFinancialPaymentDto.
 *
 * The backend interprets amount as an integer number of minor currency units.
 */
export interface CreateAdminFinancialPaymentPayload {
  accountId: string;

  amount: string | number;

  currency: string;

  correlationId: string;

  methodId?: string;

  referenceType?: string;

  referencePublicId?: string;

  causationId?: string;
}

/**
 * Request body used by payment lifecycle endpoints.
 *
 * Keep aligned with the process, succeed, fail, cancel, and expire DTOs.
 */
export interface AdminFinancialPaymentLifecyclePayload {
  correlationId: string;

  causationId?: string;
}

/**
 * Request body accepted when linking a payment to a transaction.
 *
 * Keep aligned with LinkFinancialPaymentTransactionDto.
 */
export interface LinkAdminFinancialPaymentTransactionPayload
  extends AdminFinancialPaymentLifecyclePayload {
  transactionPublicId: string;
}

// -----------------------------------------------------------------------------
// API Adapter
// -----------------------------------------------------------------------------

export class AdminFinancialPaymentsApi {
  // ===========================================================================
  // Get All Financial Payments
  // ===========================================================================

  /**
   * Retrieves all Financial Payments.
   *
   * GET /financial-payments
   */
  public async getAll(): Promise<AdminFinancialPayment[]> {
    const response =
      await authenticatedApiClient.get<
        AdminFinancialPaymentResponse[]
      >(ADMIN_FINANCIAL_PAYMENTS_ENDPOINTS.GET_ALL);

    return mapAdminFinancialPayments(response);
  }

  // ===========================================================================
  // Get Financial Payment
  // ===========================================================================

  /**
   * Retrieves one Financial Payment by its public ID.
   *
   * GET /financial-payments/:paymentPublicId
   */
  public async getByPublicId(
    paymentPublicId: string,
  ): Promise<AdminFinancialPayment | null> {
    const response =
      await authenticatedApiClient.get<
        AdminFinancialPaymentResponse | null
      >(
        ADMIN_FINANCIAL_PAYMENTS_ENDPOINTS.GET_BY_PUBLIC_ID(
          paymentPublicId,
        ),
      );

    return response === null
      ? null
      : mapAdminFinancialPayment(response);
  }

  // ===========================================================================
  // Count Financial Payments
  // ===========================================================================

  /**
   * Retrieves the total number of Financial Payments.
   *
   * GET /financial-payments/count
   */
  public async count(): Promise<number> {
    return authenticatedApiClient.get<number>(
      ADMIN_FINANCIAL_PAYMENTS_ENDPOINTS.COUNT,
    );
  }

  // ===========================================================================
  // Create Financial Payment
  // ===========================================================================

  /**
   * Creates a Financial Payment.
   *
   * POST /financial-payments
   */
  public async create(
    payload: CreateAdminFinancialPaymentPayload,
  ): Promise<AdminFinancialPayment> {
    const response =
      await authenticatedApiClient.post<
        AdminFinancialPaymentResponse
      >(
        ADMIN_FINANCIAL_PAYMENTS_ENDPOINTS.CREATE,
        payload,
      );

    return mapAdminFinancialPayment(response);
  }

  // ===========================================================================
  // Process Financial Payment
  // ===========================================================================

  /**
   * Requests processing of a Financial Payment.
   *
   * POST /financial-payments/:paymentPublicId/process
   */
  public async process(
    paymentPublicId: string,
    payload: AdminFinancialPaymentLifecyclePayload,
  ): Promise<AdminFinancialPayment> {
    return this.executeLifecycleOperation(
      ADMIN_FINANCIAL_PAYMENTS_ENDPOINTS.PROCESS(paymentPublicId),
      payload,
    );
  }

  // ===========================================================================
  // Succeed Financial Payment
  // ===========================================================================

  /**
   * Records a successful payment outcome.
   *
   * POST /financial-payments/:paymentPublicId/succeed
   */
  public async succeed(
    paymentPublicId: string,
    payload: AdminFinancialPaymentLifecyclePayload,
  ): Promise<AdminFinancialPayment> {
    return this.executeLifecycleOperation(
      ADMIN_FINANCIAL_PAYMENTS_ENDPOINTS.SUCCEED(paymentPublicId),
      payload,
    );
  }

  // ===========================================================================
  // Fail Financial Payment
  // ===========================================================================

  /**
   * Records a failed payment outcome.
   *
   * POST /financial-payments/:paymentPublicId/fail
   */
  public async fail(
    paymentPublicId: string,
    payload: AdminFinancialPaymentLifecyclePayload,
  ): Promise<AdminFinancialPayment> {
    return this.executeLifecycleOperation(
      ADMIN_FINANCIAL_PAYMENTS_ENDPOINTS.FAIL(paymentPublicId),
      payload,
    );
  }

  // ===========================================================================
  // Cancel Financial Payment
  // ===========================================================================

  /**
   * Cancels a Financial Payment.
   *
   * POST /financial-payments/:paymentPublicId/cancel
   */
  public async cancel(
    paymentPublicId: string,
    payload: AdminFinancialPaymentLifecyclePayload,
  ): Promise<AdminFinancialPayment> {
    return this.executeLifecycleOperation(
      ADMIN_FINANCIAL_PAYMENTS_ENDPOINTS.CANCEL(paymentPublicId),
      payload,
    );
  }

  // ===========================================================================
  // Expire Financial Payment
  // ===========================================================================

  /**
   * Marks a Financial Payment as expired.
   *
   * POST /financial-payments/:paymentPublicId/expire
   */
  public async expire(
    paymentPublicId: string,
    payload: AdminFinancialPaymentLifecyclePayload,
  ): Promise<AdminFinancialPayment> {
    return this.executeLifecycleOperation(
      ADMIN_FINANCIAL_PAYMENTS_ENDPOINTS.EXPIRE(paymentPublicId),
      payload,
    );
  }

  // ===========================================================================
  // Link Financial Payment to Financial Transaction
  // ===========================================================================

  /**
   * Links a Financial Payment to an existing Financial Transaction.
   *
   * POST /financial-payments/:paymentPublicId/transaction
   */
  public async linkTransaction(
    paymentPublicId: string,
    payload: LinkAdminFinancialPaymentTransactionPayload,
  ): Promise<AdminFinancialPayment> {
    const response =
      await authenticatedApiClient.post<
        AdminFinancialPaymentResponse
      >(
        ADMIN_FINANCIAL_PAYMENTS_ENDPOINTS.LINK_TRANSACTION(
          paymentPublicId,
        ),
        payload,
      );

    return mapAdminFinancialPayment(response);
  }

  // ===========================================================================
  // Shared Lifecycle Operation Execution
  // ===========================================================================

  /**
   * Executes a payment lifecycle operation and maps its response.
   *
   * Each operation uses its dedicated backend route.
   */
  private async executeLifecycleOperation(
    path: string,
    payload: AdminFinancialPaymentLifecyclePayload,
  ): Promise<AdminFinancialPayment> {
    const response =
      await authenticatedApiClient.post<
        AdminFinancialPaymentResponse
      >(path, payload);

    return mapAdminFinancialPayment(response);
  }
}

// -----------------------------------------------------------------------------
// Shared Instance
// -----------------------------------------------------------------------------

export const adminFinancialPaymentsApi =
  new AdminFinancialPaymentsApi();

export default adminFinancialPaymentsApi;