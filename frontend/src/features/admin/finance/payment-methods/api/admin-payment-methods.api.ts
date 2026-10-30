
 // -----------------------------------------------------------------------------
 // sisiMove Admin — Payment Methods API
 // -----------------------------------------------------------------------------
 //
 // Responsibilities:
 // - Execute protected payment-method API requests.
 // - Use the shared AuthenticatedApiClient.
 // - Keep request payloads and response types explicit.
 // - Delegate response normalization to AdminPaymentMethodMapper.
 //
 // Non-responsibilities:
 // - Reading authentication storage.
 // - Managing access tokens.
 // - Implementing HTTP transport.
 // - Managing UI state or permissions.
 // -----------------------------------------------------------------------------

import { authenticatedApiClient } from '@/features/authentication/http';

import { AdminPaymentMethodMapper } from '../mappers';

import type { AdminPaymentMethod } from '../models/admin-payment-method.model';

import { ADMIN_PAYMENT_METHODS_ENDPOINTS } from './admin-payment-methods.endpoints';

// -----------------------------------------------------------------------------
// Request Payloads
// -----------------------------------------------------------------------------

/**
 * Payload used to register a payment method.
 *
 * `accountId` is retained here to match the expected command contract.
 * Confirm whether the backend expects `accountPublicId` instead before
 * integrating this payload with the controller.
 */
export interface AddAdminPaymentMethodPayload {
  accountId: string;
  type: AdminPaymentMethod['type'];
  provider: AdminPaymentMethod['provider'];
  correlationId: string;
  providerReference?: string;
  displayName?: string;
  lastFour?: string;
  isDefault?: boolean;
  causationId?: string;
}

/**
 * Payload used to set a payment method as the account default.
 */
export interface AdminSetDefaultPaymentMethodPayload {
  correlationId: string;
  causationId?: string;
  defaultedAt?: string;
}

/**
 * Payload used to deactivate a payment method.
 */
export interface AdminDeactivatePaymentMethodPayload {
  correlationId: string;
  causationId?: string;
  deactivatedAt?: string;
}

// -----------------------------------------------------------------------------
// Response Types
// -----------------------------------------------------------------------------

type PaymentMethodResponse = AdminPaymentMethod;
type PaymentMethodsResponse = AdminPaymentMethod[];

// -----------------------------------------------------------------------------
// API Adapter
// -----------------------------------------------------------------------------

export class AdminPaymentMethodsApi {
  /**
   * Retrieve all payment methods.
   */
  public async getAll(): Promise<AdminPaymentMethod[]> {
    const response =
      await authenticatedApiClient.get<PaymentMethodsResponse>(
        ADMIN_PAYMENT_METHODS_ENDPOINTS.GET_ALL,
      );

    return AdminPaymentMethodMapper.toModels(response);
  }

  /**
   * Retrieve one payment method by public identifier.
   */
  public async getByPublicId(
    paymentMethodPublicId: string,
  ): Promise<AdminPaymentMethod> {
    const response =
      await authenticatedApiClient.get<PaymentMethodResponse>(
        ADMIN_PAYMENT_METHODS_ENDPOINTS.GET_BY_PUBLIC_ID(
          paymentMethodPublicId,
        ),
      );

    return AdminPaymentMethodMapper.toModel(response);
  }

  /**
   * Retrieve the default payment method for an account.
   *
   * The backend endpoint may return null when no default exists.
   */
  public async getDefaultByAccount(
    accountPublicId: string,
  ): Promise<AdminPaymentMethod | null> {
    const response =
      await authenticatedApiClient.get<PaymentMethodResponse | null>(
        ADMIN_PAYMENT_METHODS_ENDPOINTS.GET_DEFAULT_BY_ACCOUNT(
          accountPublicId,
        ),
      );

    return response === null
      ? null
      : AdminPaymentMethodMapper.toModel(response);
  }

  /**
   * Register a payment method.
   */
  public async add(
    payload: AddAdminPaymentMethodPayload,
  ): Promise<AdminPaymentMethod> {
    const response =
      await authenticatedApiClient.post<PaymentMethodResponse>(
        ADMIN_PAYMENT_METHODS_ENDPOINTS.ADD,
        payload,
      );

    return AdminPaymentMethodMapper.toModel(response);
  }

  /**
   * Set a payment method as the account default.
   */
  public async setDefault(
    paymentMethodPublicId: string,
    payload: AdminSetDefaultPaymentMethodPayload,
  ): Promise<AdminPaymentMethod> {
    const response =
      await authenticatedApiClient.post<PaymentMethodResponse>(
        ADMIN_PAYMENT_METHODS_ENDPOINTS.SET_DEFAULT(
          paymentMethodPublicId,
        ),
        payload,
      );

    return AdminPaymentMethodMapper.toModel(response);
  }

  /**
   * Deactivate a payment method.
   */
  public async deactivate(
    paymentMethodPublicId: string,
    payload: AdminDeactivatePaymentMethodPayload,
  ): Promise<AdminPaymentMethod> {
    const response =
      await authenticatedApiClient.post<PaymentMethodResponse>(
        ADMIN_PAYMENT_METHODS_ENDPOINTS.DEACTIVATE(
          paymentMethodPublicId,
        ),
        payload,
      );

    return AdminPaymentMethodMapper.toModel(response);
  }
}

// -----------------------------------------------------------------------------
// Shared Instance
// -----------------------------------------------------------------------------

export const adminPaymentMethodsApi = new AdminPaymentMethodsApi();

export default adminPaymentMethodsApi;
