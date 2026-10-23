
'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { ComponentType, ReactNode } from 'react';
import {
  CalendarClock,
  CheckCircle2,
  Clock3,
  FileText,
  Receipt,
  ShieldCheck,
  XCircle,
} from 'lucide-react';

import {
  BookingDetailHeader,
  BookingPageContainer,
  BookingSectionHeader,
} from '@/components/admin/bookings/layout';

import {
  BookingLoadingState,
  BookingErrorState,
  BookingPublicId,
} from '@/components/admin/bookings/shared';

import { BookingSnapshotPanel } from '@/components/admin/bookings/snapshot';
import { BookingPassengerPanel } from '@/components/admin/bookings/passenger/BookingPassengerPanel';
import { BookingPricingPanel } from '@/components/admin/bookings/pricing/BookingPricingPanel';
import { BookingPaymentPanel } from '@/components/admin/bookings/payments/BookingPaymentPanel';
import { BookingCancellationPanel } from '@/components/admin/bookings/cancellation/BookingCancellationPanel';

import { BookingActionsMenu } from '@/components/admin/bookings/operations/BookingActionsMenu';
import {
  BookingOperationDialog,
  type BookingOperation,
} from '@/components/admin/bookings/operations/BookingOperationDialog';
import {
  BookingOperationFeedback,
  type BookingOperationFeedbackType,
} from '@/components/admin/bookings/operations/BookingOperationFeedback';

import { useAdminBooking } from '@/features/admin/bookings/hooks/useAdminBooking';
import { ADMIN_ROUTES } from '@/foundation/routing/admin-routes';
import { cn } from '@/foundation/utils/cn';

interface BookingDetailPageProps {
  params: Promise<{
    publicId: string;
  }>;
}

interface OperationFeedbackState {
  type: BookingOperationFeedbackType;
  message: string;
}

function formatDate(value: string | null | undefined): string {
  if (!value) return 'Not available';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return 'Not available';

  return new Intl.DateTimeFormat('en-KE', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

function DetailField({
  label,
  value,
  icon: Icon,
  className,
}: {
  label: string;
  value: string | number;
  icon?: ComponentType<{ className?: string }>;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'min-w-0 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] p-4',
        className,
      )}
    >
      <dt className="flex items-center gap-2 text-xs font-medium text-[var(--foreground-secondary)]">
        {Icon && (
          <Icon
            className="size-4 shrink-0 text-[var(--foreground-muted)]"
            aria-hidden="true"
          />
        )}
        {label}
      </dt>

      <dd className="mt-2 break-words text-sm font-semibold leading-6 text-[var(--foreground)]">
        {value}
      </dd>
    </div>
  );
}

function DetailSection({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        'min-w-0 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm sm:p-6',
        className,
      )}
    >
      {children}
    </section>
  );
}

function StatusPill({ status }: { status: string }) {
  const normalized = status.toUpperCase();

  const tone =
    normalized === 'CONFIRMED' ||
    normalized === 'COMPLETED' ||
    normalized === 'CAPTURED'
      ? 'border-[var(--success)]/20 bg-[var(--success-soft)] text-[var(--success)]'
      : normalized === 'CANCELLED' ||
          normalized === 'FAILED' ||
          normalized === 'EXPIRED'
        ? 'border-[var(--danger)]/20 bg-[var(--danger-soft)] text-[var(--danger)]'
        : normalized === 'PENDING' ||
            normalized === 'AUTHORIZED' ||
            normalized === 'PARTIALLY_REFUNDED'
          ? 'border-[var(--warning)]/20 bg-[var(--warning-soft)] text-[var(--warning)]'
          : 'border-[var(--border)] bg-[var(--background-subtle)] text-[var(--foreground-secondary)]';

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-semibold',
        tone,
      )}
    >
      <span className="mr-2 size-1.5 rounded-full bg-current" />
      {status.replaceAll('_', ' ')}
    </span>
  );
}

export default function AdminBookingDetailPage({
  params,
}: BookingDetailPageProps) {
  const { publicId } = use(params);
  const router = useRouter();

  const [selectedOperation, setSelectedOperation] =
    useState<BookingOperation | null>(null);
  const [operationDialogOpen, setOperationDialogOpen] = useState(false);
  const [operationFeedback, setOperationFeedback] =
    useState<OperationFeedbackState | null>(null);

  const bookingQuery = useAdminBooking(publicId);
  const booking = bookingQuery.data;

  function handleSelectOperation(operation: BookingOperation) {
    setOperationFeedback(null);
    setSelectedOperation(operation);
    setOperationDialogOpen(true);
  }

  function handleOperationDialogChange(open: boolean) {
    setOperationDialogOpen(open);

    if (!open) {
      setSelectedOperation(null);
    }
  }

  function handleOperationSuccess(message: string) {
    setOperationFeedback({
      type: 'success',
      message,
    });
  }

  function handleOperationError(message: string) {
    setOperationFeedback({
      type: 'error',
      message,
    });
  }

  if (bookingQuery.isPending) {
    return (
      <main className="min-h-screen bg-[var(--background-subtle)]">
        <BookingPageContainer>
          <BookingLoadingState
            message="Loading booking details…"
            rows={4}
          />
        </BookingPageContainer>
      </main>
    );
  }

  if (bookingQuery.isError) {
    return (
      <main className="min-h-screen bg-[var(--background-subtle)]">
        <BookingPageContainer>
          <BookingErrorState
            description="We couldn't retrieve the booking details. Please try again."
            onRetry={() => void bookingQuery.refetch()}
            isRetrying={bookingQuery.isFetching}
          />
        </BookingPageContainer>
      </main>
    );
  }

  if (!booking) {
    return (
      <main className="min-h-screen bg-[var(--background-subtle)]">
        <BookingPageContainer>
          <BookingDetailHeader
            title="Booking not found"
            description="No booking matching this public ID was found in the available booking records."
            reference={publicId}
            onBack={() => router.push(ADMIN_ROUTES.BOOKINGS)}
          />

          <DetailSection>
            <div className="flex items-start gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[var(--background-subtle)]">
                <FileText
                  className="size-5 text-[var(--foreground-muted)]"
                  aria-hidden="true"
                />
              </div>

              <div>
                <h2 className="text-sm font-semibold text-[var(--foreground)]">
                  No matching booking
                </h2>
                <p className="mt-1 text-sm leading-6 text-[var(--foreground-secondary)]">
                  Check the booking reference or return to the booking
                  directory.
                </p>
              </div>
            </div>
          </DetailSection>
        </BookingPageContainer>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--background-subtle)]">
      <BookingPageContainer className="gap-6 py-6 sm:py-8">
        <BookingDetailHeader
          title="Booking details"
          description="A complete overview of the booking, journey, passenger, pricing, and payment record."
          reference={booking.publicId}
          status={<StatusPill status={booking.status} />}
          onBack={() => router.push(ADMIN_ROUTES.BOOKINGS)}
        />

        {/* Booking operations */}
        <DetailSection>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <BookingSectionHeader
                title="Booking operations"
                description="Manage the booking lifecycle and available payment operations."
              />
              <p className="mt-2 break-all text-xs text-[var(--foreground-muted)]">
                Reference: {booking.publicId}
              </p>
            </div>

            <div className="shrink-0">
              <BookingActionsMenu
                booking={booking}
                onSelectOperation={handleSelectOperation}
                disabled={bookingQuery.isFetching}
              />
            </div>
          </div>

          {operationFeedback && (
            <div className="mt-5">
              <BookingOperationFeedback
                type={operationFeedback.type}
                message={operationFeedback.message}
                onDismiss={() => setOperationFeedback(null)}
              />
            </div>
          )}
        </DetailSection>

        <DetailSection>
          <BookingSectionHeader
            title="Booking overview"
            description="Key identifiers and the current lifecycle of this booking."
          />

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <DetailField
              label="Booking reference"
              value={booking.publicId}
              icon={FileText}
            />

            <DetailField
              label="Booking status"
              value={booking.status.replaceAll('_', ' ')}
              icon={ShieldCheck}
            />

            <DetailField
              label="Seats booked"
              value={booking.seats}
              icon={Receipt}
            />

            <DetailField
              label="Record version"
              value={booking.version}
              icon={FileText}
            />
          </div>

          <div className="mt-6 border-t border-[var(--border-subtle)] pt-5">
            <h3 className="text-sm font-semibold text-[var(--foreground)]">
              Booking timeline
            </h3>

            <dl className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
              <DetailField
                label="Created"
                value={formatDate(booking.createdAt)}
                icon={CalendarClock}
              />

              <DetailField
                label="Last updated"
                value={formatDate(booking.updatedAt)}
                icon={Clock3}
              />

              <DetailField
                label="Confirmed"
                value={formatDate(booking.confirmedAt)}
                icon={CheckCircle2}
              />

              <DetailField
                label="Cancelled"
                value={formatDate(booking.cancelledAt)}
                icon={XCircle}
              />

              <DetailField
                label="Completed"
                value={formatDate(booking.completedAt)}
                icon={CheckCircle2}
              />

              <DetailField
                label="Expired"
                value={formatDate(booking.expiredAt)}
                icon={Clock3}
              />
            </dl>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-3 border-t border-[var(--border-subtle)] pt-5 md:grid-cols-2">
            <div className="min-w-0">
              <p className="mb-2 text-xs font-medium text-[var(--foreground-secondary)]">
                Journey public ID
              </p>
              <BookingPublicId publicId={booking.journeyPublicId} />
            </div>

            <div className="min-w-0">
              <p className="mb-2 text-xs font-medium text-[var(--foreground-secondary)]">
                Passenger public ID
              </p>
              <BookingPublicId publicId={booking.passengerPublicId} />
            </div>
          </div>
        </DetailSection>

        <BookingPassengerPanel
          passengerPublicId={booking.passengerPublicId}
        />

        <BookingSnapshotPanel snapshot={booking.snapshot} />

        <BookingPricingPanel pricing={booking.pricing} />

        <BookingPaymentPanel payment={booking.payment} />

        <BookingCancellationPanel
          cancellation={booking.cancellation}
        />

        {selectedOperation && (
          <BookingOperationDialog
            booking={booking}
            operation={selectedOperation}
            open={operationDialogOpen}
            onOpenChange={handleOperationDialogChange}
            onSuccess={handleOperationSuccess}
            onError={handleOperationError}
          />
        )}
      </BookingPageContainer>
    </main>
  );
}
