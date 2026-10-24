import { RotateCcw } from 'lucide-react';
import { AdminFinancialAccountStatus, AdminFinancialAccountType } from '@/features/admin/finance/accounts/models';

export interface FinancialAccountFiltersProps {
  status: AdminFinancialAccountStatus | 'ALL';
  type: AdminFinancialAccountType | 'ALL';
  currency: string;
  ownerPublicId: string;
  currencies: string[];
  onStatusChange: (value: AdminFinancialAccountStatus | 'ALL') => void;
  onTypeChange: (value: AdminFinancialAccountType | 'ALL') => void;
  onCurrencyChange: (value: string) => void;
  onOwnerPublicIdChange: (value: string) => void;
  onReset: () => void;
}

const controlClass = 'h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--foreground)] outline-none focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand-soft)]';

export function FinancialAccountFilters(props: FinancialAccountFiltersProps) {
  const { status, type, currency, ownerPublicId, currencies, onStatusChange, onTypeChange, onCurrencyChange, onOwnerPublicIdChange, onReset } = props;
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
      <div>
        <label htmlFor="financial-account-status" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[var(--foreground-muted)]">Status</label>
        <select id="financial-account-status" className={controlClass} value={status} onChange={(e) => onStatusChange(e.target.value as AdminFinancialAccountStatus | 'ALL')}>
          <option value="ALL">All statuses</option>
          {Object.values(AdminFinancialAccountStatus).map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
      </div>
      <div>
        <label htmlFor="financial-account-type" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[var(--foreground-muted)]">Account type</label>
        <select id="financial-account-type" className={controlClass} value={type} onChange={(e) => onTypeChange(e.target.value as AdminFinancialAccountType | 'ALL')}>
          <option value="ALL">All types</option>
          {Object.values(AdminFinancialAccountType).map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
      </div>
      <div>
        <label htmlFor="financial-account-currency" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[var(--foreground-muted)]">Currency</label>
        <select id="financial-account-currency" className={controlClass} value={currency} onChange={(e) => onCurrencyChange(e.target.value)}>
          <option value="ALL">All currencies</option>
          {currencies.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
      </div>
      <div>
        <label htmlFor="financial-account-owner" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[var(--foreground-muted)]">Owner public ID</label>
        <input id="financial-account-owner" className={controlClass} value={ownerPublicId} onChange={(e) => onOwnerPublicIdChange(e.target.value)} placeholder="Filter by owner…" />
      </div>
      <div className="flex items-end">
        <button type="button" onClick={onReset} className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-[var(--border)] px-3 text-sm font-medium text-[var(--foreground-secondary)] transition hover:bg-[var(--background-muted)]">
          <RotateCcw size={15} aria-hidden="true" /> Reset filters
        </button>
      </div>
    </div>
  );
}
