import type { AdminFinancialTransaction } from '@/features/admin/finance/transactions/models';
import { TransactionAmount } from '../shared/TransactionAmount';

type TransactionEntry = AdminFinancialTransaction['entries'][number];

export interface TransactionEntryTableRowProps {
  entry: TransactionEntry;
  currency?: string | null;
}

function readString(record: object, keys: string[]): string | undefined {
  const source = record as Record<string, unknown>;

  for (const key of keys) {
    const value = source[key];
    if (typeof value === 'string' && value.trim()) return value;
  }

  return undefined;
}

function readAmount(entry: TransactionEntry): number | undefined {
  const source = entry as unknown as Record<string, unknown>;
  for (const key of ['amount', 'amountMinor', 'value']) {
    const value = source[key];
    if (typeof value === 'number' && Number.isFinite(value)) return value;
  }
  return undefined;
}

export function TransactionEntryTableRow({
  entry,
  currency,
}: TransactionEntryTableRowProps) {
  const publicId = readString(entry, ['publicId', 'entryPublicId']);
  const account = readString(entry, [
    'accountPublicId',
    'financialAccountPublicId',
    'accountId',
    'accountName',
  ]);
  const direction = readString(entry, ['direction', 'entryType', 'type']);
  const amount = readAmount(entry);

  return (
    <tr className="bg-[var(--surface)]">
      <td className="px-4 py-3">
        <span className="break-all font-mono text-xs text-[var(--foreground-secondary)]">
          {publicId || '—'}
        </span>
      </td>
      <td className="px-4 py-3">
        <span className="break-all text-[var(--foreground)]">{account || '—'}</span>
      </td>
      <td className="px-4 py-3">
        <span className="text-[var(--foreground)]">{direction || '—'}</span>
      </td>
      <td className="px-4 py-3 text-right tabular-nums text-[var(--foreground)]">
        {amount === undefined ? '—' : (
          <TransactionAmount amount={amount} currency={currency || 'KES'} />
        )}
      </td>
    </tr>
  );
}

export default TransactionEntryTableRow;
