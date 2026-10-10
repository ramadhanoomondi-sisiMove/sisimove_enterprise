
'use client';

// -----------------------------------------------------------------------------
// sisiMove — New Support Case
// -----------------------------------------------------------------------------
//
// Supports both general Support Cases and Journey-specific Support Cases.
//
// General:
//   useCreateSupportCase()
//
// Journey-specific:
//   useCreateJourneySupportCase()
//   POST /support-cases/journeys/:journeyPublicId
//
// Journey reference metadata and requester identity are resolved by the backend
// for Journey-specific requests.
// -----------------------------------------------------------------------------

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';

import { Badge, Button, Card, Input } from '@/components/ui';

import {
  useCreateSupportCase,
  useCreateJourneySupportCase,
} from '@/features/support-case/hooks';

import type {
  SupportCaseCategory,
  SupportCasePriority,
} from '@/features/support-case/models';

import {
  SUPPORT_CASE_CATEGORIES,
  SUPPORT_CASE_PRIORITIES,
} from '@/features/support-case/models';

// =============================================================================
// Props
// =============================================================================

export interface SupportCaseNewProps {
  readonly requesterPublicId: string;
  readonly initialReferenceType?: string;
  readonly initialReferencePublicId?: string;
  readonly initialJourneyPublicId?: string;
  readonly className?: string;
  readonly onCreated?: (supportCasePublicId: string) => void;
}

const MAX_SUBJECT_LENGTH = 160;
const MAX_DESCRIPTION_LENGTH = 5000;

// =============================================================================
// Helpers
// =============================================================================

function formatLabel(value: string): string {
  return value
    .toLowerCase()
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return 'We could not create your support case. Please try again.';
}

// =============================================================================
// Component
// =============================================================================

export function SupportCaseNew({
  requesterPublicId,
  initialReferenceType,
  initialReferencePublicId,
  initialJourneyPublicId,
  className,
  onCreated,
}: SupportCaseNewProps) {
  const router = useRouter();

  const createSupportCase = useCreateSupportCase();
  const createJourneySupportCase = useCreateJourneySupportCase();

  const journeyPublicId = initialJourneyPublicId?.trim() || undefined;
  const isJourneySupport = Boolean(journeyPublicId);

  const [priority, setPriority] =
    useState<SupportCasePriority>('NORMAL');

  const [category, setCategory] =
    useState<SupportCaseCategory>('OTHER');

  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');

  const [referenceType, setReferenceType] = useState(
    initialReferenceType ?? '',
  );

  const [referencePublicId, setReferencePublicId] = useState(
    initialReferencePublicId ?? '',
  );

  const [formError, setFormError] = useState<string | null>(null);

  const isSubmitting =
    createSupportCase.isPending ||
    createJourneySupportCase.isPending;

  // ---------------------------------------------------------------------------
  // Submission
  // ---------------------------------------------------------------------------

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    const trimmedSubject = subject.trim();
    const trimmedDescription = description.trim();
    const trimmedReferenceType = referenceType.trim();
    const trimmedReferencePublicId = referencePublicId.trim();

    // Requester identity is supplied by the authenticated application context.
    // Journey-specific API requests do not send this value in their body.

    if (!requesterPublicId) {
      setFormError(
        'Your account could not be identified. Please refresh and try again.',
      );
      return;
    }

    if (!trimmedSubject) {
      setFormError('Please enter a subject.');
      return;
    }

    if (trimmedSubject.length > MAX_SUBJECT_LENGTH) {
      setFormError(
        `Subject must be ${MAX_SUBJECT_LENGTH} characters or fewer.`,
      );
      return;
    }

    if (trimmedDescription.length > MAX_DESCRIPTION_LENGTH) {
      setFormError(
        `Description must be ${MAX_DESCRIPTION_LENGTH} characters or fewer.`,
      );
      return;
    }

    // Journey-specific support gets its reference from the endpoint.
    // General support continues to validate optional reference fields.

    if (
      !isJourneySupport &&
      ((trimmedReferenceType && !trimmedReferencePublicId) ||
        (!trimmedReferenceType && trimmedReferencePublicId))
    ) {
      setFormError(
        'Reference type and reference ID must be provided together.',
      );
      return;
    }

    try {
      const createdCase = isJourneySupport
        ? await createJourneySupportCase.mutateAsync({
            journeyPublicId: journeyPublicId!,
            request: {
              priority,
              category,
              subject: trimmedSubject,
              ...(trimmedDescription
                ? { description: trimmedDescription }
                : {}),
            },
          })
        : await createSupportCase.mutateAsync({
            requesterPublicId,
            priority,
            category,
            subject: trimmedSubject,
            ...(trimmedDescription
              ? { description: trimmedDescription }
              : {}),
            ...(trimmedReferenceType && trimmedReferencePublicId
              ? {
                  referenceType: trimmedReferenceType,
                  referencePublicId: trimmedReferencePublicId,
                }
              : {}),
          });

      onCreated?.(createdCase.publicId);

      router.push(
        `/support/cases/${encodeURIComponent(createdCase.publicId)}`,
      );
    } catch (error) {
      setFormError(getErrorMessage(error));
    }
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <Card
      variant="default"
      padding="lg"
      className={className}
    >
      <form
        onSubmit={handleSubmit}
        noValidate
        className="space-y-6"
      >
        {/* Header */}

        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-lg font-semibold text-slate-900">
              Contact support
            </h1>

            <Badge variant="brand" size="sm">
              New case
            </Badge>

            {isJourneySupport && (
              <Badge variant="outline" size="sm">
                Journey support
              </Badge>
            )}
          </div>

          <p className="mt-1 text-sm leading-6 text-slate-600">
            {isJourneySupport
              ? 'Tell us what you need help with regarding this Journey.'
              : 'Tell us what you need help with and include any relevant details.'}
          </p>
        </div>

        {/* Journey context */}

        {isJourneySupport && (
          <section
            aria-label="Journey support context"
            className="rounded-lg border border-blue-100 bg-blue-50 p-3"
          >
            <p className="text-xs font-medium text-blue-900">
              Related Journey
            </p>

            <p className="mt-1 break-all text-xs leading-5 text-blue-800">
              {journeyPublicId}
            </p>

            <p className="mt-1 text-xs leading-5 text-blue-800">
              Your support case will be linked to this Journey automatically.
            </p>
          </section>
        )}

        {/* Classification */}

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">
              Category
            </span>

            <select
              value={category}
              onChange={(event) =>
                setCategory(event.target.value as SupportCaseCategory)
              }
              disabled={isSubmitting}
              className="block h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50"
            >
              {SUPPORT_CASE_CATEGORIES.map((item) => (
                <option key={item} value={item}>
                  {formatLabel(item)}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">
              Priority
            </span>

            <select
              value={priority}
              onChange={(event) =>
                setPriority(event.target.value as SupportCasePriority)
              }
              disabled={isSubmitting}
              className="block h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50"
            >
              {SUPPORT_CASE_PRIORITIES.map((item) => (
                <option key={item} value={item}>
                  {formatLabel(item)}
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* Subject */}

        <Input
          label="Subject"
          value={subject}
          onChange={(event) => setSubject(event.target.value)}
          placeholder={
            isJourneySupport
              ? 'What do you need help with on this Journey?'
              : 'What do you need help with?'
          }
          maxLength={MAX_SUBJECT_LENGTH}
          disabled={isSubmitting}
          fullWidth
        />

        {/* Description */}

        <div>
          <label
            htmlFor="support-case-description"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            Description
          </label>

          <textarea
            id="support-case-description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Give us the details that will help us understand the issue."
            maxLength={MAX_DESCRIPTION_LENGTH}
            disabled={isSubmitting}
            rows={6}
            className="block w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50"
          />

          <p className="mt-1.5 text-xs text-slate-500">
            {description.length}/{MAX_DESCRIPTION_LENGTH}
          </p>
        </div>

        {/* Contextual reference for general support */}

        {!isJourneySupport &&
          (initialReferenceType || initialReferencePublicId) && (
            <div className="rounded-lg border border-blue-100 bg-blue-50 p-3">
              <p className="text-xs font-medium text-blue-900">
                Related reference
              </p>

              <p className="mt-1 break-all text-xs leading-5 text-blue-800">
                {initialReferenceType ?? 'Reference'}:{' '}
                {initialReferencePublicId ?? 'Unavailable'}
              </p>
            </div>
          )}

        {!isJourneySupport &&
          !initialReferenceType &&
          !initialReferencePublicId && (
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Reference type"
                value={referenceType}
                onChange={(event) => setReferenceType(event.target.value)}
                placeholder="Optional"
                disabled={isSubmitting}
                fullWidth
              />

              <Input
                label="Reference ID"
                value={referencePublicId}
                onChange={(event) =>
                  setReferencePublicId(event.target.value)
                }
                placeholder="Optional"
                disabled={isSubmitting}
                fullWidth
              />
            </div>
          )}

        {/* Error */}

        {formError && (
          <div
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700"
          >
            {formError}
          </div>
        )}

        {/* Actions */}

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="ghost"
            disabled={isSubmitting}
            onClick={() => router.push('/support')}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            variant="primary"
            loading={isSubmitting}
            disabled={!requesterPublicId || isSubmitting}
          >
            {isSubmitting
              ? 'Creating case…'
              : 'Create support case'}
          </Button>
        </div>
      </form>
    </Card>
  );
}
