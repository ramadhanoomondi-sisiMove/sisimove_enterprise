import type { ReactNode } from 'react';

export interface CommissionTableRowCell {
  readonly key: string;
  readonly content: ReactNode;
  readonly className?: string;
}

export interface CommissionTableRowProps {
  readonly cells: readonly CommissionTableRowCell[];
  readonly className?: string;
}

export function CommissionTableRow({
  cells,
  className,
}: CommissionTableRowProps) {
  return (
    <tr
      className={[
        'transition-colors hover:bg-[var(--background-subtle)]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {cells.map((cell) => (
        <td
          key={cell.key}
          className={[
            'px-4 py-3 align-middle text-[var(--foreground)]',
            cell.className,
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {cell.content}
        </td>
      ))}
    </tr>
  );
}