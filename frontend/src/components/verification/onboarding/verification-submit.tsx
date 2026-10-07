'use client';

// -----------------------------------------------------------------------------
// Path: src/components/verification/onboarding/verification-submit.tsx
// -----------------------------------------------------------------------------
//
// sisiMove — Verification Request Submission
//
// Dependency level: 3
//
// Responsibility
// --------------
// Owns the interaction for submitting one selected verification requirement.
//
// Frontend responsibilities:
// - present the selected VerificationRequirement;
// - allow file selection;
// - validate that a file was selected;
// - validate the request type against the frontend API schema;
// - submit the raw File through useSubmitVerificationRequest();
// - present mutation state and backend errors;
// - report successful submission to the feature-level workflow.
//
// Backend responsibilities:
// - authenticate the current identity;
// - resolve Verification;
// - determine eligibility;
// - determine required verification types;
// - enforce request lifecycle rules;
// - enforce pending-request rules;
// - create/upload the Asset;
// - create the VerificationRequest;
// - enforce authoritative file/content validation;
// - authorize the operation.
//
// This component does NOT:
// - load Verification;
// - load Verification Requests;
// - calculate VerificationRequirement[];
// - create Assets directly;
// - call verification APIs directly;
// - cancel requests;
// - navigate;
// - implement a modal;
// - determine backend eligibility.
//
// Requirement status
// ------------------
// The component uses the exact VerificationRequirementStatus model:
//
//     NOT_STARTED
//     PENDING
//     APPROVED
//     REJECTED
//     CANCELLED
//
// Submission is allowed only for:
//
//     NOT_STARTED
//     REJECTED
//     CANCELLED
//
// Submission is blocked for:
//
//     PENDING
//     APPROVED
//
// No additional or inferred status values are introduced.
//
// File validation
// ---------------
// The frontend only validates that a File exists.
//
// MIME type, file size, file content, uploadability, and all authoritative
// verification constraints remain backend responsibilities unless those
// constraints are explicitly published as a shared API contract.
//
// Backend submission contract
// ---------------------------
// The frontend sends only:
//
//     type
//     file
//
// The backend creates and owns the Asset. The frontend never supplies an
// assetPublicId for this workflow.
//
// Mutation ownership
// ------------------
// VerificationSubmit owns the verification-request submission mutation through
// useSubmitVerificationRequest().
//
// VerificationOnboarding owns the surrounding feature workflow and decides
// what should happen after this component reports success.
//
// Design system
// -------------
// All visual styling uses the frozen sisiMove design tokens.
// No arbitrary colors, gradients, or dark-mode styling are introduced.
// -----------------------------------------------------------------------------

import { useCallback, useRef, useState } from 'react';

import { Button } from '@/components/ui';

import { useSubmitVerificationRequest } from '@/features/verification/hooks/use-submit-verification-request';
import type { VerificationRequirement } from '@/features/verification/models/verification-requirement';
import type { VerificationRequestType } from '@/features/verification/models/verification-request';
import { submitVerificationRequestSchema } from '@/features/verification/schemas/submit-verification-request.schema';

// =============================================================================
// Props
// =============================================================================

export interface VerificationSubmitProps {
  /**
   * The requirement currently selected by the feature-level onboarding
   * workflow.
   *
   * A null requirement means there is no submission surface to render.
   */
  readonly requirement: VerificationRequirement | null;

  /**
   * Reports successful submission to the owning workflow.
   *
   * The callback does not perform the mutation itself.
   * VerificationSubmit owns the mutation and invokes this callback only after
   * the backend accepts the request successfully.
   */
  readonly onSubmitted?: () => void;
}

// =============================================================================
// Requirement presentation helpers
// =============================================================================

function getRequirementLabel(
  type: VerificationRequestType,
): string {
  switch (type) {
    case 'PROFILE_PHOTO':
      return 'Profile photo';

    case 'GOVERNMENT_ID':
      return 'Government ID';

    case 'DRIVER_LICENSE':
      return 'Driver license';

    default:
      return type;
  }
}

function getRequirementStatusLabel(
  status: VerificationRequirement['status'],
): string {
  switch (status) {
    case 'NOT_STARTED':
      return 'Not started';

    case 'PENDING':
      return 'Under review';

    case 'APPROVED':
      return 'Approved';

    case 'REJECTED':
      return 'Needs attention';

    case 'CANCELLED':
      return 'Cancelled';

    default:
      return status;
  }
}

function getStatusMessage(
  requirement: VerificationRequirement,
): string | null {
  switch (requirement.status) {
    case 'NOT_STARTED':
      return null;

    case 'PENDING':
      return 'This verification requirement is currently under review.';

    case 'APPROVED':
      return 'This verification requirement has been approved.';

    case 'REJECTED':
      return (
        requirement.rejectionReason ??
        'This verification request was rejected. Please submit the requested information again.'
      );

    case 'CANCELLED':
      return 'This verification request was cancelled. You can submit a new request.';

    default:
      return null;
  }
}

// =============================================================================
// Submission rules
// =============================================================================

function canSubmit(
  status: VerificationRequirement['status'],
): boolean {
  switch (status) {
    case 'NOT_STARTED':
    case 'REJECTED':
    case 'CANCELLED':
      return true;

    case 'PENDING':
    case 'APPROVED':
      return false;

    default:
      return false;
  }
}

// =============================================================================
// Status presentation
// =============================================================================

function getStatusContainerClassName(
  status: VerificationRequirement['status'],
): string {
  switch (status) {
    case 'APPROVED':
      return 'border-[var(--success)] bg-[var(--success-soft)]';

    case 'PENDING':
      return 'border-[var(--warning)] bg-[var(--warning-soft)]';

    case 'REJECTED':
      return 'border-[var(--danger)] bg-[var(--danger-soft)]';

    case 'CANCELLED':
      return 'border-[var(--border)] bg-[var(--background-muted)]';

    case 'NOT_STARTED':
    default:
      return 'border-[var(--border)] bg-[var(--background-subtle)]';
  }
}

function getStatusTextClassName(
  status: VerificationRequirement['status'],
): string {
  switch (status) {
    case 'APPROVED':
      return 'text-[var(--success)]';

    case 'PENDING':
      return 'text-[var(--warning)]';

    case 'REJECTED':
      return 'text-[var(--danger)]';

    case 'CANCELLED':
    case 'NOT_STARTED':
    default:
      return 'text-[var(--foreground-secondary)]';
  }
}

function getStatusBadgeClassName(
  status: VerificationRequirement['status'],
): string {
  switch (status) {
    case 'APPROVED':
      return [
        'border-[var(--success)]',
        'bg-[var(--success-soft)]',
        'text-[var(--success)]',
      ].join(' ');

    case 'PENDING':
      return [
        'border-[var(--warning)]',
        'bg-[var(--warning-soft)]',
        'text-[var(--warning)]',
      ].join(' ');

    case 'REJECTED':
      return [
        'border-[var(--danger)]',
        'bg-[var(--danger-soft)]',
        'text-[var(--danger)]',
      ].join(' ');

    case 'CANCELLED':
      return [
        'border-[var(--border)]',
        'bg-[var(--background-muted)]',
        'text-[var(--foreground-muted)]',
      ].join(' ');

    case 'NOT_STARTED':
    default:
      return [
        'border-[var(--border)]',
        'bg-[var(--background-subtle)]',
        'text-[var(--foreground-secondary)]',
      ].join(' ');
  }
}

// =============================================================================
// Component
// =============================================================================

export function VerificationSubmit({
  requirement,
  onSubmitted,
}: VerificationSubmitProps) {
  const {
    isSubmitting,
    error,
    submit,
  } = useSubmitVerificationRequest();

  // ---------------------------------------------------------------------------
  // Local file state
  // ---------------------------------------------------------------------------
  //
  // File selection is presentation/workflow state owned by this component.
  //
  // The File is intentionally kept as a browser File object until submission.
  // The backend receives the multipart payload and owns Asset creation.
  // ---------------------------------------------------------------------------

  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // ---------------------------------------------------------------------------
  // File selection
  // ---------------------------------------------------------------------------

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = event.target.files?.[0] ?? null;

      setFileError(null);
      setFile(selectedFile);
    },
    [],
  );

  // ---------------------------------------------------------------------------
  // Submit
  // ---------------------------------------------------------------------------
  //
  // The component performs only frontend-safe checks before handing the raw
  // File to the mutation hook.
  //
  // Authoritative validation remains on the backend.
  // ---------------------------------------------------------------------------

  const handleSubmit = useCallback(async () => {
    if (!requirement) {
      return;
    }

    if (!canSubmit(requirement.status)) {
      return;
    }

    if (!file) {
      setFileError('Please select a verification file.');
      return;
    }

    setFileError(null);

    // -------------------------------------------------------------------------
    // Validate the request type against the frontend API contract.
    //
    // This protects the API boundary from an invalid requirement type without
    // duplicating backend verification rules.
    // -------------------------------------------------------------------------

    const parsed = submitVerificationRequestSchema.safeParse({
      type: requirement.type,
    });

    if (!parsed.success) {
      setFileError(
        parsed.error.issues[0]?.message ??
          'Unable to submit this verification request.',
      );
      return;
    }

    try {
      await submit(parsed.data, file);

      // -----------------------------------------------------------------------
      // Clear the browser file input after successful submission.
      //
      // The owning onboarding workflow will close this surface and reload the
      // authoritative Verification + VerificationRequest state.
      // -----------------------------------------------------------------------

      setFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      onSubmitted?.();
    } catch {
      /*
       * useSubmitVerificationRequest() owns normalization and exposes the
       * resulting error through its `error` state.
       *
       * This component deliberately does not duplicate error handling.
       */
    }
  }, [
    file,
    onSubmitted,
    requirement,
    submit,
  ]);

  // ---------------------------------------------------------------------------
  // Nothing selected
  // ---------------------------------------------------------------------------

  if (!requirement) {
    return null;
  }

  // ---------------------------------------------------------------------------
  // Derived presentation state
  // ---------------------------------------------------------------------------

  const requirementLabel = getRequirementLabel(
    requirement.type,
  );

  const statusLabel = getRequirementStatusLabel(
    requirement.status,
  );

  const statusMessage = getStatusMessage(
    requirement,
  );

  const isSubmittable = canSubmit(
    requirement.status,
  );

  const isDisabled =
    isSubmitting ||
    !isSubmittable;

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <section
      aria-labelledby="verification-submit-title"
      className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)]"
    >
      <div className="space-y-5">
        {/* ------------------------------------------------------------------ */}
        {/* Header                                                             */}
        {/* ------------------------------------------------------------------ */}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2
              id="verification-submit-title"
              className="text-base font-semibold text-[var(--foreground)]"
            >
              {requirement.status === 'REJECTED'
                ? `Resubmit ${requirementLabel}`
                : `Submit ${requirementLabel}`}
            </h2>

            <p className="mt-1 text-sm leading-5 text-[var(--foreground-secondary)]">
              Select the file you want to submit for verification.
            </p>
          </div>

          <span
            className={[
              'shrink-0 rounded-[var(--radius-full)] border px-2.5 py-1',
              'text-xs font-medium',
              getStatusBadgeClassName(requirement.status),
            ].join(' ')}
          >
            {statusLabel}
          </span>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* Requirement status                                                 */}
        {/* ------------------------------------------------------------------ */}

        {statusMessage && (
          <div
            className={[
              'rounded-[var(--radius-md)] border p-3',
              getStatusContainerClassName(requirement.status),
            ].join(' ')}
          >
            <p
              className={[
                'text-sm',
                getStatusTextClassName(requirement.status),
              ].join(' ')}
            >
              {statusMessage}
            </p>
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* File selection                                                     */}
        {/* ------------------------------------------------------------------ */}

        {isSubmittable && (
          <div>
            <label
              htmlFor="verification-file"
              className="block text-sm font-medium text-[var(--foreground)]"
            >
              Verification file
            </label>

            <p className="mt-1 text-xs text-[var(--foreground-muted)]">
              Select the document or image requested for this verification
              step.
            </p>

            <input
              ref={fileInputRef}
              id="verification-file"
              name="verification-file"
              type="file"
              disabled={isDisabled}
              onChange={handleFileChange}
              className={[
                'mt-3 block w-full',
                'rounded-[var(--radius-md)]',
                'border border-[var(--border)]',
                'bg-[var(--surface)]',
                'px-3 py-2',
                'text-sm text-[var(--foreground)]',
                'file:mr-3',
                'file:rounded-[var(--radius-sm)]',
                'file:border-0',
                'file:bg-[var(--brand-soft)]',
                'file:px-3 file:py-2',
                'file:text-sm file:font-medium',
                'file:text-[var(--brand)]',
                'focus:outline-none',
                'focus:ring-2',
                'focus:ring-[var(--brand)]',
                'focus:ring-offset-2',
                'disabled:cursor-not-allowed',
                'disabled:opacity-60',
              ].join(' ')}
            />

            {file && !fileError && (
              <p className="mt-2 text-sm text-[var(--foreground-secondary)]">
                Selected: {file.name}
              </p>
            )}

            {fileError && (
              <p
                role="alert"
                className="mt-2 text-sm text-[var(--danger)]"
              >
                {fileError}
              </p>
            )}
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* Backend submission error                                           */}
        {/* ------------------------------------------------------------------ */}

        {error && (
          <div
            role="alert"
            className="rounded-[var(--radius-md)] border border-[var(--danger)] bg-[var(--danger-soft)] p-3"
          >
            <p className="text-sm text-[var(--danger)]">
              {error.message}
            </p>
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* Submit                                                              */}
        {/* ------------------------------------------------------------------ */}

        {isSubmittable && (
          <div className="flex justify-end">
            <Button
              type="button"
              disabled={isDisabled || !file}
              onClick={() => {
                void handleSubmit();
              }}
            >
              {isSubmitting
                ? 'Submitting…'
                : requirement.status === 'REJECTED'
                  ? 'Resubmit for verification'
                  : 'Submit for verification'}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
