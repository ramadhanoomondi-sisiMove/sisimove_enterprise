// -----------------------------------------------------------------------------
// sisiMove — Report Completion Problem Dialog
// -----------------------------------------------------------------------------
//
// Presentation dialog for reporting a problem with a journey completion.
//
// Responsibilities:
// - present the report-problem form;
// - collect the dispute reason;
// - collect an optional description;
// - own the open-dispute mutation;
// - provide loading and error feedback;
// - close after a successful submission.
//
// Non-responsibilities:
// - authorization;
// - authentication;
// - HTTP/API calls;
// - deciding whether the current member is allowed to report;
// - dispute lifecycle management;
// - local completion mutation.
//
// The backend remains authoritative for authorization and dispute lifecycle
// validation.
//
// -----------------------------------------------------------------------------

'use client';

import {
  useState,
  type FormEvent,
} from 'react';

import {
  Button,
  Dialog,
  Select,
  Textarea,
} from '@/components/ui';

import {
  JourneyCompletionDisputeReason,
  type JourneyCompletion,
} from '@/features/journey-completion/models';

import {
  useOpenJourneyCompletionDispute,
} from '@/features/journey-completion/hooks/mutations';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface ReportCompletionProblemDialogProps {
  /**
   * Journey completion for which the problem is being reported.
   */
  completion: JourneyCompletion;

  /**
   * Controls whether the dialog is visible.
   */
  open: boolean;

  /**
   * Called when the dialog should be opened or closed.
   */
  onOpenChange: (open: boolean) => void;
}

// -----------------------------------------------------------------------------
// Reason options
// -----------------------------------------------------------------------------

const DISPUTE_REASON_OPTIONS = [
  {
    value: JourneyCompletionDisputeReason.JOURNEY_NOT_COMPLETED,
    label: 'Journey was not completed',
  },
  {
    value: JourneyCompletionDisputeReason.JOURNEY_CANCELLED,
    label: 'Journey was cancelled',
  },
  {
    value: JourneyCompletionDisputeReason.PASSENGER_DID_NOT_TRAVEL,
    label: 'Passenger did not travel',
  },
  {
    value:
      JourneyCompletionDisputeReason.PROVIDER_DID_NOT_COMPLETE_JOURNEY,
    label: 'Provider did not complete the journey',
  },
  {
    value: JourneyCompletionDisputeReason.BOOKING_DISPUTE,
    label: 'Booking dispute',
  },
  {
    value: JourneyCompletionDisputeReason.OTHER,
    label: 'Other',
  },
] as const;

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function ReportCompletionProblemDialog({
  completion,
  open,
  onOpenChange,
}: ReportCompletionProblemDialogProps) {
  // ---------------------------------------------------------------------------
  // Local form state
  // ---------------------------------------------------------------------------
  //
  // This state belongs to the presentation form only. It does not represent
  // domain state and does not attempt to mutate the completion locally.
  //

  const [reason, setReason] =
    useState<JourneyCompletionDisputeReason>(
      JourneyCompletionDisputeReason.OTHER,
    );

  const [description, setDescription] =
    useState('');

  // ---------------------------------------------------------------------------
  // Mutation
  // ---------------------------------------------------------------------------

  const openDispute =
    useOpenJourneyCompletionDispute();

  // ---------------------------------------------------------------------------
  // Submit
  // ---------------------------------------------------------------------------

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    openDispute.mutate(
      {
        journeyCompletionPublicId: completion.publicId,
        request: {
          reason,
          description:
            description.trim().length > 0
              ? description.trim()
              : undefined,
        },
      },
      {
        onSuccess: () => {
          setReason(
            JourneyCompletionDisputeReason.OTHER,
          );
          setDescription('');
          onOpenChange(false);
        },
      },
    );
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title="Report a problem"
      description="Tell us what went wrong with this journey completion."
    >
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4"
      >
        {/* ----------------------------------------------------------------- */}
        {/* Reason                                                            */}
        {/* ----------------------------------------------------------------- */}

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="completion-problem-reason"
            className="text-sm font-medium text-[var(--foreground)]"
          >
            Problem
          </label>

          <Select
            id="completion-problem-reason"
            value={reason}
            onChange={(event) =>
              setReason(
                event.target
                  .value as JourneyCompletionDisputeReason,
              )
            }
            disabled={openDispute.isPending}
          >
            {DISPUTE_REASON_OPTIONS.map((option) => (
              <option
                key={option.value}
                value={option.value}
              >
                {option.label}
              </option>
            ))}
          </Select>
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* Description                                                       */}
        {/* ----------------------------------------------------------------- */}

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="completion-problem-description"
            className="text-sm font-medium text-[var(--foreground)]"
          >
            Details
          </label>

          <Textarea
            id="completion-problem-description"
            value={description}
            onChange={(event) =>
              setDescription(event.target.value)
            }
            placeholder="Describe what happened..."
            rows={5}
            disabled={openDispute.isPending}
          />

          <p className="text-xs text-[var(--foreground-secondary)]">
            You can provide additional context to help with the
            review.
          </p>
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* Error                                                             */}
        {/* ----------------------------------------------------------------- */}

        {openDispute.isError && (
          <p
            role="alert"
            className="text-sm text-[var(--danger)]"
          >
            {openDispute.error instanceof Error
              ? openDispute.error.message
              : 'Unable to report the problem. Please try again.'}
          </p>
        )}

        {/* ----------------------------------------------------------------- */}
        {/* Actions                                                           */}
        {/* ----------------------------------------------------------------- */}

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="secondary"
            size="md"
            disabled={openDispute.isPending}
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            variant="primary"
            size="md"
            loading={openDispute.isPending}
            disabled={openDispute.isPending}
          >
            {openDispute.isPending
              ? 'Reporting…'
              : 'Report problem'}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}