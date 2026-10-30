
'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';

import {
  useAdminProvider,
  useAdminProviderOperations,
  type AdminProviderStatus,
  type AdminUpdateProviderInput,
} from '@/features/admin/finance/providers';

import { ADMIN_ROUTES } from '@/foundation/routing/admin-routes';

import { ProviderDetailsLayout } from '@/components/admin/finance/providers/details/ProviderDetailsLayout';

import {
  ProviderActionsMenu,
  ProviderEnableDialog,
  ProviderDisableDialog,
  ProviderChangeStatusDialog,
  ProviderUpdateDialog,
  ProviderOperationFeedback,
  ProviderErrorState,
  ProviderLoadingState,
} from '@/components/admin/finance/providers';

type ActiveDialog = 'edit' | 'enable' | 'disable' | 'status' | null;

interface OperationFeedback {
  type: 'success' | 'error';
  message: string;
  error?: unknown;
}

export default function ProviderDetailsPage() {
  const params = useParams<{ publicId: string }>();
  const router = useRouter();

  const publicId =
    typeof params.publicId === 'string'
      ? params.publicId.trim()
      : '';

  const {
    provider,
    isLoading,
    isError,
    error,
    refetch,
  } = useAdminProvider(publicId);

  const operations = useAdminProviderOperations();

  const [activeDialog, setActiveDialog] =
    useState<ActiveDialog>(null);

  const [feedback, setFeedback] =
    useState<OperationFeedback | null>(null);

  const closeDialog = () => {
    setActiveDialog(null);
  };

  const runOperation = async (
    operation: () => Promise<unknown>,
    successMessage: string,
  ) => {
    setFeedback(null);

    try {
      await operation();

      setActiveDialog(null);

      setFeedback({
        type: 'success',
        message: successMessage,
      });
    } catch (operationError) {
      setFeedback({
        type: 'error',
        message: 'The provider operation could not be completed.',
        error: operationError,
      });
    }
  };

  if (!publicId) {
    return (
      <ProviderErrorState
        title="Provider not identified"
        description="The payment provider identifier is missing from this page."
      />
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <ProviderLoadingState label="Loading payment provider" />
        <ProviderLoadingState className="h-40 w-full" />
        <ProviderLoadingState className="h-64 w-full" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-4">
        <ProviderErrorState
          title="Unable to load payment provider"
          description={
            error instanceof Error
              ? error.message
              : 'Something went wrong while loading this payment provider.'
          }
        />

        <div className="flex flex-wrap gap-2">
          <Button onClick={() => void refetch()}>
            Try again
          </Button>

          <Button
            variant="outline"
            onClick={() =>
              router.push(ADMIN_ROUTES.FINANCE_PROVIDERS)
            }
          >
            Back to providers
          </Button>
        </div>
      </div>
    );
  }

  if (!provider) {
    return (
      <ProviderErrorState
        title="Provider not found"
        description="The requested payment provider could not be found."
      />
    );
  }

  return (
    <div className="space-y-6">
      {feedback && (
        <ProviderOperationFeedback
          isSuccess={feedback.type === 'success'}
          isError={feedback.type === 'error'}
          successTitle="Provider updated"
          successMessage={feedback.message}
          errorTitle="Operation failed"
          errorMessage={feedback.message}
          error={feedback.error}
          onDismiss={() => setFeedback(null)}
        />
      )}

      <ProviderDetailsLayout
        provider={provider}
        onBack={() =>
          router.push(ADMIN_ROUTES.FINANCE_PROVIDERS)
        }
        actions={
          <ProviderActionsMenu
            provider={provider}
            onEdit={() => {
              setFeedback(null);
              setActiveDialog('edit');
            }}
            onEnable={() => {
              setFeedback(null);
              setActiveDialog('enable');
            }}
            onDisable={() => {
              setFeedback(null);
              setActiveDialog('disable');
            }}
            onChangeStatus={() => {
              setFeedback(null);
              setActiveDialog('status');
            }}
            isLoading={operations.isLoading}
          />
        }
      />

      <ProviderUpdateDialog
        provider={provider}
        isOpen={activeDialog === 'edit'}
        isLoading={operations.isUpdating}
        onConfirm={(input: AdminUpdateProviderInput) => {
          void runOperation(
            () =>
              operations.updateProvider.mutateAsync({
                params: {
                  providerPublicId: publicId,
                },
                input,
              }),
            'The provider details were updated successfully.',
          );
        }}
        onCancel={closeDialog}
      />

      <ProviderEnableDialog
        provider={provider}
        isOpen={activeDialog === 'enable'}
        isLoading={operations.isEnabling}
        onConfirm={() => {
          void runOperation(
            () =>
              operations.enableProvider.mutateAsync({
                providerPublicId: publicId,
              }),
            'The provider was enabled successfully.',
          );
        }}
        onCancel={closeDialog}
      />

      <ProviderDisableDialog
        provider={provider}
        isOpen={activeDialog === 'disable'}
        isLoading={operations.isDisabling}
        onConfirm={() => {
          void runOperation(
            () =>
              operations.disableProvider.mutateAsync({
                providerPublicId: publicId,
              }),
            'The provider was disabled successfully.',
          );
        }}
        onCancel={closeDialog}
      />

      <ProviderChangeStatusDialog
        provider={provider}
        isOpen={activeDialog === 'status'}
        isLoading={operations.isChangingStatus}
        onConfirm={(status: AdminProviderStatus) => {
          void runOperation(
            () =>
              operations.changeProviderStatus.mutateAsync({
                params: {
                  providerPublicId: publicId,
                },
                input: { status },
              }),
            'The provider integration status was updated successfully.',
          );
        }}
        onCancel={closeDialog}
      />
    </div>
  );
}
