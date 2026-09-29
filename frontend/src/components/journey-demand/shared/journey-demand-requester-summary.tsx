// -----------------------------------------------------------------------------
// Path: src/features/journey-demands/components/shared/journey-demand-requester-summary.tsx
// -----------------------------------------------------------------------------
//
// sisiMove — Journey Demand Requester Summary
//
// Compact public requester identity block used by Journey Demand marketplace
// cards and detail surfaces.
//
// Responsibilities:
// - Render the requester's public avatar.
// - Render the public @handle.
// - Render concise public trust evidence.
//
// This component does NOT:
// - fetch requester data;
// - fetch trust data;
// - perform navigation;
// - calculate trust scores;
// - infer verification state;
// - expose private identity information.
//
// Marketplace presentation:
// - Dense enough for the Journey Demand marketplace card.
// - @handle remains the primary requester identity.
// - Trust evidence is secondary.
// - Avoids unnecessary vertical expansion.
// - Uses frozen design-token variables.
// -----------------------------------------------------------------------------

import { Avatar } from "@/components/ui";

import type {
  PublicJourneyDemandRequester,
} from "@/features/journey-demand/models";

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface JourneyDemandRequesterSummaryProps {
  readonly requester: PublicJourneyDemandRequester;
  readonly emphasis?: "compact" | "default";
  readonly className?: string;
}

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function normalizeHandle(handle: string): string {
  const normalizedHandle = handle.trim().replace(/^@+/, "");

  return normalizedHandle.length > 0
    ? `@${normalizedHandle}`
    : "@";
}

function getVerificationLabel(
  verificationLevel: PublicJourneyDemandRequester["trust"]["verificationLevel"],
): string | null {
  switch (verificationLevel) {
    case "HIGHLY_VERIFIED":
      return "Highly verified";

    case "VERIFIED":
      return "Verified";

    case "BASIC":
      return "Basic verification";

    case "NONE":
    default:
      return null;
  }
}

/**
 * Creates a short, readable avatar fallback from a public handle.
 *
 * Examples:
 * - "jane_doe" -> "JD"
 * - "jane-doe" -> "JD"
 * - "jane" -> "JA"
 *
 * The fallback is intentionally derived only from the public handle.
 * It does not attempt to infer a person's real name.
 */
function getAvatarFallback(handle: string): string {
  const words = handle
    .replace(/^@+/, "")
    .split(/[\s_-]+/)
    .filter(Boolean);

  if (words.length === 0) {
    return "?";
  }

  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }

  return words
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase();
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyDemandRequesterSummary({
  requester,
  emphasis = "default",
  className,
}: JourneyDemandRequesterSummaryProps) {
  const { traveller, trust } = requester;

  const handle = normalizeHandle(traveller.handle);
  const avatarFallback = getAvatarFallback(traveller.handle);
  const verificationLabel = getVerificationLabel(
    trust.verificationLevel,
  );

  const isCompact = emphasis === "compact";

  return (
    <div
      className={[
        "flex",
        "min-w-0",
        "items-center",
        isCompact ? "gap-1.5" : "gap-2.5",
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* -----------------------------------------------------------------
          Avatar
          ----------------------------------------------------------------- */}

      <Avatar
        src={traveller.avatar?.url}
        alt={`Avatar for ${handle}`}
        fallback={avatarFallback}
        size={isCompact ? "sm" : "md"}
      />

      {/* -----------------------------------------------------------------
          Public identity + trust
          ----------------------------------------------------------------- */}

      <div className="min-w-0">
        <p
          className={[
            "truncate",
            "font-semibold",
            "leading-tight",
            "text-[var(--foreground)]",
            isCompact ? "text-sm" : "text-base",
          ].join(" ")}
          title={handle}
        >
          {handle}
        </p>

        <div
          className={[
            "mt-0.5",
            "flex",
            "min-w-0",
            "items-center",
            "gap-x-1.5",
            "overflow-hidden",
            "whitespace-nowrap",
            "text-[var(--foreground-muted)]",
            isCompact ? "text-[10px]" : "text-xs",
          ].join(" ")}
        >
          {/* Verification */}

          {verificationLabel !== null && (
            <span className="flex shrink-0 items-center">
              <span
                aria-hidden="true"
                className="mr-0.5 font-semibold text-[var(--success)]"
              >
                ✓
              </span>

              {verificationLabel}
            </span>
          )}

          {/* Rating */}

          {trust.ratingCount > 0 && (
            <span className="shrink-0">
              <span aria-hidden="true">★</span>{" "}
              {trust.ratingAverage.toFixed(1)}
              {" · "}
              {trust.ratingCount}
            </span>
          )}

          {/* Completed journeys */}

          {trust.completedJourneys > 0 && (
            <span className="shrink-0">
              {trust.completedJourneys}{" "}
              {trust.completedJourneys === 1
                ? "journey"
                : "journeys"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}