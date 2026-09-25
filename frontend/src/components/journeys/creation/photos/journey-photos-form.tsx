// -----------------------------------------------------------------------------
// sisiMove — Journey Photos Form
// -----------------------------------------------------------------------------
//
// Presentation form for configuring the Assets attached to a Journey.
//
// Architectural boundary:
//
// - Assets already exist in the Assets domain.
// - This form does NOT upload Assets.
// - This form does NOT create Asset records.
// - This form does NOT call the Journey API.
// - This form does NOT delete Assets.
// - This form does NOT own JourneyAsset persistence.
// - The route/workflow owns upload, attachment, removal, and navigation.
//
// The form represents the Journey-side configuration:
//
//     assetPublicId
//     type
//     sortOrder
//
// The parent workflow can therefore:
//
//     AssetUploadDialog
//          │
//          ▼
//       Asset
//          │
//          ▼
//   useAttachJourneyAsset()
//          │
//          ▼
//     Journey aggregate
//
// -----------------------------------------------------------------------------
// sisiMove — Journey Photos Form
// -----------------------------------------------------------------------------

'use client';

import type { FormEvent } from 'react';
import { useMemo, useState } from 'react';

import {
  JOURNEY_ASSET_TYPES,
} from '@/features/journey/models';

import type {
  JourneyAssetType,
} from '@/features/journey/models';

import type {
  Asset,
} from '@/features/assets';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

/**
 * Journey-side Asset configuration represented by the form.
 *
 * `assetPublicId` references an existing Asset owned by the Assets domain.
 */
export interface JourneyPhotosFormValue {
  /**
   * Public identifier of the existing Asset.
   */
  assetPublicId: string;

  /**
   * Semantic role of the Asset within the Journey.
   */
  type: JourneyAssetType;

  /**
   * Display ordering within the Journey's Assets.
   */
  sortOrder: number;
}

/**
 * Value emitted when the form changes.
 */
export type JourneyPhotosFormSubmitValue =
  readonly JourneyPhotosFormValue[];

/**
 * Initial value supplied by the route/workflow.
 */
export type JourneyPhotosFormInitialValue =
  readonly JourneyPhotosFormValue[];

/**
 * Presentation props for the Journey Photos form.
 */
export interface JourneyPhotosFormProps {
  /**
   * Existing Journey Asset configuration.
   *
   * This value is used to initialise the form.
   */
  initialValue?: JourneyPhotosFormInitialValue;

  /**
   * Existing Assets available to the authenticated user.
   *
   * These are Asset-domain resources and are not created by this form.
   */
  assets?: readonly Asset[];

  /**
   * Disables the form while the parent workflow is performing persistence.
   */
  disabled?: boolean;

  /**
   * Called whenever the local Journey Asset configuration changes.
   */
  onChange?: (
    value: JourneyPhotosFormSubmitValue,
  ) => void;

  /**
   * Called when the native form is submitted.
   */
  onSubmit?: (
    value: JourneyPhotosFormSubmitValue,
  ) => void | Promise<void>;

  /**
   * Requests that the parent workflow open its Asset upload flow.
   *
   * The upload itself remains outside this form.
   */
  onUpload?: () => void;
}

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const DEFAULT_ASSET_TYPE: JourneyAssetType = 'VEHICLE';

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function formatLabel(value: string): string {
  return value
    .replaceAll('_', ' ')
    .toLowerCase()
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

/**
 * Only Assets suitable for the Journey Photos workflow are presented.
 *
 * The Asset domain owns the canonical type/status values. The Journey Photos
 * form therefore treats these values as read-model strings and does not
 * attempt to mutate or validate the Asset lifecycle.
 */
function isSelectablePhotoAsset(
  asset: Asset,
): boolean {
  return (
    asset.type === 'IMAGE' &&
    asset.status !== 'DELETED' &&
    asset.status !== 'ARCHIVED'
  );
}

/**
 * Creates a stable local representation from the supplied initial value.
 *
 * The form does not generate domain identifiers. `assetPublicId` is always
 * supplied by the existing Asset record.
 */
function normalizeInitialValue(
  value: JourneyPhotosFormInitialValue | undefined,
): JourneyPhotosFormValue[] {
  return (value ?? []).map(
    (item, index) => ({
      assetPublicId: item.assetPublicId,
      type: item.type,
      sortOrder: item.sortOrder ?? index,
    }),
  );
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyPhotosForm({
  initialValue,
  assets = [],
  disabled = false,
  onChange,
  onSubmit,
  onUpload,
}: JourneyPhotosFormProps) {
  const [
    photos,
    setPhotos,
  ] = useState<JourneyPhotosFormValue[]>(
    () => normalizeInitialValue(initialValue),
  );

  const selectableAssets = useMemo(
    () =>
      assets.filter(isSelectablePhotoAsset),
    [assets],
  );

  const attachedAssetIds = useMemo(
    () =>
      new Set(
        photos.map(
          (photo) => photo.assetPublicId,
        ),
      ),
    [photos],
  );

  function emitChange(
    nextPhotos: JourneyPhotosFormValue[],
  ) {
    onChange?.(nextPhotos);
  }

  function updatePhotos(
    nextPhotos: JourneyPhotosFormValue[],
  ) {
    setPhotos(nextPhotos);
    emitChange(nextPhotos);
  }

  // ---------------------------------------------------------------------------
  // Add existing Asset
  // ---------------------------------------------------------------------------

  function handleAddAsset(
    assetPublicId: string,
  ) {
    if (
      disabled ||
      !assetPublicId ||
      attachedAssetIds.has(assetPublicId)
    ) {
      return;
    }

    const nextPhoto: JourneyPhotosFormValue = {
      assetPublicId,
      type: DEFAULT_ASSET_TYPE,
      sortOrder: photos.length,
    };

    updatePhotos([
      ...photos,
      nextPhoto,
    ]);
  }

  // ---------------------------------------------------------------------------
  // Remove from local Journey configuration
  // ---------------------------------------------------------------------------

  function handleRemoveAsset(
    assetPublicId: string,
  ) {
    if (disabled) {
      return;
    }

    const remaining = photos
      .filter(
        (photo) =>
          photo.assetPublicId !== assetPublicId,
      )
      .map(
        (photo, index) => ({
          ...photo,
          sortOrder: index,
        }),
      );

    updatePhotos(remaining);
  }

  // ---------------------------------------------------------------------------
  // Change Journey Asset type
  // ---------------------------------------------------------------------------

  function handleTypeChange(
    assetPublicId: string,
    type: JourneyAssetType,
  ) {
    if (disabled) {
      return;
    }

    const nextPhotos = photos.map(
      (photo) =>
        photo.assetPublicId === assetPublicId
          ? {
              ...photo,
              type,
            }
          : photo,
    );

    updatePhotos(nextPhotos);
  }

  // ---------------------------------------------------------------------------
  // Move Asset
  // ---------------------------------------------------------------------------

  function handleMove(
    assetPublicId: string,
    direction: 'up' | 'down',
  ) {
    if (disabled) {
      return;
    }

    const currentIndex = photos.findIndex(
      (photo) =>
        photo.assetPublicId === assetPublicId,
    );

    if (currentIndex < 0) {
      return;
    }

    const targetIndex =
      direction === 'up'
        ? currentIndex - 1
        : currentIndex + 1;

    if (
      targetIndex < 0 ||
      targetIndex >= photos.length
    ) {
      return;
    }

    const nextPhotos = [...photos];

    const [
      current,
    ] = nextPhotos.splice(
      currentIndex,
      1,
    );

    nextPhotos.splice(
      targetIndex,
      0,
      current,
    );

    updatePhotos(
      nextPhotos.map(
        (photo, index) => ({
          ...photo,
          sortOrder: index,
        }),
      ),
    );
  }

  // ---------------------------------------------------------------------------
  // Submit
  // ---------------------------------------------------------------------------

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    await onSubmit?.(
      photos.map(
        (photo, index) => ({
          ...photo,
          sortOrder: index,
        }),
      ),
    );
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <form
      id="journey-photos-form"
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {/* ------------------------------------------------------------------- */}
      {/* Asset actions                                                        */}
      {/* ------------------------------------------------------------------- */}

      <div
        className={[
          'flex',
          'flex-col',
          'gap-3',
          'rounded-[var(--radius-lg)]',
          'border',
          'border-[var(--border)]',
          'bg-[var(--surface)]',
          'p-4',
          'sm:flex-row',
          'sm:items-center',
          'sm:justify-between',
        ].join(' ')}
      >
        <div>
          <p className="text-sm font-medium text-[var(--foreground)]">
            Add Journey photos
          </p>

          <p className="mt-1 text-sm leading-6 text-[var(--foreground-secondary)]">
            Choose an existing photo or upload a new Asset.
          </p>
        </div>

        {onUpload && (
          <button
            type="button"
            disabled={disabled}
            onClick={onUpload}
            className={[
              'inline-flex',
              'items-center',
              'justify-center',
              'rounded-[var(--radius-md)]',
              'border',
              'border-[var(--brand)]',
              'bg-[var(--surface)]',
              'px-4',
              'py-2.5',
              'text-sm',
              'font-medium',
              'text-[var(--brand)]',
              'transition-colors',
              'hover:bg-[var(--brand-soft)]',
              'focus:outline-none',
              'focus:ring-2',
              'focus:ring-[var(--brand)]/20',
              'disabled:cursor-not-allowed',
              'disabled:opacity-60',
            ].join(' ')}
          >
            Upload photo
          </button>
        )}
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* Existing Asset selector                                              */}
      {/* ------------------------------------------------------------------- */}

      <div className="space-y-2">
        <label
          htmlFor="journey-photos-asset"
          className="block text-sm font-medium text-[var(--foreground)]"
        >
          Existing photo
        </label>

        <p className="text-sm leading-6 text-[var(--foreground-secondary)]">
          Select a photo that already exists in your sisiMove Assets.
        </p>

        <select
          id="journey-photos-asset"
          value=""
          disabled={
            disabled ||
            selectableAssets.length === 0
          }
          onChange={(event) =>
            handleAddAsset(
              event.target.value,
            )
          }
          className={[
            'w-full',
            'rounded-[var(--radius-md)]',
            'border',
            'border-[var(--border)]',
            'bg-[var(--surface)]',
            'px-3',
            'py-2.5',
            'text-sm',
            'text-[var(--foreground)]',
            'shadow-[var(--shadow-sm)]',
            'outline-none',
            'transition',
            'focus:border-[var(--brand)]',
            'focus:ring-2',
            'focus:ring-[var(--brand)]/20',
            'disabled:cursor-not-allowed',
            'disabled:opacity-60',
          ].join(' ')}
        >
          <option value="">
            {selectableAssets.length === 0
              ? 'No existing photos available'
              : 'Select a photo'}
          </option>

          {selectableAssets.map(
            (asset) => (
              <option
                key={asset.publicId}
                value={asset.publicId}
                disabled={attachedAssetIds.has(
                  asset.publicId,
                )}
              >
                {asset.originalFilename ??
                  'Unnamed photo'}
                {' — '}
                {formatLabel(
                  asset.category,
                )}
              </option>
            ),
          )}
        </select>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* Selected photos                                                      */}
      {/* ------------------------------------------------------------------- */}

      <div className="space-y-3">
        <div>
          <h3 className="text-sm font-medium text-[var(--foreground)]">
            Selected photos
          </h3>

          <p className="mt-1 text-sm leading-6 text-[var(--foreground-secondary)]">
            Set how each Asset is used within this Journey and its display
            order.
          </p>
        </div>

        {photos.length === 0 ? (
          <div
            className={[
              'rounded-[var(--radius-lg)]',
              'border',
              'border-dashed',
              'border-[var(--border-strong)]',
              'bg-[var(--background-subtle)]',
              'px-5',
              'py-8',
              'text-center',
            ].join(' ')}
          >
            <p className="text-sm font-medium text-[var(--foreground)]">
              No photos selected
            </p>

            <p className="mt-1 text-sm text-[var(--foreground-muted)]">
              Add an existing photo or upload a new one.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {photos.map(
              (photo, index) => {
                const asset =
                  assets.find(
                    (item) =>
                      item.publicId ===
                      photo.assetPublicId,
                  );

                return (
                  <div
                    key={photo.assetPublicId}
                    className={[
                      'rounded-[var(--radius-lg)]',
                      'border',
                      'border-[var(--border)]',
                      'bg-[var(--surface)]',
                      'p-4',
                    ].join(' ')}
                  >
                    <div className="flex flex-col gap-4">
                      <div className="flex items-start gap-3">
                        <div
                          className={[
                            'flex',
                            'h-10',
                            'w-10',
                            'shrink-0',
                            'items-center',
                            'justify-center',
                            'rounded-[var(--radius-md)]',
                            'bg-[var(--brand-soft)]',
                            'text-sm',
                            'font-semibold',
                            'text-[var(--brand)]',
                          ].join(' ')}
                        >
                          {index + 1}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-[var(--foreground)]">
                            {asset?.originalFilename ??
                              'Selected photo'}
                          </p>

                          <p className="mt-1 text-xs text-[var(--foreground-muted)]">
                            {asset
                              ? formatLabel(
                                  asset.category,
                                )
                              : photo.assetPublicId}
                          </p>
                        </div>

                        <button
                          type="button"
                          disabled={disabled}
                          onClick={() =>
                            handleRemoveAsset(
                              photo.assetPublicId,
                            )
                          }
                          className={[
                            'shrink-0',
                            'rounded-[var(--radius-md)]',
                            'px-2.5',
                            'py-2',
                            'text-sm',
                            'font-medium',
                            'text-[var(--danger)]',
                            'transition-colors',
                            'hover:bg-[var(--danger-soft)]',
                            'focus:outline-none',
                            'focus:ring-2',
                            'focus:ring-[var(--danger)]/20',
                            'disabled:cursor-not-allowed',
                            'disabled:opacity-60',
                          ].join(' ')}
                        >
                          Remove
                        </button>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        {/* ------------------------------------------------- */}
                        {/* Journey Asset type                                */}
                        {/* ------------------------------------------------- */}

                        <div className="space-y-2">
                          <label
                            htmlFor={`journey-photo-type-${photo.assetPublicId}`}
                            className="block text-sm font-medium text-[var(--foreground)]"
                          >
                            Photo role
                          </label>

                          <select
                            id={`journey-photo-type-${photo.assetPublicId}`}
                            value={photo.type}
                            disabled={disabled}
                            onChange={(event) =>
                              handleTypeChange(
                                photo.assetPublicId,
                                event.target
                                  .value as JourneyAssetType,
                              )
                            }
                            className={[
                              'w-full',
                              'rounded-[var(--radius-md)]',
                              'border',
                              'border-[var(--border)]',
                              'bg-[var(--surface)]',
                              'px-3',
                              'py-2.5',
                              'text-sm',
                              'text-[var(--foreground)]',
                              'shadow-[var(--shadow-sm)]',
                              'outline-none',
                              'focus:border-[var(--brand)]',
                              'focus:ring-2',
                              'focus:ring-[var(--brand)]/20',
                              'disabled:cursor-not-allowed',
                              'disabled:opacity-60',
                            ].join(' ')}
                          >
                            {JOURNEY_ASSET_TYPES.map(
                              (type) => (
                                <option
                                  key={type}
                                  value={type}
                                >
                                  {formatLabel(type)}
                                </option>
                              ),
                            )}
                          </select>
                        </div>

                        {/* ------------------------------------------------- */}
                        {/* Ordering                                           */}
                        {/* ------------------------------------------------- */}

                        <div className="space-y-2">
                          <span className="block text-sm font-medium text-[var(--foreground)]">
                            Display order
                          </span>

                          <div className="flex gap-2">
                            <button
                              type="button"
                              disabled={
                                disabled ||
                                index === 0
                              }
                              onClick={() =>
                                handleMove(
                                  photo.assetPublicId,
                                  'up',
                                )
                              }
                              className={[
                                'flex-1',
                                'rounded-[var(--radius-md)]',
                                'border',
                                'border-[var(--border)]',
                                'bg-[var(--surface)]',
                                'px-3',
                                'py-2.5',
                                'text-sm',
                                'font-medium',
                                'text-[var(--foreground)]',
                                'transition-colors',
                                'hover:bg-[var(--background-subtle)]',
                                'focus:outline-none',
                                'focus:ring-2',
                                'focus:ring-[var(--brand)]/20',
                                'disabled:cursor-not-allowed',
                                'disabled:opacity-50',
                              ].join(' ')}
                            >
                              Move up
                            </button>

                            <button
                              type="button"
                              disabled={
                                disabled ||
                                index ===
                                  photos.length - 1
                              }
                              onClick={() =>
                                handleMove(
                                  photo.assetPublicId,
                                  'down',
                                )
                              }
                              className={[
                                'flex-1',
                                'rounded-[var(--radius-md)]',
                                'border',
                                'border-[var(--border)]',
                                'bg-[var(--surface)]',
                                'px-3',
                                'py-2.5',
                                'text-sm',
                                'font-medium',
                                'text-[var(--foreground)]',
                                'transition-colors',
                                'hover:bg-[var(--background-subtle)]',
                                'focus:outline-none',
                                'focus:ring-2',
                                'focus:ring-[var(--brand)]/20',
                                'disabled:cursor-not-allowed',
                                'disabled:opacity-50',
                              ].join(' ')}
                            >
                              Move down
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              },
            )}
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* Native submit                                                        */}
      {/* ------------------------------------------------------------------- */}

      <button
        type="submit"
        tabIndex={-1}
        aria-hidden="true"
        className="sr-only"
      >
        Save photos
      </button>
    </form>
  );
}