
import {
  CalendarDays,
  File,
  Fingerprint,
  HardDrive,
  Image as ImageIcon,
  Languages,
} from 'lucide-react';

import type { AssetModel } from '@/features/admin/assets/models';
import { cn } from '@/foundation/utils/cn';

export interface AssetMetadataPanelProps {
  readonly asset: AssetModel;
  readonly className?: string;
}

function formatBytes(bytes?: number | null): string {
  if (bytes == null || !Number.isFinite(bytes) || bytes < 0) {
    return 'Not available';
  }

  if (bytes === 0) {
    return '0 B';
  }

  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const index = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1,
  );

  return `${(bytes / 1024 ** index).toLocaleString(undefined, {
    maximumFractionDigits: index === 0 ? 0 : 2,
  })} ${units[index]}`;
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

function MetadataItem({
  label,
  value,
  icon: Icon,
  breakAll = false,
}: {
  readonly label: string;
  readonly value: string;
  readonly icon: typeof File;
  readonly breakAll?: boolean;
}) {
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

export function AssetMetadataPanel({
  asset,
  className,
}: AssetMetadataPanelProps) {
  const metadata = [
    {
      label: 'Original filename',
      value: asset.originalFilename?.trim() || 'Untitled asset',
      icon: File,
      breakAll: true,
    },
    {
      label: 'Asset public ID',
      value: asset.publicId || 'Not available',
      icon: Fingerprint,
      breakAll: true,
    },
    {
      label: 'Asset type',
      value: asset.type,
      icon: ImageIcon,
    },
    {
      label: 'Category',
      value: asset.category.replaceAll('_', ' '),
      icon: File,
    },
    {
      label: 'MIME type',
      value: asset.mimeType || 'Not available',
      icon: Languages,
      breakAll: true,
    },
    {
      label: 'File size',
      value: formatBytes(asset.sizeBytes),
      icon: HardDrive,
    },
    {
      label: 'Created at',
      value: formatDate(asset.createdAt),
      icon: CalendarDays,
    },
    {
      label: 'Last updated',
      value: formatDate(asset.updatedAt),
      icon: CalendarDays,
    },
  ];

  return (
    <section
      aria-labelledby="asset-metadata-title"
      className={cn(
        'min-w-0 rounded-2xl border border-[var(--border)]',
        'bg-[var(--background)]',
        className,
      )}
    >
      <div className="border-b border-[var(--border)] px-5 py-4">
        <h2
          id="asset-metadata-title"
          className="text-base font-semibold text-[var(--foreground)]"
        >
          Asset metadata
        </h2>

        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
          File properties and identification details
        </p>
      </div>

      <div className="grid min-w-0 gap-x-8 px-5 sm:grid-cols-2">
        {metadata.map((item) => (
          <MetadataItem key={item.label} {...item} />
        ))}
      </div>
    </section>
  );
}

export default AssetMetadataPanel;
