
import {
  FileAudio,
  FileImage,
  FileQuestion,
  FileText,
  FileVideo,
} from 'lucide-react';
import type { ComponentType, HTMLAttributes, ReactNode } from 'react';

import { cn } from '@/foundation/utils/cn';
import type { AssetType } from '@/features/admin/assets/models';

export type AssetPreviewFallbackReason =
  | 'unsupported'
  | 'unavailable'
  | 'missing';

export interface AssetPreviewFallbackProps
  extends HTMLAttributes<HTMLDivElement> {
  readonly type?: AssetType;
  readonly reason?: AssetPreviewFallbackReason;
  readonly title?: string;
  readonly description?: string;
  readonly actions?: ReactNode;
}

const REASON_CONTENT: Record<
  AssetPreviewFallbackReason,
  { title: string; description: string }
> = {
  unsupported: {
    title: 'Preview unavailable',
    description: 'This file type cannot be previewed here.',
  },
  unavailable: {
    title: 'Preview could not be loaded',
    description:
      'The preview source is unavailable or could not be accessed.',
  },
  missing: {
    title: 'No preview available',
    description: 'There is no preview source available for this asset.',
  },
};

const FILE_ICONS: Record<
  AssetType,
  ComponentType<{ className?: string }>
> = {
  IMAGE: FileImage,
  VIDEO: FileVideo,
  AUDIO: FileAudio,
  DOCUMENT: FileText,
  OTHER: FileQuestion,
};

export function AssetPreviewFallback({
  type,
  reason = 'unsupported',
  title,
  description,
  actions,
  className,
  ...props
}: AssetPreviewFallbackProps) {
  const content = REASON_CONTENT[reason];

  return (
    <div
      {...props}
      className={cn(
        'flex min-h-56 flex-col items-center justify-center',
        'rounded-xl border border-dashed border-[var(--border)]',
        'bg-[var(--background-muted)] px-6 py-10 text-center',
        className,
      )}
    >
      <div
        aria-hidden="true"
        className={cn(
          'mb-4 flex size-14 items-center justify-center rounded-2xl',
          'border border-[var(--border)] bg-[var(--background)]',
          'text-[var(--muted-foreground)]',
        )}
      >
        {type ? (
          <FileTypeIcon type={type} />
        ) : (
          <FileQuestion className="size-7" />
        )}
      </div>

      <h3 className="text-sm font-semibold text-[var(--foreground)]">
        {title ?? content.title}
      </h3>

      <p className="mt-1 max-w-sm text-sm leading-6 text-[var(--muted-foreground)]">
        {description ?? content.description}
      </p>

      {actions && (
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          {actions}
        </div>
      )}
    </div>
  );
}

function FileTypeIcon({ type }: { readonly type: AssetType }) {
  const Icon = FILE_ICONS[type];

  return <Icon aria-hidden="true" className="size-7" />;
}

export default AssetPreviewFallback;
