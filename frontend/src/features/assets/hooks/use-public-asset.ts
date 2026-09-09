// -----------------------------------------------------------------------------
// sisiMove — Public Asset Hook
// -----------------------------------------------------------------------------
//
// Explicitly controlled hook for loading a public Asset.
//
// Design principles:
// - No automatic useEffect-based fetching.
// - Callers explicitly control when loading occurs.
// - Stale requests cannot overwrite newer requests.
// - Invalid load attempts invalidate older in-flight requests.
// - Reset fully clears the current asset state.
// - PublicAsset remains a frontend read model and is never coupled to Prisma.
// -----------------------------------------------------------------------------

'use client';

import {
  useCallback,
  useRef,
  useState,
} from 'react';

import { assetsApi } from '../api';
import type { PublicAsset } from '../models';

// -----------------------------------------------------------------------------
// State
// -----------------------------------------------------------------------------

export interface UsePublicAssetState {
  readonly asset: PublicAsset | null;
  readonly loading: boolean;
  readonly error: Error | null;
}

// -----------------------------------------------------------------------------
// Result
// -----------------------------------------------------------------------------

export interface UsePublicAssetResult
  extends UsePublicAssetState {
  load: (
    publicId: string,
  ) => Promise<PublicAsset | null>;

  refresh: () => Promise<PublicAsset | null>;

  reset: () => void;
}

// -----------------------------------------------------------------------------
// Error Normalization
// -----------------------------------------------------------------------------

function normalizeError(
  cause: unknown,
): Error {
  if (cause instanceof Error) {
    return cause;
  }

  return new Error(
    'Failed to load public asset.',
  );
}

// -----------------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------------

export function usePublicAsset(
  initialPublicId?: string,
): UsePublicAssetResult {
  const [asset, setAsset] =
    useState<PublicAsset | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<Error | null>(null);

  const publicIdRef = useRef(
    initialPublicId?.trim() ?? '',
  );

  const requestSequenceRef =
    useRef(0);

  // ---------------------------------------------------------------------------
  // Load
  // ---------------------------------------------------------------------------

  const load = useCallback(
    async (
      publicId: string,
    ): Promise<PublicAsset | null> => {
      // Every invocation represents a new request intent.
      //
      // This must happen before validation so that an invalid request also
      // invalidates any older request that may still be in flight.
      const requestSequence =
        ++requestSequenceRef.current;

      const normalizedPublicId =
        publicId.trim();

      if (!normalizedPublicId) {
        const validationError =
          new Error(
            'Asset public ID is required.',
          );

        publicIdRef.current = '';

        setAsset(null);
        setError(validationError);
        setLoading(false);

        return null;
      }

      publicIdRef.current =
        normalizedPublicId;

      setLoading(true);
      setError(null);

      try {
        const result =
          await assetsApi.getPublic(
            normalizedPublicId,
          );

        // Ignore stale responses from older requests.
        if (
          requestSequence !==
          requestSequenceRef.current
        ) {
          return null;
        }

        setAsset(result);
        setError(null);

        return result;
      } catch (cause: unknown) {
        // Ignore errors from stale requests.
        if (
          requestSequence !==
          requestSequenceRef.current
        ) {
          return null;
        }

        const normalizedError =
          normalizeError(cause);

        setAsset(null);
        setError(normalizedError);

        return null;
      } finally {
        // Only the current request controls loading state.
        if (
          requestSequence ===
          requestSequenceRef.current
        ) {
          setLoading(false);
        }
      }
    },
    [],
  );

  // ---------------------------------------------------------------------------
  // Refresh
  // ---------------------------------------------------------------------------

  const refresh = useCallback(
    async (): Promise<PublicAsset | null> => {
      const publicId =
        publicIdRef.current;

      if (!publicId) {
        const validationError =
          new Error(
            'Asset public ID is required.',
          );

        setAsset(null);
        setError(validationError);
        setLoading(false);

        return null;
      }

      return load(publicId);
    },
    [load],
  );

  // ---------------------------------------------------------------------------
  // Reset
  // ---------------------------------------------------------------------------

  const reset = useCallback(
    (): void => {
      // Invalidate every request currently in flight.
      requestSequenceRef.current += 1;

      publicIdRef.current = '';

      setAsset(null);
      setLoading(false);
      setError(null);
    },
    [],
  );

  // ---------------------------------------------------------------------------
  // Result
  // ---------------------------------------------------------------------------

  return {
    asset,
    loading,
    error,
    load,
    refresh,
    reset,
  };
}