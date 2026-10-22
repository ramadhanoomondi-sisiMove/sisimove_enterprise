
'use client';

import { useEffect, useState } from 'react';

import { assetsApi } from '../api';

interface AssetPreviewState {
  readonly publicId: string;
  readonly url: string | null;
  readonly error: Error | null;
}

export function useAssetPreview(
  publicId: string | null | undefined,
  enabled = true,
) {
  const normalizedPublicId = publicId?.trim() ?? '';

  const [previewState, setPreviewState] =
    useState<AssetPreviewState | null>(null);

  const isEnabled = enabled && normalizedPublicId.length > 0;

  useEffect(() => {
    if (!isEnabled) {
      return;
    }

    let cancelled = false;
    let objectUrl: string | null = null;

    const loadPreview = async (): Promise<void> => {
      try {
        const content = await assetsApi.getPrivateContent(
          normalizedPublicId,
        );

        if (cancelled) {
          return;
        }

        objectUrl = URL.createObjectURL(content);

        setPreviewState({
          publicId: normalizedPublicId,
          url: objectUrl,
          error: null,
        });
      } catch (cause: unknown) {
        if (cancelled) {
          return;
        }

        setPreviewState({
          publicId: normalizedPublicId,
          url: null,
          error:
            cause instanceof Error
              ? cause
              : new Error('Unable to load asset preview.'),
        });
      }
    };

    void loadPreview();

    return () => {
      cancelled = true;

      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [normalizedPublicId, isEnabled]);

  const currentState =
    previewState?.publicId === normalizedPublicId
      ? previewState
      : null;

  return {
    previewUrl: isEnabled ? currentState?.url ?? null : null,
    isLoading: isEnabled && currentState === null,
    isError: currentState?.error !== null &&
      currentState?.error !== undefined,
    error: currentState?.error ?? null,
  };
}

export default useAssetPreview;
