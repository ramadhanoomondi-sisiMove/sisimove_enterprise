
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
  const handleOpen = () => {
    onOpen?.(completion);
  };

  return (
    <tr className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--background-subtle)]">
      {/* Completion ID */}
      <td className="px-4 py-3">
        {onOpen ? (
          <button
            type="button"
            onClick={handleOpen}
            className="text-left transition-opacity hover:opacity-75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2"
            aria-label={`Open completion ${completion.publicId}`}
          >
            <JourneyCompletionPublicId
              publicId={completion.publicId}
            />
          </button>
        ) : (
          <JourneyCompletionPublicId
            publicId={completion.publicId}
          />
        )}
      </td>

      {/* Journey ID */}
      <td className="px-4 py-3">
        <span className="font-mono text-xs text-[var(--foreground-secondary)]">
          {completion.journeyPublicId}
        </span>
      </td>

      {/* Provider ID */}
      <td className="px-4 py-3">
        <span className="font-mono text-xs text-[var(--foreground-secondary)]">
          {completion.providerPublicId}
        </span>
      </td>

      {/* Status */}
      <td className="px-4 py-3">
        <JourneyCompletionStatusBadge
          status={completion.status}
        />
      </td>

      {/* Confirmations */}
      <td className="px-4 py-3 text-right text-sm tabular-nums text-[var(--foreground)]">
        {completion.confirmedCount} / {completion.requiredConfirmations}
      </td>

      {/* Created */}
      <td className="px-4 py-3 text-sm text-[var(--foreground-secondary)]">
        <JourneyCompletionDate
          value={completion.createdAt}
        />
      </td>

      {/* Confirmed */}
      <td className="px-4 py-3 text-sm text-[var(--foreground-secondary)]">
        <JourneyCompletionDate
          value={completion.confirmedAt ?? null}
          fallback="—"
        />
      </td>
    </tr>
  );
}
