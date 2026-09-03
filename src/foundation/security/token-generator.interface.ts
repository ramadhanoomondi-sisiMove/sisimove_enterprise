// -----------------------------------------------------------------------------
// Foundation — Security — Token Generator
// -----------------------------------------------------------------------------
//
// Generates cryptographically secure opaque tokens.
//
// These tokens are appropriate for:
// - refresh tokens;
// - email verification tokens;
// - password reset tokens;
// - recovery tokens;
// - other high-entropy bearer credentials.
//
// This abstraction intentionally knows nothing about JWT.
// -----------------------------------------------------------------------------

export interface TokenGenerator {
  /**
   * Generate a cryptographically secure opaque token.
   *
   * Implementations should return URL-safe material suitable for use in
   * HTTP headers, URLs, or cookies.
   */
  generate(byteLength?: number): string;
}
