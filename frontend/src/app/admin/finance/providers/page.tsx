
"use client";

// -----------------------------------------------------------------------------
// sisiMove Admin — Payment Providers Control Center
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Display the Payment Providers control-center header.
// - Show provider metrics and operational summaries.
// - Delegate search, filtering and pagination to ProviderDirectory.
// - Keep overview and directory loading/error states independent.
// - Provide a consistent page layout.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Layout
// -----------------------------------------------------------------------------

import {
  ProviderPageContainer,
  ProviderControlCenterHeader,
} from "@/components/admin/finance/providers/layout";

// -----------------------------------------------------------------------------
// Overview
// -----------------------------------------------------------------------------

import { ProviderOverview } from "@/components/admin/finance/providers/overview/ProviderOverview";

// -----------------------------------------------------------------------------
// Directory
// -----------------------------------------------------------------------------

import { ProviderDirectory } from "@/components/admin/finance/providers/directory/ProviderDirectory";

// =============================================================================
// Page
// =============================================================================

export default function AdminPaymentProvidersPage() {
  return (
    <ProviderPageContainer
      size="2xl"
      className="py-6"
    >
      <div className="space-y-6">

        {/* Control Center Header */}

        <ProviderControlCenterHeader
          eyebrow="FINANCE CONTROL CENTER"
          title="Payment Providers"
          description="Review registered payment providers, monitor integration readiness, manage supported capabilities, and oversee payment infrastructure across the sisiMove platform."
        />

        {/* Provider Overview */}

        <ProviderOverview />

        {/* Provider Directory */}

        <ProviderDirectory />

      </div>
    </ProviderPageContainer>
  );
}
