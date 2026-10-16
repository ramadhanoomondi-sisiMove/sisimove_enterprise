
/**
 * sisiMove — Member Status Model
 *
 * Defines the Identity lifecycle statuses confirmed by the backend.
 *
 * CLOSED is terminal. Status transitions and permissions must be enforced
 * by the backend; this model only represents and validates status values.
 */

export const MEMBER_STATUSES = [
  "PENDING",
  "ACTIVE",
  "SUSPENDED",
  "CLOSED",
] as const;

export type MemberStatus = (typeof MEMBER_STATUSES)[number];

/**
 * Checks whether an unknown API value is a recognized member status.
 */
export function isMemberStatus(value: unknown): value is MemberStatus {
  return (
    typeof value === "string" &&
    MEMBER_STATUSES.some((status) => status === value)
  );
}

/**
 * Human-readable labels for administrative UI display.
 */
export const MEMBER_STATUS_LABELS: Record<MemberStatus, string> = {
  PENDING: "Pending",
  ACTIVE: "Active",
  SUSPENDED: "Suspended",
  CLOSED: "Closed",
};

/**
 * Indicates whether a status represents a terminal lifecycle state.
 */
export function isTerminalMemberStatus(status: MemberStatus): boolean {
  return status === "CLOSED";
}
