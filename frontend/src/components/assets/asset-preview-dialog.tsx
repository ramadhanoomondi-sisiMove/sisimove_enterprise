// -----------------------------------------------------------------------------
// sisiMove — Asset Preview Dialog
// -----------------------------------------------------------------------------
//
// Reusable dialog for viewing an authenticated Asset.
//
// Responsibilities:
// - Present Asset metadata
// - Present the Asset lifecycle state
// - Present visibility information
// - Provide optional management actions
// - Remain independent of higher-level business workflows
//
// The authenticated Asset model intentionally does not contain a URL.
// Therefore this component does not invent or construct a private Asset URL.
// Public Asset delivery is a separate boundary.
//
// -----------------------------------------------------------------------------

'use client';

import {
  Badge,
  Button,
  Dialog,
  type BadgeVariant,
} from '@/components/ui';

import type { Asset } from '@/features/assets';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface AssetPreviewDialogProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly asset: Asset | null;

  /**
   * Higher-level workflow may provide replacement orchestration.
   */
  readonly onReplace?: (asset: Asset) => void;

  /**
   * Higher-level workflow may provide archive orchestration.
   */
  readonly onArchive?: (asset: Asset) => void;

  /**
   * Higher-level workflow may provide deletion orchestration.
   */
  readonly onDelete?: (asset: Asset) => void;
}

// -----------------------------------------------------------------------------
// Formatting
// -----------------------------------------------------------------------------

function formatFileSize(sizeBytes: number): string {
  if (sizeBytes < 1024) {
    return `${sizeBytes} B`;
  }

  if (sizeBytes < 1024 * 1024) {
    return `${(sizeBytes / 1024).toFixed(1)} KB`;
  }

  if (sizeBytes < 1024 * 1024 * 1024) {
    return `${(sizeBytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  return `${(sizeBytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

function formatDate(value: string | null): string {
  if (!value) {
    return '—';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '—';
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

function formatLabel(value: string): string {
  return value
    .toLowerCase()
    .split('_')
    .map(
      (part) =>
        part.charAt(0).toUpperCase() + part.slice(1),
    )
    .join(' ');
}

function getStatusVariant(status: string): BadgeVariant {
  switch (status) {
    case 'READY':
      return 'success';

    case 'UPLOADING':
    case 'UPLOADED':
      return 'warning';

    case 'DELETED':
      return 'danger';

    case 'ARCHIVED':
      return 'default';

    default:
      return 'default';
  }
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function AssetPreviewDialog({
  open,
  onOpenChange,
  asset,
  onReplace,
  onArchive,
  onDelete,
}: AssetPreviewDialogProps) {
  if (!asset) {
    return (
      <Dialog
        open={false}
        onOpenChange={onOpenChange}
        title="Asset"
      >
        {null}
      </Dialog>
    );
  }

  const canReplace =
    asset.status !== 'DELETED' &&
    asset.status !== 'ARCHIVED' &&
    Boolean(onReplace);

  const canArchive =
    asset.status === 'READY' &&
    Boolean(onArchive);

  const canDelete =
    asset.status !== 'DELETED' &&
    Boolean(onDelete);

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={asset.originalFilename ?? 'Asset'}
      description="Asset details and management options."
      size="md"
      footer={
        <>
          {onDelete && canDelete && (
            <Button
              variant="danger"
              size="sm"
              onClick={() => onDelete(asset)}
            >
              Delete
            </Button>
          )}

          {onArchive && canArchive && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onArchive(asset)}
            >
              Archive
            </Button>
          )}

          {onReplace && canReplace && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onReplace(asset)}
            >
              Replace
            </Button>
          )}

          <Button
            variant="primary"
            size="sm"
            onClick={() => onOpenChange(false)}
          >
            Done
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-5">
        {/* ----------------------------------------------------------------- */}
        {/* Preview boundary                                                  */}
        {/* ----------------------------------------------------------------- */}

        <div
          className={[
            'rounded-[var(--radius-lg)]',
            'border',
            'border-[var(--border-subtle)]',
            'bg-[var(--background-subtle)]',
            'px-4',
            'py-4',
          ].join(' ')}
        >
          <p className="text-sm font-medium text-[var(--foreground)]">
            Asset metadata
          </p>

          <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
            Private asset content is not exposed by the authenticated
            metadata endpoint.
          </p>
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* Status                                                             */}
        {/* ----------------------------------------------------------------- */}

        <div className="flex items-center justify-between gap-4">
          <span className="text-sm text-[var(--foreground-secondary)]">
            Status
          </span>

          <Badge
            variant={getStatusVariant(asset.status)}
            size="sm"
          >
            {formatLabel(asset.status)}
          </Badge>
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* Metadata                                                           */}
        {/* ----------------------------------------------------------------- */}

        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-medium text-[var(--foreground-muted)]">
              Type
            </dt>

            <dd className="mt-1 text-sm text-[var(--foreground)]">
              {formatLabel(asset.type)}
            </dd>
          </div>

          <div>
            <dt className="text-xs font-medium text-[var(--foreground-muted)]">
              Category
            </dt>

            <dd className="mt-1 text-sm text-[var(--foreground)]">
              {formatLabel(asset.category)}
            </dd>
          </div>

          <div>
            <dt className="text-xs font-medium text-[var(--foreground-muted)]">
              File size
            </dt>

            <dd className="mt-1 text-sm text-[var(--foreground)]">
              {formatFileSize(asset.sizeBytes)}
            </dd>
          </div>

          <div>
            <dt className="text-xs font-medium text-[var(--foreground-muted)]">
              Visibility
            </dt>

            <dd className="mt-1 text-sm text-[var(--foreground)]">
              {formatLabel(asset.visibility)}
            </dd>
          </div>

          <div>
            <dt className="text-xs font-medium text-[var(--foreground-muted)]">
              MIME type
            </dt>

            <dd className="mt-1 break-all text-sm text-[var(--foreground)]">
              {asset.mimeType}
            </dd>
          </div>

          <div>
            <dt className="text-xs font-medium text-[var(--foreground-muted)]">
              Uploaded
            </dt>

            <dd className="mt-1 text-sm text-[var(--foreground)]">
              {formatDate(asset.uploadedAt)}
            </dd>
          </div>

          <div>
            <dt className="text-xs font-medium text-[var(--foreground-muted)]">
              Created
            </dt>

            <dd className="mt-1 text-sm text-[var(--foreground)]">
              {formatDate(asset.createdAt)}
            </dd>
          </div>

          {asset.archivedAt && (
            <div>
              <dt className="text-xs font-medium text-[var(--foreground-muted)]">
                Archived
              </dt>

              <dd className="mt-1 text-sm text-[var(--foreground)]">
                {formatDate(asset.archivedAt)}
              </dd>
            </div>
          )}

          {asset.deletedAt && (
            <div>
              <dt className="text-xs font-medium text-[var(--foreground-muted)]">
                Deleted
              </dt>

              <dd className="mt-1 text-sm text-[var(--foreground)]">
                {formatDate(asset.deletedAt)}
              </dd>
            </div>
          )}
        </dl>
      </div>
    </Dialog>
  );
}