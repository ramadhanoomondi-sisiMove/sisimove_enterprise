// -----------------------------------------------------------------------------
// sisiMove — Traveller Profile Avatar Hook
// -----------------------------------------------------------------------------
//
// Client-side mutation hook for changing the authenticated TravellerProfile
// avatar.
//
// Responsibilities:
// - Execute the change-avatar API operation.
// - Track mutation/loading state.
// - Expose a normalized Error state.
// - Allow callers to clear the mutation error.
//
// Non-responsibilities:
// - Uploading Assets.
// - Resolving public Asset URLs.
// - Fetching TravellerProfile data.
// - Updating local TravellerProfile state.
// - Deciding which Asset represents a profile photo.
//
// The consuming workflow owns orchestration.
//
// Typical flow:
//
// AssetUploadDialog
//       │
//       ▼
//    Asset
//       │
//       │ asset.publicId
//       ▼
// useTravellerProfileAvatar()
//       │
//       ▼
// PATCH /traveller-profiles/:id/avatar
//       │
//       ▼
// refetch TravellerProfile
//       │
//       ▼
// usePublicAsset(profile.avatarAssetPublicId)
//
// -----------------------------------------------------------------------------

'use client';

import {
  useCallback,
  useState,
} from 'react';

import {
  changeTravellerProfileAvatar,
  type ChangeTravellerProfileAvatarInput,
} from '../api';

// -----------------------------------------------------------------------------
// State
// -----------------------------------------------------------------------------

export interface UseTravellerProfileAvatarState {
  readonly isChanging: boolean;
  readonly error: Error | null;
}

// -----------------------------------------------------------------------------
// Actions
// -----------------------------------------------------------------------------

export interface UseTravellerProfileAvatarActions {
  readonly changeAvatar: (
    travellerProfileId: string,
    input: ChangeTravellerProfileAvatarInput,
  ) => Promise<void>;
  readonly clearError: () => void;
}

// -----------------------------------------------------------------------------
// Result
// -----------------------------------------------------------------------------

export interface UseTravellerProfileAvatarResult
  extends UseTravellerProfileAvatarState,
    UseTravellerProfileAvatarActions {}

// -----------------------------------------------------------------------------
// Error normalization
// -----------------------------------------------------------------------------

function toAvatarError(error: unknown): Error {
  if (error instanceof Error && error.message) {
    return error;
  }

  return new Error(
    'The profile photo could not be changed. Please try again.',
  );
}

// -----------------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------------

export function useTravellerProfileAvatar(): UseTravellerProfileAvatarResult {
  const [isChanging, setIsChanging] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const changeAvatar = useCallback(
    async (
      travellerProfileId: string,
      input: ChangeTravellerProfileAvatarInput,
    ): Promise<void> => {
      setIsChanging(true);
      setError(null);

      try {
        await changeTravellerProfileAvatar(
          travellerProfileId,
          input,
        );
      } catch (error: unknown) {
        const normalizedError = toAvatarError(error);

        setError(normalizedError);

        throw normalizedError;
      } finally {
        setIsChanging(false);
      }
    },
    [],
  );

  const clearError = useCallback((): void => {
    setError(null);
  }, []);

  return {
    isChanging,
    error,
    changeAvatar,
    clearError,
  };
}