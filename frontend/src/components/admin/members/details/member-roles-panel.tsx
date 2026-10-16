
"use client";

/**
 * sisiMove — Admin Member Roles Panel
 *
 * Responsibilities:
 * - display a member's role assignments;
 * - distinguish active and revoked assignments;
 * - open the existing role-assignment dialog;
 * - expose revocation only when the caller grants permission;
 * - leave authorization enforcement to the backend.
 */

import { useState } from "react";

import { Button } from "@/components/ui/button";

import { MemberRoleAssignmentDialog } from "./member-role-assignment-dialog";

import type {
  MemberRoleAssignmentDetail,
  MemberRoleDefinition,
  MemberRolesOverview,
} from "@/features/admin/members/models/member-roles.model";

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface MemberRolesPanelProps {
  identityPublicId: string;
  overview: MemberRolesOverview;
  availableRoles: MemberRoleDefinition[];

  canAssignRole: boolean;
  canRevokeRole: boolean;

  /**
   * The parent performs the revocation using the existing mutation.
   * Supply the assignment's public role ID and collect any required reason
   * through the existing confirmation workflow.
   */
  onRevokeRole?: (
    assignment: MemberRoleAssignmentDetail,
  ) => void;

  className?: string;
}

// -----------------------------------------------------------------------------
// Formatting
// -----------------------------------------------------------------------------

function formatDate(value?: string): string {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function getRoleName(
  assignment: MemberRoleAssignmentDetail,
): string {
  return assignment.role?.name ?? assignment.assignment.rolePublicId;
}

function getRoleCode(
  assignment: MemberRoleAssignmentDetail,
): string | undefined {
  return assignment.role?.code;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function MemberRolesPanel({
  identityPublicId,
  overview,
  availableRoles,
  canAssignRole,
  canRevokeRole,
  onRevokeRole,
  className,
}: MemberRolesPanelProps) {
  const [assignmentDialogOpen, setAssignmentDialogOpen] =
    useState(false);

  const assignments = overview.assignments;

  const activeAssignments = assignments.filter(
    ({ assignment }) => !assignment.revokedAt,
  );

  const revokedAssignments = assignments.filter(
    ({ assignment }) => Boolean(assignment.revokedAt),
  );

  return (
    <section
      aria-labelledby="member-roles-heading"
      className={[
        "space-y-6 rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface)] p-5",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* ------------------------------------------------------------------- */}
      {/* Header                                                              */}
      {/* ------------------------------------------------------------------- */}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2
            id="member-roles-heading"
            className="text-base font-semibold text-[var(--foreground)]"
          >
            Roles
          </h2>

          <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
            Review this member&apos;s role assignments and their history.
          </p>
        </div>

        {canAssignRole && (
          <Button
            type="button"
            onClick={() => setAssignmentDialogOpen(true)}
            disabled={!identityPublicId.trim()}
          >
            Assign role
          </Button>
        )}
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* Summary                                                             */}
      {/* ------------------------------------------------------------------- */}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--background-subtle)] p-4">
          <p className="text-sm text-[var(--foreground-secondary)]">
            Current assignments
          </p>

          <p className="mt-1 text-2xl font-semibold tabular-nums text-[var(--foreground)]">
            {activeAssignments.length}
          </p>
        </div>

        <div className="rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--background-subtle)] p-4">
          <p className="text-sm text-[var(--foreground-secondary)]">
            Revoked assignments
          </p>

          <p className="mt-1 text-2xl font-semibold tabular-nums text-[var(--foreground)]">
            {revokedAssignments.length}
          </p>
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* Current assignments                                                 */}
      {/* ------------------------------------------------------------------- */}

      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-[var(--foreground)]">
          Current assignments
        </h3>

        {activeAssignments.length === 0 ? (
          <p className="rounded-[var(--radius-lg)] border border-dashed border-[var(--border)] p-4 text-sm text-[var(--foreground-secondary)]">
            No current role assignments were returned for this member.
          </p>
        ) : (
          <ul className="divide-y divide-[var(--border-subtle)] rounded-[var(--radius-lg)] border border-[var(--border)]">
            {activeAssignments.map((item) => {
              const assignment = item.assignment;
              const roleCode = getRoleCode(item);

              return (
                <li
                  key={assignment.publicId}
                  className="flex flex-col gap-3 p-4 sm:flex-row sm:items-start sm:justify-between"
                >
                  <div className="min-w-0 space-y-1">
                    <p className="font-medium text-[var(--foreground)]">
                      {getRoleName(item)}
                    </p>

                    {roleCode && (
                      <p className="text-xs text-[var(--foreground-secondary)]">
                        {roleCode}
                      </p>
                    )}

                    <dl className="space-y-1 text-sm text-[var(--foreground-secondary)]">
                      <div>
                        <dt className="inline">Assigned: </dt>
                        <dd className="inline">
                          {formatDate(assignment.assignedAt)}
                        </dd>
                      </div>

                      <div>
                        <dt className="inline">Expires: </dt>
                        <dd className="inline">
                          {formatDate(assignment.expiresAt)}
                        </dd>
                      </div>

                      <div>
                        <dt className="inline">Assigned by: </dt>
                        <dd className="inline">
                          {assignment.assignedByPublicId ?? "Not recorded"}
                        </dd>
                      </div>
                    </dl>
                  </div>

                  {canRevokeRole && onRevokeRole && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => onRevokeRole(item)}
                    >
                      Revoke
                    </Button>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* Revoked assignment history                                          */}
      {/* ------------------------------------------------------------------- */}

      {revokedAssignments.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-[var(--foreground)]">
            Revoked history
          </h3>

          <ul className="divide-y divide-[var(--border-subtle)] rounded-[var(--radius-lg)] border border-[var(--border)]">
            {revokedAssignments.map((item) => {
              const assignment = item.assignment;

              return (
                <li
                  key={assignment.publicId}
                  className="p-4"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium text-[var(--foreground)]">
                      {getRoleName(item)}
                    </p>

                    <span className="rounded-full bg-[var(--background-muted)] px-2 py-0.5 text-xs text-[var(--foreground-secondary)]">
                      Revoked
                    </span>
                  </div>

                  <dl className="mt-2 space-y-1 text-sm text-[var(--foreground-secondary)]">
                    <div>
                      <dt className="inline">Assigned: </dt>
                      <dd className="inline">
                        {formatDate(assignment.assignedAt)}
                      </dd>
                    </div>

                    <div>
                      <dt className="inline">Revoked: </dt>
                      <dd className="inline">
                        {formatDate(assignment.revokedAt)}
                      </dd>
                    </div>

                    <div>
                      <dt className="inline">Revoked by: </dt>
                      <dd className="inline">
                        {assignment.revokedByPublicId ?? "Not recorded"}
                      </dd>
                    </div>
                  </dl>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* Assignment dialog                                                   */}
      {/* ------------------------------------------------------------------- */}

      <MemberRoleAssignmentDialog
        open={assignmentDialogOpen}
        identityPublicId={identityPublicId}
        availableRoles={availableRoles}
        onClose={() => setAssignmentDialogOpen(false)}
        onSuccess={() => setAssignmentDialogOpen(false)}
      />
    </section>
  );
}

export default MemberRolesPanel;
