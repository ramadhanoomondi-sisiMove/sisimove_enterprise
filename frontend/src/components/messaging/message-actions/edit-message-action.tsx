// -----------------------------------------------------------------------------
// sisiMove — Edit Messaging Message Action
// -----------------------------------------------------------------------------
//
// Owns the edit mutation for one Messaging message.
//
// Responsibilities:
// - expose an edit trigger;
// - manage local edit-mode state;
// - manage the temporary edited content;
// - invoke useEditMessagingMessage();
// - return to normal presentation after a successful mutation.
//
// Non-responsibilities:
// - fetching the message;
// - fetching the conversation;
// - authorizing the member;
// - implementing Messaging domain rules;
// - calling the HTTP API directly.
//
// The edit draft is intentionally synchronized through user actions rather
// than a React effect. Entering edit mode initializes the draft, while cancel
// explicitly restores the current message content.
//
// This avoids synchronous setState calls inside an effect and keeps the local
// editing state event-driven.
// -----------------------------------------------------------------------------

'use client';

import {
  useState,
} from 'react';

import {
  Check,
  Loader2,
  Pencil,
  X,
} from 'lucide-react';

import {
  Button,
  Input,
} from '@/components/ui';

import type {
  MessagingMessage as MessagingMessageModel,
} from '@/features/messaging/models';

import {
  useEditMessagingMessage,
} from '@/features/messaging/hooks/mutations';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface EditMessageActionProps {
  readonly message: MessagingMessageModel;
  readonly disabled?: boolean;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function EditMessageAction({
  message,
  disabled = false,
}: EditMessageActionProps) {
  // ---------------------------------------------------------------------------
  // Local editing state
  // ---------------------------------------------------------------------------
  //
  // The draft belongs to the edit interaction. It is initialized when the
  // member explicitly enters edit mode rather than synchronized from props
  // through an effect.
  //
  const [isEditing, setIsEditing] = useState(false);

  const [content, setContent] = useState(
    message.content ?? '',
  );

  // ---------------------------------------------------------------------------
  // Mutation
  // ---------------------------------------------------------------------------

  const editMessageMutation =
    useEditMessagingMessage();

  // ---------------------------------------------------------------------------
  // Start editing
  // ---------------------------------------------------------------------------
  //
  // Always initialize the draft from the latest message supplied by the
  // component at the moment editing begins.
  //
  const handleStartEditing = () => {
    if (
      disabled ||
      editMessageMutation.isPending
    ) {
      return;
    }

    setContent(message.content ?? '');
    setIsEditing(true);
  };

  // ---------------------------------------------------------------------------
  // Cancel editing
  // ---------------------------------------------------------------------------

  const handleCancel = () => {
    if (editMessageMutation.isPending) {
      return;
    }

    setContent(message.content ?? '');
    setIsEditing(false);
  };

  // ---------------------------------------------------------------------------
  // Submit edited content
  // ---------------------------------------------------------------------------

  const handleSubmit = async () => {
    const trimmedContent = content.trim();

    // A text message cannot be replaced with empty content.
    if (!trimmedContent) {
      return;
    }

    // No mutation is required when the content has not changed.
    if (
      trimmedContent ===
      (message.content ?? '').trim()
    ) {
      setIsEditing(false);
      return;
    }

    await editMessageMutation.mutateAsync({
      messagePublicId: message.publicId,
      command: {
        content: trimmedContent,
      },
    });

    setIsEditing(false);
  };

  // ---------------------------------------------------------------------------
  // Editing UI
  // ---------------------------------------------------------------------------

  if (isEditing) {
    return (
      <div
        className="flex min-w-0 items-center gap-1"
        data-message-edit-action={message.publicId}
      >
        <Input
          aria-label="Edit message"
          autoFocus
          disabled={editMessageMutation.isPending}
          value={content}
          onChange={(event) => {
            setContent(event.target.value);
          }}
          onKeyDown={(event) => {
            if (event.key === 'Escape') {
              event.preventDefault();
              handleCancel();
              return;
            }

            if (
              event.key === 'Enter' &&
              !event.shiftKey
            ) {
              event.preventDefault();
              void handleSubmit();
            }
          }}
        />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="size-9 shrink-0 px-0"
          aria-label="Save edited message"
          title="Save"
          disabled={
            editMessageMutation.isPending ||
            !content.trim()
          }
          onClick={() => {
            void handleSubmit();
          }}
          leadingIcon={
            editMessageMutation.isPending ? (
              <Loader2
                aria-hidden="true"
                className="size-4 animate-spin"
              />
            ) : (
              <Check
                aria-hidden="true"
                className="size-4"
              />
            )
          }
        >
          <span className="sr-only">
            Save
          </span>
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="size-9 shrink-0 px-0"
          aria-label="Cancel editing message"
          title="Cancel"
          disabled={
            editMessageMutation.isPending
          }
          onClick={handleCancel}
          leadingIcon={
            <X
              aria-hidden="true"
              className="size-4"
            />
          }
        >
          <span className="sr-only">
            Cancel
          </span>
        </Button>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Edit trigger
  // ---------------------------------------------------------------------------

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="size-9 shrink-0 px-0"
      aria-label="Edit message"
      title="Edit message"
      disabled={
        disabled ||
        editMessageMutation.isPending
      }
      onClick={handleStartEditing}
      leadingIcon={
        editMessageMutation.isPending ? (
          <Loader2
            aria-hidden="true"
            className="size-4 animate-spin"
          />
        ) : (
          <Pencil
            aria-hidden="true"
            className="size-4"
          />
        )
      }
    >
      <span className="sr-only">
        Edit message
      </span>
    </Button>
  );
}