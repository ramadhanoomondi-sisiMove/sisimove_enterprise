// -----------------------------------------------------------------------------
// sisiMove — Journey Expire Action
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - present the Journey expire action;
// - own the expire mutation for the UI it renders;
// - expose pending/error state through the action UI;
// - notify the parent after a successful expiration.
//
// Non-responsibilities:
// - no Journey status inference;
// - no expiration eligibility calculation;
// - no authorization decisions;
// - no verification checks;
// - no navigation;
// - no route construction;
// - no scheduling logic;
// - no automatic expiration;
// - no Journey aggregate reconstruction.
//
// The backend remains authoritative for whether the Journey can be expired.
//
// Automatic/system-driven expiration is a separate concern. This component
// only exposes the explicit expire command supplied by the Journey API.
//
// The parent decides whether this action should be rendered.
//
// -----------------------------------------------------------------------------

"use client";

import { useState } from "react";

import { Button } from "@/components/ui";
import { ErrorState } from "@/components/ui/error-state";
import { cn } from "@/foundation/utils/cn";

import { useExpireJourney } from "@/features/journey/hooks/mutations";

// =============================================================================
// Icons
// =============================================================================

function ExpireIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="size-4"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 6v6l3.5 2"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 12a7.5 7.5 0 1 1-2.196-5.304"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17 4.5h3.5V8"
      />
    </svg>
  );
}

// =============================================================================
// Props
// =============================================================================

export interface JourneyExpireActionProps {
  /**
   * Public identifier of the Journey being expired.
   */
  readonly journeyPublicId: string;

  /**
   * Allows the parent management surface to disable the action.
   *
   * This does not replace backend lifecycle validation.
   */
  readonly disabled?: boolean;

  /**
   * Called after the expire command succeeds.
   *
   * The parent can use this to refetch the Journey projection or update
   * management presentation state.
   */
  readonly onExpired?: () => void | Promise<void>;

  /**
   * Optional action label.
   */
  readonly label?: string;

  /**
   * Optional label displayed while the mutation is processing.
   */
  readonly expiringLabel?: string;

  /**
   * Optional additional classes.
   */
  readonly className?: string;
}

// =============================================================================
// Component
// =============================================================================

export function JourneyExpireAction({
  journeyPublicId,
  disabled = false,
  onExpired,
  label = "Expire Journey",
  expiringLabel = "Expiring…",
  className,
}: JourneyExpireActionProps) {
  const [error, setError] = useState<Error | null>(null);

  const expireJourneyMutation = useExpireJourney();

  const isPending = expireJourneyMutation.isPending;
  const isDisabled = disabled || isPending;

  // ===========================================================================
  // Expire
  // ===========================================================================

  async function handleExpire(): Promise<void> {
    if (isDisabled) {
      return;
    }

    const normalizedJourneyPublicId =
      journeyPublicId.trim();

    if (normalizedJourneyPublicId.length === 0) {
      setError(
        new Error(
          "Journey public ID is required to expire the Journey.",
        ),
      );

      return;
    }

    setError(null);

    try {
      await expireJourneyMutation.expire(
        normalizedJourneyPublicId,
      );

      await onExpired?.();
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause
          : new Error(
              "Unable to expire the Journey.",
            ),
      );
    }
  }

  // ===========================================================================
  // Render
  // ===========================================================================

  return (
    <div
      className={cn(
        "w-full",
        "space-y-2",
        className,
      )}
    >
      {error !== null && (
        <ErrorState
          title="We couldn't expire this Journey"
          description={error.message}
          retryAction={{
            label: "Try again",
            onClick: handleExpire,
            disabled: isDisabled,
          }}
        />
      )}

      <Button
        type="button"
        variant="danger"
        leadingIcon={<ExpireIcon />}
        onClick={handleExpire}
        loading={isPending}
        disabled={isDisabled}
      >
        {isPending ? expiringLabel : label}
      </Button>
    </div>
  );
}