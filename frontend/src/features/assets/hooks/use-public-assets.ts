// -----------------------------------------------------------------------------
// sisiMove — Use Public Assets
// -----------------------------------------------------------------------------
//
// Resolves multiple public Asset references through the public Asset API.
//
// Important architectural rules:
// - Asset public IDs remain opaque.
// - Browser-facing URLs come from the Asset API.
// - The hook does not construct URLs.
// - The hook does not mirror Asset domain state.
// - Individual Asset failures do not prevent successful Assets from rendering.
// - The request is keyed by semantic reference content rather than array
//   identity, so callers may create reference arrays during render safely.
//
// -----------------------------------------------------------------------------

"use client";

import { useEffect, useState } from "react";

import { getPublicAsset } from "../api";

import type { PublicAsset } from "../models";

// =============================================================================
// Public Asset Reference
// =============================================================================

export interface PublicAssetReferenceInput {
  /**
   * Opaque public Asset identifier.
   */
  readonly publicId: string;

  /**
   * Semantic alternative text supplied by the consuming feature.
   */
  readonly alt?: string;
}

// =============================================================================
// Public Hook Result
// =============================================================================

export interface UsePublicAssetsResult {
  /**
   * Successfully resolved public Assets.
   *
   * Failed references are omitted.
   */
  readonly assets: readonly PublicAsset[];

  /**
   * Whether the current collection is being resolved.
   */
  readonly isLoading: boolean;

  /**
   * First error encountered while resolving the collection.
   *
   * Other Assets may still have resolved successfully.
   */
  readonly error: Error | null;
}

// =============================================================================
// Internal State
// =============================================================================

interface PublicAssetsState {
  /**
   * Semantic signature of the request that produced this state.
   */
  readonly requestKey: string;

  /**
   * Successfully resolved Assets.
   */
  readonly assets: readonly PublicAsset[];

  /**
   * First encountered resolution error.
   */
  readonly error: Error | null;
}

// =============================================================================
// Reference Normalization
// =============================================================================

function normalizeReferences(
  references: readonly PublicAssetReferenceInput[],
): readonly PublicAssetReferenceInput[] {
  const seen = new Set<string>();
  const normalized: PublicAssetReferenceInput[] = [];

  for (const reference of references) {
    const publicId = reference.publicId.trim();

    // -------------------------------------------------------------------------
    // Ignore empty identifiers and duplicate public Asset references.
    // -------------------------------------------------------------------------

    if (publicId.length === 0 || seen.has(publicId)) {
      continue;
    }

    seen.add(publicId);

    normalized.push({
      publicId,
      alt: reference.alt?.trim() || "",
    });
  }

  return normalized;
}

// =============================================================================
// Request Key
// =============================================================================
//
// The key is deliberately a primitive.
//
// This prevents the effect from depending on the caller's array identity:
//
//     references !== previousReferences
//
// while the actual semantic request remains:
//
//     publicId + alt
//
// The array structure is encoded explicitly as objects rather than tuples so
// that the type recovered inside the effect is exactly
// `PublicAssetReferenceInput[]`.
//
// =============================================================================

function createRequestKey(
  references: readonly PublicAssetReferenceInput[],
): string {
  return JSON.stringify(
    references.map((reference) => ({
      publicId: reference.publicId,
      alt: reference.alt ?? "",
    })),
  );
}

// =============================================================================
// References From Request Key
// =============================================================================

function referencesFromRequestKey(
  requestKey: string,
): readonly PublicAssetReferenceInput[] {
  if (!requestKey) {
    return [];
  }

  try {
    const parsed: unknown = JSON.parse(requestKey);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.flatMap((value): PublicAssetReferenceInput[] => {
      if (
        typeof value !== "object" ||
        value === null ||
        !("publicId" in value) ||
        typeof value.publicId !== "string"
      ) {
        return [];
      }

      const alt =
        "alt" in value && typeof value.alt === "string"
          ? value.alt
          : "";

      return [
        {
          publicId: value.publicId,
          alt,
        },
      ];
    });
  } catch {
    // -------------------------------------------------------------------------
    // The request key is generated internally, so this should not normally
    // occur. Returning an empty collection keeps the hook defensive.
    // -------------------------------------------------------------------------

    return [];
  }
}

// =============================================================================
// Hook
// =============================================================================

/**
 * Resolves multiple publicly renderable Assets.
 *
 * The hook is intentionally non-blocking:
 *
 * - the consuming Journey may render immediately;
 * - successfully resolved images become available when ready;
 * - unavailable Assets remain absent;
 * - one failed Asset does not invalidate the whole Journey.
 */
export function usePublicAssets(
  references: readonly PublicAssetReferenceInput[],
): UsePublicAssetsResult {
  // ---------------------------------------------------------------------------
  // Normalize the input during render.
  //
  // This is a pure calculation and does not access React state or refs.
  // ---------------------------------------------------------------------------

  const normalizedReferences = normalizeReferences(references);

  // ---------------------------------------------------------------------------
  // Convert the semantic request into a primitive dependency.
  // ---------------------------------------------------------------------------

  const requestKey = createRequestKey(normalizedReferences);

  const [state, setState] = useState<PublicAssetsState>(() => ({
    requestKey,
    assets: [],
    error: null,
  }));

  // ---------------------------------------------------------------------------
  // Resolve the current request.
  //
  // The effect depends exclusively on the primitive request key.
  //
  // We reconstruct the references from that key inside the effect so the
  // effect does not close over the caller's potentially unstable array.
  // ---------------------------------------------------------------------------

  useEffect(() => {
    const requestReferences = referencesFromRequestKey(requestKey);

    // -------------------------------------------------------------------------
    // Nothing to resolve.
    // -------------------------------------------------------------------------

    if (requestReferences.length === 0) {
      return;
    }

    let cancelled = false;

    // -------------------------------------------------------------------------
    // Resolve all Assets concurrently.
    // -------------------------------------------------------------------------

    void Promise.allSettled(
      requestReferences.map((reference) =>
        getPublicAsset(reference.publicId, reference.alt),
      ),
    ).then((results) => {
      if (cancelled) {
        return;
      }

      const resolvedAssets: PublicAsset[] = [];
      let firstError: Error | null = null;

      for (const result of results) {
        if (result.status === "fulfilled") {
          resolvedAssets.push(result.value);
          continue;
        }

        if (firstError === null) {
          firstError =
            result.reason instanceof Error
              ? result.reason
              : new Error("Failed to resolve one or more public Assets.");
        }
      }

      setState({
        requestKey,
        assets: resolvedAssets,
        error: firstError,
      });
    });

    return () => {
      cancelled = true;
    };
  }, [requestKey]);

  // ---------------------------------------------------------------------------
  // Empty collection.
  // ---------------------------------------------------------------------------

  if (normalizedReferences.length === 0) {
    return {
      assets: [],
      isLoading: false,
      error: null,
    };
  }

  // ---------------------------------------------------------------------------
  // A new semantic request exists but its effect has not completed yet.
  //
  // Never expose Assets belonging to the previous request.
  // ---------------------------------------------------------------------------

  if (state.requestKey !== requestKey) {
    return {
      assets: [],
      isLoading: true,
      error: null,
    };
  }

  // ---------------------------------------------------------------------------
  // Current request has completed.
  // ---------------------------------------------------------------------------

  return {
    assets: state.assets,
    isLoading: false,
    error: state.error,
  };
}