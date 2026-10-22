
import {
  ExternalLink,
  FileText,
  Link2,
  UserRound,
  CarFront,
  MessageSquare,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/foundation/utils/cn';

export type AssetRelatedRecordType =
  | 'MEMBER'
  | 'VEHICLE'
  | 'JOURNEY'
  | 'MESSAGE'
  | 'OTHER';

export interface AssetRelatedRecord {
  readonly id: string;
  readonly type: AssetRelatedRecordType;
  readonly title: string;
  readonly description?: string;
  readonly href?: string;
}

export interface AssetRelatedRecordsPanelProps {
  readonly records?: readonly AssetRelatedRecord[];
  readonly isLoading?: boolean;
  readonly className?: string;
  readonly onOpenRecord?: (record: AssetRelatedRecord) => void;
}

const RECORD_ICONS = {
  MEMBER: UserRound,
  VEHICLE: CarFront,
  JOURNEY: Link2,
  MESSAGE: MessageSquare,
  OTHER: FileText,
} as const;

function formatRecordType(type: AssetRelatedRecordType): string {
  return type.charAt(0) + type.slice(1).toLowerCase();
}

export function AssetRelatedRecordsPanel({
  records = [],
  isLoading = false,
  className,
  onOpenRecord,
}: AssetRelatedRecordsPanelProps) {
  return (
    <section
      aria-labelledby="asset-related-records-title"
      aria-busy={isLoading}
      className={cn(
        'min-w-0 rounded-2xl border border-[var(--border)]',
        'bg-[var(--background)]',
        className,
      )}
    >
      <div className="border-b border-[var(--border)] px-5 py-4">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h2
              id="asset-related-records-title"
              className="text-base font-semibold text-[var(--foreground)]"
            >
              Related records
            </h2>

            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              Records associated with this asset
            </p>
          </div>

          {!isLoading && (
            <span className="shrink-0 rounded-full border border-[var(--border)] px-2.5 py-1 text-xs font-medium text-[var(--muted-foreground)]">
              {records.length}
            </span>
          )}
        </div>
      </div>

      <div className="p-5">
        {isLoading ? (
          <div
            role="status"
            className="space-y-3"
          >
            <span className="sr-only">Loading related records</span>

            {Array.from({ length: 3 }, (_, index) => (
              <div
                key={index}
                className="flex animate-pulse items-center gap-3"
              >
                <div className="size-10 rounded-xl bg-[var(--background-muted)]" />

                <div className="min-w-0 flex-1 space-y-2">
                  <div className="h-3 w-2/5 rounded bg-[var(--background-muted)]" />
                  <div className="h-3 w-3/5 rounded bg-[var(--background-muted)]" />
                </div>
              </div>
            ))}
          </div>
        ) : records.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[var(--border)] px-4 py-8 text-center">
            <div className="mb-3 flex size-11 items-center justify-center rounded-xl bg-[var(--background-muted)] text-[var(--muted-foreground)]">
              <Link2 aria-hidden="true" className="size-5" />
            </div>

            <p className="text-sm font-medium text-[var(--foreground)]">
              No related records
            </p>

            <p className="mt-1 max-w-sm text-sm leading-6 text-[var(--muted-foreground)]">
              No linked records have been provided for this asset.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-[var(--border)]">
            {records.map((record) => {
              const Icon = RECORD_ICONS[record.type];

              return (
                <li key={record.id} className="py-3 first:pt-0 last:pb-0">
                  <div className="flex min-w-0 items-start gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[var(--background-muted)] text-[var(--muted-foreground)]">
                      <Icon aria-hidden="true" className="size-5" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="break-words text-sm font-medium text-[var(--foreground)]">
                        {record.title}
                      </p>

                      <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                        {formatRecordType(record.type)}
                      </p>

                      {record.description && (
                        <p className="mt-1 break-words text-sm leading-5 text-[var(--muted-foreground)]">
                          {record.description}
                        </p>
                      )}
                    </div>

                    {onOpenRecord && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        aria-label={`Open ${record.title}`}
                        leadingIcon={
                          <ExternalLink
                            aria-hidden="true"
                            className="size-4"
                          />
                        }
                        onClick={() => onOpenRecord(record)}
                      >
                        Open
                      </Button>
                    )}

                    {!onOpenRecord && record.href && (
                      <a
                        href={record.href}
                        aria-label={`Open ${record.title}`}
                        className="inline-flex min-h-9 shrink-0 items-center gap-2 rounded-[var(--radius-md)] px-3 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--background-subtle)] focus-visible:outline-2 focus-visible:outline-[var(--brand)] focus-visible:outline-offset-2"
                      >
                        <ExternalLink
                          aria-hidden="true"
                          className="size-4"
                        />
                        Open
                      </a>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}

export default AssetRelatedRecordsPanel;
