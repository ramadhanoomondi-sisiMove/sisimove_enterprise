
'use client';

// -----------------------------------------------------------------------------
// sisiMove Admin — Commission Overview
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Compose the commission overview components.
// - Receive booking and earning commission records.
// - Calculate aggregate commission metrics.
// - Calculate commission type and status distributions.
// - Prepare recent commission activity.
// - Keep currency calculations separated.
//
// Architecture:
// - Parent components own data fetching.
// - This component owns overview aggregation.
// - Individual overview components own presentation.
//
// -----------------------------------------------------------------------------

import {
  useMemo,
} from 'react';

import type {
  AdminBookingCommissionModel,
  AdminEarningCommissionModel,
  AdminCommissionStatus,
} from '@/features/admin/commissions/models';

import {
  CommissionMetricCard,
  CommissionMetricGrid,
  CommissionRecentActivity,
  CommissionRevenueSummary,
  CommissionStatusDistribution,
  CommissionTypeDistribution,
} from './';

import type {
  CommissionRecentActivityItem,
} from './CommissionRecentActivity';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface CommissionOverviewProps {
  readonly bookingCommissions: readonly AdminBookingCommissionModel[];
  readonly earningCommissions: readonly AdminEarningCommissionModel[];
  readonly currency: string;
  readonly className?: string;
}

type CommissionOverviewRecord = {
  readonly publicId: string;
  readonly type: 'BOOKING' | 'EARNING';
  readonly status: AdminCommissionStatus;
  readonly commissionAmount: number;
  readonly currency: string;
  readonly createdAt: string | Date;
};

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const RECENT_ACTIVITY_LIMIT = 5;

const COMMISSION_STATUSES: readonly AdminCommissionStatus[] = [
  'PENDING',
  'ASSESSED',
  'CANCELLED',
];

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function toTimestamp(
  value: string | Date | null | undefined,
): number {
  if (!value) {
    return 0;
  }

  const timestamp = new Date(value).getTime();

  return Number.isNaN(timestamp) ? 0 : timestamp;
}

function calculatePercentage(
  count: number,
  total: number,
): number {
  if (total === 0) {
    return 0;
  }

  return Number(((count / total) * 100).toFixed(1));
}

function sumCommissionAmounts(
  records: readonly CommissionOverviewRecord[],
  currency: string,
  status?: AdminCommissionStatus,
): number {
  return records.reduce((total, record) => {
    if (record.currency !== currency) {
      return total;
    }

    if (status && record.status !== status) {
      return total;
    }

    return total + record.commissionAmount;
  }, 0);
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function CommissionOverview({
  bookingCommissions,
  earningCommissions,
  currency,
  className,
}: CommissionOverviewProps) {
  // ---------------------------------------------------------------------------
  // Normalize records
  // ---------------------------------------------------------------------------

  const allCommissions = useMemo<CommissionOverviewRecord[]>(() => {
    const bookingRecords: CommissionOverviewRecord[] =
      bookingCommissions.map((commission) => ({
        publicId: commission.publicId,
        type: 'BOOKING',
        status: commission.status,
        commissionAmount: commission.commissionAmount,
        currency: commission.currency,
        createdAt: commission.createdAt,
      }));

    const earningRecords: CommissionOverviewRecord[] =
      earningCommissions.map((commission) => ({
        publicId: commission.publicId,
        type: 'EARNING',
        status: commission.status,
        commissionAmount: commission.commissionAmount,
        currency: commission.currency,
        createdAt: commission.createdAt,
      }));

    return [
      ...bookingRecords,
      ...earningRecords,
    ];
  }, [
    bookingCommissions,
    earningCommissions,
  ]);

  // ---------------------------------------------------------------------------
  // Overall metrics
  // ---------------------------------------------------------------------------

  const totalCommissions = allCommissions.length;

  const totalBookingCommissions =
    bookingCommissions.length;

  const totalEarningCommissions =
    earningCommissions.length;

  const pendingCommissions = allCommissions.filter(
    (commission) => commission.status === 'PENDING',
  ).length;

  const assessedCommissions = allCommissions.filter(
    (commission) => commission.status === 'ASSESSED',
  ).length;

  const cancelledCommissions = allCommissions.filter(
    (commission) => commission.status === 'CANCELLED',
  ).length;

  // ---------------------------------------------------------------------------
  // Revenue calculations
  // ---------------------------------------------------------------------------

  const revenue = useMemo(() => {

    const assessedCommissionAmount = sumCommissionAmounts(
      allCommissions,
      currency,
      'ASSESSED',
    );

    const pendingCommissionAmount = sumCommissionAmounts(
      allCommissions,
      currency,
      'PENDING',
    );

    return {
      totalCommissionAmount:
        assessedCommissionAmount + pendingCommissionAmount,

      assessedCommissionAmount,
      pendingCommissionAmount,
    };
  }, [
    allCommissions,
    currency,
  ]);

  // ---------------------------------------------------------------------------
  // Type distribution
  // ---------------------------------------------------------------------------

  const typeDistribution = useMemo(() => [
    {
      label: 'Booking',
      count: totalBookingCommissions,
      percentage: calculatePercentage(
        totalBookingCommissions,
        totalCommissions,
      ),
    },
    {
      label: 'Earning',
      count: totalEarningCommissions,
      percentage: calculatePercentage(
        totalEarningCommissions,
        totalCommissions,
      ),
    },
  ], [
    totalBookingCommissions,
    totalEarningCommissions,
    totalCommissions,
  ]);

  // ---------------------------------------------------------------------------
  // Status distribution
  // ---------------------------------------------------------------------------

  const statusDistribution = useMemo(() => {
    const counts: Record<AdminCommissionStatus, number> = {
      PENDING: pendingCommissions,
      ASSESSED: assessedCommissions,
      CANCELLED: cancelledCommissions,
    };

    return COMMISSION_STATUSES.map((status) => ({
      label: status,
      count: counts[status],
      percentage: calculatePercentage(
        counts[status],
        totalCommissions,
      ),
    }));
  }, [
    pendingCommissions,
    assessedCommissions,
    cancelledCommissions,
    totalCommissions,
  ]);

  // ---------------------------------------------------------------------------
  // Recent activity
  // ---------------------------------------------------------------------------

  const recentActivity = useMemo<
    CommissionRecentActivityItem[]
  >(() => {
    return [...allCommissions]
      .sort(
        (a, b) =>
          toTimestamp(b.createdAt) -
          toTimestamp(a.createdAt),
      )
      .slice(0, RECENT_ACTIVITY_LIMIT)
      .map((commission) => ({
        publicId: commission.publicId,
        type: commission.type,
        status: commission.status,
        commissionAmount: commission.commissionAmount,
        currency: commission.currency,
        createdAt: commission.createdAt,
        description:
          commission.type === 'BOOKING'
            ? 'Booking commission'
            : 'Earning commission',
      }));
  }, [allCommissions]);

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <section
      className={[
        'space-y-6',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      aria-label="Commission overview"
    >
      {/* ------------------------------------------------------------------- */}
      {/* Metric cards */}
      {/* ------------------------------------------------------------------- */}

      <CommissionMetricGrid columns={4}>
        <CommissionMetricCard
          title="Total Commissions"
          value={totalCommissions.toLocaleString()}
          description="All booking and earning records"
        />

        <CommissionMetricCard
          title="Booking Commissions"
          value={totalBookingCommissions.toLocaleString()}
          description="Commissions charged against bookings"
        />

        <CommissionMetricCard
          title="Earning Commissions"
          value={totalEarningCommissions.toLocaleString()}
          description="Commissions retained from provider earnings"
        />

        <CommissionMetricCard
          title="Pending Commissions"
          value={pendingCommissions.toLocaleString()}
          description="Awaiting assessment"
        />
      </CommissionMetricGrid>

      {/* ------------------------------------------------------------------- */}
      {/* Distribution and revenue */}
      {/* ------------------------------------------------------------------- */}

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <CommissionTypeDistribution
          items={typeDistribution}
        />

        <CommissionStatusDistribution
          items={statusDistribution}
        />
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* Revenue summary */}
      {/* ------------------------------------------------------------------- */}

      <CommissionRevenueSummary
        totalCommissionAmount={
          revenue.totalCommissionAmount
        }
        assessedCommissionAmount={
          revenue.assessedCommissionAmount
        }
        pendingCommissionAmount={
          revenue.pendingCommissionAmount
        }
        currency={currency}
        description={`Assessed and pending commission amounts in ${currency}. Cancelled commissions are excluded.`}
      />

      {/* ------------------------------------------------------------------- */}
      {/* Recent activity */}
      {/* ------------------------------------------------------------------- */}

      <CommissionRecentActivity
        items={recentActivity}
        title="Recent Commission Activity"
        description="The five most recently created booking and earning commissions."
      />
    </section>
  );
}
