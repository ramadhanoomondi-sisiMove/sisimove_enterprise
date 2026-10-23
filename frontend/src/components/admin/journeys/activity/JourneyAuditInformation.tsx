
'use client';

import {
  CalendarClock,
  ClipboardList,
  Fingerprint,
  RefreshCw,
  ShieldCheck,
} from 'lucide-react';

import { cn } from '@/foundation/utils/cn';
import type { Journey } from '@/features/admin/journeys/models/journey.model';

interface JourneyAuditInformationProps {
  journey: Journey;
  className?: string;
  timezone?: string;
}

function formatDate(
  value: string | null | undefined,
  timezone?: string,
): string {
  if (!value) return '—';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return 'Invalid date';

  try {
    return new Intl.DateTimeFormat('en-KE', {
      dateStyle: 'medium',
      timeStyle: 'short',
      ...(timezone ? { timeZone: timezone } : {}),
    }).format(date);
  } catch {
    return new Intl.DateTimeFormat('en-KE', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(date);
  }
}

function formatStatus(status: string): string {
  return (
    status
      .trim()
      .replace(/[_-]+/g, ' ')
      .toLowerCase()
      .replace(/\b\w/g, (character) => character.toUpperCase()) ||
    'Unknown'
  );
}

function AuditField({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="min-w-0">
      <dt className="text-xs text-[var(--foreground-muted)]">{label}</dt>
      <dd
        className={cn(
          'mt-1.5 break-words text-sm text-[var(--foreground)]',
          mono && 'font-mono text-xs',
        )}
      >
        {value || '—'}
      </dd>
    </div>
  );
}

function AuditSection({
  title,
  description,
  icon,
  children,
}: {
  title: string;
  description: string;
  icon: 'identity' | 'record' | 'timestamps';
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)]">
      <div className="flex items-start gap-3 border-b border-[var(--border-subtle)] p-4 sm:p-5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--background-subtle)] text-[var(--foreground-secondary)]">
          {icon === 'identity' ? (
            <Fingerprint className="h-5 w-5" aria-hidden="true" />
          ) : icon === 'record' ? (
            <ClipboardList className="h-5 w-5" aria-hidden="true" />
          ) : (
            <CalendarClock className="h-5 w-5" aria-hidden="true" />
          )}
        </div>

        <div>
          <h3 className="text-sm font-semibold text-[var(--foreground)]">
            {title}
          </h3>
          <p className="mt-1 text-sm leading-5 text-[var(--foreground-muted)]">
            {description}
          </p>
        </div>
      </div>

      <dl className="grid grid-cols-1 gap-x-6 gap-y-5 p-4 sm:grid-cols-2 sm:p-5 lg:grid-cols-3">
        {children}
      </dl>
    </section>
  );
}

export function JourneyAuditInformation({
  journey,
  className,
  timezone,
}: JourneyAuditInformationProps) {
  return (
    <section
      aria-label="Journey audit information"
      className={cn('space-y-4', className)}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-[var(--foreground)]">
            Audit information
          </h2>
          <p className="mt-1 text-sm leading-6 text-[var(--foreground-muted)]">
            Inspect journey identifiers, record version, and recorded
            timestamps.
          </p>
        </div>

        <span className="inline-flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs text-[var(--foreground-secondary)]">
          <ShieldCheck className="h-4 w-4" aria-hidden="true" />
          Read-only
        </span>
      </div>

      <AuditSection
        title="Record identity"
        description="Identifiers used to reference this journey and its provider."
        icon="identity"
      >
        <AuditField label="Internal ID" value={journey.id} mono />
        <AuditField label="Public ID" value={journey.publicId} mono />
        <AuditField
          label="Provider public ID"
          value={journey.providerPublicId}
          mono
        />
      </AuditSection>

      <AuditSection
        title="Record state"
        description="Current status and record version."
        icon="record"
      >
        <AuditField
          label="Journey status"
          value={formatStatus(journey.status)}
        />
        <AuditField
          label="Record version"
          value={String(journey.version)}
        />
        <AuditField
          label="Corridor public ID"
          value={journey.corridor.publicId}
          mono
        />
        <AuditField
          label="Schedule public ID"
          value={journey.schedule.publicId}
          mono
        />
        <AuditField
          label="Vehicle public ID"
          value={journey.vehicle.publicId}
          mono
        />
        <AuditField
          label="Capacity public ID"
          value={journey.capacity.publicId}
          mono
        />
      </AuditSection>

      <AuditSection
        title="Record timestamps"
        description="Creation, update, and publication metadata."
        icon="timestamps"
      >
        <AuditField
          label="Created at"
          value={formatDate(journey.createdAt, timezone)}
        />
        <AuditField
          label="Last updated"
          value={formatDate(journey.updatedAt, timezone)}
        />
        <AuditField
          label="Published at"
          value={formatDate(journey.publishedAt, timezone)}
        />
      </AuditSection>

      <div className="flex items-start gap-3 rounded-xl border border-[var(--border)] bg-[var(--background-subtle)] p-4">
        <RefreshCw
          className="mt-0.5 h-4 w-4 shrink-0 text-[var(--foreground-muted)]"
          aria-hidden="true"
        />
        <div>
          <p className="text-sm font-medium text-[var(--foreground)]">
            Audit scope
          </p>
          <p className="mt-1 text-sm leading-5 text-[var(--foreground-muted)]">
            This view displays metadata available on the journey response. It
            does not represent a complete change history or identify who
            modified each field. A separate audit-log source would be needed
            for that information.
          </p>
        </div>
      </div>
    </section>
  );
}

export default JourneyAuditInformation;
