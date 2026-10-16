
"use client";

import { Badge } from "@/components/ui/badge";
import { MemberDataSection } from "@/components/admin/members/primitives/member-data-section";
import type { MemberDeviceResponse } from "@/features/admin/members/api/member-devices.api";
import { cn } from "@/foundation/utils/cn";

interface MemberDeviceListProps {
  devices: readonly MemberDeviceResponse[];
  isLoading?: boolean;
  error?: boolean;
  onRetry?: () => void;
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

function statusVariant(
  status: string,
): "success" | "warning" | "danger" | "outline" {
  switch (status.toUpperCase()) {
    case "ACTIVE":
    case "TRUSTED":
      return "success";
    case "PENDING":
    case "UNTRUSTED":
      return "warning";
    case "REVOKED":
    case "BLOCKED":
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
  value?: string | null;
}) {
  return (
    <div className="min-w-0">
      <p className="text-xs font-medium text-[var(--foreground-muted)]">
        {label}
      </p>
      <p className="mt-1 break-words text-sm text-[var(--foreground)]">
        {value || "—"}
      </p>
    </div>
  );
}

function DeviceCard({ device }: { device: MemberDeviceResponse }) {
  const revoked = Boolean(device.revokedAt);

  return (
    <article className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium text-[var(--foreground-muted)]">
            Device reference
          </p>
          <p className="mt-1 break-all text-sm font-semibold text-[var(--foreground)]">
            {device.publicId}
          </p>
          {device.name && (
            <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
              {device.name}
            </p>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant={statusVariant(device.status)}>
            {device.status.replaceAll("_", " ")}
          </Badge>
          <Badge variant={statusVariant(device.trustLevel)}>
            Trust: {device.trustLevel.replaceAll("_", " ")}
          </Badge>
          {revoked && <Badge variant="danger">Revoked</Badge>}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Detail label="Device type" value={device.deviceType} />
        <Detail label="Platform" value={device.platform} />
        <Detail label="Operating system" value={device.operatingSystem} />
        <Detail
          label="OS version"
          value={device.operatingSystemVersion}
        />
        <Detail label="Browser" value={device.browser} />
        <Detail label="Browser version" value={device.browserVersion} />
        <Detail label="Last seen" value={formatDate(device.lastSeenAt)} />
        <Detail label="Trusted at" value={formatDate(device.trustedAt)} />
        <Detail label="Revoked at" value={formatDate(device.revokedAt)} />
        <Detail label="Registered" value={formatDate(device.createdAt)} />
        <Detail label="Last updated" value={formatDate(device.updatedAt)} />
      </div>
    </article>
  );
}

export function MemberDeviceList({
  devices,
  isLoading = false,
  error = false,
  onRetry,
  className,
}: MemberDeviceListProps) {
  const sortedDevices = [...devices].sort((first, second) => {
    const firstTime = new Date(first.lastSeenAt ?? first.createdAt).getTime();
    const secondTime = new Date(second.lastSeenAt ?? second.createdAt).getTime();

    const safeFirst = Number.isFinite(firstTime) ? firstTime : 0;
    const safeSecond = Number.isFinite(secondTime) ? secondTime : 0;

    return safeSecond - safeFirst;
  });

  return (
    <MemberDataSection
      title="Registered devices"
      description="Device registration and trust information for the selected member."
      className={cn("space-y-4", className)}
    >
      {isLoading ? (
        <div className="space-y-3" aria-label="Loading devices">
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
      ) : error ? (
        <div className="rounded-[var(--radius-lg)] border border-[var(--danger)]/30 p-4" role="alert">
          <p className="text-sm font-medium text-[var(--foreground)]">
            Could not load device information.
          </p>
          <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
            Check your access permissions and connection, then retry.
          </p>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="mt-3 rounded-[var(--radius-md)] border border-[var(--border)] px-3 py-2 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--background-subtle)]"
            >
              Retry
            </button>
          )}
        </div>
      ) : sortedDevices.length === 0 ? (
        <div className="rounded-[var(--radius-lg)] border border-dashed border-[var(--border-strong)] px-4 py-8 text-center">
          <p className="text-sm font-medium text-[var(--foreground)]">
            No device records supplied
          </p>
          <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
            An authorized member-specific device endpoint is needed to populate this section.
          </p>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-[var(--foreground-secondary)]">
              Most recently seen first
            </p>
            <Badge variant="outline">
              {sortedDevices.length}{" "}
              {sortedDevices.length === 1 ? "device" : "devices"}
            </Badge>
          </div>

          <div className="space-y-4">
            {sortedDevices.map((device) => (
              <DeviceCard key={device.publicId} device={device} />
            ))}
          </div>
        </>
      )}
    </MemberDataSection>
  );
}

export default MemberDeviceList;
