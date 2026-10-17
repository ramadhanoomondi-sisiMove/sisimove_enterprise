
 // -----------------------------------------------------------------------------
 // sisiMove — Admin Member Detail Page
 // -----------------------------------------------------------------------------

"use client";

import { useMemo, useState, type ReactNode } from "react";
import { useParams, useRouter } from "next/navigation";

import { Container } from "@/components/ui/container";
import { ErrorState } from "@/components/ui/error-state";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

import {
  MemberDetailHeader,
  MemberDetailNavigation,
  MemberIdentityCard,
  MemberProfileCard,
  MemberVerificationPanel,
  MemberTrustPanel,
  MemberRolesPanel,
  MemberSecurityPanel,
  MemberJourneyPanel,
  MemberBookingPanel,
  MEMBER_DETAIL_SECTIONS,
  type MemberDetailSection,
} from "@/components/admin/members/details";

import {
  isMemberIdentityStatus,
  type MemberIdentity,
} from "@/features/admin/members/models/member.model";

import type { IdentityResponseDto } from "@/features/admin/members/types/member-api.types";
import { MemberActivityTimeline } from "@/components/admin/members/details/member-activity-timeline";

import { useMember } from "@/features/admin/members/hooks/use-member";
import { useMemberProfile } from "@/features/admin/members/hooks/use-member-profile";
import { useMemberVerificationByIdentity } from "@/features/admin/members/hooks/use-member-verification";
import { useMemberTrust } from "@/features/admin/members/hooks/use-member-trust";
import { useMemberSecurity } from "@/features/admin/members/hooks/use-member-security";
import { useMemberRolesManager } from "@/features/admin/members/hooks/use-member-roles";

import { usePublicAsset } from "@/features/assets/hooks/use-public-asset";
import { ADMIN_ROUTES } from "@/foundation/routing/admin-routes";

import type {
  MemberRoleAssignmentDetail,
  MemberRoleDefinition,
  MemberRolesOverview,
} from "@/features/admin/members/models/member-roles.model";

// -----------------------------------------------------------------------------
// Loading
// -----------------------------------------------------------------------------

function MemberDetailLoading(): ReactNode {
  return (
    <div className="space-y-6 py-6">
      <div className="space-y-3">
        <Skeleton radius="md" />
        <Skeleton radius="md" />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Skeleton radius="lg" />
        <Skeleton radius="lg" />
        <Skeleton radius="lg" />
      </div>

      <Skeleton radius="lg" />
      <Skeleton radius="lg" />
    </div>
  );
}

// -----------------------------------------------------------------------------
// Identity mapper
// -----------------------------------------------------------------------------

function mapIdentityToMember(
  identity: IdentityResponseDto,
): MemberIdentity | null {
  if (!isMemberIdentityStatus(identity.status)) {
    return null;
  }

  return {
    publicId: identity.publicId,
    email: identity.email,
    phoneNumber: identity.phoneNumber,
    status: identity.status,
    roles: identity.roles.map((role) => ({
      publicId: role.publicId,
      identityPublicId: role.identityPublicId,
      rolePublicId: role.rolePublicId,
      assignedByPublicId: role.assignedByPublicId,
      assignedAt: role.assignedAt,
      expiresAt: role.expiresAt,
      revokedAt: role.revokedAt,
      revokedByPublicId: role.revokedByPublicId,
      createdAt: role.createdAt,
      updatedAt: role.updatedAt,
    })),
    createdAt: identity.createdAt,
    updatedAt: identity.updatedAt,
    activatedAt: identity.activatedAt,
    suspendedAt: identity.suspendedAt,
    closedAt: identity.closedAt,
  };
}

// -----------------------------------------------------------------------------
// Page
// -----------------------------------------------------------------------------

export default function AdminMemberDetailPage(): ReactNode {
  const params = useParams<{ identityPublicId: string }>();
  const router = useRouter();

  const identityPublicId = params.identityPublicId?.trim() ?? "";

  const [activeSection, setActiveSection] =
    useState<MemberDetailSection>("identity");

  // Role-revocation confirmation state.
  const [assignmentToRevoke, setAssignmentToRevoke] =
    useState<MemberRoleAssignmentDetail | null>(null);
  const [revokeReason, setRevokeReason] = useState("");
  const [revokeError, setRevokeError] = useState<string | null>(null);

  // ---------------------------------------------------------------------------
  // Domain queries
  // ---------------------------------------------------------------------------

  const memberQuery = useMember(identityPublicId);
  const profileQuery = useMemberProfile(identityPublicId);

  const verificationQuery =
    useMemberVerificationByIdentity(identityPublicId);

  const trustQuery = useMemberTrust(identityPublicId);

  const securityQuery = useMemberSecurity(identityPublicId);

  // Existing role-assignment query and mutations.
  const rolesManager = useMemberRolesManager({
    identityPublicId,
  });

  // Profile photo.
  const profile = profileQuery.data ?? null;
  const profilePhoto = usePublicAsset(profile?.avatarAssetPublicId);

  // ---------------------------------------------------------------------------
  // Role definitions
  // ---------------------------------------------------------------------------
  //
  // Connect this to the project's existing Roles API/query when its adapter
  // and response contract are available. Do not substitute permission
  // definitions or member assignments for role definitions.
  //

  const availableRoles = useMemo<MemberRoleDefinition[]>(
    () => [],
    [],
  );

  const roleAssignments: MemberRoleAssignmentDetail[] = useMemo(() => {
    const roleDefinitionsByPublicId = new Map(
      availableRoles.map((role) => [role.publicId, role]),
    );

    return rolesManager.assignments.map((assignment) => ({
      assignment,
      role: roleDefinitionsByPublicId.get(assignment.rolePublicId),
    }));
  }, [rolesManager.assignments, availableRoles]);

  const rolesOverview: MemberRolesOverview = {
    identityPublicId,
    assignments: roleAssignments,
  };

  // Fail closed until the current operator's effective permissions are
  // connected. The backend remains authoritative for protected operations.
  const canAssignRole = false;
  const canRevokeRole = false;

  // ---------------------------------------------------------------------------
  // Role revocation
  // ---------------------------------------------------------------------------

  async function confirmRevokeRole(): Promise<void> {
    if (!assignmentToRevoke) return;

    const reason = revokeReason.trim();

    if (!reason) {
      setRevokeError("Enter a reason for revoking this role.");
      return;
    }

    try {
      setRevokeError(null);

      await rolesManager.revokeRole(
        assignmentToRevoke.assignment.rolePublicId,
        { reason },
      );

      setAssignmentToRevoke(null);
      setRevokeReason("");
    } catch (error: unknown) {
      setRevokeError(
        error instanceof Error
          ? error.message
          : "Unable to revoke this role.",
      );
    }
  }

  // ---------------------------------------------------------------------------
  // Invalid route
  // ---------------------------------------------------------------------------

  if (!identityPublicId) {
    return (
      <Container size="2xl" className="py-6">
        <ErrorState
          title="Invalid member identifier"
          description="A valid identity identifier is required to open this member record."
          secondaryAction={{
            label: "Back to members",
            onClick: () => router.push(ADMIN_ROUTES.MEMBERS),
          }}
        />
      </Container>
    );
  }

  // ---------------------------------------------------------------------------
  // Loading
  // ---------------------------------------------------------------------------

  if (memberQuery.isPending && !memberQuery.data) {
    return (
      <Container size="2xl">
        <MemberDetailLoading />
      </Container>
    );
  }

  // ---------------------------------------------------------------------------
  // Query error
  // ---------------------------------------------------------------------------

  if (memberQuery.isError && !memberQuery.data) {
    return (
      <Container size="2xl" className="py-6">
        <ErrorState
          title="Unable to load member"
          description="The member record could not be retrieved. Check your connection and try again."
          retryAction={{
            label: "Retry",
            onClick: () => {
              void memberQuery.refetch();
            },
          }}
          secondaryAction={{
            label: "Back to members",
            onClick: () => router.push(ADMIN_ROUTES.MEMBERS),
          }}
        />
      </Container>
    );
  }

  // ---------------------------------------------------------------------------
  // Missing member
  // ---------------------------------------------------------------------------

  if (!memberQuery.data) {
    return (
      <Container size="2xl" className="py-6">
        <ErrorState
          title="Member not found"
          description="No member record is available for this identity identifier."
          secondaryAction={{
            label: "Back to members",
            onClick: () => router.push(ADMIN_ROUTES.MEMBERS),
          }}
        />
      </Container>
    );
  }

  // ---------------------------------------------------------------------------
  // Validate identity response
  // ---------------------------------------------------------------------------

  const member = mapIdentityToMember(memberQuery.data);

  if (!member) {
    return (
      <Container size="2xl" className="py-6">
        <ErrorState
          title="Unexpected member status"
          description="The Identity API returned a status value that this frontend does not recognize. Check the backend status contract before displaying this record."
          retryAction={{
            label: "Retry",
            onClick: () => {
              void memberQuery.refetch();
            },
          }}
          secondaryAction={{
            label: "Back to members",
            onClick: () => router.push(ADMIN_ROUTES.MEMBERS),
          }}
        />
      </Container>
    );
  }

  if (member.publicId !== identityPublicId) {
    return (
      <Container size="2xl" className="py-6">
        <ErrorState
          title="Member identifier mismatch"
          description="The returned identity does not match the requested member route."
          retryAction={{
            label: "Retry",
            onClick: () => {
              void memberQuery.refetch();
            },
          }}
          secondaryAction={{
            label: "Back to members",
            onClick: () => router.push(ADMIN_ROUTES.MEMBERS),
          }}
        />
      </Container>
    );
  }

  const activeSectionLabel =
    MEMBER_DETAIL_SECTIONS.find(
      (section) => section.id === activeSection,
    )?.label ?? "Member details";

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <Container size="2xl" className="space-y-6 py-6">
      <div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => router.push(ADMIN_ROUTES.MEMBERS)}
        >
          Back to members
        </Button>
      </div>

      <MemberDetailHeader
        member={member}
        avatarUrl={profilePhoto.asset?.url ?? null}
        displayName={profile?.handle ?? null}
      />

      <MemberDetailNavigation
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />

      <section
        id={`member-detail-panel-${activeSection}`}
        role="tabpanel"
        aria-label={activeSectionLabel}
        className="min-w-0"
      >
        {activeSection === "identity" ? (
          <MemberIdentityCard member={member} />
        ) : activeSection === "profile" ? (
          <div className="space-y-4">
            {profileQuery.isError && !profileQuery.data ? (
              <ErrorState
                title="Unable to load member profile"
                description="The Identity record loaded successfully, but the Traveller Profile could not be retrieved. Retry the profile request without reloading Identity."
                retryAction={{
                  label: "Retry profile",
                  onClick: () => {
                    void profileQuery.refetch();
                  },
                }}
              />
            ) : (
              <MemberProfileCard
                profile={profile}
                isLoading={
                  profileQuery.isPending && !profileQuery.data
                }
                avatarUrl={profilePhoto.asset?.url ?? null}
              />
            )}
          </div>
        ) : activeSection === "verification" ? (
          <MemberVerificationPanel
            verification={verificationQuery.data ?? null}
            isLoading={
              verificationQuery.isPending &&
              !verificationQuery.data
            }
            error={
              verificationQuery.isError
                ? verificationQuery.error instanceof Error
                  ? verificationQuery.error.message
                  : "An unexpected error occurred while loading verification details."
                : null
            }
            onRetry={() => {
              void verificationQuery.refetch();
            }}
          />
        ) : activeSection === "trust" ? (
          <MemberTrustPanel
            trust={trustQuery.data ?? null}
            isLoading={trustQuery.isPending && !trustQuery.data}
            error={
              trustQuery.isError
                ? trustQuery.error instanceof Error
                  ? trustQuery.error.message
                  : "An unexpected error occurred while loading trust information."
                : null
            }
            onRetry={() => {
              void trustQuery.refetch();
            }}
          />
        ) : activeSection === "security" ? (
          <MemberSecurityPanel
            security={securityQuery.data ?? null}
            isLoading={
              securityQuery.isPending && !securityQuery.data
            }
            error={
              securityQuery.isError
                ? securityQuery.error instanceof Error
                  ? securityQuery.error.message
                  : "An unexpected error occurred while loading security information."
                : null
            }
            onRetry={() => {
              void securityQuery.refetch();
            }}
          />
        ) : activeSection === "journeys" ? (
          <MemberJourneyPanel
            providerPublicId={identityPublicId}
          />
        ) : activeSection === "bookings" ? (
          <MemberBookingPanel
            passengerPublicId={identityPublicId}
          />
          ) : activeSection === "activity" ? (
            <MemberActivityTimeline memberPublicId={identityPublicId} />
            
        ) : activeSection === "roles" ? (
          <div className="space-y-4">
            <MemberRolesPanel
              identityPublicId={identityPublicId}
              overview={rolesOverview}
              availableRoles={availableRoles}
              canAssignRole={canAssignRole}
              canRevokeRole={canRevokeRole}
              isLoading={rolesManager.isLoading}
              error={
                rolesManager.error instanceof Error
                  ? rolesManager.error
                  : rolesManager.error
                    ? new Error("Unable to load member roles.")
                    : null
              }
              onRetry={() => {
                void rolesManager.refetch();
              }}
              onRevokeRole={(item) => {
                setAssignmentToRevoke(item);
                setRevokeReason("");
                setRevokeError(null);
              }}
            />

            {assignmentToRevoke && (
              <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="revoke-role-heading"
                className="space-y-4 rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface)] p-5"
              >
                <h3
                  id="revoke-role-heading"
                  className="font-semibold text-[var(--foreground)]"
                >
                  Revoke role assignment
                </h3>

                <p className="text-sm text-[var(--foreground-secondary)]">
                  Revoke{" "}
                  {assignmentToRevoke.role?.name ??
                    assignmentToRevoke.assignment.rolePublicId}{" "}
                  from this member? A reason is required.
                </p>

                <div className="space-y-2">
                  <label
                    htmlFor="revoke-role-reason"
                    className="block text-sm font-medium text-[var(--foreground)]"
                  >
                    Reason
                  </label>

                  <textarea
                    id="revoke-role-reason"
                    value={revokeReason}
                    onChange={(event) =>
                      setRevokeReason(event.target.value)
                    }
                    rows={3}
                    className="w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--background)] p-3 text-sm text-[var(--foreground)]"
                    placeholder="Enter the reason for revocation"
                  />
                </div>

                {revokeError && (
                  <p role="alert" className="text-sm text-[var(--danger)]">
                    {revokeError}
                  </p>
                )}

                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    onClick={() => void confirmRevokeRole()}
                    disabled={
                      rolesManager.isRevoking ||
                      !revokeReason.trim()
                    }
                  >
                    {rolesManager.isRevoking
                      ? "Revoking…"
                      : "Confirm revocation"}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setAssignmentToRevoke(null);
                      setRevokeReason("");
                      setRevokeError(null);
                    }}
                    disabled={rolesManager.isRevoking}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-6">
            <h2 className="text-base font-semibold text-[var(--foreground)]">
              {activeSectionLabel}
            </h2>

            <p className="mt-2 text-sm text-[var(--foreground-muted)]">
              This section is not yet connected to its detail data source.
              The identity record remains available while the section
              integration is completed.
            </p>
          </div>
        )}
      </section>
    </Container>
  );
}
