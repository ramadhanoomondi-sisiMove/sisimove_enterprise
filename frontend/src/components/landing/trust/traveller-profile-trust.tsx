// -----------------------------------------------------------------------------
// sisiMove — Traveller Profile Trust
// -----------------------------------------------------------------------------
//
// Public Trust presentation for a traveller profile.
//
// Responsibilities:
// - Present public Trust signals.
// - Present verification status.
// - Present aggregated rating.
// - Present journey-history summary.
// - Present public Trust badges.
//
// This component does not:
// - fetch Trust data;
// - calculate ratings;
// - determine verification status;
// - award badges;
// - access Identity data;
// - access Booking data;
// - access Financial data;
// - expose verification evidence;
// - expose internal Trust/risk information.
//
// Trust remains a separate feature from Traveller Profile. The traveller
// profile page may compose both features without either feature owning the
// other.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Next.js
// -----------------------------------------------------------------------------

import Image from 'next/image';

// -----------------------------------------------------------------------------
// Trust Feature
// -----------------------------------------------------------------------------

import type {
  TrustProfile,
} from '@/features/trust';

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const BADGE_IMAGE_SIZE = 40;

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface TravellerProfileTrustProps {
  profile: TrustProfile;
}

// -----------------------------------------------------------------------------
// Traveller Profile Trust
// -----------------------------------------------------------------------------

export function TravellerProfileTrust({
  profile,
}: TravellerProfileTrustProps) {
  return (
    <section
      aria-labelledby="traveller-trust-heading"
      className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8"
    >
      <div>
        <h2
          id="traveller-trust-heading"
          className="text-xl font-semibold tracking-tight text-neutral-950"
        >
          Trust
        </h2>

        <p className="mt-1 text-sm text-neutral-500">
          Information to help you understand this traveller.
        </p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <TravellerProfileTrustVerification
          verified={profile.verification.verified}
          level={profile.verification.level}
        />

        <TravellerProfileTrustRating
          score={profile.rating.score}
          count={profile.rating.count}
        />

        <TravellerProfileTrustHistory
          completedJourneys={
            profile.journeyHistory.completedJourneys
          }
          cancelledJourneys={
            profile.journeyHistory.cancelledJourneys
          }
        />
      </div>

      {profile.badges.length > 0 ? (
        <TravellerProfileTrustBadges
          badges={profile.badges}
        />
      ) : null}
    </section>
  );
}

// -----------------------------------------------------------------------------
// Verification
// -----------------------------------------------------------------------------

interface TravellerProfileTrustVerificationProps {
  verified: boolean;
  level: string | null;
}

function TravellerProfileTrustVerification({
  verified,
  level,
}: TravellerProfileTrustVerificationProps) {
  return (
    <div className="rounded-xl border border-neutral-200 p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
        Verification
      </p>

      <div className="mt-2 flex flex-wrap items-center gap-2">
        <span
          className={
            verified
              ? 'rounded-full bg-neutral-950 px-2.5 py-1 text-xs font-semibold text-white'
              : 'rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-semibold text-neutral-600'
          }
        >
          {verified ? 'Verified' : 'Not verified'}
        </span>

        {level ? (
          <span className="text-sm text-neutral-600">
            {level}
          </span>
        ) : null}
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Rating
// -----------------------------------------------------------------------------

interface TravellerProfileTrustRatingProps {
  score: number | null;
  count: number;
}

function TravellerProfileTrustRating({
  score,
  count,
}: TravellerProfileTrustRatingProps) {
  return (
    <div className="rounded-xl border border-neutral-200 p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
        Rating
      </p>

      <div className="mt-2">
        {score !== null ? (
          <p className="text-2xl font-semibold tracking-tight text-neutral-950">
            {score.toFixed(1)}
          </p>
        ) : (
          <p className="text-sm font-medium text-neutral-700">
            No rating yet
          </p>
        )}

        <p className="mt-1 text-sm text-neutral-500">
          {count === 1
            ? '1 eligible rating'
            : `${count} eligible ratings`}
        </p>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Journey History
// -----------------------------------------------------------------------------

interface TravellerProfileTrustHistoryProps {
  completedJourneys: number;
  cancelledJourneys: number | null;
}

function TravellerProfileTrustHistory({
  completedJourneys,
  cancelledJourneys,
}: TravellerProfileTrustHistoryProps) {
  return (
    <div className="rounded-xl border border-neutral-200 p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
        Journey history
      </p>

      <div className="mt-2">
        <p className="text-2xl font-semibold tracking-tight text-neutral-950">
          {completedJourneys}
        </p>

        <p className="mt-1 text-sm text-neutral-500">
          {completedJourneys === 1
            ? 'completed journey'
            : 'completed journeys'}
        </p>

        {cancelledJourneys !== null ? (
          <p className="mt-2 text-xs text-neutral-500">
            {cancelledJourneys === 1
              ? '1 cancelled journey'
              : `${cancelledJourneys} cancelled journeys`}
          </p>
        ) : null}
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Badges
// -----------------------------------------------------------------------------

interface TravellerProfileTrustBadgesProps {
  badges: TrustProfile['badges'];
}

function TravellerProfileTrustBadges({
  badges,
}: TravellerProfileTrustBadgesProps) {
  return (
    <div className="mt-6 border-t border-neutral-200 pt-6">
      <div>
        <h3 className="text-sm font-semibold text-neutral-950">
          Trust badges
        </h3>

        <p className="mt-1 text-sm text-neutral-500">
          Recognition awarded through SisiMove.
        </p>
      </div>

      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {badges.map((badge) => (
          <li
            key={badge.publicId}
            className="rounded-xl border border-neutral-200 p-4"
          >
            <div className="flex items-start gap-3">
              {badge.assetUrl ? (
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-neutral-100">
                  <Image
                    src={badge.assetUrl}
                    alt=""
                    fill
                    sizes={`${BADGE_IMAGE_SIZE}px`}
                    className="object-cover"
                  />
                </div>
              ) : (
                <div
                  aria-hidden="true"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-sm font-semibold text-neutral-600"
                >
                  ✓
                </div>
              )}

              <div className="min-w-0">
                <p className="font-medium text-neutral-950">
                  {badge.name}
                </p>

                {badge.description ? (
                  <p className="mt-1 text-sm leading-5 text-neutral-600">
                    {badge.description}
                  </p>
                ) : null}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}