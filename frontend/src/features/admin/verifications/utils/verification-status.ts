
import type {
  VerificationApiLevel,
  VerificationApiStatus,
  VerificationRequestApiStatus,
} from "../types/verification-api.types";

export type VerificationStatusTone =
  | "success"
  | "warning"
  | "danger"
  | "neutral";

export interface VerificationStatusDisplay {
  label: string;
  tone: VerificationStatusTone;
}

const VERIFICATION_STATUS_DISPLAY: Record<
  VerificationApiStatus,
  VerificationStatusDisplay
> = {
  PENDING: { label: "Pending", tone: "warning" },
  VERIFIED: { label: "Verified", tone: "success" },
  REJECTED: { label: "Rejected", tone: "danger" },
  EXPIRED: { label: "Expired", tone: "neutral" },
  REVOKED: { label: "Revoked", tone: "danger" },
};

const VERIFICATION_REQUEST_STATUS_DISPLAY: Record<
  VerificationRequestApiStatus,
  VerificationStatusDisplay
> = {
  PENDING: { label: "Pending", tone: "warning" },
  APPROVED: { label: "Approved", tone: "success" },
  REJECTED: { label: "Rejected", tone: "danger" },
  CANCELLED: { label: "Cancelled", tone: "neutral" },
};

const VERIFICATION_LEVEL_LABELS: Record<VerificationApiLevel, string> = {
  NONE: "None",
  MEMBER: "Member",
  DRIVER: "Driver",
};

export function getVerificationStatusDisplay(
  status: VerificationApiStatus,
): VerificationStatusDisplay {
  return VERIFICATION_STATUS_DISPLAY[status];
}

export function getVerificationRequestStatusDisplay(
  status: VerificationRequestApiStatus,
): VerificationStatusDisplay {
  return VERIFICATION_REQUEST_STATUS_DISPLAY[status];
}

export function getVerificationLevelLabel(
  level: VerificationApiLevel,
): string {
  return VERIFICATION_LEVEL_LABELS[level];
}

export function isVerificationPending(
  status: VerificationApiStatus,
): boolean {
  return status === "PENDING";
}

export function isVerificationApproved(
  status: VerificationRequestApiStatus,
): boolean {
  return status === "APPROVED";
}

export function isVerificationRequestPending(
  status: VerificationRequestApiStatus,
): boolean {
  return status === "PENDING";
}

export function isVerificationTerminal(
  status: VerificationApiStatus,
): boolean {
  return (
    status === "VERIFIED" ||
    status === "REJECTED" ||
    status === "EXPIRED" ||
    status === "REVOKED"
  );
}
