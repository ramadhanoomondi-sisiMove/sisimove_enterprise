"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { Card } from "@/components/ui";
import { VerificationLevelBadge } from "../primitives";

import { useVerificationActions } from "@/features/admin/verifications/hooks/use-verification-actions";
import { verificationsKeys } from "@/features/admin/verifications/queries/verifications.keys";

import type {
  VerificationApiResponse,
  VerificationRequestApiResponse,
} from "@/features/admin/verifications/types/verification-api.types";

export interface VerificationLevelPanelProps {
  verification: VerificationApiResponse;
  className?: string;
  canGrantMember?: boolean;
  canGrantDriver?: boolean;
}

const levelDescriptions: Record<
  VerificationApiResponse["level"],
  string
> = {
  NONE: "No verification level has been assigned.",
  MEMBER: "Member-level verification.",
  DRIVER: "Driver-level verification.",
};

const formatRequestType = (
  type: VerificationRequestApiResponse["type"],
): string => {
  switch (type) {
    case "PROFILE_PHOTO":
      return "Profile photo";
    case "GOVERNMENT_ID":
      return "Government ID";
    case "DRIVER_LICENSE":
      return "Driver licence";
    default:
      return type;
  }
};

const formatDate = (value?: string | null): string => {
  if (!value) return "Not recorded";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return new Intl.DateTimeFormat("en-KE", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return "The action failed. Please try again.";
};

export function VerificationLevelPanel({
  verification,
  className,
}: VerificationLevelPanelProps) {
  const actions = useVerificationActions();
  const queryClient = useQueryClient();

  const [memberRequestPublicId, setMemberRequestPublicId] =
    useState("");
  const [driverRequestPublicId, setDriverRequestPublicId] =
    useState("");

  const [memberError, setMemberError] = useState<string | null>(null);
  const [driverError, setDriverError] = useState<string | null>(null);

  const [memberSuccess, setMemberSuccess] = useState(false);
  const [driverSuccess, setDriverSuccess] = useState(false);

  const requests = verification.requests ?? [];

  const approvedRequests = requests.filter(
    (request) => request.status === "APPROVED",
  );

  const approvedMemberRequests = approvedRequests.filter(
    (request) =>
      request.type === "PROFILE_PHOTO" ||
      request.type === "GOVERNMENT_ID",
  );

  const approvedDriverLicenseRequests = approvedRequests.filter(
    (request) => request.type === "DRIVER_LICENSE",
  );

  const memberAlreadyGranted =
    verification.level === "MEMBER" ||
    verification.level === "DRIVER";

  const driverAlreadyGranted = verification.level === "DRIVER";

  const memberEvidenceReady =
    verification.profilePhotoVerified === true &&
    verification.governmentIdVerified === true;

  const canAttemptMemberGrant =
    verification.level === "NONE" &&
    memberEvidenceReady &&
    !memberAlreadyGranted;

  const canAttemptDriverGrant =
    verification.level === "MEMBER" &&
    !driverAlreadyGranted;

  async function refreshVerification(): Promise<void> {
    await queryClient.invalidateQueries({
      queryKey: verificationsKeys.detail(verification.publicId),
    });
  }

  async function grantMember(): Promise<void> {
    if (
      !memberRequestPublicId ||
      !canAttemptMemberGrant ||
      actions.grantMember.isPending
    ) {
      return;
    }

    setMemberError(null);
    setMemberSuccess(false);
    setDriverError(null);
    setDriverSuccess(false);

    try {
      await actions.grantMember.mutateAsync({
        verificationPublicId: verification.publicId,
        verificationRequestPublicId: memberRequestPublicId,
      });

      await refreshVerification();
      setMemberSuccess(true);
    } catch (error) {
      setMemberError(getErrorMessage(error));
    }
  }

  async function grantDriver(): Promise<void> {
    if (
      !driverRequestPublicId ||
      !canAttemptDriverGrant ||
      actions.grantDriver.isPending
    ) {
      return;
    }

    setDriverError(null);
    setDriverSuccess(false);
    setMemberError(null);
    setMemberSuccess(false);

    try {
      await actions.grantDriver.mutateAsync({
        verificationPublicId: verification.publicId,
        verificationRequestPublicId: driverRequestPublicId,
      });

      await refreshVerification();
      setDriverSuccess(true);
    } catch (error) {
      setDriverError(getErrorMessage(error));
    }
  }

  return (
    <Card
      padding="md"
      className={`overflow-visible ${className ?? ""}`}
    >
      <section
        aria-labelledby="verification-level-panel-title"
        className="space-y-5"
      >
        <div>
          <h2
            id="verification-level-panel-title"
            className="text-base font-semibold text-[var(--foreground)]"
          >
            Verification level
          </h2>

          <p className="mt-1 text-sm text-[var(--foreground-muted)]">
            The level currently assigned to this verification record.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <VerificationLevelBadge level={verification.level} />
        </div>

        <p className="text-sm leading-6 text-[var(--foreground-secondary)]">
          {levelDescriptions[verification.level]}
        </p>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-[var(--border)] p-3">
            <p className="text-xs font-medium text-[var(--foreground-muted)]">
              Member verified at
            </p>

            <p className="mt-1 text-sm text-[var(--foreground)]">
              {formatDate(verification.memberVerifiedAt)}
            </p>
          </div>

          <div className="rounded-xl border border-[var(--border)] p-3">
            <p className="text-xs font-medium text-[var(--foreground-muted)]">
              Driver verified at
            </p>

            <p className="mt-1 text-sm text-[var(--foreground)]">
              {formatDate(verification.driverVerifiedAt)}
            </p>
          </div>
        </div>

        {canAttemptMemberGrant && (
          <div className="space-y-3 border-t border-[var(--border)] pt-5">
            <div>
              <h3 className="text-sm font-semibold text-[var(--foreground)]">
                Grant member verification
              </h3>

              <p className="mt-1 text-sm text-[var(--foreground-muted)]">
                Both profile photo and government ID are verified.
                Select an approved member-evidence request to continue.
                The backend will validate the grant.
              </p>
            </div>

            {approvedMemberRequests.length > 0 ? (
              <>
                <label
                  htmlFor="grant-member-request"
                  className="block text-sm font-medium text-[var(--foreground)]"
                >
                  Approved member-evidence request
                </label>

                <select
                  id="grant-member-request"
                  value={memberRequestPublicId}
                  onChange={(event) => {
                    setMemberRequestPublicId(event.target.value);
                    setMemberError(null);
                    setMemberSuccess(false);
                  }}
                  disabled={actions.grantMember.isPending}
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm text-[var(--foreground)] outline-none focus:ring-2 focus:ring-[var(--ring)] disabled:opacity-60"
                >
                  <option value="">Select a request</option>

                  {approvedMemberRequests.map((request) => (
                    <option
                      key={request.publicId}
                      value={request.publicId}
                    >
                      {formatRequestType(request.type)} — {request.publicId}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={() => void grantMember()}
                  disabled={
                    !memberRequestPublicId ||
                    actions.grantMember.isPending
                  }
                  className="flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                >
                  {actions.grantMember.isPending
                    ? "Granting..."
                    : "Grant Member Verification"}
                </button>
              </>
            ) : (
              <p className="text-sm text-[var(--foreground-muted)]">
                No approved profile-photo or government-ID requests
                are available.
              </p>
            )}

            {memberError && (
              <p role="alert" className="text-sm text-red-600">
                {memberError}
              </p>
            )}

            {memberSuccess && (
              <p role="status" className="text-sm text-emerald-600">
                Member verification grant succeeded. The verification
                record is refreshing.
              </p>
            )}
          </div>
        )}

        {verification.level === "NONE" && !memberEvidenceReady && (
          <div className="rounded-xl border border-[var(--border)] p-3">
            <h3 className="text-sm font-semibold text-[var(--foreground)]">
              Member verification requirements
            </h3>

            <p className="mt-1 text-sm text-[var(--foreground-muted)]">
              Both the profile photo and government ID must be verified
              before requesting member verification.
            </p>
          </div>
        )}

        {canAttemptDriverGrant && (
          <div className="space-y-3 border-t border-[var(--border)] pt-5">
            <div>
              <h3 className="text-sm font-semibold text-[var(--foreground)]">
                Grant driver verification
              </h3>

              <p className="mt-1 text-sm text-[var(--foreground-muted)]">
                The member must already have MEMBER verification.
                Select an approved driver-licence request to continue.
                The backend will validate the grant.
              </p>
            </div>

            {approvedDriverLicenseRequests.length > 0 ? (
              <>
                <label
                  htmlFor="grant-driver-request"
                  className="block text-sm font-medium text-[var(--foreground)]"
                >
                  Approved driver-licence request
                </label>

                <select
                  id="grant-driver-request"
                  value={driverRequestPublicId}
                  onChange={(event) => {
                    setDriverRequestPublicId(event.target.value);
                    setDriverError(null);
                    setDriverSuccess(false);
                  }}
                  disabled={actions.grantDriver.isPending}
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm text-[var(--foreground)] outline-none focus:ring-2 focus:ring-[var(--ring)] disabled:opacity-60"
                >
                  <option value="">Select a driver licence</option>

                  {approvedDriverLicenseRequests.map((request) => (
                    <option
                      key={request.publicId}
                      value={request.publicId}
                    >
                      {request.publicId}
                    </option>
                  ))}
                </select>

            <div className="mt-4 flex w-full justify-start">
  <button
    type="button"
    onClick={() => void grantDriver()}
    disabled={
      !driverRequestPublicId ||
      actions.grantDriver.isPending
    }
    className="inline-flex min-h-11 items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
  >
    {actions.grantDriver.isPending
      ? "Granting..."
      : "Grant Driver Verification"}
  </button>
</div>
              </>
            ) : (
              <p className="text-sm text-[var(--foreground-muted)]">
                No approved driver-licence requests are available.
              </p>
            )}

            {driverError && (
              <p role="alert" className="text-sm text-red-600">
                {driverError}
              </p>
            )}

            {driverSuccess && (
              <p role="status" className="text-sm text-emerald-600">
                Driver verification grant succeeded. The verification
                record is refreshing.
              </p>
            )}
          </div>
        )}
      </section>
    </Card>
  );
}

export default VerificationLevelPanel;
