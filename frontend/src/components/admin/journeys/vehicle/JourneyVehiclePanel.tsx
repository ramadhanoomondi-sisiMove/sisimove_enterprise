
'use client';

/**
 * sisiMove — Journey Vehicle Panel
 *
 * Displays vehicle information associated with a journey.
 *
 * Responsibilities:
 * - Present vehicle make, model, and year.
 * - Display registration, color, and vehicle identifiers when available.
 * - Handle incomplete vehicle information gracefully.
 * - Keep vehicle presentation consistent with other journey detail panels.
 *
 * This component is presentation-only. It does not fetch or modify vehicle data.
 */

import {
  CalendarDays,
  CarFront,
  Fingerprint,
  Palette,
  ShieldCheck,
} from 'lucide-react';

import { cn } from '@/foundation/utils/cn';
import type { Journey } from '@/features/admin/journeys/models/journey.model';

export interface JourneyVehiclePanelProps {
  journey: Pick<Journey, 'vehicle'>;
  className?: string;
  compact?: boolean;
  showVehicleId?: boolean;
}

function DetailItem({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: typeof CarFront;
}) {
  return (
    <div className="flex min-w-0 items-start gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[var(--background-subtle)] text-[var(--foreground-muted)]">
        <Icon aria-hidden="true" className="size-4" />
      </span>

      <div className="min-w-0">
        <p className="text-xs text-[var(--foreground-muted)]">{label}</p>
        <p className="mt-1 break-words text-sm font-medium text-[var(--foreground)]">
          {value}
        </p>
      </div>
    </div>
  );
}

export default function JourneyVehiclePanel({
  journey,
  className,
  compact = false,
  showVehicleId = true,
}: JourneyVehiclePanelProps) {
  const vehicle = journey.vehicle;

  const vehicleName = [vehicle.make, vehicle.model]
    .map((part) => part?.trim())
    .filter(Boolean)
    .join(' ');

  const displayName = [
    vehicleName || 'Vehicle details unavailable',
    vehicle.year != null ? `(${vehicle.year})` : null,
  ]
    .filter(Boolean)
    .join(' ');

  const registration = vehicle.registration?.trim() || null;
  const color = vehicle.color?.trim() || null;
  const publicId = vehicle.publicId?.trim() || null;

  return (
    <section
      aria-labelledby="journey-vehicle-heading"
      className={cn('min-w-0 space-y-4', className)}
    >
      <header className="flex items-center gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[var(--brand-soft)] text-[var(--brand)]">
          <CarFront aria-hidden="true" className="size-5" />
        </span>

        <div className="min-w-0">
          <h2
            id="journey-vehicle-heading"
            className="text-base font-semibold text-[var(--foreground)]"
          >
            Vehicle details
          </h2>

          <p className="mt-1 text-sm text-[var(--foreground-muted)]">
            Vehicle assigned to this journey
          </p>
        </div>
      </header>

      <div
        className={cn(
          'rounded-2xl border border-[var(--border)] bg-[var(--surface)]',
          compact ? 'p-3' : 'p-5',
        )}
      >
        <div className="flex min-w-0 items-start gap-3">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-[var(--background-subtle)] text-[var(--foreground-secondary)]">
            <CarFront aria-hidden="true" className="size-6" />
          </span>

          <div className="min-w-0 flex-1">
            <h3 className="break-words text-base font-semibold text-[var(--foreground)]">
              {displayName}
            </h3>

            <p className="mt-1 text-sm text-[var(--foreground-muted)]">
              {registration
                ? `Registration: ${registration}`
                : 'Registration not available'}
            </p>
          </div>

          {registration && (
            <span
              className="inline-flex shrink-0 items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--background-subtle)] px-2.5 py-1 text-xs font-medium text-[var(--foreground-secondary)]"
              title="Registration recorded"
            >
              <ShieldCheck aria-hidden="true" className="size-3.5" />
              Recorded
            </span>
          )}
        </div>

        <div
          className={cn(
            'mt-4 grid grid-cols-1 gap-3',
            compact ? 'sm:grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-3',
          )}
        >
          <DetailItem
            label="Make"
            value={vehicle.make?.trim() || 'Not specified'}
            icon={CarFront}
          />

          <DetailItem
            label="Model"
            value={vehicle.model?.trim() || 'Not specified'}
            icon={CarFront}
          />

          <DetailItem
            label="Year"
            value={vehicle.year != null ? String(vehicle.year) : 'Not specified'}
            icon={CalendarDays}
          />

          <DetailItem
            label="Color"
            value={color || 'Not specified'}
            icon={Palette}
          />

          <DetailItem
            label="Registration"
            value={registration || 'Not specified'}
            icon={Fingerprint}
          />

          {showVehicleId && (
            <DetailItem
              label="Vehicle public ID"
              value={publicId || 'Not available'}
              icon={Fingerprint}
            />
          )}
        </div>

        {vehicle.assetPublicId && (
          <div className="mt-4 border-t border-[var(--border)] pt-3">
            <p className="text-xs text-[var(--foreground-muted)]">
              Linked asset public ID
            </p>

            <p className="mt-1 break-all font-mono text-xs text-[var(--foreground-secondary)]">
              {vehicle.assetPublicId}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
