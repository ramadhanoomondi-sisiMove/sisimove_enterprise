// -----------------------------------------------------------------------------
// sisiMove — Journey Creation — Vehicle Step
// -----------------------------------------------------------------------------
//
// Vehicle configuration step for an existing Journey draft.
//
// Route:
//
//   /authenticated/journeys/create/:journeyPublicId/vehicle
//
// Responsibilities:
// - Load the Journey's persisted vehicle.
// - Present the vehicle selection form.
// - Persist the selected vehicle through the existing Journey API.
// - Navigate to the Seats step after successful submission.
//
// Non-responsibilities:
// - No Journey creation.
// - No vehicle creation.
// - No vehicle editing.
// - No global vehicle catalogue.
// - No workflow overview.
// - No publishing.
// - No ownership enforcement.
// - No backend business-rule enforcement.
//
// Persistence model:
//
//   Journey
//      └── JourneyVehicle
//
// The Journey public ID comes exclusively from the route.
//
// IMPORTANT:
// `useJourneyVehicle()` reads the vehicle currently attached to the Journey.
// It is not a provider vehicle catalogue.
//
// The form requires:
//
//   vehicles: readonly JourneyVehicleOption[]
//
// Until a separate provider-vehicle catalogue hook/API is established, the
// persisted Journey vehicle is exposed as the available option. This permits
// an existing draft to be resumed without inventing a vehicle catalogue.
//
// -----------------------------------------------------------------------------

'use client';

import {
  useMemo,
  useState,
} from 'react';

import { useRouter } from 'next/navigation';

import {
  JourneyVehicleForm,
  type JourneyVehicleFormValue,
  type JourneyVehicleOption,
} from '@/components/journeys/vehicle';

import {
  useJourneyVehicle,
  useAttachJourneyVehicle,
} from '@/features/journey/hooks';

import {
  normalizeError,
} from '@/foundation/errors';

import {
  AUTHENTICATED_ROUTES,
} from '@/foundation/routing';

// =============================================================================
// Types
// =============================================================================

interface JourneyVehiclePageProps {
  params: Promise<{
    journeyPublicId: string;
  }>;
}

// =============================================================================
// Page
// =============================================================================

export default function JourneyVehiclePage({
  params,
}: JourneyVehiclePageProps) {
  const [journeyPublicId, setJourneyPublicId] =
    useState<string | null>(null);

  // ---------------------------------------------------------------------------
  // Resolve the Journey public ID from the route.
  // ---------------------------------------------------------------------------

  void params.then(
    ({
      journeyPublicId: publicId,
    }) => {
      setJourneyPublicId(
        (current) =>
          current ?? publicId,
      );
    },
  );

  if (!journeyPublicId) {
    return null;
  }

  return (
    <JourneyVehicleStep
      journeyPublicId={journeyPublicId}
    />
  );
}

// =============================================================================
// Vehicle step
// =============================================================================

interface JourneyVehicleStepProps {
  journeyPublicId: string;
}

function JourneyVehicleStep({
  journeyPublicId,
}: JourneyVehicleStepProps) {
  const router = useRouter();

  // ---------------------------------------------------------------------------
  // Load the Journey's persisted vehicle.
  // ---------------------------------------------------------------------------

  const {
    data: vehicle,
    isLoading,
    error: queryError,
    refetch,
  } = useJourneyVehicle(
    journeyPublicId,
  );

  // ---------------------------------------------------------------------------
  // Vehicle attachment mutation.
  // ---------------------------------------------------------------------------

  const attachVehicle =
    useAttachJourneyVehicle();

  // ---------------------------------------------------------------------------
  // Mutation error
  // ---------------------------------------------------------------------------

  const [
    mutationError,
    setMutationError,
  ] = useState<string | null>(null);

  // ---------------------------------------------------------------------------
  // Saving state
  // ---------------------------------------------------------------------------

  const [
    isSaving,
    setIsSaving,
  ] = useState(false);

  // ---------------------------------------------------------------------------
  // Vehicle catalogue
  // ---------------------------------------------------------------------------
  //
  // The current Journey-specific read gives us the persisted vehicle.
  //
  // It does not establish a provider-wide vehicle catalogue.
  //
  // Therefore we do not invent an API or hook for loading vehicles.
  //
  // A future authoritative provider vehicle catalogue can replace this mapping
  // without changing JourneyVehicleForm.
  // ---------------------------------------------------------------------------

  const vehicles =
    useMemo<
      readonly JourneyVehicleOption[]
    >(
      () => {
        if (!vehicle) {
          return [];
        }

        return [
          {
            publicId:
              vehicle.publicId,

            make:
              vehicle.make,

            model:
              vehicle.model,

            year:
              vehicle.year,

            color:
              vehicle.color,

            registration:
              vehicle.registration,
          },
        ];
      },
      [vehicle],
    );

  // ---------------------------------------------------------------------------
  // Existing selection
  // ---------------------------------------------------------------------------

  const defaultValue =
    vehicle
      ? {
          vehiclePublicId:
            vehicle.publicId,
        }
      : undefined;

  // ---------------------------------------------------------------------------
  // Submit
  // ---------------------------------------------------------------------------

  async function handleSubmit(
    value: JourneyVehicleFormValue,
  ): Promise<void> {
    if (
      isSaving ||
      attachVehicle.isPending
    ) {
      return;
    }

    setMutationError(null);
    setIsSaving(true);

    try {
      await attachVehicle.mutateAsync({
        journeyPublicId,
        input: {
          vehiclePublicId:
            value.vehiclePublicId,
        },
      });

      // -----------------------------------------------------------------------
      // Vehicle is persisted. Continue to Seats.
      // -----------------------------------------------------------------------

      router.push(
        AUTHENTICATED_ROUTES.JOURNEY_CREATE_SEATS(
          journeyPublicId,
        ),
      );
    } catch (submitError: unknown) {
      const normalizedError =
        normalizeError(
          submitError,
        );

      setMutationError(
        normalizedError.message,
      );
    } finally {
      setIsSaving(false);
    }
  }

  // ---------------------------------------------------------------------------
  // Query failure
  // ---------------------------------------------------------------------------

  if (queryError) {
    const normalizedError =
      normalizeError(queryError);

    return (
      <main className="min-h-[60vh] px-4 py-8 sm:px-6 sm:py-10">
        <div className="mx-auto w-full max-w-2xl">
          <section
            className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6"
            aria-labelledby="journey-vehicle-error-title"
          >
            <h1
              id="journey-vehicle-error-title"
              className="text-xl font-semibold text-[var(--foreground)]"
            >
              Vehicle
            </h1>

            <p className="mt-2 text-sm leading-6 text-[var(--foreground-muted)]">
              We could not load the vehicle for this journey.
            </p>

            <p
              role="alert"
              className="mt-4 rounded-xl bg-[var(--danger-soft)] px-3 py-2 text-sm text-[var(--danger)]"
            >
              {normalizedError.message}
            </p>

            <button
              type="button"
              onClick={() => {
                void refetch();
              }}
              className="mt-5 rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--background-subtle)]"
            >
              Try again
            </button>
          </section>
        </div>
      </main>
    );
  }

  // ---------------------------------------------------------------------------
  // Loading
  // ---------------------------------------------------------------------------
  //
  // loading.tsx owns the route-level loading presentation.
  // ---------------------------------------------------------------------------

  if (isLoading) {
    return null;
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <main className="min-h-[60vh] px-4 py-8 sm:px-6 sm:py-10">
      <div className="mx-auto w-full max-w-2xl">
        <header className="mb-6">
          <p className="text-sm font-medium text-[var(--brand)]">
            Journey creation
          </p>

          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-[var(--foreground)]">
            Vehicle
          </h1>

          <p className="mt-2 text-sm leading-6 text-[var(--foreground-muted)]">
            Select the vehicle you will use for this journey.
          </p>
        </header>

        <JourneyVehicleForm
          vehicles={vehicles}
          defaultValue={defaultValue}
          onSubmit={handleSubmit}
          isLoading={isSaving}
          error={mutationError}
        />
      </div>
    </main>
  );
}

