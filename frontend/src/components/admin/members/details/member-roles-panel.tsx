
"use client";

/**
 * sisiMove — Admin Member Roles Panel
 *
 * Responsibilities:
 * - display current, expired, and revoked role assignments;
 * - support loading, error, and retry states;
 * - open the existing role-assignment dialog;
 * - expose actions only when the caller grants permission;
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

export interface MemberRolesPanelProps {
  identityPublicId: string;
  overview: MemberRolesOverview;
  availableRoles: MemberRoleDefinition[];

  canAssignRole: boolean;
  canRevokeRole: boolean;

  isLoading?: boolean;
  error?: Error | null;
  onRetry?: () => void;

  onRevokeRole?: (
    assignment: MemberRoleAssignmentDetail,
  ) => void;

  className?: string;
}

function formatDate(value?: string): string {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function getRoleName(
  item: MemberRoleAssignmentDetail,
): string {
  return item.role?.name ?? item.assignment.rolePublicId;
}

function getRoleCode(
  item: MemberRoleAssignmentDetail,
): string | undefined {
  return item.role?.code;
}

function isExpired(
  item: MemberRoleAssignmentDetail,
  now: number,
): boolean {
  const expiresAt = item.assignment.expiresAt;

  if (!expiresAt) return false;

  const expiryTime = new Date(expiresAt).getTime();

  return Number.isFinite(expiryTime) && expiryTime <= now;
}

type AssignmentStatus = "Current" | "Expired" | "Revoked";

function getAssignmentStatus(
  item: MemberRoleAssignmentDetail,
  now: number,
): AssignmentStatus {
  if (item.assignment.revokedAt) return "Revoked";

  if (isExpired(item, now)) return "Expired";

  return "Current";
}

interface AssignmentRowProps {
  item: MemberRoleAssignmentDetail;
  status: AssignmentStatus;
  canRevokeRole: boolean;
  onRevokeRole?: (
    assignment: MemberRoleAssignmentDetail,
  ) => void;
}

function AssignmentRow({
  item,
  status,
  canRevokeRole,
  onRevokeRole,
}: AssignmentRowProps) {
  const assignment = item.assignment;
  const roleCode = getRoleCode(item);

  return (
    <li className="flex flex-col gap-3 p-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0 space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-medium text-[var(--foreground)]">
            {getRoleName(item)}
          </p>

          <span
            className={[
              "rounded-full px-2 py-0.5 text-xs",
              status === "Current"
                ? "bg-[var(--success-soft)] text-[var(--success)]"
                : "bg-[var(--background-muted)] text-[var(--foreground-secondary)]",
            ].join(" ")}
          >
            {status}
          </span>
        </div>

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

          {status === "Revoked" && (
            <>
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
            </>
          )}
        </dl>
      </div>

      {status === "Current" &&
        canRevokeRole &&
        onRevokeRole && (
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
}

interface AssignmentSectionProps {
  title: string;
  items: MemberRoleAssignmentDetail[];
  status: AssignmentStatus;
  emptyMessage?: string;
  canRevokeRole: boolean;
  onRevokeRole?: (
    assignment: MemberRoleAssignmentDetail,
  ) => void;
}

function AssignmentSection({
  title,
  items,
  status,
  emptyMessage,
  canRevokeRole,
  onRevokeRole,
}: AssignmentSectionProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-[var(--foreground)]">
        {title}
      </h3>

      {items.length === 0 ? (
        <p className="rounded-[var(--radius-lg)] border border-dashed border-[var(--border)] p-4 text-sm text-[var(--foreground-secondary)]">
          {emptyMessage ?? "No assignments in this section."}
        </p>
      ) : (
        <ul className="divide-y divide-[var(--border)] rounded-[var(--radius-lg)] border border-[var(--border)]">
          {items.map((item) => (
            <AssignmentRow
              key={item.assignment.publicId}
              item={item}
              status={status}
              canRevokeRole={canRevokeRole}
              onRevokeRole={onRevokeRole}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

export function MemberRolesPanel({
  identityPublicId,
  overview,
  availableRoles,
  canAssignRole,
  canRevokeRole,
  isLoading = false,
  error = null,
  onRetry,
  onRevokeRole,
  className,
}: MemberRolesPanelProps) {
  const [assignmentDialogOpen, setAssignmentDialogOpen] =
    useState(false);

  // Keep expiry classification stable during this component mount.
  const [now] = useState(() => Date.now());

  const assignments = overview.assignments;

  const currentAssignments = assignments.filter(
    (item) => getAssignmentStatus(item, now) === "Current",
  );

  const expiredAssignments = assignments.filter(
    (item) => getAssignmentStatus(item, now) === "Expired",
  );

  const revokedAssignments = assignments.filter(
    (item) => getAssignmentStatus(item, now) === "Revoked",
  );

  const assignableRoles = availableRoles.filter(
    (role) => role.isActive && role.canBeAssigned,
  );

  return (
    <section
      aria-labelledby="member-roles-heading"
      aria-busy={isLoading}
      className={[
        "space-y-6 rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface)] p-5",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2
            id="member-roles-heading"
            className="text-base font-semibold text-[var(--foreground)]"
          >
            Roles
          </h2>

          <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
            Review this member&apos;s role assignments and history.
          </p>
        </div>

        {canAssignRole && (
          <Button
            type="button"
            onClick={() => setAssignmentDialogOpen(true)}
            disabled={
              !identityPublicId.trim() ||
              isLoading ||
              Boolean(error) ||
              assignableRoles.length === 0
            }
          >
            Assign role
          </Button>
        )}
      </div>

      {canAssignRole &&
        !isLoading &&
        !error &&
        assignableRoles.length === 0 && (
          <p className="text-sm text-[var(--foreground-secondary)]">
            No active, assignable roles are currently available.
          </p>
        )}

      {isLoading && (
        <div
          role="status"
          className="space-y-3 rounded-[var(--radius-lg)] border border-[var(--border)] p-4"
        >
          <div className="h-4 w-40 animate-pulse rounded bg-[var(--background-muted)]" />
          <div className="h-3 w-full max-w-md animate-pulse rounded bg-[var(--background-muted)]" />
          <div className="h-3 w-3/4 animate-pulse rounded bg-[var(--background-muted)]" />
          <span className="sr-only">Loading member roles…</span>
        </div>
      )}

      {!isLoading && error && (
        <div
          role="alert"
          className="space-y-3 rounded-[var(--radius-lg)] border border-[var(--danger)] bg-[var(--danger-soft)] p-4"
        >
          <p className="font-medium text-[var(--foreground)]">
            Unable to load member roles
          </p>

          <p className="text-sm text-[var(--foreground-secondary)]">
            {error.message ||
              "An unexpected error occurred while retrieving role assignments."}
          </p>

          {onRetry && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onRetry}
            >
              Try again
            </Button>
          )}
        </div>
      )}

      {!isLoading && !error && (
        <>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              {
                label: "Current assignments",
                count: currentAssignments.length,
              },
              {
                label: "Expired assignments",
                count: expiredAssignments.length,
              },
              {
                label: "Revoked assignments",
                count: revokedAssignments.length,
              },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--background)] p-4"
              >
                <p className="text-sm text-[var(--foreground-secondary)]">
                  {item.label}
                </p>

                <p className="mt-1 text-2xl font-semibold tabular-nums text-[var(--foreground)]">
                  {item.count}
                </p>
              </div>
            ))}
          </div>

          <AssignmentSection
            title="Current assignments"
            items={currentAssignments}
            status="Current"
            emptyMessage="No current role assignments were returned for this member."
            canRevokeRole={canRevokeRole}
            onRevokeRole={onRevokeRole}
          />

          {expiredAssignments.length > 0 && (
            <AssignmentSection
              title="Expired assignments"
              items={expiredAssignments}
              status="Expired"
              canRevokeRole={false}
            />
          )}

          {revokedAssignments.length > 0 && (
            <AssignmentSection
              title="Revoked history"
              items={revokedAssignments}
              status="Revoked"
              canRevokeRole={false}
            />
          )}
        </>
      )}

      {assignmentDialogOpen && (
        <MemberRoleAssignmentDialog
          open={assignmentDialogOpen}
          identityPublicId={identityPublicId}
          availableRoles={assignableRoles}
          onClose={() => setAssignmentDialogOpen(false)}
          onSuccess={() => setAssignmentDialogOpen(false)}
        />
      )}
    </section>
  );
}

export default MemberRolesPanel;
