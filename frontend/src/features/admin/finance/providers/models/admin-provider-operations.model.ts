
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
//
// SisiMove M-PESA purposes:
//
// 1. TOP-UP
//    - STK Push
//    - C2B PayBill / Buy Goods
//
// 2. WITHDRAWAL
//    - B2C withdrawal of customer available funds
//
// -----------------------------------------------------------------------------

export type AdminMpesaEnvironment = 'SANDBOX' | 'PRODUCTION';

export type AdminMpesaC2BBusinessType =
  | 'PAYBILL'
  | 'BUY_GOODS';

export interface AdminConfigureMpesaInput {
  // ---------------------------------------------------------------------------
  // Environment
  // ---------------------------------------------------------------------------

  environment: AdminMpesaEnvironment;

  // ---------------------------------------------------------------------------
  // Shared Daraja Authentication
  // ---------------------------------------------------------------------------

  consumerKey: string;
  consumerSecret: string;

  // ---------------------------------------------------------------------------
  // STK Push — Customer Top-up
  // ---------------------------------------------------------------------------

  shortcode: string;
  passkey: string;

  // ---------------------------------------------------------------------------
  // C2B — Customer Top-up Through PayBill / Buy Goods
  // ---------------------------------------------------------------------------

  c2bShortcode?: string;
  c2bBusinessType?: AdminMpesaC2BBusinessType;

  // ---------------------------------------------------------------------------
  // B2C — Withdrawal of Customer Available Funds
  // ---------------------------------------------------------------------------

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
// M-PESA Connection Test
// -----------------------------------------------------------------------------

export interface AdminTestMpesaConnectionResponse {
  authenticated: boolean;
  expiresAt: number;
}
