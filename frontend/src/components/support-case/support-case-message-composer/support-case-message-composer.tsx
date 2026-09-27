// -----------------------------------------------------------------------------
// sisiMove — Support Case Message Composer
// -----------------------------------------------------------------------------
//
// Member-facing composer for Support case conversation messages.
//
// Responsibilities:
// - compose text messages;
// - initiate image/file Asset uploads;
// - associate a successfully uploaded Asset with a Support message;
// - send messages through the Support mutation boundary;
// - keep the Asset upload dialog open until the message operation completes.
//
// Non-responsibilities:
// - resolving the authenticated Identity;
// - selecting an arbitrary sender identity;
// - managing Support participants;
// - managing Support lifecycle;
// - managing internal notes;
// - creating resolutions;
// - uploading files directly;
// - deciding Asset ownership.
//
// Asset workflow:
//
//     Member selects attachment
//              │
//              ▼
//     AssetUploadDialog
//              │
//              ├── POST /assets
//              │
//              ▼
//          Asset created
//              │
//              ▼
//        onUploaded(asset)
//              │
//              ▼
//     Support message mutation
//              │
//              ▼
//       AssetUploadDialog closes
//
// This intentionally uses the existing Asset capability rather than creating
// Support-specific file-upload infrastructure.
//
// -----------------------------------------------------------------------------

'use client';

import {
  useRef,
  useState,
  type FormEvent,
} from 'react';

import {
  Button,
} from '@/components/ui';

import {
  AssetUploadDialog,
 } from '@/components/assets';

import {
  type Asset,
} from '@/features/assets';

import type { SupportCase } from '@/features/support-case/models';
import type { SupportMessageType } from '@/features/support-case/models';

import {
  useSendSupportCaseMessage,
} from '@/features/support-case/hooks';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface SupportCaseMessageComposerProps {
  /**
   * Support case receiving the message.
   */
  readonly supportCase: SupportCase;

  /**
   * Public Identity/member identifier of the authenticated sender.
   *
   * This is supplied by the authenticated application context.
   *
   * The composer intentionally does not expose a sender selector because
   * senderPublicId is not member-selectable data.
   */
  readonly senderPublicId: string;

  /**
   * Optional additional class names.
   */
  readonly className?: string;
}

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const MAX_MESSAGE_LENGTH = 5000;

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function SupportCaseMessageComposer({
  supportCase,
  senderPublicId,
  className,
}: SupportCaseMessageComposerProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [content, setContent] = useState('');
  const [sendError, setSendError] = useState<string | null>(null);

  const [imageUploadOpen, setImageUploadOpen] = useState(false);
  const [fileUploadOpen, setFileUploadOpen] = useState(false);

  const sendMessage = useSendSupportCaseMessage();

  const isSending = sendMessage.isPending;
  const isDisabled =
    !supportCase.isOpen ||
    !senderPublicId ||
    isSending ||
    imageUploadOpen ||
    fileUploadOpen;

  // ---------------------------------------------------------------------------
  // Text message
  // ---------------------------------------------------------------------------

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isDisabled) {
      return;
    }

    const trimmedContent = content.trim();

    if (!trimmedContent) {
      setSendError('Enter a message before sending.');
      textareaRef.current?.focus();
      return;
    }

    if (trimmedContent.length > MAX_MESSAGE_LENGTH) {
      setSendError(
        `Your message cannot exceed ${MAX_MESSAGE_LENGTH.toLocaleString()} characters.`,
      );
      textareaRef.current?.focus();
      return;
    }

    setSendError(null);

    try {
      await sendMessage.mutateAsync({
        supportCasePublicId: supportCase.publicId,
        request: {
          senderPublicId,
          type: 'TEXT',
          content: trimmedContent,
        },
      });

      setContent('');
    } catch (error) {
      setSendError(toMessageError(error));
    }
  }

  // ---------------------------------------------------------------------------
  // Asset upload → Support message
  // ---------------------------------------------------------------------------

  async function handleUploadedAsset(
    asset: Asset,
    type: Extract<SupportMessageType, 'IMAGE' | 'FILE'>,
  ) {
    setSendError(null);

    try {
      await sendMessage.mutateAsync({
        supportCasePublicId: supportCase.publicId,
        request: {
          senderPublicId,
          type,
          assetId: asset.publicId,
        },
      });
    } catch (error) {
      /*
       * AssetUploadDialog awaits this callback.
       *
       * Throwing here is intentional:
       *
       *     Asset upload succeeds
       *          │
       *          ▼
       *     message association fails
       *          │
       *          ▼
       *     dialog remains open
       *
       * This allows the existing AssetUploadDialog to keep its loading/error
       * lifecycle authoritative instead of closing after only the Asset upload.
       */
      const messageError = toMessageError(error);

      setSendError(messageError);

      throw new Error(messageError);
    }
  }

  // ---------------------------------------------------------------------------
  // Closed case
  // ---------------------------------------------------------------------------

  if (!supportCase.isOpen) {
    return (
      <div
        className={[
          'rounded-[var(--radius-lg)]',
          'border',
          'border-[var(--border)]',
          'bg-[var(--background-subtle)]',
          'px-4',
          'py-3',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <p className="text-sm text-[var(--foreground-secondary)]">
          This support case is no longer accepting new messages.
        </p>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className={[
          'rounded-[var(--radius-lg)]',
          'border',
          'border-[var(--border)]',
          'bg-[var(--surface)]',
          'p-3',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <label
          htmlFor={`support-message-${supportCase.publicId}`}
          className="sr-only"
        >
          Support message
        </label>

        <textarea
          ref={textareaRef}
          id={`support-message-${supportCase.publicId}`}
          value={content}
          onChange={(event) => {
            setContent(event.target.value);
            setSendError(null);
          }}
          maxLength={MAX_MESSAGE_LENGTH}
          rows={3}
          placeholder="Write a message to support..."
          disabled={isSending}
          className={[
            'min-h-20',
            'w-full',
            'resize-y',
            'rounded-[var(--radius-md)]',
            'border',
            'border-[var(--border)]',
            'bg-[var(--surface)]',
            'px-3',
            'py-2.5',
            'text-sm',
            'leading-5',
            'text-[var(--foreground)]',
            'placeholder:text-[var(--foreground-subtle)]',
            'outline-none',
            'transition-colors',
            'duration-150',
            'ease-out',
            'hover:border-[var(--border-strong)]',
            'focus:border-[var(--brand)]',
            'focus:ring-2',
            'focus:ring-[var(--brand)]/10',
            'disabled:cursor-not-allowed',
            'disabled:bg-[var(--background-muted)]',
            'disabled:opacity-70',
          ].join(' ')}
        />

        {sendError && (
          <p
            role="alert"
            className={[
              'mt-2',
              'rounded-[var(--radius-md)]',
              'bg-[var(--danger-soft)]',
              'px-3',
              'py-2',
              'text-sm',
              'text-[var(--danger)]',
            ].join(' ')}
          >
            {sendError}
          </p>
        )}

        <div
          className={[
            'mt-3',
            'flex',
            'flex-col',
            'gap-3',
            'sm:flex-row',
            'sm:items-center',
            'sm:justify-between',
          ].join(' ')}
        >
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={isSending}
              onClick={() => {
                setSendError(null);
                setImageUploadOpen(true);
              }}
              leadingIcon={<AttachmentIcon />}
            >
              Photo
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={isSending}
              onClick={() => {
                setSendError(null);
                setFileUploadOpen(true);
              }}
              leadingIcon={<FileIcon />}
            >
              File
            </Button>
          </div>

          <div className="flex items-center justify-between gap-3 sm:justify-end">
            <span className="text-xs text-[var(--foreground-muted)]">
              {content.length.toLocaleString()} /{' '}
              {MAX_MESSAGE_LENGTH.toLocaleString()}
            </span>

            <Button
              type="submit"
              size="sm"
              loading={isSending}
              disabled={!content.trim()}
              trailingIcon={<SendIcon />}
            >
              Send
            </Button>
          </div>
        </div>
      </form>

      {/* ------------------------------------------------------------------- */}
      {/* Image Asset Upload                                                   */}
      {/* ------------------------------------------------------------------- */}

      <AssetUploadDialog
        open={imageUploadOpen}
        onOpenChange={setImageUploadOpen}
        category="CHAT_ATTACHMENT"
        type="IMAGE"
        title="Attach a photo"
        description="Choose a photo to send to SisiMove support."
        accept="image/*"
        onUploaded={async (asset) => {
          await handleUploadedAsset(asset, 'IMAGE');
        }}
      />

      {/* ------------------------------------------------------------------- */}
      {/* File Asset Upload                                                    */}
      {/* ------------------------------------------------------------------- */}

      <AssetUploadDialog
        open={fileUploadOpen}
        onOpenChange={setFileUploadOpen}
        category="CHAT_ATTACHMENT"
        type="DOCUMENT"
        title="Attach a file"
        description="Choose a document to send to SisiMove support."
        accept="application/pdf"
        onUploaded={async (asset) => {
          await handleUploadedAsset(asset, 'FILE');
        }}
      />
    </>
  );
}

// -----------------------------------------------------------------------------
// Error presentation
// -----------------------------------------------------------------------------

function toMessageError(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return 'The message could not be sent. Please try again.';
}

// -----------------------------------------------------------------------------
// Icons
// -----------------------------------------------------------------------------

function AttachmentIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path
        d="m7.5 10.5 4.3-4.3a2.5 2.5 0 0 1 3.5 3.5l-5.9 5.9a4 4 0 0 1-5.7-5.7l6-6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FileIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path
        d="M5.5 3.5h6l3 3V16a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5V3.5Z"
        strokeLinejoin="round"
      />
      <path
        d="M11.5 3.5V7h3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path
        d="m3.5 10 13-6-3.5 12-3.5-4.5L3.5 10Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="m9.5 11.5 3-3"
        strokeLinecap="round"
      />
    </svg>
  );
}