
import type {
  AdminJourneyCompletion,
} from '@/features/admin/journey-completion/models';

import { JourneyCompletionEmptyState } from '../shared';

import { JourneyCompletionTableRow } from './JourneyCompletionTableRow';
import { JourneyCompletionTableSkeleton } from './JourneyCompletionTableSkeleton';

export interface JourneyCompletionTableProps {
  completions: AdminJourneyCompletion[];
  isLoading?: boolean;
  onOpen?: (completion: AdminJourneyCompletion) => void;
  emptyTitle?: string;
  emptyDescription?: string;
}

const HEADERS = [
  'Completion ID',
  'Journey ID',
  'Provider ID',
  'Status',
  'Confirmations',
  'Created',
  'Confirmed',
] as const;

export function JourneyCompletionTable({
  completions,
  isLoading = false,
  onOpen,
  emptyTitle = 'No journey completions found',
  emptyDescription = 'Try changing your search or filters.',
}: JourneyCompletionTableProps) {
  if (isLoading) {
    return <JourneyCompletionTableSkeleton />;
  }

  if (completions.length === 0) {
    return (
      <JourneyCompletionEmptyState
        title={emptyTitle}
        description={emptyDescription}
      />
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--surface)]">
      <table className="w-full min-w-[1050px] border-collapse text-left">
        <thead className="bg-[var(--background-subtle)]">
          <tr>
            {HEADERS.map((header) => (
              <th
                key={header}
                scope="col"
                className={`whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[var(--foreground-muted)] ${
                  header === 'Confirmations' ? 'text-right' : ''
                }`}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {completions.map((completion, index) => (
            <JourneyCompletionTableRow
              key={
                completion.publicId?.trim()
                  ? completion.publicId
                  : `journey-completion-row-${index}`
              }
              completion={completion}
              onOpen={onOpen}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
