'use client';

// -----------------------------------------------------------------------------
// sisiMove — Journey Pricing Step
// -----------------------------------------------------------------------------
//
// Pricing step in the Journey creation workflow.
//
// Architectural rules:
// - JourneyPricing is a child entity of Journey.
// - There is no pricing catalogue.
// - The provider declares the passenger contribution for this Journey.
// - The page owns query, mutation, error handling, and navigation.
// - JourneyPricingForm is presentation-only.
// - The frontend does not calculate commission, fees, or profit.
// - The backend remains authoritative over monetary validation.
//
// Workflow:
//
// Route
//   ↓
// Schedule
//   ↓
// Vehicle
//   ↓
// Seats
//   ↓
// Pricing
//   ↓
// Preferences
//
// Backend operations:
//
// GET
//   /journeys/:journeyPublicId/pricing
//
// POST
//   /journeys/:journeyPublicId/pricing
//   {
//     amount,
//     currency
//   }
//
// -----------------------------------------------------------------------------

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import {
  JourneyPricingForm,
  type JourneyPricingFormValue,
} from '@/components/journeys/pricing';

import { useJourneyPricing } from '@/features/journey/hooks/use-journey-pricing';
import { useAttachJourneyPricing } from '@/features/journey/hooks/use-attach-journey-pricing';

import { normalizeError } from '@/foundation/errors';
import { AUTHENTICATED_ROUTES } from '@/foundation/routing';

// =============================================================================
// Route Props
// =============================================================================

interface JourneyPricingPageProps {
  params: Promise<{
    journeyPublicId: string;
  }>;
}

// =============================================================================
// Page
// =============================================================================

export default function JourneyPricingPage({
  params,
}: JourneyPricingPageProps) {
  const [journeyPublicId, setJourneyPublicId] = useState<string | null>(
    null,
  );

  // ---------------------------------------------------------------------------
  // Resolve the dynamic route parameter.
  // ---------------------------------------------------------------------------
  //
  // This follows the existing Journey creation step pattern used by the
  // working Route and Seats pages.
  //

  void params.then(({ journeyPublicId: publicId }) => {
    setJourneyPublicId((current) => current ?? publicId);
  });

  if (!journeyPublicId) {
    return null;
  }

  return (
    <JourneyPricingStep journeyPublicId={journeyPublicId} />
  );
}

// =============================================================================
// Pricing Step
// =============================================================================

interface JourneyPricingStepProps {
  journeyPublicId: string;
}

function JourneyPricingStep({
  journeyPublicId,
}: JourneyPricingStepProps) {
  const router = useRouter();

  // ---------------------------------------------------------------------------
  // Existing Journey pricing
  // ---------------------------------------------------------------------------
  //
  // A draft may not have pricing yet, so the query intentionally supports
  // JourneyPricing | null.
  //

  const {
    data: pricing,
    isLoading,
    error: queryError,
    refetch,
  } = useJourneyPricing(journeyPublicId);

  // ---------------------------------------------------------------------------
  // Pricing mutation
  // ---------------------------------------------------------------------------
  //
  // The mutation receives provider-declared pricing data:
  //
  // {
  //   amount,
  //   currency,
  // }
  //
  // No pricing definition or catalogue identifier is involved.
  //

  const attachPricing = useAttachJourneyPricing();

  // ---------------------------------------------------------------------------
  // Mutation error
  // ---------------------------------------------------------------------------

  const [mutationError, setMutationError] = useState<string | null>(
    null,
  );

  // ---------------------------------------------------------------------------
  // Submit
  // ---------------------------------------------------------------------------
  //
  // The form provides only provider-editable pricing fields.
  //
  // The page deliberately does not:
  // - calculate commission;
  // - calculate platform fees;
  // - calculate provider income;
  // - create a pricing catalogue entry;
  // - submit JourneyPricing.publicId.
  //
  // Those concerns remain outside this presentation workflow and monetary
  // validation remains authoritative in the backend.
  //

  async function handleSubmit(
    value: JourneyPricingFormValue,
  ): Promise<void> {
    if (attachPricing.isPending) {
      return;
    }

    setMutationError(null);

    try {
      await attachPricing.mutateAsync({
        journeyPublicId,
        input: {
          amount: value.amount,
          currency: value.currency,
        },
      });

      // -----------------------------------------------------------------------
      // Pricing has been persisted successfully.
      //
      // The URL is the workflow state. The Journey persisted on the backend is
      // the data state. Continue to the next creation step.
      // -----------------------------------------------------------------------

      router.push(
        AUTHENTICATED_ROUTES.JOURNEY_CREATE_PREFERENCES(
          journeyPublicId,
        ),
      );
    } catch (submitError: unknown) {
      const normalizedError = normalizeError(submitError);

      setMutationError(normalizedError.message);
    }
  }

  // ---------------------------------------------------------------------------
  // Query error
  // ---------------------------------------------------------------------------

  if (queryError) {
    const normalizedError = normalizeError(queryError);

    return (
      <main className="min-h-[60vh] px-4 py-6 sm:px-6 sm:py-8">
        <div className="mx-auto w-full max-w-2xl">
          <section
            aria-labelledby="journey-pricing-error-title"
            className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface)] p-5 sm:p-6"
          >
            <p className="text-sm font-medium text-[var(--brand)]">
              Journey creation
            </p>

            <h1
              id="journey-pricing-error-title"
              className="mt-1 text-lg font-semibold text-[var(--foreground)]"
            >
              Passenger contribution
            </h1>

            <p className="mt-2 text-sm leading-6 text-[var(--foreground-muted)]">
              We could not load the pricing for this journey.
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
              className="mt-5 rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--foreground)] transition hover:bg-[var(--background-subtle)]"
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
  // Next.js route loading UI handles route transitions, while this query
  // loading state prevents rendering the form before existing pricing has
  // been retrieved.
  //

  if (isLoading) {
    return null;
  }

  // ---------------------------------------------------------------------------
  // Existing pricing → form default
  // ---------------------------------------------------------------------------
  //
  // A draft may have no pricing.
  //
  // When pricing already exists, only its provider-editable fields are passed
  // into the form.
  //
  // JourneyPricing.publicId is intentionally not passed because the provider
  // does not select a pricing definition.
  //

  const defaultValue = pricing
    ? {
        amount: pricing.amount,
        currency: pricing.currency,
      }
    : undefined;

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <main className="min-h-[60vh] px-4 py-6 sm:px-6 sm:py-8">
      <div className="mx-auto w-full max-w-2xl">
        <header className="mb-6">
          <p className="text-sm font-medium text-[var(--brand)]">
            Journey creation
          </p>

          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-[var(--foreground)]">
            Pricing
          </h1>

          <p className="mt-2 text-sm leading-6 text-[var(--foreground-muted)]">
            Set the contribution each passenger will make toward
            the shared cost of your journey.
          </p>
        </header>

        <JourneyPricingForm
          defaultValue={defaultValue}
          onSubmit={handleSubmit}
          isLoading={attachPricing.isPending}
          error={mutationError}
        />
      </div>
    </main>
  );
}

