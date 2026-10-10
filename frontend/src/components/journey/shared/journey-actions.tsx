
"use client";

// -----------------------------------------------------------------------------
// Path: src/features/journey/components/shared/JourneyActions.tsx
// -----------------------------------------------------------------------------

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

  const actionGap = "gap-[clamp(0.25rem,0.55vw,0.45rem)]";

  const actionText = isCompact
    ? "text-[clamp(0.48rem,0.75vw,0.66rem)]"
    : "text-[clamp(0.52rem,0.82vw,0.72rem)]";

  const actionIcon = "size-[clamp(0.58rem,0.95vw,0.76rem)]";

  // Keep this as a string because cn() accepts individual class values,
  // not an array of class strings.
  const interactionClasses =
    "transition-all duration-200 ease-out " +
    "hover:-translate-y-0.5 hover:shadow-md " +
    "active:translate-y-0 active:scale-[0.98] " +
    "focus-visible:ring-2 " +
    "focus-visible:ring-[var(--brand)] " +
    "focus-visible:ring-offset-2 " +
    "disabled:translate-y-0 disabled:scale-100 " +
    "disabled:shadow-none";

  return (
    <div
      className={cn(
        "flex min-w-0 shrink-0 items-center justify-end",
        actionGap,
        className,
      )}
    >
      {/* View Journey */}

      {onView && (
        <span
          className="group/action relative inline-flex"
          title={
            viewDisabled
              ? "Viewing this Journey is currently unavailable"
              : "View Journey details"
          }
        >
          <Button
            type="button"
            variant="outline"
            size="sm"
            leadingIcon={
              <ArrowRight
                aria-hidden="true"
                className={cn(
                  actionIcon,
                  "transition-transform duration-200",
                  "group-hover/action:translate-x-0.5",
                )}
              />
            }
            onClick={onView}
            disabled={viewDisabled}
            className={cn(
              "w-auto min-w-0 shrink-0",
              actionHeight,
              actionPadding,
              actionText,
              "leading-none whitespace-nowrap",
              interactionClasses,
            )}
          >
            {viewLabel}
          </Button>
        </span>
      )}

      {/* Share */}

      {onShare && (
        <span
          className="group/action relative inline-flex"
          title={
            shareDisabled
              ? "Sharing this Journey is currently unavailable"
              : "Share this Journey with others"
          }
        >
          <Button
            type="button"
            variant="outline"
            size="sm"
            leadingIcon={
              <Share2
                aria-hidden="true"
                className={cn(
                  actionIcon,
                  "transition-transform duration-200",
                  "group-hover/action:scale-110",
                  "group-hover/action:-rotate-6",
                )}
              />
            }
            onClick={onShare}
            disabled={shareDisabled}
            className={cn(
              "w-auto min-w-0 shrink-0",
              actionHeight,
              actionPadding,
              actionText,
              "leading-none whitespace-nowrap",
              interactionClasses,
            )}
          >
            {shareLabel}
          </Button>
        </span>
      )}

      {/* Book Journey */}

      {onBook && (
        <span
          className="group/action relative inline-flex"
          title={
            isBooking
              ? "Your booking is being processed"
              : bookDisabled
                ? "Booking this Journey is currently unavailable"
                : "Reserve your seat on this Journey"
          }
        >
          <Button
            type="button"
            variant="primary"
            size="sm"
            leadingIcon={
              <BookOpen
                aria-hidden="true"
                className={cn(
                  actionIcon,
                  "transition-transform duration-200",
                  "group-hover/action:scale-110",
                )}
              />
            }
            onClick={onBook}
            loading={isBooking}
            disabled={bookDisabled || isBooking}
            className={cn(
              "w-auto min-w-0 shrink-0",
              actionHeight,
              actionPadding,
              actionText,
              "font-semibold leading-none whitespace-nowrap",
              interactionClasses,
            )}
          >
            {isBooking ? bookingLabel : bookLabel}
          </Button>
        </span>
      )}
    </div>
  );
}
