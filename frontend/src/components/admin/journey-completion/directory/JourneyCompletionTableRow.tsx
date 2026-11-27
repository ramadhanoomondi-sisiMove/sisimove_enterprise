
import type {
  AdminJourneyCompletion,
} from '@/features/admin/journey-completion/models';
import {
  JourneyCompletionDate,
  JourneyCompletionPublicId,
  JourneyCompletionStatusBadge,
} from '../shared';

export interface JourneyCompletionTableRowProps {
  completion: AdminJourneyCompletion;
  onOpen?: (completion: AdminJourneyCompletion) => void;
}

export function JourneyCompletionTableRow({
  completion,
  onOpen,
}: JourneyCompletionTableRowProps) {
  return (
    <tr className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--background-subtle)]">
      <td className="px-4 py-3">
        {onOpen ? (
          <button
            type="button"
            onClick={() => onOpen(completion)}
            className="text-left"
          >
            <JourneyCompletionPublicId publicId={completion.publicId} />
          </button>
        ) : (
          <JourneyCompletionPublicId publicId={completion.publicId} />
        )}
      </td>

      <td className="px-4 py-3">
        <span className="font-mono text-xs text-[var(--foreground-secondary)]">
          {completion.journeyPublicId}
        </span>
      </td>

      <td className="px-4 py-3">
        <span className="font-mono text-xs text-[var(--foreground-secondary)]">
          {completion.providerPublicId}
        </span>
      </td>

      <td className="px-4 py-3">
        <JourneyCompletionStatusBadge status={completion.status} />
      </td>

      <td className="px-4 py-3 text-right text-sm tabular-nums text-[var(--foreground)]">
        {completion.confirmedCount} / {completion.requiredConfirmations}
      </td>

      <td className="px-4 py-3 text-sm text-[var(--foreground-secondary)]">
        <JourneyCompletionDate value={completion.createdAt} />
      </td>

      <td className="px-4 py-3 text-sm text-[var(--foreground-secondary)]">
        <JourneyCompletionDate
          value={completion.confirmedAt ?? null}
          fallback="—"
        />
      </td>
    </tr>
  );
}
