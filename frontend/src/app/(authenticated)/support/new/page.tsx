'use client';

// -----------------------------------------------------------------------------
// sisiMove — New Support Case Route
// -----------------------------------------------------------------------------
//
// Route:
//   /support/new
//
// Responsibilities:
// - compose the member-facing SupportCaseNew feature component;
// - resolve the authenticated member identity required by the support API;
// - preserve optional contextual support references from the URL.
//
// Non-responsibilities:
// - fetching Support cases;
// - implementing Support case creation;
// - validating Support case fields;
// - resolving referenced Journey / Booking / Payment / Wallet data;
// - managing Support mutations.
//
// Architectural boundary:
//
// The Support feature owns Support-case behavior. This route only supplies the
// authenticated requester identity and optional contextual reference values.
//
// Contextual links may arrive as:
//   /support/new?referenceType=BOOKING&referencePublicId=<opaque-public-id>
//
// The reference remains opaque to Support. SupportCaseNew displays it as
// context rather than independently loading the referenced domain.
//
// -----------------------------------------------------------------------------

import { useSearchParams } from 'next/navigation';

import { SupportCaseNew } from '@/components/support-case';
import { useCurrentIdentity } from '@/features/identity/hooks';
import { AUTHENTICATED_ROUTES } from '@/foundation/routing';

export default function NewSupportCasePage() {
  const searchParams = useSearchParams();

  const { data: identity, isLoading, isError } = useCurrentIdentity();

  const referenceType = searchParams.get('referenceType') ?? undefined;
  const referencePublicId =
    searchParams.get('referencePublicId') ?? undefined;

  if (isLoading) {
    return null;
  }

  if (isError || !identity?.publicId) {
    return (
      <main className="page-container py-6">
        <div className="mx-auto w-full max-w-3xl">
          <section
            aria-labelledby="support-new-error-title"
            className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6"
          >
            <h1
              id="support-new-error-title"
              className="text-base font-semibold text-[var(--foreground)]"
            >
              Support is temporarily unavailable
            </h1>

            <p className="mt-1 text-sm leading-6 text-[var(--foreground-secondary)]">
              We could not load the information required to contact support.
              Please try again.
            </p>

            <a
              href={AUTHENTICATED_ROUTES.SUPPORT}
              className="mt-4 inline-flex text-sm font-medium text-[var(--brand)] hover:text-[var(--brand-hover)]"
            >
              Back to Support
            </a>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="page-container py-6">
      <div className="mx-auto w-full max-w-3xl">
        <SupportCaseNew
          requesterPublicId={identity.publicId}
          initialReferenceType={referenceType}
          initialReferencePublicId={referencePublicId}
        />
      </div>
    </main>
  );
}

