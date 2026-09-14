// -----------------------------------------------------------------------------
// sisiMove — Traveller Summary
// -----------------------------------------------------------------------------
//
// Reusable public presentation component for displaying a Traveller Profile
// summary.
//
// This component is presentation-only:
//
// - receives a resolved PublicTraveller model;
// - does not fetch traveller data;
// - does not fetch trust data;
// - does not access private identity information;
// - can be reused by Journey cards, Demand cards, and public detail pages.
//
// -----------------------------------------------------------------------------

import Link from "next/link";

import { Avatar } from "@/components/ui/avatar";
import type { PublicTraveller } from "@/features/traveller-profile/models";

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface TravellerSummaryProps {
  /**
   * Public traveller read model.
   */
  traveller: PublicTraveller;

  /**
   * Whether the traveller handle should link to the public traveller page.
   *
   * Defaults to true.
   */
  linkToProfile?: boolean;

  /**
   * Optional additional class name for the root element.
   */
  className?: string;
}

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function getTravellerInitials(traveller: PublicTraveller): string {
  const handle = traveller.handle.trim().replace(/^@+/, "");

  if (handle.length === 0) {
    return "?";
  }

  const words = handle.split(/[\s_-]+/).filter(Boolean);

  if (words.length === 0) {
    return "?";
  }

  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }

  return `${words[0][0]}${words[1][0]}`.toUpperCase();
}

function formatHandle(handle: string): string {
  const normalizedHandle = handle.trim().replace(/^@+/, "");

  return normalizedHandle.length > 0
    ? `@${normalizedHandle}`
    : "@traveller";
}

function getTravellerProfileHref(traveller: PublicTraveller): string {
  return `/travellers/${encodeURIComponent(traveller.handle)}`;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function TravellerSummary({
  traveller,
  linkToProfile = true,
  className,
}: TravellerSummaryProps) {
  const handleLabel = formatHandle(traveller.handle);
  const initials = getTravellerInitials(traveller);
  const profileHref = getTravellerProfileHref(traveller);

  const avatar = traveller.avatar;

  const avatarContent = (
    <Avatar
      src={avatar?.url ?? undefined}
      alt={avatar?.alt ?? `${handleLabel} avatar`}
      fallback={initials}
      size="md"
    />
  );

  return (
    <div className={className ?? "flex min-w-0 items-center gap-3"}>
      {linkToProfile ? (
        <Link
          href={profileHref}
          aria-label={`View ${handleLabel} traveller profile`}
          className="shrink-0 rounded-full outline-offset-2 transition-opacity hover:opacity-85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring"
        >
          {avatarContent}
        </Link>
      ) : (
        <div className="shrink-0">{avatarContent}</div>
      )}

      <div className="min-w-0">
        {linkToProfile ? (
          <Link
            href={profileHref}
            className="block max-w-full truncate rounded-sm text-sm font-semibold text-foreground outline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring"
          >
            {handleLabel}
          </Link>
        ) : (
          <span className="block truncate text-sm font-semibold text-foreground">
            {handleLabel}
          </span>
        )}

        {traveller.bio ? (
          <p className="mt-0.5 line-clamp-2 text-sm text-muted-foreground">
            {traveller.bio}
          </p>
        ) : null}
      </div>
    </div>
  );
}