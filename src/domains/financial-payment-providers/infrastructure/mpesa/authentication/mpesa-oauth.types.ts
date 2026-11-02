// -----------------------------------------------------------------------------
// Safaricom M-PESA OAuth Types
// -----------------------------------------------------------------------------
//
// Type contracts for Safaricom Daraja OAuth authentication.
//
// Responsibilities:
// - Define the OAuth token response.
// - Define the normalized access token returned internally.
// - Keep external API response types separate from application contracts.
//
// -----------------------------------------------------------------------------

// =============================================================================
// Safaricom OAuth API Response
// =============================================================================

export interface MpesaOAuthApiResponse {
  access_token: string;
  expires_in: string;
}

// =============================================================================
// Normalized OAuth Access Token
// =============================================================================

export interface MpesaOAuthAccessToken {
  accessToken: string;
  expiresIn: number;
  expiresAt: number;
}

// =============================================================================
// Authentication Result
// =============================================================================

export interface MpesaOAuthAuthenticationResult {
  authenticated: boolean;
  expiresAt: number;
}
