
'use client';

import {
  CalendarDays,
  Database,
  File,
  Fingerprint,
  HardDrive,
  Image as ImageIcon,
  LockKeyhole,
  UserRound,
} from 'lucide-react';

import { cn } from '@/foundation/utils/cn';
import type { AssetModel } from '@/features/admin/assets/models';

export interface AssetFileInformationProps {
  readonly asset: AssetModel;
  readonly className?: string;
}

interface InformationItem {
  readonly label: string;
  readonly value: string;
  readonly icon: typeof File;
  readonly breakAll?: boolean;
}

function formatBytes(bytes?: number | null): string {
  if (bytes == null || !Number.isFinite(bytes) || bytes < 0) {
    return 'Unknown';
  }

  if (bytes === 0) {
    return '0 B';
  }

  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const unitIndex = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1,
  );

  const value = bytes / 1024 ** unitIndex;

  return `${value.toLocaleString(undefined, {
    maximumFractionDigits: unitIndex === 0 ? 0 : 2,
  })} ${units[unitIndex]}`;
}

function formatDate(value?: Date | string | null): string {
  if (!value) {
    return 'Not available';
  }

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Not available';
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

function formatLabel(value?: string | null): string {
  if (!value) {
    return 'Not specified';
  }

  return value
    .toLowerCase()
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function InformationRow({
  label,
  value,
  icon: Icon,
  breakAll = false,
}: InformationItem) {
  return (
    <div className="flex min-w-0 gap-3 py-3">
      <div
        className={cn(
          'flex size-9 shrink-0 items-center justify-center rounded-lg',
          'bg-[var(--background-muted)] text-[var(--muted-foreground)]',
        )}
      >
        <Icon aria-hidden="true" className="size-4" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-[var(--muted-foreground)]">
          {label}
        </p>

        <p
          className={cn(
            'mt-1 text-sm font-medium text-[var(--foreground)]',
            breakAll ? 'break-all' : 'break-words',
          )}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

export function AssetFileInformation({
  asset,
  className,
}: AssetFileInformationProps) {
  const filename =
    asset.originalFilename?.trim() || 'Untitled asset';

  const fileInformation: InformationItem[] = [
    {
      label: 'File name',
      value: filename,
      icon: File,
    },
    {
      label: 'Asset ID',
      value: asset.publicId,
      icon: Fingerprint,
      breakAll: true,
    },
    {
      label: 'File type',
      value: formatLabel(asset.type),
      icon: ImageIcon,
    },
    {
      label: 'Category',
      value: formatLabel(asset.category),
      icon: File,
    },
    {
      label: 'MIME type',
      value: asset.mimeType || 'Unknown',
      icon: File,
      breakAll: true,
    },
    {
      label: 'File size',
      value: formatBytes(asset.sizeBytes),
      icon: HardDrive,
    },
  ];

  const storageInformation: InformationItem[] = [
    {
      label: 'Storage provider',
      value: formatLabel(asset.storageProvider),
      icon: Database,
    },
    {
      label: 'Bucket',
      value: asset.bucket || 'Not specified',
      icon: HardDrive,
      breakAll: true,
    },
    {
      label: 'Object key',
      value: asset.objectKey || 'Not specified',
      icon: Database,
      breakAll: true,
    },
    {
      label: 'Owner identity ID',
      value: asset.ownerIdentityPublicId || 'Not assigned',
      icon: UserRound,
      breakAll: true,
    },
  ];

  const dateInformation: InformationItem[] = [
    {
      label: 'Created',
      value: formatDate(asset.createdAt),
      icon: CalendarDays,
    },
    {
      label: 'Last updated',
      value: formatDate(asset.updatedAt),
      icon: CalendarDays,
    },
    {
      label: 'Uploaded',
      value: formatDate(asset.uploadedAt),
      icon: CalendarDays,
    },
    {
      label: 'Archived',
      value: formatDate(asset.archivedAt),
      icon: CalendarDays,
    },
    {
      label: 'Deleted',
      value: formatDate(asset.deletedAt),
      icon: CalendarDays,
    },
  ];

  return (
    <section
      aria-labelledby="asset-file-information-title"
      className={cn(
        'min-w-0 rounded-2xl border border-[var(--border)]',
        'bg-[var(--background)]',
        className,
      )}
    >
      <div className="border-b border-[var(--border)] px-5 py-4">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'flex size-10 items-center justify-center rounded-xl',
              'bg-[var(--background-muted)]',
            )}
          >
            <File
              aria-hidden="true"
              className="size-5 text-[var(--foreground)]"
            />
          </div>

          <div className="min-w-0">
            <h2
              id="asset-file-information-title"
              className="text-base font-semibold text-[var(--foreground)]"
            >
              File information
            </h2>

            <p className="mt-0.5 text-sm text-[var(--muted-foreground)]">
              Metadata and storage details
            </p>
          </div>
        </div>
      </div>

      <div className="divide-y divide-[var(--border)] px-5">
        <section aria-labelledby="asset-general-information-title" className="py-4">
          <h3
            id="asset-general-information-title"
            className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]"
          >
            General
          </h3>

          <div className="mt-2 divide-y divide-[var(--border)]">
            {fileInformation.map((item) => (
              <InformationRow key={item.label} {...item} />
            ))}
          </div>
        </section>

        <section aria-labelledby="asset-storage-information-title" className="py-4">
          <h3
            id="asset-storage-information-title"
            className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]"
          >
            Storage and ownership
          </h3>

          <div className="mt-2 divide-y divide-[var(--border)]">
            {storageInformation.map((item) => (
              <InformationRow key={item.label} {...item} />
            ))}
          </div>
        </section>

        <section aria-labelledby="asset-lifecycle-information-title" className="py-4">
          <h3
            id="asset-lifecycle-information-title"
            className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]"
          >
            Lifecycle
          </h3>

          <div className="mt-2 divide-y divide-[var(--border)]">
            <InformationRow
              label="Status"
              value={formatLabel(asset.status)}
              icon={LockKeyhole}
            />

            <InformationRow
              label="Visibility"
              value={formatLabel(asset.visibility)}
              icon={LockKeyhole}
            />

            {dateInformation.map((item) => (
              <InformationRow key={item.label} {...item} />
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}

export default AssetFileInformation;
