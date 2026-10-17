
import type {
  VerificationRequestApiType,
} from "../types/verification-api.types";

export type VerificationEvidenceAction = "preview" | "download";

export interface VerificationEvidenceTypeDisplay {
  label: string;
  description: string;
}

const EVIDENCE_TYPE_DISPLAY: Record<
  VerificationRequestApiType,
  VerificationEvidenceTypeDisplay
> = {
  PROFILE_PHOTO: {
    label: "Profile photo",
    description: "Member profile photo submitted for verification.",
  },
  GOVERNMENT_ID: {
    label: "Government ID",
    description: "Government-issued identity document.",
  },
  DRIVER_LICENSE: {
    label: "Driver's licence",
    description: "Driving licence submitted for verification.",
  },
};

const PREVIEWABLE_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
]);

export function getVerificationEvidenceTypeDisplay(
  type: VerificationRequestApiType,
): VerificationEvidenceTypeDisplay {
  return EVIDENCE_TYPE_DISPLAY[type];
}

export function isVerificationEvidencePreviewable(
  mimeType: string | null | undefined,
): boolean {
  if (!mimeType) {
    return false;
  }

  return PREVIEWABLE_MIME_TYPES.has(mimeType.toLowerCase().trim());
}

export function canPreviewVerificationEvidence(
  mimeType: string | null | undefined,
  previewAvailable: boolean,
): boolean {
  return previewAvailable && isVerificationEvidencePreviewable(mimeType);
}

export function canDownloadVerificationEvidence(
  downloadAvailable: boolean,
): boolean {
  return downloadAvailable;
}
