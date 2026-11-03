// -----------------------------------------------------------------------------
// Admin Provider — Operation Models
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Provider Capability Input
// -----------------------------------------------------------------------------

export type AdminProviderCapabilityType =
  | 'INITIATE_PAYMENT'
  | 'VERIFY_PAYMENT'
  | 'QUERY_PAYMENT'
  | 'REFUND_PAYMENT'
  | 'INITIATE_DISBURSEMENT'
  | 'VERIFY_DISBURSEMENT'
  | 'QUERY_BALANCE'
  | 'WEBHOOKS';

export interface AdminCreateProviderCapabilityInput {
  type: AdminProviderCapabilityType;
  isSupported: boolean;
}

// -----------------------------------------------------------------------------
// Create Provider
// -----------------------------------------------------------------------------

export interface AdminCreateProviderInput {
  code: string;
  name: string;
  type: string;
  environment: string;
  description?: string;
  configurationReference?: string;
  capabilities?: AdminCreateProviderCapabilityInput[];
}

// -----------------------------------------------------------------------------
// Update Provider
// -----------------------------------------------------------------------------

export interface AdminUpdateProviderInput {
  name: string;
  causationId?: string;
}

// -----------------------------------------------------------------------------
// Change Provider Status
// -----------------------------------------------------------------------------

export interface AdminChangeProviderStatusInput {
  status: string;
  causationId?: string;
}

// -----------------------------------------------------------------------------
// Provider Operations
// -----------------------------------------------------------------------------

export interface AdminProviderOperationParams {
  providerPublicId: string;
}

export interface AdminProviderCapabilityOperationParams
  extends AdminProviderOperationParams {
  capabilityType: string;
}

// -----------------------------------------------------------------------------
// M-PESA Configuration
// -----------------------------------------------------------------------------

export interface AdminConfigureMpesaInput {
  environment: 'SANDBOX' | 'PRODUCTION';
  consumerKey: string;
  consumerSecret: string;
  shortcode: string;
  passkey: string;
}

export interface AdminConfigureMpesaResponse {
  configurationReference: string;
  message: string;
}

// -----------------------------------------------------------------------------
// M-PESA Connection Test
// -----------------------------------------------------------------------------

export interface AdminTestMpesaConnectionResponse {
  authenticated: boolean;
  expiresAt: number;
}