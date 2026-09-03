// -----------------------------------------------------------------------------
// Foundation — Security — OTP Service
// -----------------------------------------------------------------------------
//
// Abstraction for cryptographically secure one-time password operations.
//
// The foundation defines the security contract.
//
// Infrastructure provides the implementation.
//
// -----------------------------------------------------------------------------

// =============================================================================
// Generated OTP
// =============================================================================

export interface GeneratedOtp {
  /**
   * Raw OTP generated for immediate application-level delivery.
   *
   * MUST NOT be persisted, logged, or placed in the domain model.
   */
  readonly otp: string;

  /**
   * Persistence-safe hash of the OTP.
   *
   * This is the only OTP material that may cross into domain state.
   */
  readonly hash: string;
}

// =============================================================================
// OTP Service
// =============================================================================

export interface OtpService {
  /**
   * Generate a cryptographically secure numeric OTP and its hash.
   */
  generate(length: number): Promise<GeneratedOtp>;

  /**
   * Verify a raw OTP against a persisted OTP hash.
   */
  verify(otp: string, otpHash: string): Promise<boolean>;
}
