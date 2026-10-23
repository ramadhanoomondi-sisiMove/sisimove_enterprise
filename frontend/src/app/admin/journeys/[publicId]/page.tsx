
'use client';

/**
 * sisiMove — Admin Journey Detail Page
 *
 * Displays one journey for authorized administrative inspection.
 *
 * Responsibilities:
 * - Fetch one journey using its public ID.
 * - Fetch bookings and boarding information scoped to the journey.
 * - Handle loading, error, and missing-record states.
 * - Present journey operational details, bookings, and boarding progress.
 * - Reuse established admin journey components.
 *
 * Non-responsibilities:
 * - Fetching the complete journey directory.
 * - Filtering all journeys on the frontend.
 * - Modifying booking, payment, or boarding records.
 * - Inventing missing journey or provider information.
 */

import {
  ArrowLeft,
  MapPinned,
} from 'lucide-react';

import Link from 'next/link';
import { useParams } from 'next/navigation';

import {
  JourneyControlCenterHeader,
  JourneyPageContainer,
  JourneySectionHeader,
} from '@/components/admin/journeys/layout';

import JourneyProviderPanel from '@/components/admin/journeys/provider/JourneyProviderPanel';
import JourneyRoutePanel from '@/components/admin/journeys/route/JourneyRoutePanel';
import JourneyVehiclePanel from '@/components/admin/journeys/vehicle/JourneyVehiclePanel';
import JourneyCapacityPanel from '@/components/admin/journeys/capacity/JourneyCapacityPanel';
import JourneyPricingPanel from '@/components/admin/journeys/pricing/JourneyPricingPanel';
import JourneyPreferencesPanel from '@/components/admin/journeys/preferences/JourneyPreferencesPanel';
import JourneyBookingsPanel from '@/components/admin/journeys/bookings/JourneyBookingsPanel';
import JourneyPaymentsPanel from '@/components/admin/journeys/payments/JourneyPaymentsPanel';
import { JourneySettlementPanel } from '@/components/admin/journeys/settlement/JourneySettlementPanel';
import JourneyCompletionPanel from '@/components/admin/journeys/completion/JourneyCompletionPanel';
import JourneyBoardingPanel from '@/components/admin/journeys/boarding/JourneyBoardingPanel';
import JourneyAssetsPanel from '@/components/admin/journeys/assets/JourneyAssetsPanel';
import JourneyLifecycleActions from '@/components/admin/journeys/operations/JourneyLifecycleActions';

import { useDetailedJourney } from '@/features/admin/journeys/hooks';
import { useJourneyBookings } from '@/features/admin/journeys/hooks/useJourneyBookings';
import { useJourneyBoarding } from '@/features/admin/journeys/hooks/useJourneyBoarding';
import { useJourneySettlementsByJourney } from '@/features/admin/journeys/hooks/useJourneySettlement';
import { useJourneyCompletion } from '@/features/admin/journeys/hooks/useJourneyCompletion';

import type { MappedJourney } from '@/features/admin/journeys/mappers/journey.mapper';

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function formatDateTime(
  value: string | null | undefined,
  timezone?: string,
): string {
  if (!value) {
    return 'Not recorded';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Invalid date';
  }

  try {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
      ...(timezone ? { timeZone: timezone } : {}),
    }).format(date);
  } catch {
    return date.toLocaleString();
  }
}

function formatMoney(
  amount: number,
  currency: string,
): string {
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString()}`;
  }
}

function DetailValue({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
      <p className="text-xs font-medium text-[var(--foreground-muted)]">
        {label}
      </p>

      <p className="mt-2 break-words text-sm font-semibold text-[var(--foreground)]">
        {value}
      </p>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Journey lifecycle
// -----------------------------------------------------------------------------

function JourneyLifecycleSection({
  journey,
}: {
  journey: MappedJourney;
}) {
  const events = [
    { label: 'Created', value: journey.createdAt },
    { label: 'Published', value: journey.publishedAt },
    { label: 'Started', value: journey.startedAt },
    {
      label: 'Completion requested',
      value: journey.completionRequestedAt,
    },
    { label: 'Completed', value: journey.completedAt },
    { label: 'Cancelled', value: journey.cancelledAt },
    { label: 'Expired', value: journey.expiredAt },
    { label: 'Last updated', value: journey.updatedAt },
  ];

  return (
    <section className="space-y-5">
      <JourneySectionHeader
        title="Journey lifecycle"
        description="Manage lifecycle transitions and inspect recorded milestones."
      />

      <JourneyLifecycleActions
        journeyPublicId={journey.publicId}
        status={journey.status}
        startedAt={journey.startedAt}
        completedAt={journey.completedAt}
        cancelledAt={journey.cancelledAt}
        expiredAt={journey.expiredAt}
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {events.map((event) => (
          <DetailValue
            key={event.label}
            label={event.label}
            value={formatDateTime(event.value)}
          />
        ))}
      </div>
    </section>
  );
}

// -----------------------------------------------------------------------------
// Journey record metadata
// -----------------------------------------------------------------------------

function JourneyRecordSection({
  journey,
}: {
  journey: MappedJourney;
}) {
  return (
    <section className="space-y-5">
      <JourneySectionHeader
        title="Record information"
        description="Identifiers and timestamps for the stored journey record."
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <DetailValue
          label="Internal record ID"
          value={journey.id}
        />

        <DetailValue
          label="Journey public ID"
          value={journey.publicId}
        />

        <DetailValue
          label="Provider public ID"
          value={journey.providerPublicId}
        />

        <DetailValue
          label="Record version"
          value={String(journey.version)}
        />

        <DetailValue
          label="Created at"
          value={formatDateTime(journey.createdAt)}
        />

        <DetailValue
          label="Updated at"
          value={formatDateTime(journey.updatedAt)}
        />
      </div>
    </section>
  );
}

// -----------------------------------------------------------------------------
// Bookings request state
// -----------------------------------------------------------------------------

function JourneyBookingsError({
  message,
  onRetry,
  retrying,
}: {
  message: string;
  onRetry: () => void;
  retrying: boolean;
}) {
  return (
    <section
      role="alert"
      className="space-y-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5"
    >
      <div>
        <h2 className="font-semibold text-[var(--foreground)]">
          Unable to load journey bookings
        </h2>

        <p className="mt-2 break-words text-sm text-[var(--foreground-muted)]">
          {message}
        </p>
      </div>

      <button
        type="button"
        onClick={onRetry}
        disabled={retrying}
        className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--background-subtle)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {retrying ? 'Retrying…' : 'Retry bookings'}
      </button>
    </section>
  );
}

// -----------------------------------------------------------------------------
// Boarding request state
// -----------------------------------------------------------------------------

function JourneyBoardingError({
  message,
  onRetry,
  retrying,
}: {
  message: string;
  onRetry: () => void;
  retrying: boolean;
}) {
  return (
    <section
      role="alert"
      className="space-y-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5"
    >
      <div>
        <h2 className="font-semibold text-[var(--foreground)]">
          Unable to load journey boarding
        </h2>

        <p className="mt-2 break-words text-sm text-[var(--foreground-muted)]">
          {message}
        </p>
      </div>

      <button
        type="button"
        onClick={onRetry}
        disabled={retrying}
        className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--background-subtle)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {retrying ? 'Retrying…' : 'Retry boarding'}
      </button>
    </section>
  );
}

// -----------------------------------------------------------------------------
// Page
// -----------------------------------------------------------------------------

export default function AdminJourneyDetailPage() {
  const params = useParams<{ publicId: string }>();

  const publicId =
    typeof params.publicId === 'string'
      ? params.publicId.trim()
      : '';

  const journeyQuery = useDetailedJourney(publicId);
  const journey = journeyQuery.data;

  // Both queries are scoped to this journey's public ID.
  // Hooks remain unconditional; each query handles an empty ID internally.
  const bookingsQuery = useJourneyBookings(
    publicId.length > 0 ? publicId : undefined,
  );

  const boardingQuery = useJourneyBoarding(
    publicId.length > 0 ? publicId : undefined,
  );

  // Settlements are fetched by journey public ID, not by guessing a completion ID.
  // Keep this query separate from bookings/payments and scope it to this journey.
  const settlementsQuery = useJourneySettlementsByJourney(
    publicId.length > 0 ? publicId : undefined,
  );

  // Completion is scoped to this journey's public ID.
  const completionQuery = useJourneyCompletion(
    publicId.length > 0 ? publicId : undefined,
  );

  // ---------------------------------------------------------------------------
  // Journey loading
  // ---------------------------------------------------------------------------

  if (journeyQuery.isPending) {
    return (
      <JourneyPageContainer width="wide" spacing="relaxed">
        <JourneyControlCenterHeader
          eyebrow="Operations"
          title="Journey details"
          description="Loading the selected journey record."
        />

        <section
          aria-live="polite"
          className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6"
        >
          <p className="text-sm text-[var(--foreground-muted)]">
            Loading journey details…
          </p>
        </section>
      </JourneyPageContainer>
    );
  }

  // ---------------------------------------------------------------------------
  // Journey error
  // ---------------------------------------------------------------------------

  if (journeyQuery.isError) {
    return (
      <JourneyPageContainer width="wide" spacing="relaxed">
        <JourneyControlCenterHeader
          eyebrow="Operations"
          title="Unable to load journey"
          description="The selected journey record could not be retrieved."
        />

        <section
          role="alert"
          className="space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6"
        >
          <div>
            <h2 className="font-semibold text-[var(--foreground)]">
              Journey request failed
            </h2>

            <p className="mt-2 break-words text-sm text-[var(--foreground-muted)]">
              {journeyQuery.error instanceof Error
                ? journeyQuery.error.message
                : 'An unexpected error occurred while loading this journey.'}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => void journeyQuery.refetch()}
              disabled={journeyQuery.isFetching}
              className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--background-subtle)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {journeyQuery.isFetching ? 'Retrying…' : 'Retry'}
            </button>

            <Link
              href="/admin/journeys"
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-[var(--brand)]"
            >
              <ArrowLeft aria-hidden="true" className="size-4" />
              Back to journeys
            </Link>
          </div>
        </section>
      </JourneyPageContainer>
    );
  }

  // ---------------------------------------------------------------------------
  // Journey not found
  // ---------------------------------------------------------------------------

  if (!journey) {
    return (
      <JourneyPageContainer width="wide" spacing="relaxed">
        <JourneyControlCenterHeader
          eyebrow="Operations"
          title="Journey not found"
          description="No journey record was returned for this public ID."
        />

        <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <p className="break-all text-sm text-[var(--foreground-muted)]">
            Requested journey ID: {publicId || 'Not provided'}
          </p>

          <Link
            href="/admin/journeys"
            className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-[var(--brand)]"
          >
            <ArrowLeft aria-hidden="true" className="size-4" />
            Back to journeys
          </Link>
        </section>
      </JourneyPageContainer>
    );
  }

  // ---------------------------------------------------------------------------
  // Journey details
  // ---------------------------------------------------------------------------

  const routeTitle = journey.corridor
    ? `${journey.corridor.originName} → ${journey.corridor.destinationName}`
    : 'Journey details';

  const departure = journey.schedule?.departureAt;

  const departureText = departure
    ? formatDateTime(departure, journey.schedule?.timezone)
    : 'Not scheduled';

  const pricing = journey.pricing;

  const pricingText = pricing
    ? formatMoney(pricing.amount, pricing.currency)
    : 'Not configured';

  return (
    <JourneyPageContainer width="wide" spacing="relaxed">
      <div className="space-y-8">
        <JourneyControlCenterHeader
          eyebrow="Operations"
          title={routeTitle}
          description="Inspect the journey record, provider, route, schedule, capacity, pricing, bookings, boarding, and lifecycle information."
        />

        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] pb-5">
          <Link
            href="/admin/journeys"
            className="inline-flex items-center gap-2 text-sm font-medium text-[var(--foreground-secondary)] transition-colors hover:text-[var(--brand)]"
          >
            <ArrowLeft aria-hidden="true" className="size-4" />
            Back to Journey Directory
          </Link>

          <span className="inline-flex items-center rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs font-semibold text-[var(--foreground)]">
            {journey.status}
          </span>
        </div>

        {/* Summary metrics */}

        <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <DetailValue
            label="Journey status"
            value={journey.status}
          />

          <DetailValue
            label="Departure"
            value={departureText}
          />

          <DetailValue
            label="Journey fare"
            value={pricingText}
          />

          <DetailValue
            label="Seat availability"
            value={
              journey.capacity
                ? `${journey.capacity.availableSeats} of ${journey.capacity.totalSeats} seats available`
                : 'Not recorded'
            }
          />
        </section>

        {/* Route and provider */}

        <section className="grid grid-cols-1 gap-8 xl:grid-cols-2">
          {journey.corridor ? (
            <JourneyRoutePanel
              corridor={journey.corridor}
            />
          ) : (
            <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
              <div className="flex items-center gap-3">
                <MapPinned
                  aria-hidden="true"
                  className="size-5 text-[var(--foreground-muted)]"
                />

                <h2 className="font-semibold text-[var(--foreground)]">
                  Route details
                </h2>
              </div>

              <p className="mt-3 text-sm text-[var(--foreground-muted)]">
                No corridor is attached to this journey record.
              </p>
            </section>
          )}

          <JourneyProviderPanel
            journey={{
              providerPublicId: journey.providerPublicId,
            }}
          />
        </section>

        {/* Schedule */}

        <section className="space-y-5">
          <JourneySectionHeader
            title="Schedule details"
            description="Departure time, arrival time, timezone, and schedule record."
          />

          {journey.schedule ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <DetailValue
                label="Departure"
                value={formatDateTime(
                  journey.schedule.departureAt,
                  journey.schedule.timezone,
                )}
              />

              <DetailValue
                label="Arrival"
                value={formatDateTime(
                  journey.schedule.arrivalAt,
                  journey.schedule.timezone,
                )}
              />

              <DetailValue
                label="Timezone"
                value={journey.schedule.timezone || 'Not specified'}
              />

              <DetailValue
                label="Schedule public ID"
                value={journey.schedule.publicId}
              />
            </div>
          ) : (
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
              <p className="text-sm text-[var(--foreground-muted)]">
                No schedule is attached to this journey record.
              </p>
            </div>
          )}
        </section>

        {/* Vehicle, capacity, and pricing */}

        <section className="space-y-5">
          <JourneySectionHeader
            title="Transport and commercial details"
            description="Vehicle information, passenger capacity, and the configured fare."
          />

          <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
            {journey.vehicle ? (
              <JourneyVehiclePanel
                journey={{ vehicle: journey.vehicle }}
              />
            ) : (
              <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
                <h2 className="font-semibold text-[var(--foreground)]">
                  Vehicle details
                </h2>

                <p className="mt-2 text-sm text-[var(--foreground-muted)]">
                  No vehicle is attached to this journey.
                </p>
              </section>
            )}

            {journey.capacity ? (
              <JourneyCapacityPanel
                journey={{ capacity: journey.capacity }}
              />
            ) : (
              <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
                <h2 className="font-semibold text-[var(--foreground)]">
                  Seat capacity
                </h2>

                <p className="mt-2 text-sm text-[var(--foreground-muted)]">
                  No capacity record is attached to this journey.
                </p>
              </section>
            )}

            {journey.pricing ? (
              <JourneyPricingPanel
                journey={{ pricing: journey.pricing }}
              />
            ) : (
              <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
                <h2 className="font-semibold text-[var(--foreground)]">
                  Journey pricing
                </h2>

                <p className="mt-2 text-sm text-[var(--foreground-muted)]">
                  No pricing record is attached to this journey.
                </p>
              </section>
            )}
          </div>
        </section>

        {/* Passenger preferences */}

        {journey.preferences ? (
          <JourneyPreferencesPanel
            journey={{ preferences: journey.preferences }}
          />
        ) : (
          <section className="space-y-4">
            <JourneySectionHeader
              title="Passenger preferences"
              description="No preferences record is attached to this journey."
            />

            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
              <p className="text-sm text-[var(--foreground-muted)]">
                Passenger preferences have not been recorded for this journey.
              </p>
            </div>
          </section>
        )}

        {/* Journey bookings */}

        {bookingsQuery.isError ? (
          <JourneyBookingsError
            message={
              bookingsQuery.error instanceof Error
                ? bookingsQuery.error.message
                : 'An unexpected error occurred while loading journey bookings.'
            }
            onRetry={() => void bookingsQuery.refetch()}
            retrying={bookingsQuery.isFetching}
          />
        ) : (
          <JourneyBookingsPanel
            journey={{ publicId: journey.publicId }}
            bookings={bookingsQuery.data ?? []}
            loading={bookingsQuery.isPending}
          />
        )}

        {/* Journey payments: reuse the bookings query; do not issue a second request. */}

        <section className="space-y-5">
          <JourneySectionHeader
            title="Journey payments"
            description="Review payment statuses, captured amounts, transaction references, and financial events for this journey's bookings."
          />

          {bookingsQuery.isPending ? (
            <JourneyPaymentsPanel bookings={[]} loading />
          ) : bookingsQuery.isError ? (
            <section
              role="alert"
              className="space-y-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5"
            >
              <div>
                <h2 className="font-semibold text-[var(--foreground)]">
                  Unable to load journey payments
                </h2>
                <p className="mt-2 break-words text-sm text-[var(--foreground-muted)]">
                  Payment information could not be displayed because the journey bookings request failed.
                </p>
              </div>

              <button
                type="button"
                onClick={() => void bookingsQuery.refetch()}
                disabled={bookingsQuery.isFetching}
                className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--background-subtle)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {bookingsQuery.isFetching ? 'Retrying…' : 'Retry payments'}
              </button>
            </section>
          ) : (
            <JourneyPaymentsPanel
              bookings={bookingsQuery.data ?? []}
              loading={bookingsQuery.isFetching}
            />
          )}
        </section>

        {/* Journey completion */}

        <section className="space-y-5">
          <JourneySectionHeader
            title="Journey completion"
            description="Inspect completion status, participant confirmations, lifecycle timestamps, and open disputes for this journey."
          />

          {completionQuery.isPending ? (
            <JourneyCompletionPanel
              completion={null}
              loading
              timezone={journey.schedule?.timezone}
            />
          ) : completionQuery.isError ? (
            <section
              role="alert"
              className="space-y-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5"
            >
              <div>
                <h2 className="font-semibold text-[var(--foreground)]">
                  Unable to load journey completion
                </h2>
                <p className="mt-2 break-words text-sm text-[var(--foreground-muted)]">
                  {completionQuery.error instanceof Error
                    ? completionQuery.error.message
                    : 'An unexpected error occurred while loading journey completion.'}
                </p>
              </div>

              <button
                type="button"
                onClick={() => void completionQuery.refetch()}
                disabled={completionQuery.isFetching}
                className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--background-subtle)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {completionQuery.isFetching ? 'Retrying…' : 'Retry completion'}
              </button>
            </section>
          ) : (
            <JourneyCompletionPanel
              completion={completionQuery.data ?? null}
              loading={completionQuery.isFetching}
              timezone={journey.schedule?.timezone}
            />
          )}
        </section>

        {/* Journey settlements */}

        <section className="space-y-5">
          <JourneySectionHeader
            title="Journey settlements"
            description="Inspect settlement records associated with this journey, including processing state, financial transaction references, failures, holds, and reconciliation timestamps."
          />

          {settlementsQuery.isPending ? (
            <div
              aria-live="polite"
              className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5"
            >
              <p className="text-sm text-[var(--foreground-muted)]">
                Loading settlement records…
              </p>
            </div>
          ) : settlementsQuery.isError ? (
            <section
              role="alert"
              className="space-y-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5"
            >
              <div>
                <h2 className="font-semibold text-[var(--foreground)]">
                  Unable to load journey settlements
                </h2>
                <p className="mt-2 break-words text-sm text-[var(--foreground-muted)]">
                  {settlementsQuery.error instanceof Error
                    ? settlementsQuery.error.message
                    : 'An unexpected error occurred while loading settlement records.'}
                </p>
              </div>

              <button
                type="button"
                onClick={() => void settlementsQuery.refetch()}
                disabled={settlementsQuery.isFetching}
                className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--background-subtle)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {settlementsQuery.isFetching ? 'Retrying…' : 'Retry settlements'}
              </button>
            </section>
          ) : settlementsQuery.data?.length ? (
            <div className="space-y-5">
              {settlementsQuery.data.map((settlement) => (
                <JourneySettlementPanel
                  key={settlement.publicId}
                  settlement={settlement}
                  loading={settlementsQuery.isFetching}
                  timezone={journey.schedule?.timezone}
                />
              ))}
            </div>
          ) : (
            <JourneySettlementPanel
              settlement={null}
              loading={settlementsQuery.isFetching}
              timezone={journey.schedule?.timezone}
            />
          )}
        </section>

        {/* Journey boarding */}

        <section className="space-y-5">
          <JourneySectionHeader
            title="Journey boarding"
            description="Inspect boarding status, participant records, progress, and the boarding event timeline."
          />

          {boardingQuery.isPending ? (
            <div
              aria-live="polite"
              className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5"
            >
              <p className="text-sm text-[var(--foreground-muted)]">
                Loading boarding information…
              </p>
            </div>
          ) : boardingQuery.isError ? (
            <JourneyBoardingError
              message={
                boardingQuery.error instanceof Error
                  ? boardingQuery.error.message
                  : 'An unexpected error occurred while loading boarding information.'
              }
              onRetry={() => void boardingQuery.refetch()}
              retrying={boardingQuery.isFetching}
            />
          ) : (
            <JourneyBoardingPanel
              boarding={boardingQuery.data ?? null}
              loading={boardingQuery.isFetching}
              timezone={journey.schedule?.timezone}
            />
          )}
        </section>

      {/* Journey assets */}

        <JourneyAssetsPanel
          assets={journey.assets}
          linkedVehicleAssetPublicId={journey.vehicle?.assetPublicId ?? null}
          loading={journeyQuery.isFetching}
        />

        {/* Lifecycle */}

        <JourneyLifecycleSection journey={journey} />

        {/* Record metadata */}

        <JourneyRecordSection journey={journey} />
      </div>
    </JourneyPageContainer>
  );
}
