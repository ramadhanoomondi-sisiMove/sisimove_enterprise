
import {
  Archive,
  CalendarClock,
  CheckCircle2,
  Clock3,
  FileCheck2,
  Trash2,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import type { AssetModel } from '@/features/admin/assets/models';
import { cn } from '@/foundation/utils/cn';

export interface AssetLifecyclePanelProps {
  readonly asset: AssetModel;
  readonly className?: string;
}

function formatDate(value?: Date | string | null): string {
  if (!value) {
    return 'Not recorded';
  }

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Not recorded';
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

function getLifecycleDescription(status: AssetModel['status']): string {
  switch (status) {
    case 'UPLOADING':
      return 'The asset upload is in progress.';
    case 'UPLOADED':
      return 'The asset has been uploaded.';
    case 'READY':
      return 'The asset is ready for use.';
    case 'ARCHIVED':
      return 'The asset is archived.';
    case 'DELETED':
      return 'The asset is marked as deleted.';
    default:
      return 'Lifecycle information is available below.';
  }
}

function formatStatus(status: string): string {
  return status
    .toLowerCase()
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

const STATUS_VARIANTS = {
  UPLOADING: 'warning',
  UPLOADED: 'default',
  READY: 'success',
  ARCHIVED: 'outline',
  DELETED: 'danger',
} as const;

export function AssetLifecyclePanel({
  asset,
  className,
}: AssetLifecyclePanelProps) {
  const events = [
    {
      label: 'Created',
      value: asset.createdAt,
      icon: Clock3,
    },
    {
      label: 'Uploaded',
      value: asset.uploadedAt,
      icon: FileCheck2,
    },
    {
      label: 'Last updated',
      value: asset.updatedAt,
      icon: CalendarClock,
    },
    {
      label: 'Archived',
      value: asset.archivedAt,
      icon: Archive,
    },
    {
      label: 'Deleted',
      value: asset.deletedAt,
      icon: Trash2,
    },
  ];

  return (
    <section
      aria-labelledby="asset-lifecycle-title"
      className={cn(
        'min-w-0 rounded-2xl border border-[var(--border)]',
        'bg-[var(--background)]',
        className,
      )}
    >
      <div className="border-b border-[var(--border)] px-5 py-4">
        <h2
          id="asset-lifecycle-title"
          className="text-base font-semibold text-[var(--foreground)]"
        >
          Lifecycle
        </h2>

        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
          Current state and recorded timestamps
        </p>
      </div>

      <div className="space-y-5 p-5">
        <div className="flex items-start gap-3">
          <div
            className={cn(
              'flex size-10 shrink-0 items-center justify-center rounded-xl',
              'bg-[var(--background-muted)] text-[var(--muted-foreground)]',
            )}
          >
            <CheckCircle2 aria-hidden="true" className="size-5" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-semibold text-[var(--foreground)]">
                Current status
              </span>

              <Badge variant={STATUS_VARIANTS[asset.status]}>
                {formatStatus(asset.status)}
              </Badge>
            </div>

            <p className="mt-1 text-sm leading-6 text-[var(--muted-foreground)]">
              {getLifecycleDescription(asset.status)}
            </p>
          </div>
        </div>

        <div className="border-t border-[var(--border)]" />

        <div className="space-y-0">
          {events.map(({ label, value, icon: Icon }) => (
            <div
              key={label}
              className="flex items-start gap-3 py-3 first:pt-0 last:pb-0"
            >
              <div className="mt-0.5 text-[var(--muted-foreground)]">
                <Icon aria-hidden="true" className="size-4" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-[var(--foreground)]">
                  {label}
                </p>

                <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                  {formatDate(value)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default AssetLifecyclePanel;
