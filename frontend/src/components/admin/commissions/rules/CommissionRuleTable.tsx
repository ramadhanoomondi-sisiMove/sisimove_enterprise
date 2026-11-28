
// -----------------------------------------------------------------------------
// sisiMove Admin — Commission Rule Table
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Render the commission rules table.
// - Delegate individual rule rendering to CommissionRuleTableRow.
// - Display an empty state when no rules match the directory filters.
//
// Architecture:
// - Receives rules from CommissionRuleDirectory.
// - Does not fetch, filter, or paginate records.
// - CommissionRuleTableRow owns individual row presentation.
// -----------------------------------------------------------------------------

import { Card } from '@/components/ui';

import type {
  AdminCommissionRuleModel,
} from '@/features/admin/commissions/models';

import { CommissionRuleTableRow } from './CommissionRuleTableRow';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface CommissionRuleTableProps {
  readonly rules: readonly AdminCommissionRuleModel[];
  readonly className?: string;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function CommissionRuleTable({
  rules,
  className,
}: CommissionRuleTableProps) {
  if (rules.length === 0) {
    return (
      <Card
        padding="lg"
        className={className}
      >
        <div className="py-6 text-center">
          <h3 className="font-medium text-[var(--foreground)]">
            No commission rules found
          </h3>

          <p className="mt-2 text-sm text-muted-foreground">
            There are no commission rules matching the current search
            and filter criteria.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card
      padding="none"
      className={className}
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] border-collapse text-left">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--muted)]">
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide">
                Rule
              </th>

              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide">
                Type
              </th>

              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide">
                Percentage
              </th>

              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide">
                Status
              </th>

              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide">
                Effective from
              </th>

              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide">
                Effective to
              </th>

              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide">
                Version
              </th>
            </tr>
          </thead>

          <tbody>
            {rules.map((rule) => (
              <CommissionRuleTableRow
                key={rule.publicId}
                rule={rule}
              />
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
