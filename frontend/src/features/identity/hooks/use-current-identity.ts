// -----------------------------------------------------------------------------
// sisiMove — Current Identity Hook
// -----------------------------------------------------------------------------
//
// React Query boundary for the authenticated user's Identity.
//
// Responsibilities:
//
// - load the current Identity;
// - expose loading/error state;
// - provide explicit refetch support;
// - cache the current Identity independently from Authentication state.
//
// Non-responsibilities:
//
// - authentication;
// - session restoration;
// - login;
// - logout;
// - token management;
// - Identity mutations.
//
// Authentication answers:
//
//     "Is this client authenticated?"
//
// Identity answers:
//
//     "Who is the authenticated Identity?"
//
// These are deliberately separate concerns.
//
// -----------------------------------------------------------------------------

'use client';

import { useQuery } from '@tanstack/react-query';

import { getCurrentIdentity } from '../api';

import type { Identity } from '../models';

// =============================================================================
// Query Key
// =============================================================================

const CURRENT_IDENTITY_QUERY_KEY = 'current-identity';

// =============================================================================
// Hook
// =============================================================================

export function useCurrentIdentity() {
  return useQuery<Identity | null, Error>({
    queryKey: [CURRENT_IDENTITY_QUERY_KEY],
    queryFn: getCurrentIdentity,

    // Identity changes relatively infrequently compared with ordinary
    // application data. A short stale period avoids unnecessary requests
    // while still allowing account changes to become visible promptly.
    staleTime: 5 * 60 * 1000,
  });
}

export default useCurrentIdentity;