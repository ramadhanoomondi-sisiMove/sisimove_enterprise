
import {
  CarFront,
  CalendarDays,
  Palette,
  RectangleEllipsis,
  ShieldCheck,
} from 'lucide-react';

import type { AdminBookingSnapshotVehicle } from '@/features/admin/bookings/models/admin-booking.model';
import { cn } from '@/foundation/utils/cn';

interface BookingVehicleSnapshotProps {
  vehicle: AdminBookingSnapshotVehicle | null;
  className?: string;
}

function VehicleField({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | number | null;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex min-w-0 items-start gap-3 rounded-[var(--radius-lg)] border border-[var(--border)] p-4">
      {icon && (
        <div className="flex size-9 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--background-muted)] text-[var(--foreground-secondary)]">
          {icon}
        </div>
      )}

      <div className="min-w-0">
        <p className="text-xs text-[var(--foreground-muted)]">{label}</p>
        <p className="mt-1 break-words text-sm font-medium text-[var(--foreground)]">
          {value ?? 'Not recorded'}
        </p>
      </div>
    </div>
  );
}

export function BookingVehicleSnapshot({
  vehicle,
  className,
}: BookingVehicleSnapshotProps) {
  return (
    <section
      aria-label="Historical vehicle details"
      className={cn(
        'rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6',
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-[var(--radius-lg)] bg-[var(--brand-soft)] text-[var(--brand)]">
          <CarFront aria-hidden="true" className="size-5" />
        </div>

        <div className="min-w-0">
          <h3 className="text-base font-semibold text-[var(--foreground)]">
            Vehicle snapshot
          </h3>
          <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
            Vehicle information recorded for this booking.
          </p>
        </div>
      </div>

      {!vehicle ? (
        <div className="mt-5 rounded-[var(--radius-lg)] border border-dashed border-[var(--border-strong)] bg-[var(--background-subtle)] px-4 py-8 text-center">
          <CarFront
            aria-hidden="true"
            className="mx-auto size-8 text-[var(--foreground-muted)]"
          />
          <p className="mt-3 text-sm font-medium text-[var(--foreground)]">
            No vehicle snapshot available
          </p>
          <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
            This booking does not contain historical vehicle details.
          </p>
        </div>
      ) : (
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <VehicleField
            label="Make"
            value={vehicle.make}
            icon={<CarFront aria-hidden="true" className="size-4" />}
          />

          <VehicleField
            label="Model"
            value={vehicle.model}
            icon={<CarFront aria-hidden="true" className="size-4" />}
          />

          <VehicleField
            label="Model year"
            value={vehicle.year}
            icon={<CalendarDays aria-hidden="true" className="size-4" />}
          />

          <VehicleField
            label="Color"
            value={vehicle.color}
            icon={<Palette aria-hidden="true" className="size-4" />}
          />

          <VehicleField
            label="Registration"
            value={vehicle.registration}
            icon={<RectangleEllipsis aria-hidden="true" className="size-4" />}
          />

          <VehicleField
            label="Record type"
            value="Historical snapshot"
            icon={<ShieldCheck aria-hidden="true" className="size-4" />}
          />
        </div>
      )}

      <p className="mt-4 text-xs leading-5 text-[var(--foreground-muted)]">
        These details represent the vehicle information stored with the booking,
        not necessarily the vehicle&apos;s current state.
      </p>
    </section>
  );
}

export type { BookingVehicleSnapshotProps };
