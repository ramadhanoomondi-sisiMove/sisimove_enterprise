// -----------------------------------------------------------------------------
// API Configuration
// -----------------------------------------------------------------------------

import { environment } from './environment';

export const apiConfig = {
  baseUrl: environment.apiUrl,
  timeoutMs: 15_000,

  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
} as const;