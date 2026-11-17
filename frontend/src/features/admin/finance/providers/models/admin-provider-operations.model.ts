import type {
  AdminProviderCapabilityType,
} from './admin-provider.enums';

// -----------------------------------------------------------------------------
// Admin Provider — Operation Models
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Provider Capability Input
// -----------------------------------------------------------------------------

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

export type AdminMpesaEnvironment = 'SANDBOX' | 'PRODUCTION';

export type AdminMpesaC2BBusinessType =
  | 'PAYBILL'
  | 'BUY_GOODS';

export interface AdminConfigureMpesaInput {
  // Environment
  environment: AdminMpesaEnvironment;

  // Shared Daraja Authentication
  consumerKey: string;
  consumerSecret: string;

  // STK Push — Customer Top-up
  shortcode: string;
  passkey: string;

  // C2B — Customer Top-up
  c2bShortcode?: string;
  c2bBusinessType?: AdminMpesaC2BBusinessType;

  // B2C — Available-Funds Withdrawal
  b2cShortcode?: string;
  initiatorName?: string;
  securityCredential?: string;
}

// -----------------------------------------------------------------------------
// M-PESA Configuration Response
// -----------------------------------------------------------------------------

export interface AdminConfigureMpesaResponse {
  configurationReference: string;
  message: string;
}

// -----------------------------------------------------------------------------
// M-PESA Configuration Status
// -----------------------------------------------------------------------------

export interface AdminGetMpesaConfigurationStatusParams
  extends AdminProviderOperationParams {
  environment: AdminMpesaEnvironment;
}

export interface AdminMpesaConfigurationStatus {
  environment: AdminMpesaEnvironment;

  sharedAuthenticationConfigured: boolean;
  stkPushConfigured: boolean;
  c2bConfigured: boolean;
  b2cConfigured: boolean;
}

export type AdminMpesaConfigurationStatusResponse =
  AdminMpesaConfigurationStatus;

// -----------------------------------------------------------------------------
// M-PESA Connection Test
// -----------------------------------------------------------------------------

export interface AdminTestMpesaConnectionResponse {
  authenticated: boolean;
  expiresAt: number;
}
