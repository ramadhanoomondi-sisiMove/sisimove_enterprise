
"use client";

import { use } from "react";
import Link from "next/link";

import {
  Card,
  Container,
  ErrorState,
  Skeleton,
} from "@/components/ui";

import { useCurrentIdentity } from "@/features/identity";

import {
  JourneyBoardingActions,
  JourneyBoardingActivity,
  JourneyBoardingCard,
  JourneyBoardingProvider,
} from "@/components/journey-boarding";

import { useJourneyBoardingByJourney } from "@/features/journey-boarding/hooks";

import { AUTHENTICATED_ROUTES } from "@/foundation/routing";

interface JourneyBoardingPageProps {
  params: Promise<{
    journeyPublicId: string;
  }>;
}

function JourneyBoardingPageLoading() {
  return (
    <div className="page-shell">
      <Container className="page-container">
        <div className="section-sm">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-7 w-56" />
            <Skeleton className="h-4 w-80" />
          </div>
        </div>

        <div className="section">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_20rem]">
            <div className="flex min-w-0 flex-col gap-4">
              <Skeleton className="h-72 w-full rounded-[var(--radius-lg)]" />
              <Skeleton className="h-28 w-full rounded-[var(--radius-lg)]" />
              <Skeleton className="h-64 w-full rounded-[var(--radius-lg)]" />
            </div>

            <div className="flex min-w-0 flex-col gap-4">
              <Skeleton className="h-40 w-full rounded-[var(--radius-lg)]" />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

function JourneyBoardingPageError({
  message,
}: {
  message: string;
}) {
  return (
    <div className="page-shell">
      <Container className="page-container">
        <div className="section">
          <ErrorState
            title="Unable to load boarding"
            description={message}
          />

          <div className="mt-4">
            <Link
              href={AUTHENTICATED_ROUTES.MY_JOURNEYS}
              className={[
                "inline-flex min-h-9 items-center justify-center",
                "rounded-[var(--radius-md)]",
                "border border-[var(--border)]",
                "bg-[var(--background)]",
                "px-3 text-sm font-medium",
                "text-[var(--foreground)]",
                "transition-colors",
                "hover:bg-[var(--background-subtle)]",
                "focus-visible:outline-none",
                "focus-visible:ring-2",
                "focus-visible:ring-[var(--brand)]",
                "focus-visible:ring-offset-2",
              ].join(" ")}
            >
              Back to my journeys
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default function JourneyBoardingPage({
  params,
}: JourneyBoardingPageProps) {
  const { journeyPublicId } = use(params);

  const boardingQuery = useJourneyBoardingByJourney({
    journeyPublicId,
  });

  const identityQuery = useCurrentIdentity();

  if (boardingQuery.isPending || identityQuery.isPending) {
    return <JourneyBoardingPageLoading />;
  }

  if (boardingQuery.isError) {
    return (
      <JourneyBoardingPageError
        message={
          boardingQuery.error instanceof Error
            ? boardingQuery.error.message
            : "We could not load the boarding information for this journey."
        }
      />
    );
  }

  if (identityQuery.isError) {
    return (
      <JourneyBoardingPageError
        message={
          identityQuery.error instanceof Error
            ? identityQuery.error.message
            : "We could not resolve the authenticated identity."
        }
      />
    );
  }

  const boarding = boardingQuery.data;
  const identity = identityQuery.data;

  if (boarding === undefined) {
    return (
      <JourneyBoardingPageError
        message="No boarding record was found for this journey."
      />
    );
  }

  if (identity === null) {
    return (
      <JourneyBoardingPageError
        message="Your authenticated identity could not be resolved."
      />
    );
  }

  const isProvider =
    boarding.providerPublicId === identity.publicId;

  return (
    <div className="page-shell">
      <Container className="page-container">
        {/* Page heading */}

        <div className="section-sm">
          <div className="flex flex-col gap-1">
            <Link
              href={AUTHENTICATED_ROUTES.MY_JOURNEY(
                journeyPublicId,
              )}
              className={[
                "w-fit text-sm font-medium",
                "text-[var(--brand)]",
                "hover:text-[var(--brand-hover)]",
                "focus-visible:outline-none",
                "focus-visible:ring-2",
                "focus-visible:ring-[var(--brand)]",
                "focus-visible:ring-offset-2",
              ].join(" ")}
            >
              ← Back to journey
            </Link>

            <div className="mt-2">
              <h1 className="text-xl font-semibold tracking-tight text-[var(--foreground)] sm:text-2xl">
                Journey boarding
              </h1>

              <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
                Operational boarding for journey{" "}
                <span className="font-mono text-xs text-[var(--foreground-muted)]">
                  {journeyPublicId}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Operational dashboard */}

        <div className="section">
          <div
            className={
              isProvider
                ? "grid gap-4"
                : "grid gap-4 lg:grid-cols-[minmax(0,1fr)_20rem]"
            }
          >
            {/* Main boarding content */}

            <div className="flex min-w-0 flex-col gap-4">
              <JourneyBoardingCard
                boarding={boarding}
                isProvider={isProvider}
              />

              {isProvider && (
                <JourneyBoardingProvider
                  boarding={boarding}
                />
              )}

              <JourneyBoardingActivity
                boarding={boarding}
              />
            </div>

            {/* Passenger-only actions */}

            {!isProvider && (
              <aside className="flex min-w-0 flex-col gap-4">
                <JourneyBoardingActions
                  boarding={boarding}
                  isProvider={false}
                  currentMemberPublicId={identity.publicId}
                />

                <Card variant="muted" padding="md">
                  <div className="flex flex-col gap-2">
                    <h2 className="text-sm font-semibold text-[var(--foreground)]">
                      Boarding
                    </h2>

                    <p className="text-sm leading-6 text-[var(--foreground-secondary)]">
                      Your available boarding action will appear
                      here when applicable.
                    </p>
                  </div>
                </Card>
              </aside>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}
