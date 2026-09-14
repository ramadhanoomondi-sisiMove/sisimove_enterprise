// -----------------------------------------------------------------------------
// sisiMove — Public Asset Hook
// -----------------------------------------------------------------------------
//
// React hook for resolving one publicly renderable Asset.
//
// The hook owns only the small amount of frontend composition required to
// expose a PublicAsset to a React component.
//
// The actual public Asset reference is resolved through:
//
//     getPublicAsset()
//           │
//           ▼
//     GET /assets/public/:assetPublicId/reference
//
// The hook does NOT:
//
// - call fetch directly;
// - construct storage URLs;
// - resolve storage infrastructure;
// - access Asset infrastructure;
// - mirror Asset domain state;
// - perform Asset authorization;
// - transform storage metadata;
// - duplicate API transport logic.
//
// The actual Asset binary is requested independently by the browser through
// `PublicAsset.url`.
//
// -----------------------------------------------------------------------------
//
// ARCHITECTURE
// -----------------------------------------------------------------------------
//
// React component
//       │
//       ▼
// usePublicAsset()
//       │
//       ▼
// getPublicAsset()
//       │
//       ▼
// Public Asset reference API
//       │
//       ▼
// PublicAsset
//       │
//       └── url
//             │
//             ▼
//       Browser requests Asset content
//
// -----------------------------------------------------------------------------
//
// IMPORTANT
// -----------------------------------------------------------------------------
//
// `getPublicAsset()` is an asynchronous API adapter.
//
// It performs:
//
//     GET /assets/public/:assetPublicId/reference
//
// Therefore this hook must not attempt to synchronously return the Promise
// produced by `getPublicAsset()`.
//
// The hook owns the asynchronous lifecycle:
//
//     idle/loading
//          │
//          ▼
//       success
//          │
//          └── PublicAsset
//
// or:
//
//     loading
//          │
//          ▼
//        error
//
// The effect itself does not synchronously call setState. State changes occur
// only when the asynchronous Asset resolution succeeds or fails.
//
// -----------------------------------------------------------------------------
//
// MULTIPLE PUBLIC ASSETS
// -----------------------------------------------------------------------------
//
// A public Journey can contain multiple Assets:
//
//     Journey
//     ├── provider.avatar
//     ├── trust.badges[].asset
//     ├── vehicle.asset
//     └── journey.assets[]
//
// The preferred architecture is for the public Journey read model to provide
// these PublicAsset objects directly.
//
// This hook is therefore a convenience for independently resolving a single
// public Asset representation, not a replacement for the Journey read model
// composition boundary.
//
// -----------------------------------------------------------------------------
//
// OPTIONAL ASSET REFERENCES
// -----------------------------------------------------------------------------
//
// When the reference is absent:
//
//     usePublicAsset(undefined)
//
// the hook returns:
//
//     {
//       asset: null,
//       isLoading: false,
//       error: null,
//     }
//
// No HTTP request is made.
//
// -----------------------------------------------------------------------------

'use client';

import {
  useEffect,
  useState,
} from 'react';

import {
  getPublicAsset,
} from '../api';

import type {
  PublicAsset,
} from '../models';

// =============================================================================
// Internal State
// =============================================================================
//
// The publicId is stored alongside the resolved result.
//
// This allows the hook to determine whether a previously resolved Asset still
// belongs to the currently requested publicId without synchronously resetting
// React state from inside the effect.
//
// =============================================================================

interface PublicAssetState {
  publicId: string;
  asset: PublicAsset | null;
  error: Error | null;
}

// =============================================================================
// Public Hook Result
// =============================================================================

export interface UsePublicAssetResult {
  /**
   * Resolved public Asset representation.
   *
   * `null` when no Asset reference exists, while a new reference is loading,
   * or when resolution failed.
   */
  asset: PublicAsset | null;

  /**
   * Whether the current public Asset reference is being resolved.
   */
  isLoading: boolean;

  /**
   * Error produced while resolving the current public Asset reference.
   */
  error: Error | null;
}

// =============================================================================
// Hook
// =============================================================================

/**
 * Resolves one publicly renderable Asset representation.
 *
 * The hook performs the public Asset reference request only when a valid
 * `publicId` is supplied.
 *
 * Example:
 *
 *     const {
 *       asset,
 *       isLoading,
 *       error,
 *     } = usePublicAsset(traveller.avatar?.publicId);
 *
 *     if (isLoading) {
 *       return <AvatarSkeleton />;
 *     }
 *
 *     if (error || !asset) {
 *       return <DefaultAvatar />;
 *     }
 *
 *     return <PublicAssetImage asset={asset} />;
 *
 * @param publicId
 * Opaque public Asset identifier.
 *
 * @returns
 * Public Asset state containing the resolved asset, loading state, and error.
 */
export function usePublicAsset(
  publicId: string | null | undefined,
): UsePublicAssetResult {
  const normalizedPublicId = publicId?.trim() ?? '';

  const [state, setState] = useState<PublicAssetState>(() => ({
    publicId: normalizedPublicId,
    asset: null,
    error: null,
  }));

  useEffect(() => {
    if (normalizedPublicId.length === 0) {
      return;
    }

    let cancelled = false;

    void getPublicAsset(normalizedPublicId)
      .then((resolvedAsset) => {
        if (cancelled) {
          return;
        }

        setState({
          publicId: normalizedPublicId,
          asset: resolvedAsset,
          error: null,
        });
      })
      .catch((cause: unknown) => {
        if (cancelled) {
          return;
        }

        const resolvedError =
          cause instanceof Error
            ? cause
            : new Error('Failed to resolve public Asset.');

        setState({
          publicId: normalizedPublicId,
          asset: null,
          error: resolvedError,
        });
      });

    return () => {
      cancelled = true;
    };
  }, [normalizedPublicId]);

  // ---------------------------------------------------------------------------
  // No Asset reference
  // ---------------------------------------------------------------------------
  //
  // This is derived directly from the input rather than being represented by
  // another state update inside the effect.
  //
  if (normalizedPublicId.length === 0) {
    return {
      asset: null,
      isLoading: false,
      error: null,
    };
  }

  // ---------------------------------------------------------------------------
  // Current request has not completed
  // ---------------------------------------------------------------------------
  //
  // When the requested publicId changes, the previous state may still contain
  // the previous Asset. Do not expose that stale Asset as the result for the
  // new publicId.
  //
  // Instead, the current input itself determines that the new request is
  // loading until the asynchronous operation commits matching state.
  //
  if (state.publicId !== normalizedPublicId) {
    return {
      asset: null,
      isLoading: true,
      error: null,
    };
  }

  // ---------------------------------------------------------------------------
  // Current request has completed
  // ---------------------------------------------------------------------------

  return {
    asset: state.asset,
    isLoading: false,
    error: state.error,
  };
}
