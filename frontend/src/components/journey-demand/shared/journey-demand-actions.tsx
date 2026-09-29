"use client";

// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Marketplace Actions
// -----------------------------------------------------------------------------
//
// Responsibilities:
//
// - render View, Share, and Join Demand actions;
// - expose action callbacks supplied by the parent;
// - expose disabled/loading states;
// - support compact/default marketplace density;
// - allow the card to supply marketplace-specific icons.
//
// Non-responsibilities:
//
// - navigation;
// - sharing implementation;
// - authorization;
// - mutation execution;
// - authentication decisions.
//
// Marketplace presentation:
//
// - Compact horizontal action group.
// - No full-width buttons inside the card.
// - Labels remain on one line.
// - Buttons scale with the card density.
// - Join Demand remains the primary action.
// -----------------------------------------------------------------------------

import type { ReactNode } from "react";

import {
  ArrowRight,
  BookOpen,
} from "lucide-react";

import { Button } from "@/components/ui";

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface JourneyDemandActionsProps {
  /**
   * Opens the Journey Demand detail surface.
   *
   * Navigation is owned by the parent.
   */
  readonly onView: () => void;

  /**
   * Shares the Journey Demand.
   *
   * The parent owns the sharing implementation.
   */
  readonly onShare: () => void;

  /**
   * Joins the Journey Demand.
   *
   * The parent owns the mutation and authorization decision.
   */
  readonly onJoin: () => void;

  readonly viewLabel?: string;
  readonly shareLabel?: string;
  readonly joinLabel?: string;
  readonly joiningLabel?: string;

  /**
   * Whether the Join Demand mutation is currently processing.
   */
  readonly isJoining?: boolean;

  readonly viewDisabled?: boolean;
  readonly shareDisabled?: boolean;
  readonly joinDisabled?: boolean;

  /**
   * Optional marketplace-specific action icons.
   */
  readonly viewLeadingContent?: ReactNode;
  readonly shareLeadingContent?: ReactNode;
  readonly joinLeadingContent?: ReactNode;

  /**
   * Controls action density.
   */
  readonly emphasis?: "compact" | "default";

  readonly className?: string;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyDemandActions({
  onView,
  onShare,
  onJoin,
  viewLabel = "View",
  shareLabel = "Share",
  joinLabel = "Join Demand",
  joiningLabel = "Joining…",
  isJoining = false,
  viewDisabled = false,
  shareDisabled = false,
  joinDisabled = false,
  viewLeadingContent,
  shareLeadingContent,
  joinLeadingContent,
  emphasis = "compact",
  className,
}: JourneyDemandActionsProps) {
  const isCompact = emphasis === "compact";
  const size = isCompact ? "sm" : "md";

  const buttonClassName = [
    "min-w-0",
    "shrink-0",
    "whitespace-nowrap",
    isCompact ? "px-2.5" : "px-3",
  ].join(" ");

  return (
    <div
      className={[
        "flex",
        "w-auto",
        "min-w-0",
        "shrink-0",
        "items-center",
        "justify-end",
        "gap-1.5",
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* -----------------------------------------------------------------
          View
          ----------------------------------------------------------------- */}

      <Button
        type="button"
        variant="outline"
        size={size}
        leadingIcon={
          viewLeadingContent ?? (
            <ArrowRight
              aria-hidden="true"
              className="size-3.5"
            />
          )
        }
        disabled={viewDisabled}
        onClick={onView}
        className={buttonClassName}
      >
        {viewLabel}
      </Button>

      {/* -----------------------------------------------------------------
          Share
          ----------------------------------------------------------------- */}

      <Button
        type="button"
        variant="outline"
        size={size}
        leadingIcon={shareLeadingContent}
        disabled={shareDisabled}
        onClick={onShare}
        className={buttonClassName}
      >
        {shareLabel}
      </Button>

      {/* -----------------------------------------------------------------
          Join
          ----------------------------------------------------------------- */}

      <Button
        type="button"
        variant="primary"
        size={size}
        leadingIcon={
          joinLeadingContent ?? (
            <BookOpen
              aria-hidden="true"
              className="size-3.5"
            />
          )
        }
        disabled={joinDisabled || isJoining}
        onClick={onJoin}
        loading={isJoining}
        className={[
          buttonClassName,
          "font-semibold",
        ].join(" ")}
      >
        {isJoining ? joiningLabel : joinLabel}
      </Button>
    </div>
  );
}