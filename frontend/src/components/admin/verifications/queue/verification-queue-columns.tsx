// -----------------------------------------------------------------------------
// sisiMove — Verification Queue Columns
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Define column metadata for the verification review queue.
// - Use fields from the established verification API contract.
// - Keep rendering and table-library integration separate.
//
// -----------------------------------------------------------------------------

import type { VerificationApiResponse } from "@/features/admin/verifications/types/verification-api.types";


// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export type VerificationQueueColumnKey =
  | "identity"
  | "status"
  | "level"
  | "evidence"
  | "createdAt"
  | "lastReviewedAt"
  | "actions";

export interface VerificationQueueColumn {
  key: VerificationQueueColumnKey;
  label: string;
  description: string;
  hideOnMobile?: boolean;
  sortable?: boolean;
}

// -----------------------------------------------------------------------------
// Column definitions
// -----------------------------------------------------------------------------

export const verificationQueueColumns: VerificationQueueColumn[] = [
  {
    key: "identity",
    label: "Identity",
    description: "Identity associated with the verification record",
  },
  {
    key: "status",
    label: "Status",
    description: "Current aggregate verification status",
    sortable: true,
  },
  {
    key: "level",
    label: "Level",
    description: "Current verification level",
    hideOnMobile: true,
    sortable: true,
  },
  {
    key: "evidence",
    label: "Evidence",
    description: "Verification evidence completion indicators",
    hideOnMobile: true,
  },
  {
    key: "createdAt",
    label: "Created",
    description: "When the verification record was created",
    sortable: true,
  },
  {
    key: "lastReviewedAt",
    label: "Last reviewed",
    description: "Most recent review timestamp, when available",
    hideOnMobile: true,
    sortable: true,
  },
  {
    key: "actions",
    label: "Actions",
    description: "Available administrative actions",
  },
];

// -----------------------------------------------------------------------------
// Field access
// -----------------------------------------------------------------------------

export function getVerificationQueueColumnValue(
  verification: VerificationApiResponse,
  key: VerificationQueueColumnKey,
): string | number | boolean | null {
  switch (key) {
    case "identity":
      return verification.identityPublicId;

    case "status":
      return verification.status;

    case "level":
      return verification.level;

    case "evidence":
      return [
        verification.profilePhotoVerified,
        verification.governmentIdVerified,
        verification.driverLicenseVerified,
      ].filter(Boolean).length;

    case "createdAt":
      return verification.createdAt;

    case "lastReviewedAt":
      return verification.lastReviewedAt ?? null;

    case "actions":
      return null;

    default: {
      const exhaustiveCheck: never = key;
      return exhaustiveCheck;
    }
  }
}

export default verificationQueueColumns;