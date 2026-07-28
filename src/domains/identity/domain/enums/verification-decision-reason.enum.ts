// src/domains/identity/domain/enums/verification-decision-reason.enum.ts

export enum VerificationDecisionReason {
  /**
   * Verification completed successfully.
   */
  APPROVED = 'APPROVED',

  /**
   * Government-issued document has expired.
   */
  DOCUMENT_EXPIRED = 'DOCUMENT_EXPIRED',

  /**
   * Uploaded document is unreadable or low quality.
   */
  DOCUMENT_UNREADABLE = 'DOCUMENT_UNREADABLE',

  /**
   * Required document is missing.
   */
  DOCUMENT_MISSING = 'DOCUMENT_MISSING',

  /**
   * Identity information does not match submitted documents.
   */
  IDENTITY_MISMATCH = 'IDENTITY_MISMATCH',

  /**
   * Selfie/profile photo does not match the identity document.
   */
  FACE_MISMATCH = 'FACE_MISMATCH',

  /**
   * Suspected duplicate verification.
   */
  DUPLICATE_VERIFICATION = 'DUPLICATE_VERIFICATION',

  /**
   * Suspected fraud or forged documents.
   */
  SUSPECTED_FRAUD = 'SUSPECTED_FRAUD',

  /**
   * Verification has expired.
   */
  EXPIRED = 'EXPIRED',

  /**
   * Verification was revoked after approval.
   */
  REVOKED = 'REVOKED',

  /**
   * Decision made for another business-specific reason.
   */
  OTHER = 'OTHER',
}
