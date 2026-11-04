
'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';

import {
  useAdminProvider,
  useAdminProviderOperations,
  type AdminProviderStatus,
  type AdminConfigureMpesaInput,
  type AdminUpdateProviderInput,
  type AdminProviderCapability,
} from '@/features/admin/finance/providers';

import { ADMIN_ROUTES } from '@/foundation/routing/admin-routes';

import { ProviderDetailsLayout } from '@/components/admin/finance/providers/details/ProviderDetailsLayout';

import {
  ProviderActionsMenu,
  ProviderEnableDialog,
  ProviderDisableDialog,
  ProviderChangeStatusDialog,
  ProviderUpdateDialog,
  ProviderMpesaConfigurationForm,
  ProviderOperationFeedback,
  ProviderErrorState,
  ProviderLoadingState,
  ProviderCapabilityEnableDialog,
  ProviderCapabilityDisableDialog,
} from '@/components/admin/finance/providers';

// -----------------------------------------------------------------------------
// Dialog State
// -----------------------------------------------------------------------------

type ActiveDialog =
  | 'edit'
  | 'enable'
  | 'disable'
  | 'status'
  | 'mpesa'
  | 'enableCapability'
  | 'disableCapability'
  | null;

// -----------------------------------------------------------------------------
// Operation Feedback
// -----------------------------------------------------------------------------

interface OperationFeedback {
  type: 'success' | 'error';
  message: string;
  error?: unknown;
}

// -----------------------------------------------------------------------------
// Provider Details Page
// -----------------------------------------------------------------------------

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

  const [selectedCapability, setSelectedCapability] =
    useState<AdminProviderCapability | null>(null);

  // ---------------------------------------------------------------------------
  // Dialog Management
  // ---------------------------------------------------------------------------

  const closeDialog = () => {
    setActiveDialog(null);
    setSelectedCapability(null);
  };

  const openCapabilityDialog = (
    capability: AdminProviderCapability,
    dialog: 'enableCapability' | 'disableCapability',
  ) => {
    setFeedback(null);
    setSelectedCapability(capability);
    setActiveDialog(dialog);
  };

  // ---------------------------------------------------------------------------
  // Operation Execution
  // ---------------------------------------------------------------------------

  const runOperation = async (
    operation: () => Promise<unknown>,
    successMessage: string,
  ) => {
    setFeedback(null);

    try {
      await operation();

      setActiveDialog(null);
      setSelectedCapability(null);

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

  // ---------------------------------------------------------------------------
  // Provider Validation
  // ---------------------------------------------------------------------------

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

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div className="space-y-6">

      {/* Operation Feedback */}

      {feedback && (
        <ProviderOperationFeedback
          isSuccess={feedback.type === 'success'}
          isError={feedback.type === 'error'}
          successTitle="Provider operation completed"
          successMessage={feedback.message}
          errorTitle="Operation failed"
          errorMessage={feedback.message}
          error={feedback.error}
          onDismiss={() => setFeedback(null)}
        />
      )}

      {/* Provider Details */}

      <ProviderDetailsLayout
        provider={provider}
        onBack={() =>
          router.push(ADMIN_ROUTES.FINANCE_PROVIDERS)
        }
        onEnableCapability={(capability) =>
          openCapabilityDialog(capability, 'enableCapability')
        }
        onDisableCapability={(capability) =>
          openCapabilityDialog(capability, 'disableCapability')
        }
        actions={
          <div className="flex flex-wrap items-center gap-2">

            {provider.code === 'MPESA' && (
              <>
                <Button
                  variant="outline"
                  onClick={() => {
                    setFeedback(null);

                    void runOperation(
                      () =>
                        operations.testMpesaConnection.mutateAsync({
                          providerPublicId: publicId,
                        }),
                      'M-PESA connection authenticated successfully.',
                    );
                  }}
                  disabled={operations.isLoading}
                >
                  {operations.isTestingMpesaConnection
                    ? 'Testing connection...'
                    : 'Test Connection'}
                </Button>

                <Button
                  variant="outline"
                  onClick={() => {
                    setFeedback(null);
                    setActiveDialog('mpesa');
                  }}
                  disabled={operations.isLoading}
                >
                  Configure M-PESA
                </Button>
              </>
            )}

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

          </div>
        }
      />

      {/* M-PESA Configuration */}

      {provider.code === 'MPESA' && (
        <ProviderMpesaConfigurationForm
          provider={provider}
          isOpen={activeDialog === 'mpesa'}
          isLoading={operations.isConfiguringMpesa}
          onConfirm={(input: AdminConfigureMpesaInput) => {
            void runOperation(
              () =>
                operations.configureMpesa.mutateAsync({
                  params: {
                    providerPublicId: publicId,
                  },
                  input,
                }),
              'M-PESA credentials were saved securely. Connection validation is still pending.',
            );
          }}
          onCancel={closeDialog}
        />
      )}

      {/* Update Provider */}

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

      {/* Enable Provider */}

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

      {/* Disable Provider */}

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

      {/* Change Provider Status */}

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

      {/* Enable Provider Capability */}

      {selectedCapability && (
        <ProviderCapabilityEnableDialog
          provider={provider}
          capability={selectedCapability}
          isOpen={activeDialog === 'enableCapability'}
          isLoading={operations.isEnablingCapability}
          onConfirm={() => {
            void runOperation(
              () =>
                operations.enableCapability.mutateAsync({
                  providerPublicId: publicId,
                  capabilityType: selectedCapability.type,
                }),
              `${selectedCapability.type} capability was enabled successfully.`,
            );
          }}
          onCancel={closeDialog}
        />
      )}

      {/* Disable Provider Capability */}

      {selectedCapability && (
        <ProviderCapabilityDisableDialog
          provider={provider}
          capability={selectedCapability}
          isOpen={activeDialog === 'disableCapability'}
          isLoading={operations.isDisablingCapability}
          onConfirm={() => {
            void runOperation(
              () =>
                operations.disableCapability.mutateAsync({
                  providerPublicId: publicId,
                  capabilityType: selectedCapability.type,
                }),
              `${selectedCapability.type} capability was disabled successfully.`,
            );
          }}
          onCancel={closeDialog}
        />
      )}

    </div>
  );
}
