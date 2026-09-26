'use client';

// -----------------------------------------------------------------------------
// sisiMove — Messaging Message Composer
// -----------------------------------------------------------------------------
//
// Message composition boundary for an active Messaging conversation.
//
// Responsibilities:
// - own message draft state;
// - own the send-message mutation;
// - own the attachment-upload workflow;
// - open the reusable AssetUploadDialog when attachment configuration exists;
// - associate an uploaded Asset.publicId with a Messaging message;
// - compose the input, attachment, and action components.
//
// Non-responsibilities:
// - loading conversations;
// - loading messages;
// - deciding conversation membership authorization;
// - implementing Asset upload infrastructure;
// - resolving public Asset URLs;
// - editing messages;
// - deleting messages;
// - moderating messages.
//
// Server-state ownership:
// - useSendMessagingMessage()
//
// Asset ownership:
// - AssetUploadDialog owns physical Asset upload;
// - this component owns the workflow connecting the uploaded Asset to
//   Messaging;
// - Messaging stores only Asset.publicId;
// - public rendering is resolved independently through PublicAsset.
//
// Important boundary:
// - Asset is used only at upload-association time;
// - MessagingMessage stores assetPublicId;
// - MessagingMessageAsset resolves public rendering through usePublicAsset().
//
// The composer intentionally does not invent Asset category/type values.
// Those values are supplied by the caller when the backend Asset contract
// establishes which Asset classification is valid for Messaging attachments.
// -----------------------------------------------------------------------------

import {
  useCallback,
  useState,
  type FormEvent,
} from 'react';

import { cn } from '@/foundation';

import {
  AssetUploadDialog,
} from '@/components/assets';

import type {
  Asset,
} from '@/features/assets/models';

import {
  MESSAGING_MESSAGE_TYPES,
} from '@/features/messaging/models/messaging-message-type';

import {
  useSendMessagingMessage,
} from '@/features/messaging/hooks/mutations';

import { MessagingMessageComposerActions } from './messaging-message-composer-actions';
import { MessagingMessageComposerAttachment } from './messaging-message-composer-attachment';
import { MessagingMessageComposerInput } from './messaging-message-composer-input';

// =============================================================================
// Types
// =============================================================================

/**
 * Asset upload configuration required to enable Messaging attachments.
 *
 * The values intentionally come from the existing Asset API/component
 * contract rather than being invented inside Messaging.
 */
type MessagingAssetUploadConfig = {
  readonly category: Parameters<
    typeof AssetUploadDialog
  >[0]['category'];

  readonly type: Parameters<
    typeof AssetUploadDialog
  >[0]['type'];
};

// =============================================================================
// Props
// =============================================================================

export interface MessagingMessageComposerProps {
  /**
   * Opaque public identifier of the conversation receiving the message.
   */
  readonly conversationPublicId: string;

  /**
   * Configuration for Messaging attachments.
   *
   * When omitted, the composer remains text-only.
   *
   * This allows Messaging to function without inventing an Asset category/type
   * before the backend Asset classification contract explicitly defines one.
   */
  readonly assetUpload?: MessagingAssetUploadConfig;

  /**
   * Disables message composition.
   *
   * This is presentation/context state supplied by the parent.
   */
  readonly disabled?: boolean;

  readonly className?: string;
}

// =============================================================================
// Component
// =============================================================================

export function MessagingMessageComposer({
  conversationPublicId,
  assetUpload,
  disabled = false,
  className,
}: MessagingMessageComposerProps) {
  // ---------------------------------------------------------------------------
  // Local draft state
  // ---------------------------------------------------------------------------

  const [content, setContent] = useState('');

  const [
    isAttachmentDialogOpen,
    setIsAttachmentDialogOpen,
  ] = useState(false);

  // ---------------------------------------------------------------------------
  // Mutation
  // ---------------------------------------------------------------------------
  //
  // The composer owns sending because composing and sending the current draft
  // are one UI workflow.
  //
  // The API adapter and mutation hook remain responsible for transport and
  // server-state concerns.
  // ---------------------------------------------------------------------------

  const sendMessageMutation =
    useSendMessagingMessage();

  const isSending =
    sendMessageMutation.isPending;

  const isDisabled =
    disabled ||
    isSending ||
    !conversationPublicId;

  const canSend =
    content.trim().length > 0 &&
    !isDisabled;

  const canAttach =
    Boolean(assetUpload) &&
    !isDisabled;

  // ---------------------------------------------------------------------------
  // Send text message
  // ---------------------------------------------------------------------------

  const handleSubmit = useCallback(
    async (
      event: FormEvent<HTMLFormElement>,
    ) => {
      event.preventDefault();

      const trimmedContent =
        content.trim();

      if (
        !trimmedContent ||
        isDisabled
      ) {
        return;
      }

      await sendMessageMutation.mutateAsync({
        conversationPublicId,
        command: {
          type:
            MESSAGING_MESSAGE_TYPES.TEXT,
          content: trimmedContent,
        },
      });

      setContent('');
    },
    [
      content,
      conversationPublicId,
      isDisabled,
      sendMessageMutation,
    ],
  );

  // ---------------------------------------------------------------------------
  // Uploaded Asset → Messaging message
  // ---------------------------------------------------------------------------
  //
  // AssetUploadDialog returns the authenticated Asset representation.
  //
  // Messaging does not retain that Asset object. It only receives the stable
  // public Asset identifier and places it on the message command.
  //
  // Public URL resolution happens later through PublicAsset.
  // ---------------------------------------------------------------------------

  const handleAttachmentUploaded =
    useCallback(
      async (asset: Asset) => {
        const trimmedContent =
          content.trim();

        await sendMessageMutation.mutateAsync({
          conversationPublicId,
          command: {
            type:
              MESSAGING_MESSAGE_TYPES.FILE,
            content:
              trimmedContent || undefined,
            assetPublicId:
              asset.publicId,
          },
        });

        setContent('');
      },
      [
        content,
        conversationPublicId,
        sendMessageMutation,
      ],
    );

  // ---------------------------------------------------------------------------
  // Open attachment workflow
  // ---------------------------------------------------------------------------

  const handleAttachmentOpen =
    useCallback(() => {
      if (!canAttach) {
        return;
      }

      setIsAttachmentDialogOpen(true);
    }, [canAttach]);

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className={cn(
          'border-t border-[var(--border)]',
          'bg-[var(--surface)]',
          'p-3',
          className,
        )}
      >
        <div className="flex flex-col gap-2">
          <div className="flex items-end gap-2">
            {/* ------------------------------------------------------------- */}
            {/* Attachment                                                    */}
            {/* ------------------------------------------------------------- */}

            {assetUpload ? (
              <MessagingMessageComposerAttachment
                disabled={!canAttach}
                onOpen={handleAttachmentOpen}
              />
            ) : null}

            {/* ------------------------------------------------------------- */}
            {/* Message input                                                 */}
            {/* ------------------------------------------------------------- */}

            <MessagingMessageComposerInput
              value={content}
              onChange={setContent}
              disabled={isDisabled}
            />

            {/* ------------------------------------------------------------- */}
            {/* Send action                                                   */}
            {/* ------------------------------------------------------------- */}

            <MessagingMessageComposerActions
              canSend={canSend}
              isSending={isSending}
              disabled={isDisabled}
            />
          </div>

          {/* --------------------------------------------------------------- */}
          {/* Send error                                                      */}
          {/* --------------------------------------------------------------- */}

          {sendMessageMutation.error ? (
            <p
              role="alert"
              className="text-sm text-[var(--danger)]"
            >
              {sendMessageMutation.error.message ||
                'The message could not be sent. Please try again.'}
            </p>
          ) : null}
        </div>
      </form>

      {/* ------------------------------------------------------------------- */}
      {/* Asset upload                                                        */}
      {/* ------------------------------------------------------------------- */}
      {assetUpload ? (
        <AssetUploadDialog
          open={isAttachmentDialogOpen}
          onOpenChange={
            setIsAttachmentDialogOpen
          }
          category={assetUpload.category}
          type={assetUpload.type}
          title="Attach a file"
          description="Choose a file to attach to your message."
          onUploaded={
            handleAttachmentUploaded
          }
        />
      ) : null}
    </>
  );
}