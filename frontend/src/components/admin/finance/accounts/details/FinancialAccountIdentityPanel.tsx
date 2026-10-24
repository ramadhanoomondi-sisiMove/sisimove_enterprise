'use client';

import { Copy, Fingerprint, UserRound } from 'lucide-react';
import { useState } from 'react';
import type { AdminFinancialAccount } from '@/features/admin/finance/accounts/models';

export interface FinancialAccountIdentityPanelProps {
  account: AdminFinancialAccount;
}

function CopyableValue({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);

  async function copyValue() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="flex min-w-0 items-center justify-between gap-3">
      <div className="min-w-0">
        <p className="text-xs font-medium text-[var(--foreground-muted)]">{label}</p>
        <p className="mt-1 break-all font-mono text-sm text-[var(--foreground)]">{value || '—'}</p>
      </div>
      {value && <button type="button" onClick={copyValue} aria-label={`Copy ${label}`} title={copied ? 'Copied' : `Copy ${label}`} className="shrink-0 rounded-lg border border-[var(--border)] p-2 text-[var(--foreground-secondary)] transition hover:bg-[var(--background-muted)]">
        {copied ? <span className="text-xs">Copied</span> : <Copy size={15} aria-hidden="true" />}
      </button>}
    </div>
  );
}

export function FinancialAccountIdentityPanel({ account }: FinancialAccountIdentityPanelProps) {
  return (
    <section aria-labelledby="financial-account-identity-title" className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--brand-soft)] text-[var(--brand)]">
          <Fingerprint size={20} aria-hidden="true" />
        </span>
        <div>
          <h2 id="financial-account-identity-title" className="font-semibold text-[var(--foreground)]">Account identity</h2>
          <p className="text-sm text-[var(--foreground-secondary)]">Public identifiers used to reference this account</p>
        </div>
      </div>
      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <CopyableValue label="Account public ID" value={account.publicId} />
        <div className="flex min-w-0 items-center gap-3">
          <UserRound size={17} className="shrink-0 text-[var(--foreground-muted)]" aria-hidden="true" />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-[var(--foreground-muted)]">Owner public ID</p>
            {account.ownerPublicId
              ? <CopyableValue label="Owner public ID value" value={account.ownerPublicId} />
              : <p className="mt-1 text-sm text-[var(--foreground-secondary)]">No owner — system/platform account</p>}
          </div>
        </div>
        <CopyableValue label="Balance public ID" value={account.balance.publicId} />
        <CopyableValue label="Balance account public ID" value={account.balance.accountPublicId} />
      </div>
    </section>
  );
}

export default FinancialAccountIdentityPanel;
