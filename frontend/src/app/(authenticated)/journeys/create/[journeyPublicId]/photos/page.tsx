// -----------------------------------------------------------------------------
// sisiMove — Journey Photos Creation Page
// -----------------------------------------------------------------------------
//
// Workflow owner for the Photos step of Journey creation.
//
// Responsibilities:
// - Load the user's existing Assets.
// - Load the Journey's current Asset attachments.
// - Open the Asset upload workflow.
// - Attach newly uploaded Assets to the Journey.
// - Reconcile the Journey's Asset attachments when the form is submitted.
// - Remove Journey-side Asset attachments when no longer selected.
// - Navigate to the Review step after successful persistence.
//
// Architectural boundary:
//
// Asset domain
//     │
//     ├── owns Asset creation/upload
//     │
//     ▼
// AssetUploadDialog
//     │
//     ▼
// Asset
//     │
//     └──────────────────────────────┐
//                                    │ assetPublicId
//                                    ▼
//                            Journey Asset API
//                                    │
//                                    ▼
//                             Journey aggregate
//
// This page does NOT:
// - create Asset records directly;
// - upload files directly;
// - construct Asset URLs;
// - modify Asset metadata;
// - delete underlying Assets;
// - invent a Journey Asset update endpoint;
// - own Journey domain invariants.
//
// Journey Asset changes use the existing aggregate operations:
//
//     POST   /journeys/:journeyPublicId/assets
//     DELETE /journeys/:journeyPublicId/assets/:assetPublicId
//
// Because Journey Asset configuration has no update operation, changing the
// Journey-side type or sort order is represented as:
//
//     remove existing attachment
//          +
//     attach the desired configuration
//
// -----------------------------------------------------------------------------

'use client';

import {
  useCallback,
  useMemo,
  useState,
} from 'react';

import {
  useParams,
  useRouter,
} from 'next/navigation';

import {
  Button,
} from '@/components/ui';

import {
  JourneyPhotosForm,
  JourneyPhotosStep,
  type JourneyPhotosFormSubmitValue,
  type JourneyPhotosFormValue,
} from '@/components/journeys/creation/photos';

import {
  AssetUploadDialog,
} from '@/components/assets';

import {
  useAsset,
  type Asset,
} from '@/features/assets';

import {
  useJourneyAssets,
} from '@/features/journey/hooks/queries';

import {
  useAttachJourneyAsset,
  useRemoveJourneyAsset,
} from '@/features/journey/hooks/mutations';

import type {
  JourneyAssetType,
} from '@/features/journey/models';

import {
  AUTHENTICATED_ROUTES,
} from '@/foundation/routing';

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

/**
 * Photos uploaded from this Journey creation workflow are ordinary image
 * Assets classified as vehicle photos.
 *
 * The Journey Asset `type` remains independent from the Asset domain
 * `category`.
 */
const UPLOAD_ASSET_TYPE = 'IMAGE' as const;
const UPLOAD_ASSET_CATEGORY = 'VEHICLE_PHOTO' as const;

const UPLOAD_ACCEPT = 'image/*';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

interface PersistedJourneyAsset {
  assetPublicId: string;
  type: JourneyAssetType;
  sortOrder: number;
}

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function toErrorMessage(
  error: unknown,
  fallback: string,
): string {
  if (
    error instanceof Error &&
    error.message
  ) {
    return error.message;
  }

  return fallback;
}

/**
 * Maps the Journey Asset read model into the presentation form model.
 *
 * Only Journey-owned configuration crosses into the form.
 *
 * `publicId`, timestamps, and other persistence metadata remain outside the
 * form because they are not required to configure the Journey Asset.
 */
function toFormValue(
  assets: readonly {
    assetPublicId: string;
    type: JourneyAssetType;
    sortOrder: number;
  }[],
): JourneyPhotosFormValue[] {
  return [...assets]
    .sort(
      (first, second) =>
        first.sortOrder -
        second.sortOrder,
    )
    .map(
      (asset) => ({
        assetPublicId:
          asset.assetPublicId,
        type: asset.type,
        sortOrder:
          asset.sortOrder,
      }),
    );
}

/**
 * Determines whether two Journey Asset configurations are equivalent.
 */
function isSameJourneyAsset(
  left: PersistedJourneyAsset,
  right: JourneyPhotosFormValue,
): boolean {
  return (
    left.assetPublicId ===
      right.assetPublicId &&
    left.type === right.type &&
    left.sortOrder === right.sortOrder
  );
}

// -----------------------------------------------------------------------------
// Page
// -----------------------------------------------------------------------------

export default function JourneyPhotosPage() {
  const router = useRouter();

  const params = useParams<{
    journeyPublicId: string;
  }>();

  const journeyPublicId =
    params.journeyPublicId;

  // ---------------------------------------------------------------------------
  // Journey Asset read boundary
  // ---------------------------------------------------------------------------

  const journeyAssetsQuery =
    useJourneyAssets(
      journeyPublicId,
    );

  // ---------------------------------------------------------------------------
  // Authenticated Asset capability
  // ---------------------------------------------------------------------------

  const {
    assets,
    isLoading: assetsLoading,
    error: assetsError,
    loadAssets,
  } = useAsset();

  // ---------------------------------------------------------------------------
  // Journey Asset mutations
  // ---------------------------------------------------------------------------

  const attachAsset =
    useAttachJourneyAsset();

  const removeAsset =
    useRemoveJourneyAsset();

  // ---------------------------------------------------------------------------
  // Local workflow state
  // ---------------------------------------------------------------------------

  const [
    uploadOpen,
    setUploadOpen,
  ] = useState(false);

  const [
    photosDraft,
    setPhotosDraft,
  ] = useState<
    JourneyPhotosFormSubmitValue | undefined
  >();

  const [
    saveError,
    setSaveError,
  ] = useState<string | null>(null);

  // ---------------------------------------------------------------------------
  // Persisted Journey Asset configuration
  // ---------------------------------------------------------------------------

  const persistedAssets =
    useMemo<PersistedJourneyAsset[]>(
      () => {
        const journeyAssets =
          journeyAssetsQuery.data ?? [];

        return journeyAssets
          .map(
            (asset) => ({
              assetPublicId:
                asset.assetPublicId,
              type: asset.type,
              sortOrder:
                asset.sortOrder,
            }),
          )
          .sort(
            (first, second) =>
              first.sortOrder -
              second.sortOrder,
          );
      },
      [journeyAssetsQuery.data],
    );

  const persistedFormValue =
    useMemo(
      () =>
        toFormValue(
          persistedAssets,
        ),
      [persistedAssets],
    );

  // ---------------------------------------------------------------------------
  // Form value
  // ---------------------------------------------------------------------------
  //
  // The form owns its local presentation state after initialisation.
  //
  // When persisted Journey Assets change, the form is remounted using the
  // persisted collection signature below. This is particularly important after
  // an Asset is uploaded and attached by the workflow.
  // ---------------------------------------------------------------------------

  const formKey = useMemo(
    () =>
      [
        journeyPublicId,
        ...persistedAssets.map(
          (asset) =>
            `${asset.assetPublicId}:${asset.type}:${asset.sortOrder}`,
        ),
      ].join('|'),
    [
      journeyPublicId,
      persistedAssets,
    ],
  );

  const formValue =
    photosDraft ??
    persistedFormValue;

  // ---------------------------------------------------------------------------
  // Asset loading
  // ---------------------------------------------------------------------------

  const handleOpenUpload =
    useCallback(() => {
      setSaveError(null);
      setUploadOpen(true);

      /**
       * AssetManager's capability owns Asset loading. We refresh the
       * collection before opening the picker so newly available Assets are
       * visible to the form.
       */
      void loadAssets();
    }, [loadAssets]);

  // ---------------------------------------------------------------------------
  // Form change
  // ---------------------------------------------------------------------------

  const handlePhotosChange =
    useCallback(
      (
        value: JourneyPhotosFormSubmitValue,
      ) => {
        setSaveError(null);
        setPhotosDraft(value);
      },
      [],
    );

  // ---------------------------------------------------------------------------
  // Upload completed
  // ---------------------------------------------------------------------------
  //
  // Uploading creates the Asset-domain record.
  //
  // The Journey still needs an explicit Journey Asset attachment. Therefore
  // this callback completes both sides of the workflow:
  //
  //     upload Asset
  //          │
  //          ▼
  //     attach Asset to Journey
  //
  // The underlying Asset is never deleted if Journey attachment fails. It
  // remains an Asset-domain resource that can be managed by the Assets
  // capability.
  // ---------------------------------------------------------------------------

  const handleUploaded =
    useCallback(
      async (asset: Asset) => {
        setSaveError(null);

        try {
          const nextSortOrder =
            persistedAssets.length;

          await attachAsset.mutateAsync({
            journeyPublicId,
            assetPublicId:
              asset.publicId,
            type: 'VEHICLE',
            sortOrder:
              nextSortOrder,
          });

          /**
           * Refresh the Asset collection so the newly uploaded Asset is
           * available to the Photos form.
           */
          await loadAssets();

          setPhotosDraft(
            undefined,
          );

          setUploadOpen(false);
        } catch (error) {
          setSaveError(
            toErrorMessage(
              error,
              'The photo was uploaded but could not be attached to this Journey. Please try again.',
            ),
          );

          throw error;
        }
      },
      [
        attachAsset,
        journeyPublicId,
        loadAssets,
        persistedAssets.length,
      ],
    );

  // ---------------------------------------------------------------------------
  // Save / reconcile
  // ---------------------------------------------------------------------------
  //
  // There is deliberately no "update Journey Asset" API.
  //
  // Existing attachments that have changed configuration are therefore
  // reconciled through remove + attach.
  // ---------------------------------------------------------------------------

  const handlePhotosSubmit =
    useCallback(
      async (
        submittedPhotos: JourneyPhotosFormSubmitValue,
      ) => {
        setSaveError(null);

        try {
          const desired =
            submittedPhotos.map(
              (photo, index) => ({
                ...photo,
                sortOrder: index,
              }),
            );

          const persistedByAssetId =
            new Map(
              persistedAssets.map(
                (asset) => [
                  asset.assetPublicId,
                  asset,
                ],
              ),
            );

          const desiredByAssetId =
            new Map(
              desired.map(
                (photo) => [
                  photo.assetPublicId,
                  photo,
                ],
              ),
            );

          // -----------------------------------------------------------------
          // Remove attachments that no longer exist in the desired form.
          // -----------------------------------------------------------------

          const assetsToRemove =
            persistedAssets.filter(
              (asset) =>
                !desiredByAssetId.has(
                  asset.assetPublicId,
                ),
            );

          // -----------------------------------------------------------------
          // Remove attachments whose Journey-side configuration changed.
          //
          // There is intentionally no update operation.
          // -----------------------------------------------------------------

          const assetsToReconfigure =
            desired.filter(
              (photo) => {
                const persisted =
                  persistedByAssetId.get(
                    photo.assetPublicId,
                  );

                if (!persisted) {
                  return false;
                }

                return !isSameJourneyAsset(
                  persisted,
                  photo,
                );
              },
            );

          // -----------------------------------------------------------------
          // Attachments that are entirely new.
          // -----------------------------------------------------------------

          const assetsToAdd =
            desired.filter(
              (photo) =>
                !persistedByAssetId.has(
                  photo.assetPublicId,
                ),
            );

          // -----------------------------------------------------------------
          // Remove obsolete attachments.
          // -----------------------------------------------------------------

          for (
            const asset of [
              ...assetsToRemove,
              ...assetsToReconfigure.map(
                (photo) =>
                  persistedByAssetId.get(
                    photo.assetPublicId,
                  ),
              ).filter(
                (
                  asset,
                ): asset is PersistedJourneyAsset =>
                  asset !== undefined,
              ),
            ]
          ) {
            await removeAsset.mutateAsync({
              journeyPublicId,
              assetPublicId:
                asset.assetPublicId,
            });
          }

          // -----------------------------------------------------------------
          // Attach new and reconfigured assets.
          // -----------------------------------------------------------------

          for (
            const photo of [
              ...assetsToAdd,
              ...assetsToReconfigure,
            ]
          ) {
            await attachAsset.mutateAsync({
              journeyPublicId,
              assetPublicId:
                photo.assetPublicId,
              type: photo.type,
              sortOrder:
                photo.sortOrder,
            });
          }

          // -----------------------------------------------------------------
          // Clear local draft and continue.
          // -----------------------------------------------------------------

          setPhotosDraft(
            undefined,
          );

          router.push(
            AUTHENTICATED_ROUTES.JOURNEY_CREATE_REVIEW(
              journeyPublicId,
            ),
          );
        } catch (error) {
          setSaveError(
            toErrorMessage(
              error,
              'Unable to save the Journey photos. Please try again.',
            ),
          );
        }
      },
      [
        attachAsset,
        journeyPublicId,
        persistedAssets,
        removeAsset,
        router,
      ],
    );

  // ---------------------------------------------------------------------------
  // Remove Journey Asset from the persisted Journey
  // ---------------------------------------------------------------------------
  //
  // This is exposed separately from the form's local Remove action only when
  // the workflow needs to remove an already-persisted attachment immediately.
  //
  // The current form deliberately keeps Remove local until Save and continue,
  // so the creation step behaves consistently with the other configuration
  // steps.
  // ---------------------------------------------------------------------------

  const handleBack =
    useCallback(() => {
      router.push(
        AUTHENTICATED_ROUTES.JOURNEY_CREATE_PREFERENCES(
          journeyPublicId,
        ),
      );
    }, [
      journeyPublicId,
      router,
    ]);

  const handleContinue =
    useCallback(() => {
      const form =
        document.getElementById(
          'journey-photos-form',
        );

      if (
        !(form instanceof HTMLFormElement)
      ) {
        return;
      }

      form.requestSubmit();
    }, []);

  // ---------------------------------------------------------------------------
  // Loading
  // ---------------------------------------------------------------------------

  if (
    journeyAssetsQuery.isLoading ||
    assetsLoading
  ) {
    return (
      <JourneyPhotosStep>
        <div
          className={[
            'rounded-[var(--radius-lg)]',
            'border',
            'border-[var(--border)]',
            'bg-[var(--surface)]',
            'p-5',
          ].join(' ')}
        >
          <p className="text-sm text-[var(--foreground-muted)]">
            Loading Journey photos…
          </p>
        </div>
      </JourneyPhotosStep>
    );
  }

  // ---------------------------------------------------------------------------
  // Error
  // ---------------------------------------------------------------------------

  if (
    journeyAssetsQuery.isError ||
    assetsError
  ) {
    const error =
      journeyAssetsQuery.error ??
      assetsError;

    return (
      <JourneyPhotosStep>
        <div
          role="alert"
          className={[
            'rounded-[var(--radius-lg)]',
            'border',
            'border-[var(--danger)]',
            'bg-[var(--surface)]',
            'p-5',
          ].join(' ')}
        >
          <p className="text-sm font-medium text-[var(--danger)]">
            Unable to load Journey photos.
          </p>

          <p className="mt-1 text-sm leading-6 text-[var(--foreground-secondary)]">
            {toErrorMessage(
              error,
              'Please try again.',
            )}
          </p>

          <div className="mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                void journeyAssetsQuery.refetch();
                void loadAssets();
              }}
            >
              Try again
            </Button>
          </div>
        </div>
      </JourneyPhotosStep>
    );
  }

  // ---------------------------------------------------------------------------
  // Mutation state
  // ---------------------------------------------------------------------------

  const isSaving =
    attachAsset.isPending ||
    removeAsset.isPending;

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <JourneyPhotosStep>
      <div className="space-y-6">
        <JourneyPhotosForm
          key={formKey}
          initialValue={formValue}
          assets={assets}
          disabled={isSaving}
          onChange={handlePhotosChange}
          onSubmit={handlePhotosSubmit}
          onUpload={handleOpenUpload}
        />

        {/* ----------------------------------------------------------------- */}
        {/* Workflow error                                                     */}
        {/* ----------------------------------------------------------------- */}

        {saveError && (
          <div
            role="alert"
            className={[
              'rounded-[var(--radius-md)]',
              'border',
              'border-[var(--danger)]',
              'bg-[var(--surface)]',
              'px-4',
              'py-3',
            ].join(' ')}
          >
            <p className="text-sm text-[var(--danger)]">
              {saveError}
            </p>
          </div>
        )}

        {/* ----------------------------------------------------------------- */}
        {/* Navigation                                                         */}
        {/* ----------------------------------------------------------------- */}

        <div
          className={[
            'flex',
            'flex-col-reverse',
            'gap-3',
            'border-t',
            'border-[var(--border)]',
            'pt-5',
            'sm:flex-row',
            'sm:items-center',
            'sm:justify-between',
          ].join(' ')}
        >
          <Button
            type="button"
            variant="ghost"
            disabled={isSaving}
            onClick={handleBack}
          >
            Back
          </Button>

          <Button
            type="button"
            loading={isSaving}
            onClick={handleContinue}
          >
            Save and continue
          </Button>
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* Asset Upload                                                         */}
      {/* ------------------------------------------------------------------- */}
      {/*
       * AssetUploadDialog owns the physical file upload.
       *
       * Once the Asset exists, handleUploaded() attaches that existing Asset
       * to the Journey through the Journey Asset mutation.
       */}

      <AssetUploadDialog
        open={uploadOpen}
        onOpenChange={setUploadOpen}
        category={UPLOAD_ASSET_CATEGORY}
        type={UPLOAD_ASSET_TYPE}
        accept={UPLOAD_ACCEPT}
        title="Upload Journey photo"
        description="Choose a photo to add to this Journey."
        onUploaded={handleUploaded}
      />
    </JourneyPhotosStep>
  );
}