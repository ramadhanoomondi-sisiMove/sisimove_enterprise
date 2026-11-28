
// src/app/admin/finance/commissions/page.tsx
'use client';

import Link from 'next/link';

import {
  Card,
} from '@/components/ui';

import {
  CommissionPageContainer,
  CommissionDetailHeader,
} from '@/components/admin/finance/commissions/layout';

import {
  CommissionOverview,
} from '@/components/admin/finance/commissions/overview/CommissionOverview';

import {
  useAdminBookingCommissions,
  useAdminEarningCommissions,
} from '@/features/admin/finance/commissions/hooks';

import {
  ADMIN_ROUTES,
} from '@/foundation/routing/admin-routes';

// -----------------------------------------------------------------------------
// Commission Navigation
// -----------------------------------------------------------------------------

const commissionSections = [
  {
    title: 'Booking Commissions',
    description:
      'Review commissions charged against passenger bookings, including assessment status and booking references.',
    href: ADMIN_ROUTES.FINANCE_BOOKING_COMMISSIONS,
    action: 'View booking commissions',
  },
  {
    title: 'Earning Commissions',
    description:
      'Review commissions retained from provider earnings, including settlements and net earning amounts.',
    href: ADMIN_ROUTES.FINANCE_EARNING_COMMISSIONS,
    action: 'View earning commissions',
  },
  {
    title: 'Commission Rules',
    description:
      'Manage commission percentages, effective periods, rule versions, and activation status.',
    href: ADMIN_ROUTES.FINANCE_COMMISSION_RULES,
    action: 'Manage commission rules',
  },
] as const;

// -----------------------------------------------------------------------------
// Page
// -----------------------------------------------------------------------------

export default function AdminCommissionsPage() {
  const {
    allCommissions: bookingCommissions,
  } = useAdminBookingCommissions();

  const {
    allCommissions: earningCommissions,
  } = useAdminEarningCommissions();

  return (
    <CommissionPageContainer size="2xl" className="py-6">
      <div className="space-y-8">

        {/* Page Header */}
        <CommissionDetailHeader
          eyebrow="FINANCE CONTROL CENTER"
          title="Commissions"
          description="Monitor commission performance and manage booking commissions, earning commissions, and commission rules across the sisiMove platform."
        />

        {/* Commission Overview */}
        <CommissionOverview
          bookingCommissions={bookingCommissions ?? []}
          earningCommissions={earningCommissions ?? []}
          currency="KES"
        />

        {/* Commission Management Sections */}
        <section className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Commission Management
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Select a commission area to view records and manage its
              operations.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {commissionSections.map((section) => (
              <Card
                key={section.href}
                variant="default"
                padding="lg"
                className="flex h-full flex-col"
              >
                <div className="flex flex-1 flex-col gap-4">
                  <div className="space-y-2">
                    <h3 className="text-base font-semibold text-foreground">
                      {section.title}
                    </h3>

                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {section.description}
                    </p>
                  </div>

                  <div className="mt-auto pt-2">
                    <Link
                      href={section.href}
                      className={[
                        'inline-flex',
                        'items-center',
                        'gap-2',
                        'text-sm',
                        'font-semibold',
                        'text-[var(--primary)]',
                        'underline-offset-4',
                        'hover:underline',
                        'focus-visible:outline-none',
                        'focus-visible:ring-2',
                        'focus-visible:ring-[var(--ring)]',
                        'focus-visible:ring-offset-2',
                      ].join(' ')}
                    >
                      {section.action}
                      <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </CommissionPageContainer>
  );
}
