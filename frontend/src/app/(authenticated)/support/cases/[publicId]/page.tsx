// -----------------------------------------------------------------------------
// sisiMove — Support Case Detail Route
// -----------------------------------------------------------------------------
//
// Route:
//   /support/cases/[publicId]
//
// Responsibilities:
// - receive the opaque SupportCase public ID from Next.js routing;
// - compose the member-facing SupportCaseDetail feature component.
//
// Non-responsibilities:
// - fetching the Support case;
// - fetching Support messages;
// - resolving Journey / Booking / Payment / Wallet references;
// - authorizing access to the Support case;
// - implementing Support-case presentation logic.
//
// The publicId is intentionally passed through unchanged. It is an opaque
// domain reference and must not be interpreted by the route.
//
// -----------------------------------------------------------------------------

import { SupportCaseDetail } from '@/components/support-case';

interface SupportCaseDetailPageProps {
  readonly params: Promise<{
    publicId: string;
  }>;
}

export default async function SupportCaseDetailPage({
  params,
}: SupportCaseDetailPageProps) {
  const { publicId } = await params;

  return (
    <main className="page-container py-6">
      <div className="mx-auto w-full max-w-3xl">
        <SupportCaseDetail supportCasePublicId={publicId} />
      </div>
    </main>
  );
}

