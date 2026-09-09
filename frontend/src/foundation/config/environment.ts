// -----------------------------------------------------------------------------
// sisiMove — Frontend Environment
// -----------------------------------------------------------------------------
//
// Centralized access to frontend environment variables.
//
// Responsibilities:
// - Read public frontend environment variables.
// - Provide safe development defaults.
// - Expose normalized environment flags.
// - Keep environment access outside feature and presentation layers.
//
// Important:
// - Only NEXT_PUBLIC_* variables are available to browser-side code.
// - Secrets must never be placed in this file or exposed through
//   NEXT_PUBLIC_* variables.
// - The API URL points to the SisiMove NestJS API, not the Next.js frontend.
//
// Expected development setup:
//
//   Next.js frontend
//       http://localhost:3000
//
//   SisiMove API
//       http://localhost:3001/api/v1
//
// The actual value of NEXT_PUBLIC_API_URL takes precedence over the fallback.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Environment Variable Reader
// -----------------------------------------------------------------------------

const readEnvironmentVariable = (
  key: string,
  fallback?: string,
): string => {
  const value = process.env[key];

  if (value !== undefined && value.trim().length > 0) {
    return value.trim();
  }

  if (fallback !== undefined) {
    return fallback;
  }

  return '';
};

// -----------------------------------------------------------------------------
// Environment Values
// -----------------------------------------------------------------------------

const appEnv = readEnvironmentVariable(
  'NEXT_PUBLIC_APP_ENV',
  'development',
);

// -----------------------------------------------------------------------------
// Public Environment Configuration
// -----------------------------------------------------------------------------

export const environment = {
  /**
   * Base URL for the SisiMove HTTP API.
   *
   * Development default:
   *
   *   http://localhost:3001/api/v1
   *
   * Override with:
   *
   *   NEXT_PUBLIC_API_URL
   *
   * Example:
   *
   *   NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
   */
  apiUrl: readEnvironmentVariable(
    'NEXT_PUBLIC_API_URL',
    'http://localhost:3001/api/v1',
  ),

  /**
   * Current frontend application environment.
   *
   * Override with:
   *
   *   NEXT_PUBLIC_APP_ENV
   */
  appEnv,

  /**
   * True when the frontend is running in development mode.
   */
  isDevelopment: appEnv === 'development',

  /**
   * True when the frontend is running in production mode.
   */
  isProduction: appEnv === 'production',

  /**
   * True when the frontend is running in test mode.
   */
  isTest: appEnv === 'test',
} as const;