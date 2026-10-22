'use client';

import type { HTMLAttributes } from 'react';
import { RotateCcw, SlidersHorizontal } from 'lucide-react';

import { cn } from '@/foundation/utils/cn';
import type { AssetFiltersModel } from '@/features/admin/assets/models';
import {
  AssetCategory,
  AssetStatus,
  AssetStorageProvider,
  AssetType,
  AssetVisibility,
} from '@/features/admin/assets/models';

export interface AssetFiltersProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  readonly value: AssetFiltersModel;
  readonly onChange: <K extends keyof AssetFiltersModel>(
    key: K,
    value: AssetFiltersModel[K],
  ) => void;
  readonly onReset: () => void;
  readonly disabled?: boolean;
}

const SELECT_CLASS = cn(
  'h-10 w-full min-w-0 rounded-lg border px-3 text-sm',
  'border-[var(--border)] bg-[var(--background)]',
  'text-[var(--foreground)] outline-none',
  'focus:border-[var(--brand)] focus:ring-2',
  'focus:ring-[var(--brand-soft)] disabled:cursor-not-allowed',
  'disabled:opacity-60',
);

const TYPE_LABELS: Record<AssetType, string> = {
  [AssetType.IMAGE]: 'Image',
  [AssetType.VIDEO]: 'Video',
  [AssetType.AUDIO]: 'Audio',
  [AssetType.DOCUMENT]: 'Document',
  [AssetType.OTHER]: 'Other',
};

const CATEGORY_LABELS: Record<AssetCategory, string> = {
  [AssetCategory.PROFILE_PHOTO]: 'Profile photo',
  [AssetCategory.COVER_PHOTO]: 'Cover photo',
  [AssetCategory.AVATAR]: 'Avatar',
  [AssetCategory.GOVERNMENT_ID]: 'Government ID',
  [AssetCategory.DRIVER_LICENSE]: 'Driver license',
  [AssetCategory.PASSPORT]: 'Passport',
  [AssetCategory.SELFIE]: 'Selfie',
  [AssetCategory.VEHICLE_PHOTO]: 'Vehicle photo',
  [AssetCategory.CHAT_ATTACHMENT]: 'Chat attachment',
  [AssetCategory.OTHER]: 'Other',
};

const STATUS_LABELS: Record<AssetStatus, string> = {
  [AssetStatus.UPLOADING]: 'Uploading',
  [AssetStatus.UPLOADED]: 'Uploaded',
  [AssetStatus.READY]: 'Ready',
  [AssetStatus.ARCHIVED]: 'Archived',
  [AssetStatus.DELETED]: 'Deleted',
};

const VISIBILITY_LABELS: Record<AssetVisibility, string> = {
  [AssetVisibility.PUBLIC]: 'Public',
  [AssetVisibility.PRIVATE]: 'Private',
};

const STORAGE_LABELS: Record<AssetStorageProvider, string> = {
  [AssetStorageProvider.LOCAL]: 'Local',
  [AssetStorageProvider.AWS_S3]: 'AWS S3',
  [AssetStorageProvider.GOOGLE_CLOUD_STORAGE]: 'Google Cloud Storage',
  [AssetStorageProvider.AZURE_BLOB]: 'Azure Blob',
  [AssetStorageProvider.CLOUDINARY]: 'Cloudinary',
  [AssetStorageProvider.BUNNY]: 'Bunny',
  [AssetStorageProvider.OTHER]: 'Other',
};

function FilterSelect<T extends string>({
  id,
  label,
  value,
  options,
  disabled,
  onChange,
}: {
  readonly id: string;
  readonly label: string;
  readonly value: T | '';
  readonly options: Record<T, string>;
  readonly disabled: boolean;
  readonly onChange: (value: T | '') => void;
}) {
  return (
    <div className="min-w-0 space-y-1.5">
      <label
        htmlFor={id}
        className="text-xs font-medium text-[var(--muted-foreground)]"
      >
        {label}
      </label>

      <select
        id={id}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value as T | '')}
        className={SELECT_CLASS}
      >
        <option value="">All {label.toLowerCase()}s</option>

      {(Object.entries(options) as [string, string][]).map(
  ([optionValue, optionLabel]) => (
    <option key={optionValue} value={optionValue}>
      {optionLabel}
    </option>
  ),
)}
      </select>
    </div>
  );
}

export function AssetFilters({
  value,
  onChange,
  onReset,
  disabled = false,
  className,
  ...props
}: AssetFiltersProps) {
  const hasActiveFilters =
    value.search.trim().length > 0 ||
    value.type !== '' ||
    value.category !== '' ||
    value.status !== '' ||
    value.visibility !== '' ||
    value.storageProvider !== '';

  return (
    <section
      {...props}
      aria-label="Filter assets"
      className={cn(
        'rounded-xl border border-[var(--border)]',
        'bg-[var(--background)] p-4 sm:p-5',
        className,
      )}
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <SlidersHorizontal
            aria-hidden="true"
            className="size-4 text-[var(--brand)]"
          />

          <h3 className="text-sm font-semibold text-[var(--foreground)]">
            Filters
          </h3>
        </div>

        <button
          type="button"
          onClick={onReset}
          disabled={disabled || !hasActiveFilters}
          className={cn(
            'inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5',
            'text-xs font-medium text-[var(--muted-foreground)]',
            'transition-colors hover:bg-[var(--muted)]',
            'hover:text-[var(--foreground)]',
            'focus-visible:outline-none focus-visible:ring-2',
            'focus-visible:ring-[var(--brand)]',
            'disabled:cursor-not-allowed disabled:opacity-50',
          )}
        >
          <RotateCcw aria-hidden="true" className="size-3.5" />
          Reset filters
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <FilterSelect
          id="asset-filter-type"
          label="Type"
          value={value.type}
          options={TYPE_LABELS}
          disabled={disabled}
          onChange={(next) => onChange('type', next)}
        />

        <FilterSelect
          id="asset-filter-category"
          label="Category"
          value={value.category}
          options={CATEGORY_LABELS}
          disabled={disabled}
          onChange={(next) => onChange('category', next)}
        />

        <FilterSelect
          id="asset-filter-status"
          label="Status"
          value={value.status}
          options={STATUS_LABELS}
          disabled={disabled}
          onChange={(next) => onChange('status', next)}
        />

        <FilterSelect
          id="asset-filter-visibility"
          label="Visibility"
          value={value.visibility}
          options={VISIBILITY_LABELS}
          disabled={disabled}
          onChange={(next) => onChange('visibility', next)}
        />

        <FilterSelect
          id="asset-filter-storage"
          label="Storage provider"
          value={value.storageProvider}
          options={STORAGE_LABELS}
          disabled={disabled}
          onChange={(next) => onChange('storageProvider', next)}
        />
      </div>
    </section>
  );
}

export default AssetFilters;
