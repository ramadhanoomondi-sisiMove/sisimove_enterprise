// -----------------------------------------------------------------------------
// sisiMove — Verification Badge
// -----------------------------------------------------------------------------
//
// Reusable presentation component for displaying a traveller's public
// verification level.
//
// This component:
//
// - receives a public verification level;
// - does not fetch Trust data;
// - does not expose verification evidence;
// - does not import backend or Prisma enums;
// - can be reused by Journey cards, Demand cards, and public profiles.
//
// -----------------------------------------------------------------------------

import type { PublicTrustVerificationLevel } from "@/features/trust/models";

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface VerificationBadgeProps {
  /**
   * Public verification level.
   */
  verificationLevel: PublicTrustVerificationLevel;

  /**
   * Whether to display the verification level as text.
   *
   * Defaults to true.
   */
  showLabel?: boolean;

  /**
   * Optional additional class name.
   */
  className?: string;
}

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function getVerificationLabel(
  verificationLevel: PublicTrustVerificationLevel,
): string {
  switch (verificationLevel) {
    case "BASIC":
      return "Basic";

    case "VERIFIED":
      return "Verified";

    case "HIGHLY_VERIFIED":
      return "Highly verified";

    case "NONE":
    default:
      return "Not verified";
  }
}

function getVerificationStyles(
  verificationLevel: PublicTrustVerificationLevel,
): string {
  switch (verificationLevel) {
    case "HIGHLY_VERIFIED":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";

    case "VERIFIED":
      return "border-blue-200 bg-blue-50 text-blue-700";

    case "BASIC":
      return "border-slate-200 bg-slate-50 text-slate-700";

    case "NONE":
    default:
      return "border-slate-200 bg-slate-50 text-slate-500";
  }
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function VerificationBadge({
  verificationLevel,
  showLabel = true,
  className,
}: VerificationBadgeProps) {
  const label = getVerificationLabel(verificationLevel);
  const styles = getVerificationStyles(verificationLevel);

  return (
    <span
      className={[
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium",
        styles,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      title={`Verification level: ${label}`}
    >
      <span aria-hidden="true">✓</span>

      {showLabel ? <span>{label}</span> : null}
    </span>
  );
}