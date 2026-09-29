// -----------------------------------------------------------------------------
// Path: src/features/journey/components/shared/JourneyActions.tsx
// -----------------------------------------------------------------------------
//
// sisiMove — Journey Actions
//
// Fluid horizontal action group for Journey marketplace surfaces.
//
// Design:
// - Actions remain horizontal at every viewport size.
// - Button width, height, padding, typography and icons scale together.
// - No mobile-only stacking.
// - Designed for the dedicated JourneyCard footer.
// -----------------------------------------------------------------------------

"use client";

import {
  ArrowRight,
  BookOpen,
  Share2,
} from "lucide-react";

import { Button } from "@/components/ui";
import { cn } from "@/foundation/utils/cn";

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface JourneyActionsProps {
  readonly onView?: () => void;
  readonly onShare?: () => void;
  readonly onBook?: () => void;

  readonly isBooking?: boolean;

  readonly viewDisabled?: boolean;
  readonly shareDisabled?: boolean;
  readonly bookDisabled?: boolean;

  readonly emphasis?: "compact" | "default";

  readonly viewLabel?: string;
  readonly shareLabel?: string;
  readonly bookLabel?: string;
  readonly bookingLabel?: string;

  readonly className?: string;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyActions({
  onView,
  onShare,
  onBook,
  isBooking = false,
  viewDisabled = false,
  shareDisabled = false,
  bookDisabled = false,
  emphasis = "default",
  viewLabel = "View Journey",
  shareLabel = "Share",
  bookLabel = "Book Journey",
  bookingLabel = "Booking…",
  className,
}: JourneyActionsProps) {
  if (!onView && !onShare && !onBook) {
    return null;
  }

  const isCompact = emphasis === "compact";

  const actionHeight = isCompact
    ? "h-[clamp(1.65rem,3vw,2.25rem)]"
    : "h-[clamp(1.9rem,3.4vw,2.5rem)]";

  const actionPadding = isCompact
    ? "px-[clamp(0.45rem,1vw,0.75rem)]"
    : "px-[clamp(0.55rem,1.15vw,0.9rem)]";

  const actionGap =
    "gap-[clamp(0.25rem,0.55vw,0.45rem)]";

  const actionText = isCompact
    ? "text-[clamp(0.48rem,0.75vw,0.66rem)]"
    : "text-[clamp(0.52rem,0.82vw,0.72rem)]";

  const actionIcon =
    "size-[clamp(0.58rem,0.95vw,0.76rem)]";

  return (
    <div
      className={cn(
        "flex",
        "min-w-0",
        "shrink-0",
        "items-center",
        "justify-end",
        actionGap,
        className,
      )}
    >
      {/* ------------------------------------------------------------------- */}
      {/* View                                                                */}
      {/* ------------------------------------------------------------------- */}

      {onView && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          leadingIcon={
            <ArrowRight
              aria-hidden="true"
              className={actionIcon}
            />
          }
          onClick={onView}
          disabled={viewDisabled}
          className={cn(
            "w-auto",
            "min-w-0",
            "shrink-0",
            actionHeight,
            actionPadding,
            actionText,
            "leading-none",
            "whitespace-nowrap",
          )}
        >
          {viewLabel}
        </Button>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* Share                                                               */}
      {/* ------------------------------------------------------------------- */}

      {onShare && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          leadingIcon={
            <Share2
              aria-hidden="true"
              className={actionIcon}
            />
          }
          onClick={onShare}
          disabled={shareDisabled}
          className={cn(
            "w-auto",
            "min-w-0",
            "shrink-0",
            actionHeight,
            actionPadding,
            actionText,
            "leading-none",
            "whitespace-nowrap",
          )}
        >
          {shareLabel}
        </Button>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* Book                                                                */}
      {/* ------------------------------------------------------------------- */}

      {onBook && (
        <Button
          type="button"
          variant="primary"
          size="sm"
          leadingIcon={
            <BookOpen
              aria-hidden="true"
              className={actionIcon}
            />
          }
          onClick={onBook}
          loading={isBooking}
          disabled={bookDisabled || isBooking}
          className={cn(
            "w-auto",
            "min-w-0",
            "shrink-0",
            actionHeight,
            actionPadding,
            actionText,
            "font-semibold",
            "leading-none",
            "whitespace-nowrap",
          )}
        >
          {isBooking ? bookingLabel : bookLabel}
        </Button>
      )}
    </div>
  );
}