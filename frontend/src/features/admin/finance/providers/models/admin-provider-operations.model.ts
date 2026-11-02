
// -----------------------------------------------------------------------------
// Admin Provider — Operation Models
// -----------------------------------------------------------------------------

export interface AdminCreateProviderInput {
  code: string;
  name: string;
  type: string;
  environment: string;
  description?: string;
  configurationReference?: string;
}

export interface AdminUpdateProviderInput {
  name: string;
  causationId?: string;
}

export interface AdminChangeProviderStatusInput {
  status: string;
  causationId?: string;
}

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
