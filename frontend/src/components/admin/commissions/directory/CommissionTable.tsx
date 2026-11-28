import type { ReactNode } from 'react';

export interface CommissionTableColumn {
  readonly key: string;
  readonly label: string;
  readonly className?: string;
}

export interface CommissionTableProps {
  readonly columns: readonly CommissionTableColumn[];
  readonly children: ReactNode;
  readonly caption?: string;
  readonly className?: string;
}

export function CommissionTable({
  columns,
  children,
  caption = 'Commission records',
  className,
}: CommissionTableProps) {
  return (
    <div
      className={[
        'w-full overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <table className="w-full min-w-[760px] border-collapse text-left text-sm">
        <caption className="sr-only">{caption}</caption>

        <thead className="bg-[var(--background-subtle)]">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className={[
                  'whitespace-nowrap px-4 py-3 font-semibold text-[var(--foreground-secondary)]',
                  column.className,
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-[var(--border-subtle)]">
          {children}
        </tbody>
      </table>
    </div>
  );
}