
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

import {
  AssetErrorState,
  AssetLoadingState,
} from '@/components/admin/assets/shared';

import { AssetPageContainer } from '@/components/admin/assets/layout';
import { AssetPreviewPanel } from '@/components/admin/assets/preview';

import {
  AssetDetailsHeader,
  AssetMetadataPanel,
  AssetOwnershipPanel,
  AssetStoragePanel,
  AssetLifecyclePanel,
  AssetVisibilityPanel,
  AssetRelatedRecordsPanel,
} from '@/components/admin/assets/details';

import {
  AssetActionsMenu,
  ArchiveAssetDialog,
  DeleteAssetDialog,
  ChangeAssetVisibilityDialog,
  AssetOperationFeedback,
} from '@/components/admin/assets/operations';

import {
  useAsset,
  useArchiveAsset,
  useDeleteAsset,
  useChangeAssetVisibility,
} from '@/features/admin/assets/hooks';

import type { AssetVisibility } from '@/features/admin/assets/models';

type OperationType = 'archive' | 'delete' | 'visibility';

export default function AdminAssetDetailsPage() {
  const params = useParams<{ publicId: string }>();
  const router = useRouter();

  const publicId =
    typeof params.publicId === 'string' ? params.publicId : '';

  const { asset, isLoading, isError, refetch } = useAsset(publicId);

  const archiveMutation = useArchiveAsset();
  const deleteMutation = useDeleteAsset();
  const visibilityMutation = useChangeAssetVisibility();

  const [activeDialog, setActiveDialog] = useState<OperationType | null>(null);
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const isSubmitting =
    archiveMutation.isArchiving ||
    deleteMutation.isDeleting ||
    visibilityMutation.isChangingVisibility;

  const runOperation = async (
    operation: OperationType,
    action: () => Promise<unknown>,
  ) => {
    setFeedback(null);

    try {
      await action();
      setActiveDialog(null);

      setFeedback({
        type: 'success',
        message:
          operation === 'archive'
            ? 'Asset archived successfully.'
            : operation === 'delete'
              ? 'Asset deletion completed.'
              : 'Asset visibility updated successfully.',
      });

      if (operation === 'delete') {
        router.push('/admin/assets');
      } else {
        await refetch();
      }
    } catch (cause) {
      setFeedback({
        type: 'error',
        message:
          cause instanceof Error
            ? cause.message
            : 'The asset operation failed. Please try again.',
      });
    }
  };

  if (isLoading) {
    return (
      <AssetPageContainer>
        <AssetLoadingState
          variant="detail"
          label="Loading asset details"
        />
      </AssetPageContainer>
    );
  }

  if (isError) {
    return (
      <AssetPageContainer>
        <AssetErrorState
          variant="load-one"
          onRetry={() => {
            void refetch();
          }}
        />
      </AssetPageContainer>
    );
  }

  if (!asset) {
    return (
      <AssetPageContainer>
        <AssetErrorState
          variant="load-one"
          title="Asset not found"
          description="This asset may no longer be available, or you may not have permission to view it."
        />
      </AssetPageContainer>
    );
  }

  const operationError =
    archiveMutation.error?.message ??
    deleteMutation.error?.message ??
    visibilityMutation.error?.message ??
    null;

  return (
    <AssetPageContainer>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/admin/assets"
            className="inline-flex items-center gap-2 text-sm font-medium text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
          >
            <ArrowLeft aria-hidden="true" className="h-4 w-4" />
            Back to assets
          </Link>

          <AssetActionsMenu
            visibility={asset.visibility}
            archived={asset.status === 'ARCHIVED'}
            deleted={asset.status === 'DELETED'}
            disabled={isSubmitting}
            onChangeVisibility={() => {
              setFeedback(null);
              visibilityMutation.reset();
              setActiveDialog('visibility');
            }}
            onArchive={() => {
              setFeedback(null);
              archiveMutation.reset();
              setActiveDialog('archive');
            }}
            onDelete={() => {
              setFeedback(null);
              deleteMutation.reset();
              setActiveDialog('delete');
            }}
          />
        </div>

        {feedback && (
          <AssetOperationFeedback
            type={feedback.type}
            message={feedback.message}
            onDismiss={() => setFeedback(null)}
          />
        )}

        <AssetDetailsHeader asset={asset} />

        <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-2">
          <div className="min-w-0">
            <AssetPreviewPanel asset={asset} />
          </div>

          <div className="min-w-0 space-y-6">
            <AssetMetadataPanel asset={asset} />
            <AssetOwnershipPanel asset={asset} />
            <AssetStoragePanel asset={asset} />
            <AssetLifecyclePanel asset={asset} />
            <AssetVisibilityPanel asset={asset} />

            <AssetRelatedRecordsPanel
              records={[]}
              isLoading={false}
            />
          </div>
        </div>

        <ArchiveAssetDialog
          open={activeDialog === 'archive'}
          asset={asset}
          isSubmitting={archiveMutation.isArchiving}
          error={
            activeDialog === 'archive'
              ? archiveMutation.error?.message ?? null
              : null
          }
          onOpenChange={(open) => {
            setActiveDialog(open ? 'archive' : null);
          }}
          onConfirm={() =>
            runOperation('archive', () =>
              archiveMutation.archiveAsset(asset.publicId),
            )
          }
        />

        <DeleteAssetDialog
          open={activeDialog === 'delete'}
          asset={asset}
          isSubmitting={deleteMutation.isDeleting}
          error={
            activeDialog === 'delete'
              ? deleteMutation.error?.message ?? null
              : null
          }
          onOpenChange={(open) => {
            setActiveDialog(open ? 'delete' : null);
          }}
          onConfirm={() =>
            runOperation('delete', () =>
              deleteMutation.deleteAsset(asset.publicId),
            )
          }
        />

        <ChangeAssetVisibilityDialog
          open={activeDialog === 'visibility'}
          asset={asset}
          isSubmitting={visibilityMutation.isChangingVisibility}
          error={
            activeDialog === 'visibility'
              ? visibilityMutation.error?.message ?? null
              : null
          }
          onOpenChange={(open) => {
            setActiveDialog(open ? 'visibility' : null);
          }}
          onConfirm={(visibility: AssetVisibility) =>
            runOperation('visibility', () =>
              visibilityMutation.changeVisibility({
                assetPublicId: asset.publicId,
                visibility,
              }),
            )
          }
        />

        {operationError && !feedback && (
          <AssetOperationFeedback
            type="error"
            message={operationError}
          />
        )}
      </div>
    </AssetPageContainer>
  );
}
