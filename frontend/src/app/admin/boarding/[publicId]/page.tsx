'use client';

import { use, useState } from 'react';
import type { ComponentType, ReactNode } from 'react';
import {
  CalendarClock,
  CheckCircle2,
  Clock3,
  FileText,
  ShieldCheck,
  Users,
  XCircle,
} from 'lucide-react';

import {
  BoardingDetailHeader,
  BoardingPageContainer,
  BoardingSectionHeader,
} from '@/components/admin/boardings/layout';

import {
  BoardingLoadingState,
  BoardingErrorState,
  BoardingPublicId,
} from '@/components/admin/boardings/shared';

import { BoardingJourneyPanel } from '@/components/admin/boardings/journey/BoardingJourneyPanel';
import { BoardingProviderPanel } from '@/components/admin/boardings/provider/BoardingProviderPanel';
import { BoardingParticipantsPanel } from '@/components/admin/boardings/participants';

import {
  BoardingActionsMenu,
  type BoardingOperation,
} from '@/components/admin/boardings/operations/BoardingActionsMenu';
import { BoardingOperationDialog } from '@/components/admin/boardings/operations/BoardingOperationDialog';
import {
  BoardingOperationFeedback,
  type BoardingFeedbackType,
} from '@/components/admin/boardings/operations/BoardingOperationFeedback';

import { useAdminBoarding } from '@/features/admin/boardings/hooks/useAdminBoarding';
import { useAdminBoardingMutations } from '@/features/admin/boardings/hooks/useAdminBoardingMutations';
import { ADMIN_ROUTES } from '@/foundation/routing/admin-routes';
import { cn } from '@/foundation/utils/cn';

interface BoardingDetailPageProps {
  params: Promise<{
    publicId: string;
  }>;
}

interface OperationFeedbackState {
  type: BoardingFeedbackType;
  message: string;
}

function formatDate(value: string | null | undefined): string {
  if (!value) return 'Not available';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return 'Not available';

  return new Intl.DateTimeFormat('en-KE', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Africa/Nairobi',
  }).format(date);
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return 'The operation could not be completed. Please try again.';
}

function DetailField({
  label,
  value,
  icon: Icon,
  className,
}: {
  label: string;
  value: string | number;
  icon?: ComponentType<{ className?: string }>;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'min-w-0 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] p-4',
        className,
      )}
    >
      <dt className="flex items-center gap-2 text-xs font-medium text-[var(--foreground-secondary)]">
        {Icon && (
          <Icon
            className="size-4 shrink-0 text-[var(--foreground-muted)]"
            aria-hidden="true"
          />
        )}
        {label}
      </dt>

      <dd className="mt-2 break-words text-sm font-semibold leading-6 text-[var(--foreground)]">
        {value}
      </dd>
    </div>
  );
}

function DetailSection({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        'min-w-0 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm sm:p-6',
        className,
      )}
    >
      {children}
    </section>
  );
}

const OPERATION_SUCCESS_MESSAGES: Record<BoardingOperation, string> = {
  open: 'Boarding was opened successfully.',
  'board-provider': 'Provider boarding was recorded successfully.',
  'start-journey': 'The journey was started successfully.',
  cancel: 'Boarding was cancelled successfully.',
};

export default function AdminBoardingDetailPage({
  params,
}: BoardingDetailPageProps) {
  const { publicId } = use(params);

  const [selectedOperation, setSelectedOperation] =
    useState<BoardingOperation | null>(null);

  const [operationFeedback, setOperationFeedback] =
    useState<OperationFeedbackState | null>(null);

  const boardingQuery = useAdminBoarding(publicId);
  const boarding = boardingQuery.data;
  const mutations = useAdminBoardingMutations();

  const isOperationPending =
    mutations.openBoarding.isPending ||
    mutations.boardProvider.isPending ||
    mutations.startJourney.isPending ||
    mutations.cancelBoarding.isPending;

  function handleSelectOperation(operation: BoardingOperation) {
    setOperationFeedback(null);
    setSelectedOperation(operation);
  }

  function handleCloseDialog() {
    if (!isOperationPending) {
      setSelectedOperation(null);
    }
  }

  async function handleConfirmOperation() {
    if (!boarding || !selectedOperation || isOperationPending) {
      return;
    }

    setOperationFeedback(null);

    try {
      switch (selectedOperation) {
        case 'open':
          await mutations.openBoarding.mutateAsync({
            boardingPublicId: boarding.publicId,
          });
          break;

        case 'board-provider':
          await mutations.boardProvider.mutateAsync({
            boardingPublicId: boarding.publicId,
          });
          break;

        case 'start-journey':
          await mutations.startJourney.mutateAsync({
            boardingPublicId: boarding.publicId,
          });
          break;

        case 'cancel':
          await mutations.cancelBoarding.mutateAsync({
            boardingPublicId: boarding.publicId,
          });
          break;
      }

      setSelectedOperation(null);
      setOperationFeedback({
        type: 'success',
        message: OPERATION_SUCCESS_MESSAGES[selectedOperation],
      });
    } catch (error: unknown) {
      setOperationFeedback({
        type: 'error',
        message: getErrorMessage(error),
      });
    }
  }

  if (boardingQuery.isPending) {
    return (
      <main className="min-h-screen bg-[var(--background-subtle)]">
        <BoardingPageContainer>
          <BoardingLoadingState rows={4} variant="skeleton" />
        </BoardingPageContainer>
      </main>
    );
  }

  if (boardingQuery.isError) {
    return (
      <main className="min-h-screen bg-[var(--background-subtle)]">
        <BoardingPageContainer>
          <BoardingErrorState
            title="Unable to load boarding details"
            description="We couldn't retrieve the boarding details. Please try again."
            onRetry={() => void boardingQuery.refetch()}
            isRetrying={boardingQuery.isFetching}
          />
        </BoardingPageContainer>
      </main>
    );
  }

  if (!boarding) {
    return (
      <main className="min-h-screen bg-[var(--background-subtle)]">
        <BoardingPageContainer className="gap-6 py-6 sm:py-8">
          <BoardingDetailHeader
            title="Boarding not found"
            publicId={publicId}
            status="NOT_STARTED"
            backHref={ADMIN_ROUTES.BOARDING}
          />

          <DetailSection>
            <div className="flex items-start gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[var(--background-subtle)]">
                <FileText
                  className="size-5 text-[var(--foreground-muted)]"
                  aria-hidden="true"
                />
              </div>

              <div>
                <h2 className="text-sm font-semibold text-[var(--foreground)]">
                  No matching boarding
                </h2>
                <p className="mt-1 text-sm leading-6 text-[var(--foreground-secondary)]">
                  Check the boarding reference or return to the boarding
                  directory.
                </p>
              </div>
            </div>
          </DetailSection>
        </BoardingPageContainer>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--background-subtle)]">
      <BoardingPageContainer className="gap-6 py-6 sm:py-8">
        <BoardingDetailHeader
          title="Boarding details"
          publicId={boarding.publicId}
          status={boarding.status}
          journeyId={boarding.journeyId}
          providerPublicId={boarding.providerPublicId}
          backHref={ADMIN_ROUTES.BOARDING}
          actions={
            <BoardingActionsMenu
              boarding={boarding}
              onSelect={handleSelectOperation}
              disabled={boardingQuery.isFetching || isOperationPending}
            />
          }
        />

        <DetailSection>
          <BoardingSectionHeader
            title="Boarding operations"
            description="Review and manage the available boarding lifecycle operations."
          />

          {operationFeedback && (
            <div className="mt-5">
              <BoardingOperationFeedback
                type={operationFeedback.type}
                message={operationFeedback.message}
                onDismiss={() => setOperationFeedback(null)}
              />
            </div>
          )}
        </DetailSection>

        <DetailSection>
          <BoardingSectionHeader
            title="Boarding overview"
            description="Key identifiers, lifecycle status, and record timestamps."
          />

          <dl className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <DetailField
              label="Boarding reference"
              value={boarding.publicId}
              icon={FileText}
            />

            <DetailField
              label="Boarding status"
              value={boarding.status.replaceAll('_', ' ')}
              icon={ShieldCheck}
            />

            <DetailField
              label="Participants"
              value={boarding.participants.length}
              icon={Users}
            />

            <DetailField
              label="Record version"
              value={boarding.version}
              icon={FileText}
            />
          </dl>

          <div className="mt-6 border-t border-[var(--border-subtle)] pt-5">
            <h3 className="text-sm font-semibold text-[var(--foreground)]">
              Boarding timeline
            </h3>

            <dl className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
              <DetailField
                label="Created"
                value={formatDate(boarding.createdAt)}
                icon={CalendarClock}
              />

              <DetailField
                label="Last updated"
                value={formatDate(boarding.updatedAt)}
                icon={Clock3}
              />

              <DetailField
                label="Boarding started"
                value={formatDate(boarding.boardingStartedAt)}
                icon={CheckCircle2}
              />

              <DetailField
                label="Journey started"
                value={formatDate(boarding.journeyStartedAt)}
                icon={CheckCircle2}
              />

              <DetailField
                label="Cancelled"
                value={formatDate(boarding.cancelledAt)}
                icon={XCircle}
              />
            </dl>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-3 border-t border-[var(--border-subtle)] pt-5 md:grid-cols-2">
            <div className="min-w-0">
              <p className="mb-2 text-xs font-medium text-[var(--foreground-secondary)]">
                Journey public ID
              </p>
              <BoardingPublicId publicId={boarding.journeyId} copyable />
            </div>

            <div className="min-w-0">
              <p className="mb-2 text-xs font-medium text-[var(--foreground-secondary)]">
                Provider public ID
              </p>
              <BoardingPublicId
                publicId={boarding.providerPublicId}
                copyable
              />
            </div>
          </div>
        </DetailSection>

        <DetailSection>
          <BoardingSectionHeader
            title="Journey"
            description="Boarding lifecycle and journey context."
          />
          <div className="mt-5">
            <BoardingJourneyPanel boarding={boarding} />
          </div>
        </DetailSection>

        <DetailSection>
          <BoardingSectionHeader
            title="Provider"
            description="Provider identity and boarding status."
          />
          <div className="mt-5">
            <BoardingProviderPanel boarding={boarding} />
          </div>
        </DetailSection>

        <DetailSection>
          <BoardingSectionHeader
            title="Participants"
            description="Review provider and passenger boarding statuses."
          />
          <div className="mt-5">
            <BoardingParticipantsPanel
              participants={boarding.participants}
            />
          </div>
        </DetailSection>

        {selectedOperation && (
          <BoardingOperationDialog
            boardingPublicId={boarding.publicId}
            operation={selectedOperation}
            isPending={isOperationPending}
            onClose={handleCloseDialog}
            onConfirm={() => void handleConfirmOperation()}
          />
        )}
      </BoardingPageContainer>
    </main>
  );
}
