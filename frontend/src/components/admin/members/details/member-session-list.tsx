
"use client";

import { useMemo } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MemberDataSection } from "@/components/admin/members/primitives/member-data-section";
import { useMemberSessions } from "@/features/admin/members/hooks/use-member-sessions";
import type { MemberSessionResponse } from "@/features/admin/members/api/member-sessions.api";
import { cn } from "@/foundation/utils/cn";

interface MemberSessionListProps {
  identityPublicId: string;
  className?: string;
}

function formatDate(value?: string | null): string {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Invalid date";

  return new Intl.DateTimeFormat("en-KE", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function getStatusVariant(
  status: string,
): "success" | "warning" | "danger" | "outline" {
  switch (status.toUpperCase()) {
    case "ACTIVE":
      return "success";
    case "PENDING":
      return "warning";
    case "REVOKED":
    case "EXPIRED":
    case "TERMINATED":
      return "danger";
    default:
      return "outline";
  }
}

function Detail({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) {
  return (
    <div className="min-w-0">
      <p className="text-xs font-medium text-[var(--foreground-muted)]">
        {label}
      </p>
      <p className="mt-1 break-words text-sm text-[var(--foreground)]">
        {value === undefined || value === null || value === "" ? "—" : value}
      </p>
    </div>
  );
}

function SessionCard({ session }: { session: MemberSessionResponse }) {
  const isRevoked = Boolean(session.revokedAt);

  return (
    <article className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium text-[var(--foreground-muted)]">
            Session reference
          </p>
          <p className="mt-1 break-all text-sm font-semibold text-[var(--foreground)]">
            {session.publicId}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant={getStatusVariant(session.status)}>
            {session.status.replaceAll("_", " ")}
          </Badge>
          {isRevoked && <Badge variant="danger">Revoked</Badge>}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Detail label="Device reference" value={session.devicePublicId} />
        <Detail label="IP address" value={session.ipAddress} />
        <Detail
          label="Location"
          value={[session.city, session.countryCode].filter(Boolean).join(", ")}
        />
        <Detail label="Authenticated" value={formatDate(session.authenticatedAt)} />
        <Detail label="Last activity" value={formatDate(session.lastActivityAt)} />
        <Detail label="Expires" value={formatDate(session.expiresAt)} />
        <Detail label="Revoked at" value={formatDate(session.revokedAt)} />
        <Detail label="Revocation reason" value={session.revokedReason} />
        <Detail
          label="Replacement session"
          value={session.replacedBySessionPublicId}
        />
      </div>

      {session.userAgent && (
        <div className="mt-4 border-t border-[var(--border-subtle)] pt-3">
          <Detail label="User agent" value={session.userAgent} />
        </div>
      )}

      <div className="mt-4 border-t border-[var(--border-subtle)] pt-3">
        <Detail
          label="Token family reference"
          value={session.tokenFamilyPublicId}
        />
      </div>
    </article>
  );
}

export function MemberSessionList({
  identityPublicId,
  className,
}: MemberSessionListProps) {
  const sessionsQuery = useMemberSessions(identityPublicId);
  const sessions = sessionsQuery.data;

  const sortedSessions = useMemo(
    () =>
      [...(sessions ?? [])].sort((first, second) => {
        const firstTime = new Date(first.lastActivityAt).getTime();
        const secondTime = new Date(second.lastActivityAt).getTime();

        const safeFirst = Number.isFinite(firstTime) ? firstTime : 0;
        const safeSecond = Number.isFinite(secondTime) ? secondTime : 0;

        return safeSecond - safeFirst;
      }),
    [sessions],
  );

  const activeCount = sortedSessions.filter(
    (session) =>
      session.status.toUpperCase() === "ACTIVE" && !session.revokedAt,
  ).length;

  return (
    <MemberDataSection
      title="Sessions"
      description="Authentication sessions associated with this member identity."
      className={cn("space-y-4", className)}
    >
      {sessionsQuery.isPending ? (
        <div className="space-y-3" aria-label="Loading sessions">
          {[1, 2].map((item) => (
            <div
              key={item}
              className="animate-pulse rounded-[var(--radius-lg)] border border-[var(--border)] p-4"
            >
              <div className="h-4 w-40 rounded bg-[var(--background-muted)]" />
              <div className="mt-4 h-3 w-full rounded bg-[var(--background-muted)]" />
              <div className="mt-2 h-3 w-2/3 rounded bg-[var(--background-muted)]" />
            </div>
          ))}
        </div>
      ) : sessionsQuery.isError ? (
        <div
          className="rounded-[var(--radius-lg)] border border-[var(--danger)]/30 p-4"
          role="alert"
        >
          <p className="text-sm font-medium text-[var(--foreground)]">
            Could not load member sessions.
          </p>
          <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
            Check your access permissions and connection, then retry.
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-3"
            onClick={() => void sessionsQuery.refetch()}
          >
            Retry
          </Button>
        </div>
      ) : sortedSessions.length === 0 ? (
        <div className="rounded-[var(--radius-lg)] border border-dashed border-[var(--border-strong)] px-4 py-8 text-center">
          <p className="text-sm font-medium text-[var(--foreground)]">
            No sessions found
          </p>
          <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
            No session records were returned for this identity.
          </p>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-[var(--foreground-secondary)]">
              Sorted by most recent activity
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">
                {sortedSessions.length}{" "}
                {sortedSessions.length === 1 ? "session" : "sessions"}
              </Badge>
              <Badge variant={activeCount > 0 ? "success" : "outline"}>
                {activeCount} active
              </Badge>
            </div>
          </div>

          <div className="space-y-4">
            {sortedSessions.map((session) => (
              <SessionCard key={session.publicId} session={session} />
            ))}
          </div>
        </>
      )}
    </MemberDataSection>
  );
}

export default MemberSessionList;
