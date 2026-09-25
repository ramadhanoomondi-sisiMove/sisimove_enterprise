// -----------------------------------------------------------------------------
// sisiMove — Journey Pricing Creation Page
// -----------------------------------------------------------------------------
//
// Route:
//   /journeys/create/[journeyPublicId]/pricing
//
// Responsibilities:
// - Load the Journey-owned pricing configuration.
// - Compose JourneyPricingStep and JourneyPricingForm.
// - Provide persisted pricing to the presentation form.
// - Track unsaved pricing changes locally.
// - Persist pricing through useAttachJourneyPricing.
// - Remove the existing Journey pricing when explicitly requested.
// - Navigate to the next Journey creation step.
//
// This page does NOT:
// - Create a standalone Pricing resource.
// - Generate pricing identifiers.
// - Calculate commission.
// - Calculate provider income.
// - Convert currencies.
// - Perform financial settlement calculations.
// - Implement Journey domain invariants.
// - Call the API from the form.
// - Own aggregate persistence directly.
// - Own navigation inside the form component.
//
// The Journey aggregate remains the owner of pricing configuration.
// -----------------------------------------------------------------------------

'use client';

import {
  useCallback,
  useMemo,
  useState,
} from 'react';
import { useParams, useRouter } from 'next/navigation';

import {
  JourneyPricingForm,
  JourneyPricingStep,
  type JourneyPricingFormSubmitValue,
} from '@/components/journeys/creation/pricing';

import {
  useJourneyPricing,
} from '@/features/journey/hooks/queries';

import {
  useAttachJourneyPricing,
  useRemoveJourneyPricing,
} from '@/features/journey/hooks/mutations';

import { AUTHENTICATED_ROUTES } from '@/foundation/routing';

import { Button } from '@/components/ui';

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function isSamePricing(
  left: JourneyPricingFormSubmitValue,
  right: JourneyPricingFormSubmitValue,
): boolean {
  return (
    left.amount === right.amount &&
    left.currency === right.currency
  );
}

// -----------------------------------------------------------------------------
// Page
// -----------------------------------------------------------------------------

export default function JourneyPricingPage() {
  const router = useRouter();

  const params = useParams<{
    journeyPublicId: string;
  }>();

  const journeyPublicId =
    params.journeyPublicId;

  // ---------------------------------------------------------------------------
  // Query
  // ---------------------------------------------------------------------------

  const pricingQuery =
    useJourneyPricing(journeyPublicId);

  // ---------------------------------------------------------------------------
  // Mutations
  // ---------------------------------------------------------------------------

  const attachPricing =
    useAttachJourneyPricing();

  const removePricing =
    useRemoveJourneyPricing();

  // ---------------------------------------------------------------------------
  // Local presentation state
  // ---------------------------------------------------------------------------

  /**
   * Holds only values changed by the user during the current page session.
   *
   * Server state remains authoritative until the user starts editing.
   * We intentionally do not mirror query data through an effect.
   */
  const [pricingDraft, setPricingDraft] =
    useState<
      Partial<JourneyPricingFormSubmitValue>
    >();

  const [saveError, setSaveError] =
    useState<string | null>(null);

  // ---------------------------------------------------------------------------
  // Persisted pricing
  // ---------------------------------------------------------------------------

  const persistedPricing =
    useMemo<
      JourneyPricingFormSubmitValue | undefined
    >(() => {
      const pricing =
        pricingQuery.data;

      if (!pricing) {
        return undefined;
      }

      return {
        amount:
          pricing.amount,
        currency:
          pricing.currency,
      };
    }, [pricingQuery.data]);

  // ---------------------------------------------------------------------------
  // Form value
  // ---------------------------------------------------------------------------

  /**
   * Once the user starts editing, the local draft takes precedence over the
   * persisted server value.
   */
  const pricingValue = useMemo<
    JourneyPricingFormSubmitValue | undefined
  >(() => {
    if (pricingDraft) {
      return {
        amount:
          pricingDraft.amount ??
          persistedPricing?.amount ??
          0,
        currency:
          pricingDraft.currency ??
          persistedPricing?.currency ??
          'KES',
      };
    }

    return persistedPricing;
  }, [
    pricingDraft,
    persistedPricing,
  ]);

  // ---------------------------------------------------------------------------
  // Form change
  // ---------------------------------------------------------------------------

  const handlePricingChange =
    useCallback(
      (
        value: Partial<JourneyPricingFormSubmitValue>,
      ) => {
        setSaveError(null);

        setPricingDraft((current) => ({
          ...current,
          ...value,
        }));
      },
      [],
    );

  // ---------------------------------------------------------------------------
  // Save pricing
  // ---------------------------------------------------------------------------

  const handlePricingSubmit =
    useCallback(
      async (
        pricing: JourneyPricingFormSubmitValue,
      ) => {
        setSaveError(null);

        try {
          const pricingNeedsPersistence =
            !persistedPricing ||
            !isSamePricing(
              pricing,
              persistedPricing,
            );

          if (pricingNeedsPersistence) {
            await attachPricing.mutateAsync({
              journeyPublicId,
              amount:
                pricing.amount,
              currency:
                pricing.currency,
            });
          }

          setPricingDraft(
            undefined,
          );

          router.push(
            AUTHENTICATED_ROUTES.JOURNEY_CREATE_PREFERENCES(
              journeyPublicId,
            ),
          );
        } catch (error) {
          setSaveError(
            error instanceof Error
              ? error.message
              : 'Unable to save the Journey pricing. Please try again.',
          );
        }
      },
      [
        attachPricing,
        journeyPublicId,
        persistedPricing,
        router,
      ],
    );

  // ---------------------------------------------------------------------------
  // Remove pricing
  // ---------------------------------------------------------------------------

  const handleRemovePricing =
    useCallback(
      async () => {
        setSaveError(null);

        try {
          await removePricing.mutateAsync({
            journeyPublicId,
          });

          setPricingDraft(
            undefined,
          );
        } catch (error) {
          setSaveError(
            error instanceof Error
              ? error.message
              : 'Unable to remove the Journey pricing. Please try again.',
          );
        }
      },
      [
        journeyPublicId,
        removePricing,
      ],
    );

  // ---------------------------------------------------------------------------
  // Navigation
  // ---------------------------------------------------------------------------

  const handleBack = useCallback(() => {
    router.push(
      AUTHENTICATED_ROUTES.JOURNEY_CREATE_SEATS(
        journeyPublicId,
      ),
    );
  }, [
    journeyPublicId,
    router,
  ]);

  const handleContinue = useCallback(() => {
    const form = document.getElementById(
      'journey-pricing-form',
    );

    if (!(form instanceof HTMLFormElement)) {
      return;
    }

    form.requestSubmit();
  }, []);

  // ---------------------------------------------------------------------------
  // Loading state
  // ---------------------------------------------------------------------------

  if (pricingQuery.isLoading) {
    return (
      <JourneyPricingStep>
        <div
          className={[
            'rounded-[var(--radius-lg)]',
            'border',
            'border-[var(--border)]',
            'bg-[var(--surface)]',
            'p-5',
          ].join(' ')}
        >
          <p className="text-sm text-[var(--foreground-muted)]">
            Loading pricing…
          </p>
        </div>
      </JourneyPricingStep>
    );
  }

  // ---------------------------------------------------------------------------
  // Query error
  // ---------------------------------------------------------------------------

  if (pricingQuery.isError) {
    return (
      <JourneyPricingStep>
        <div
          role="alert"
          className={[
            'rounded-[var(--radius-lg)]',
            'border',
            'border-[var(--danger)]',
            'bg-[var(--surface)]',
            'p-5',
          ].join(' ')}
        >
          <p className="text-sm font-medium text-[var(--danger)]">
            Unable to load the Journey pricing.
          </p>

          <p className="mt-1 text-sm leading-6 text-[var(--foreground-secondary)]">
            {pricingQuery.error instanceof Error
              ? pricingQuery.error.message
              : 'Please try again.'}
          </p>

          <div className="mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                pricingQuery.refetch()
              }
            >
              Try again
            </Button>
          </div>
        </div>
      </JourneyPricingStep>
    );
  }

  // ---------------------------------------------------------------------------
  // Mutation state
  // ---------------------------------------------------------------------------

  const isSaving =
    attachPricing.isPending ||
    removePricing.isPending;

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <JourneyPricingStep>
      <div className="space-y-6">
        <JourneyPricingForm
          key={journeyPublicId}
          initialValue={pricingValue}
          disabled={isSaving}
          onChange={
            handlePricingChange
          }
          onSubmit={
            handlePricingSubmit
          }
        />

        {saveError && (
          <div
            role="alert"
            className={[
              'rounded-[var(--radius-md)]',
              'border',
              'border-[var(--danger)]',
              'bg-[var(--surface)]',
              'px-4',
              'py-3',
            ].join(' ')}
          >
            <p className="text-sm text-[var(--danger)]">
              {saveError}
            </p>
          </div>
        )}

        {persistedPricing && (
          <div
            className={[
              'flex',
              'items-center',
              'justify-between',
              'gap-4',
              'border-t',
              'border-[var(--border)]',
              'pt-5',
            ].join(' ')}
          >
            <div>
              <p className="text-sm font-medium text-[var(--foreground)]">
                Remove pricing
              </p>

              <p className="mt-1 text-sm text-[var(--foreground-muted)]">
                Remove the current pricing configuration and set it again.
              </p>
            </div>

            <Button
              type="button"
              variant="danger"
              size="sm"
              loading={
                removePricing.isPending
              }
              disabled={
                attachPricing.isPending
              }
              onClick={
                handleRemovePricing
              }
            >
              Remove
            </Button>
          </div>
        )}

        <div
          className={[
            'flex',
            'flex-col-reverse',
            'gap-3',
            'border-t',
            'border-[var(--border)]',
            'pt-5',
            'sm:flex-row',
            'sm:items-center',
            'sm:justify-between',
          ].join(' ')}
        >
          <Button
            type="button"
            variant="ghost"
            disabled={isSaving}
            onClick={handleBack}
          >
            Back
          </Button>

          <Button
            type="button"
            loading={
              attachPricing.isPending
            }
            disabled={
              removePricing.isPending
            }
            onClick={handleContinue}
          >
            Save and continue
          </Button>
        </div>
      </div>
    </JourneyPricingStep>
  );
}