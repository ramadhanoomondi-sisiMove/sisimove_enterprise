'use client';

// -----------------------------------------------------------------------------
// sisiMove — Journey Seats Step
// -----------------------------------------------------------------------------
//
// Provider seat-capacity selection for Journey creation.
//
// Architectural rules:
// - The provider declares how many passenger seats they are offering.
// - There is no capacity catalogue.
// - The provider does not select a pre-existing capacity definition.
// - `totalSeats` is provider-supplied Journey data.
// - `bookedSeats` is server-owned lifecycle state and is never submitted here.
// - The page owns orchestration only.
// - JourneyCapacityForm remains presentation-only.
// - The backend remains authoritative for validation and persistence.
//
// Workflow:
//
//     Journey draft
//          ↓
//     Route
//          ↓
//     Schedule
//          ↓
//     Vehicle
//          ↓
//     Seats  ← this step
//          ↓
//     Pricing
//
// -----------------------------------------------------------------------------

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import {
  JourneyCapacityForm,
  type JourneyCapacityFormValue,
} from '@/components/journeys/capacity';

import { useJourneyCapacity } from '@/features/journey/hooks/use-journey-capacity';
import { useAttachJourneyCapacity } from '@/features/journey/hooks/use-attach-journey-capacity';

import { normalizeError } from '@/foundation/errors';
import { AUTHENTICATED_ROUTES } from '@/foundation/routing';

// ----------------------------------------------------------------------------
// Route props
// ----------------------------------------------------------------------------

interface JourneyCapacityPageProps {
  params: Promise<{
    journeyPublicId: string;
  }>;
}

// ----------------------------------------------------------------------------
// Page
// ----------------------------------------------------------------------------

export default function JourneyCapacityPage({
  params,
}: JourneyCapacityPageProps) {
  const [journeyPublicId, setJourneyPublicId] = useState<string | null>(
    null,
  );

  void params.then(({ journeyPublicId: publicId }) => {
    setJourneyPublicId((current) => current ?? publicId);
  });

  if (!journeyPublicId) {
    return null;
  }

  return (
    <JourneyCapacityStep journeyPublicId={journeyPublicId} />
  );
}

// ----------------------------------------------------------------------------
// Step
// ----------------------------------------------------------------------------

interface JourneyCapacityStepProps {
  journeyPublicId: string;
}

function JourneyCapacityStep({
  journeyPublicId,
}: JourneyCapacityStepProps) {
  const router = useRouter();

  // --------------------------------------------------------------------------
  // Persisted Journey capacity
  // --------------------------------------------------------------------------
  //
  // The Journey owns the selected capacity state.
  //
  // A null value means the provider has not yet supplied seat capacity.
  //
  const {
    data: capacity,
    isLoading,
    error: queryError,
    refetch,
  } = useJourneyCapacity(journeyPublicId);

  // --------------------------------------------------------------------------
  // Capacity mutation
  // --------------------------------------------------------------------------

  const attachCapacity = useAttachJourneyCapacity();

  const [mutationError, setMutationError] = useState<string | null>(
    null,
  );

  // --------------------------------------------------------------------------
  // Submit
  // --------------------------------------------------------------------------
  //
  // Only totalSeats is submitted.
  //
  // bookedSeats is deliberately excluded because it belongs to the
  // Journey/Booking lifecycle and is server-owned.
  //
  async function handleSubmit(
    value: JourneyCapacityFormValue,
  ): Promise<void> {
    if (attachCapacity.isPending) {
      return;
    }

    setMutationError(null);

    try {
      await attachCapacity.mutateAsync({
        journeyPublicId,
        input: {
          totalSeats: value.totalSeats,
        },
      });

      router.push(
        AUTHENTICATED_ROUTES.JOURNEY_CREATE_PRICING(
          journeyPublicId,
        ),
      );
    } catch (submitError: unknown) {
      const normalizedError = normalizeError(submitError);

      setMutationError(normalizedError.message);
    }
  }

  // --------------------------------------------------------------------------
  // Query error
  // --------------------------------------------------------------------------

  if (queryError) {
    const normalizedError = normalizeError(queryError);

    return (
      <main className="px-4 py-6 sm:px-6 sm:py-8">
        <div className="mx-auto w-full max-w-2xl">
          <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] p-5">
            <p className="text-sm font-medium text-[var(--danger)]">
              Unable to load passenger seats
            </p>

            <p className="mt-1 text-sm text-[var(--foreground-muted)]">
              {normalizedError.message}
            </p>

            <button
              type="button"
              onClick={() => {
                void refetch();
              }}
              className="mt-4 text-sm font-semibold text-[var(--brand)] hover:text-[var(--brand-hover)]"
            >
              Try again
            </button>
          </div>
        </div>
      </main>
    );
  }

  // --------------------------------------------------------------------------
  // Loading
  // --------------------------------------------------------------------------

  if (isLoading) {
    return null;
  }

  // --------------------------------------------------------------------------
  // Existing Journey capacity → form default
  // --------------------------------------------------------------------------

  const defaultValue = capacity
    ? {
        totalSeats: capacity.totalSeats,
      }
    : undefined;

  // --------------------------------------------------------------------------
  // Render
  // --------------------------------------------------------------------------

  return (
    <main className="px-4 py-6 sm:px-6 sm:py-8">
      <div className="mx-auto w-full max-w-2xl">
        <header className="mb-6">
          <p className="text-sm font-medium text-[var(--brand)]">
            Journey creation
          </p>

          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-[var(--foreground)]">
            Seats
          </h1>

          <p className="mt-2 text-sm leading-6 text-[var(--foreground-muted)]">
            Choose how many passenger seats you are offering on this
            journey.
          </p>
        </header>

        <JourneyCapacityForm
          defaultValue={defaultValue}
          onSubmit={handleSubmit}
          isLoading={attachCapacity.isPending}
          error={mutationError}
        />
      </div>
    </main>
  );
}

