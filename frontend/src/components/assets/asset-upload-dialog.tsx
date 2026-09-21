// -----------------------------------------------------------------------------
// sisiMove — Asset Upload Dialog
// -----------------------------------------------------------------------------
//
// Reusable dialog for uploading an Asset.
//
// Responsibilities:
// - Select a physical file
// - Validate basic file constraints
// - Upload through the Asset capability
// - Present upload/loading/error states
// - Return the created Asset to the consuming workflow
// - Await completion of the consuming workflow before closing
//
// The component intentionally contains no business/domain meaning.
// Verification, Profile, Vehicle, Journey, and other features decide what the
// uploaded Asset means after receiving it through onUploaded().
//
// -----------------------------------------------------------------------------

'use client';

import {
  useRef,
  useState,
  type ChangeEvent,
} from 'react';

import {
  Button,
  Dialog,
} from '@/components/ui';

import {
  useAsset,
  type Asset,
  type AssetUploadCategory,
  type AssetUploadType,
} from '@/features/assets';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface AssetUploadDialogProps {
  /**
   * Controls whether the dialog is visible.
   */
  readonly open: boolean;

  /**
   * Called when the dialog requests to open or close.
   */
  readonly onOpenChange: (open: boolean) => void;

  /**
   * Asset category assigned to the uploaded file.
   */
  readonly category: AssetUploadCategory;

  /**
   * Physical asset type assigned to the uploaded file.
   */
  readonly type: AssetUploadType;

  /**
   * Optional dialog title.
   */
  readonly title?: string;

  /**
   * Optional dialog description.
   */
  readonly description?: string;

  /**
   * Optional native file input accept value.
   */
  readonly accept?: string;

  /**
   * Optional maximum file size in bytes.
   */
  readonly maxSizeBytes?: number;

  /**
   * Called after the Asset has been successfully uploaded.
   *
   * The callback may perform additional feature-specific work, such as
   * associating the uploaded Asset with a TravellerProfile.
   *
   * The dialog waits for the callback to complete before closing.
   */
  readonly onUploaded: (
    asset: Asset,
  ) => void | Promise<void>;
}

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const DEFAULT_MAX_SIZE_BYTES = 10 * 1024 * 1024;

const DEFAULT_ACCEPT = 'image/*,application/pdf';

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function formatFileSize(sizeBytes: number): string {
  if (sizeBytes < 1024) {
    return `${sizeBytes} B`;
  }

  if (sizeBytes < 1024 * 1024) {
    return `${(sizeBytes / 1024).toFixed(1)} KB`;
  }

  if (sizeBytes < 1024 * 1024 * 1024) {
    return `${(sizeBytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  return `${(sizeBytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

function getFileValidationError(
  file: File,
  maxSizeBytes: number,
): string | null {
  if (file.size === 0) {
    return 'The selected file is empty.';
  }

  if (file.size > maxSizeBytes) {
    return `The selected file is too large. Maximum size is ${formatFileSize(maxSizeBytes)}.`;
  }

  return null;
}

function toUploadError(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return 'The file could not be uploaded. Please try again.';
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function AssetUploadDialog({
  open,
  onOpenChange,
  category,
  type,
  title = 'Upload file',
  description = 'Choose a file to upload.',
  accept = DEFAULT_ACCEPT,
  maxSizeBytes = DEFAULT_MAX_SIZE_BYTES,
  onUploaded,
}: AssetUploadDialogProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    upload,
    clearError,
  } = useAsset();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [validationError, setValidationError] = useState<string | null>(
    null,
  );
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // ---------------------------------------------------------------------------
  // Reset
  // ---------------------------------------------------------------------------

  function resetState() {
    setSelectedFile(null);
    setValidationError(null);
    setUploadError(null);
    setIsUploading(false);

    clearError();

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  // ---------------------------------------------------------------------------
  // Dialog state
  // ---------------------------------------------------------------------------

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      resetState();
    }

    onOpenChange(nextOpen);
  }

  // ---------------------------------------------------------------------------
  // File selection
  // ---------------------------------------------------------------------------

  function handleFileChange(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0] ?? null;

    setUploadError(null);
    clearError();

    if (!file) {
      setSelectedFile(null);
      setValidationError(null);
      return;
    }

    const error = getFileValidationError(
      file,
      maxSizeBytes,
    );

    if (error) {
      setSelectedFile(null);
      setValidationError(error);
      return;
    }

    setSelectedFile(file);
    setValidationError(null);
  }

  // ---------------------------------------------------------------------------
  // Upload
  // ---------------------------------------------------------------------------

  async function handleUpload() {
    if (!selectedFile || isUploading) {
      return;
    }

    const error = getFileValidationError(
      selectedFile,
      maxSizeBytes,
    );

    if (error) {
      setValidationError(error);
      return;
    }

    setValidationError(null);
    setUploadError(null);
    clearError();
    setIsUploading(true);

    try {
      const asset = await upload({
        file: selectedFile,
        type,
        category,
      });

      // -----------------------------------------------------------------------
      // Important:
      //
      // The Asset now exists, but the consuming feature may still need to
      // associate it with its business object.
      //
      // For example:
      //
      // Asset
      //   │
      //   └── TravellerProfile avatar association
      //
      // Awaiting onUploaded() means the dialog remains open and loading until
      // the complete consuming workflow succeeds.
      // -----------------------------------------------------------------------

      await onUploaded(asset);

      handleOpenChange(false);
    } catch (error) {
      setUploadError(toUploadError(error));
      setIsUploading(false);
    }
  }

  // ---------------------------------------------------------------------------
  // Remove selection
  // ---------------------------------------------------------------------------

  function handleRemoveSelection() {
    if (isUploading) {
      return;
    }

    setSelectedFile(null);
    setValidationError(null);
    setUploadError(null);
    clearError();

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  const error = validationError ?? uploadError;

  return (
    <Dialog
      open={open}
      onOpenChange={handleOpenChange}
      title={title}
      description={description}
      size="md"
      footer={
        <>
          <Button
            variant="ghost"
            onClick={() => handleOpenChange(false)}
            disabled={isUploading}
          >
            Cancel
          </Button>

          <Button
            variant="primary"
            loading={isUploading}
            disabled={!selectedFile || Boolean(validationError)}
            onClick={handleUpload}
          >
            Upload
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-5">
        {/* ----------------------------------------------------------------- */}
        {/* File Input                                                        */}
        {/* ----------------------------------------------------------------- */}

        {!selectedFile && (
          <label
            className={[
              'flex',
              'min-h-40',
              'cursor-pointer',
              'flex-col',
              'items-center',
              'justify-center',
              'gap-2',
              'rounded-[var(--radius-lg)]',
              'border-2',
              'border-dashed',
              'border-[var(--border-strong)]',
              'bg-[var(--background-subtle)]',
              'px-6',
              'py-8',
              'text-center',
              'transition-colors',
              'duration-150',
              'ease-out',
              'hover:border-[var(--brand)]',
              'hover:bg-[var(--brand-soft)]',
            ].join(' ')}
          >
            <span
              className={[
                'flex',
                'h-10',
                'w-10',
                'items-center',
                'justify-center',
                'rounded-[var(--radius-full)]',
                'bg-[var(--brand-soft)]',
                'text-[var(--brand)]',
              ].join(' ')}
            >
              <svg
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <path
                  d="M10 13V4m0 0L6.5 7.5M10 4l3.5 3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                <path
                  d="M4.5 11.5v3A1.5 1.5 0 0 0 6 16h8a1.5 1.5 0 0 0 1.5-1.5v-3"
                  strokeLinecap="round"
                />
              </svg>
            </span>

            <span className="text-sm font-medium text-[var(--foreground)]">
              Choose a file
            </span>

            <span className="text-xs text-[var(--foreground-muted)]">
              Maximum size: {formatFileSize(maxSizeBytes)}
            </span>

            <input
              ref={fileInputRef}
              type="file"
              accept={accept}
              onChange={handleFileChange}
              className="sr-only"
              aria-label="Choose file"
            />
          </label>
        )}

        {/* ----------------------------------------------------------------- */}
        {/* Selected File                                                     */}
        {/* ----------------------------------------------------------------- */}

        {selectedFile && (
          <div
            className={[
              'rounded-[var(--radius-lg)]',
              'border',
              'border-[var(--border)]',
              'bg-[var(--background-subtle)]',
              'p-4',
            ].join(' ')}
          >
            <div className="flex items-start gap-3">
              <div
                className={[
                  'flex',
                  'h-10',
                  'w-10',
                  'shrink-0',
                  'items-center',
                  'justify-center',
                  'rounded-[var(--radius-md)]',
                  'bg-[var(--brand-soft)]',
                  'text-[var(--brand)]',
                ].join(' ')}
              >
                <svg
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  className="h-5 w-5"
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
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-[var(--foreground)]">
                  {selectedFile.name}
                </p>

                <p className="mt-1 text-xs text-[var(--foreground-muted)]">
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleRemoveSelection}
                disabled={isUploading}
              >
                Remove
              </Button>
            </div>
          </div>
        )}

        {/* ----------------------------------------------------------------- */}
        {/* Error                                                             */}
        {/* ----------------------------------------------------------------- */}

        {error && (
          <p
            role="alert"
            className={[
              'rounded-[var(--radius-md)]',
              'border',
              'border-[var(--danger)]',
              'bg-[var(--danger-soft)]',
              'px-3',
              'py-2.5',
              'text-sm',
              'text-[var(--danger)]',
            ].join(' ')}
          >
            {error}
          </p>
        )}
      </div>
    </Dialog>
  );
}