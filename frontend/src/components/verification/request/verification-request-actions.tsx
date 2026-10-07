
// -----------------------------------------------------------------------------
// Path: src/features/verification/components/request/verification-request-actions.tsx
// -----------------------------------------------------------------------------
//
// sisiMove — Verification Request Actions
//
// Responsibility
// --------------
// Owns user actions for one VerificationRequest.
//
// Current business action:
//     Cancel a pending verification request.
//
// Mutation ownership
// ------------------
// This component owns:
//
//     useCancelVerificationRequest()
//
// The parent does not provide an onCancel mutation handler.
//
// The backend remains authoritative for:
// - request ownership
// - lifecycle
// - eligibility
// - authorization
// - cancellation rules
//
// Asset boundary
// --------------
// Generic Asset operations are deliberately NOT performed here.
//
// A verification document is business evidence. Generic Asset deletion,
// archiving, or replacement must only occur through a higher-level
// verification workflow that understands VerificationRequest lifecycle.
//
// The reusable Asset components remain available through:
//
//     @/components/assets
//
// but are not blindly wired into request cancellation.
//
// -----------------------------------------------------------------------------

'use client';

import { useState } from 'react';

import { Button } from '@/components/ui';

import { useCancelVerificationRequest } from '@/features/verification/hooks/use-cancel-verification-request';
import type { VerificationRequest } from '@/features/verification/models/verification-request';

export interface VerificationRequestActionsProps {
  readonly request: VerificationRequest;
  readonly onCancelled?: (
    request: VerificationRequest,
  ) => void;
  readonly className?: string;
}

export function VerificationRequestActions({
  request,
  onCancelled,
  className,
}: VerificationRequestActionsProps) {
  const [isConfirming, setIsConfirming] = useState(false);

  const {
    cancel,
    isCancelling,
    error,
    reset,
  } = useCancelVerificationRequest();

  /**
   * Cancellation is a request-level lifecycle operation.
   *
   * The component supplies only the public identifiers required by the API.
   * Identity and authorization remain backend responsibilities.
   */
  async function handleCancel() {
    if (isCancelling) {
      return;
    }

    try {
      const cancelledRequest = await cancel(
        request.verificationPublicId,
        request.publicId,
      );

      setIsConfirming(false);

      onCancelled?.(cancelledRequest);
    } catch {
      // The hook retains the normalized error and exposes it through `error`.
      // The UI below presents that error to the user.
    }
  }

  function handleOpenConfirmation() {
    reset();
    setIsConfirming(true);
  }

  function handleCloseConfirmation() {
    if (isCancelling) {
      return;
    }

    reset();
    setIsConfirming(false);
  }

  /**
   * Only PENDING requests are cancellable from this surface.
   *
   * This is presentation gating, not authorization.
   * The backend still decides whether cancellation is actually permitted.
   */
  if (request.status !== 'PENDING') {
    return null;
  }

  if (!isConfirming) {
    return (
      <div
        className={[
          'mt-3',
          'flex',
          'justify-end',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleOpenConfirmation}
          disabled={isCancelling}
        >
          Cancel request
        </Button>
      </div>
    );
  }

  return (
    <div
      role="alertdialog"
      aria-labelledby={`cancel-verification-request-${request.publicId}`}
      aria-describedby={`cancel-verification-request-description-${request.publicId}`}
      className={[
        'mt-3',
        'rounded-[var(--radius-md)]',
        'border',
        'border-[var(--border)]',
        'bg-[var(--background-subtle)]',
        'p-4',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <p
        id={`cancel-verification-request-${request.publicId}`}
        className="text-sm font-semibold text-[var(--foreground)]"
      >
        Cancel this verification request?
      </p>

      <p
        id={`cancel-verification-request-description-${request.publicId}`}
        className="mt-1 text-sm text-[var(--foreground-secondary)]"
      >
        The request will be cancelled. You can submit another verification
        request when eligible.
      </p>

      {error ? (
        <p
          role="alert"
          className={[
            'mt-3',
            'rounded-[var(--radius-sm)]',
            'bg-[var(--danger-soft)]',
            'px-3',
            'py-2',
            'text-sm',
            'text-[var(--danger)]',
          ].join(' ')}
        >
          {error.message}
        </p>
      ) : null}

      <div className="mt-4 flex flex-wrap justify-end gap-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleCloseConfirmation}
          disabled={isCancelling}
        >
          Keep request
        </Button>

        <Button
          type="button"
          variant="danger"
          size="sm"
          loading={isCancelling}
          onClick={handleCancel}
          disabled={isCancelling}
        >
          Cancel request
        </Button>
      </div>
    </div>
  );
}

export default VerificationRequestActions;

