// -----------------------------------------------------------------------------
// sisiMove — Join sisiMove
// -----------------------------------------------------------------------------
//
// Reusable public account-action component for visitors who want to join
// sisiMove.
//
// This component is presentation-only.
//
// It does not:
// - create an account;
// - access authentication state;
// - call an API;
// - perform registration.
//
// The authentication boundary owns the actual registration flow.
//
// -----------------------------------------------------------------------------

import Link from "next/link";

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface JoinSisiMoveProps {
  /**
   * Registration destination.
   *
   * Defaults to the public registration route.
   */
  href?: string;

  /**
   * Optional additional class name.
   */
  className?: string;

  /**
   * Optional compact presentation.
   *
   * Useful for navigation/header surfaces.
   */
  compact?: boolean;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JoinSisiMove({
  href = "/register",
  className,
  compact = false,
}: JoinSisiMoveProps) {
  return (
    <Link
      href={href}
      className={[
        "inline-flex items-center justify-center rounded-lg bg-foreground font-semibold text-background transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        compact
          ? "min-h-9 px-4 py-2 text-sm"
          : "min-h-11 px-5 py-3 text-sm",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      Join sisiMove
    </Link>
  );
}