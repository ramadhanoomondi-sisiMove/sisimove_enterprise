
// -----------------------------------------------------------------------------
// sisiMove Admin — Commission Rule Table Row
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Render one commission rule in the directory table.
// - Display its identity, type, percentage, status, effective period,
//   and version.
//
// Architecture:
// - Receives one rule from CommissionRuleTable.
// - Uses shared commission presentation components.
// - Does not fetch data or manage directory state.
// -----------------------------------------------------------------------------

import type {
  AdminCommissionRuleModel,
} from '@/features/admin/finance/commissions/models';

import { CommissionRuleLink } from '../shared/CommissionRuleLink';
import { CommissionTypeBadge } from '../shared/CommissionTypeBadge';
import { CommissionPercentage } from '../shared/CommissionPercentage';
import { CommissionDate } from '../shared/CommissionDate';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface CommissionRuleTableRowProps {
  readonly rule: AdminCommissionRuleModel;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function CommissionRuleTableRow({
  rule,
}: CommissionRuleTableRowProps) {
  return (
    <tr className="border-b border-[var(--border)] last:border-b-0">
      <td className="px-4 py-3">
        <CommissionRuleLink publicId={rule.publicId} />
      </td>

      <td className="px-4 py-3">
        <CommissionTypeBadge type={rule.type} />
      </td>

      <td className="px-4 py-3">
        <CommissionPercentage value={rule.percentage} />
      </td>

      <td className="px-4 py-3">
        <span className="inline-flex rounded-full border border-[var(--border)] px-2.5 py-1 text-xs font-medium text-[var(--foreground)]">
          {rule.status}
        </span>
      </td>

      <td className="px-4 py-3 text-sm">
        <CommissionDate value={rule.effectiveFrom} />
      </td>

      <td className="px-4 py-3 text-sm">
        <CommissionDate value={rule.effectiveTo} />
      </td>

      <td className="px-4 py-3 text-sm tabular-nums">
        v{rule.version}
      </td>
    </tr>
  );
}
