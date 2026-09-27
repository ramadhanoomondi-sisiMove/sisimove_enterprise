// -----------------------------------------------------------------------------
// sisiMove — Support Case Evidence
// -----------------------------------------------------------------------------
//
// API/application model for evidence attached to a Support Case.
//
// Evidence is intentionally modeled separately from Support Case messages.
// Although both may reference Assets, they represent different Support-domain
// concepts.
//
// Responsibilities:
// - represent member-safe evidence data;
// - preserve opaque public IDs;
// - preserve the opaque Asset reference;
// - support evidence presentation and submission.
//
// Non-responsibilities:
// - validating evidence ownership;
// - determining whether evidence may be submitted;
// - storing/uploading assets;
// - resolving Asset records;
// - deciding evidence relevance;
// - reproducing SupportCaseAggregate evidence rules.
//
// Asset lifecycle remains owned by the Assets boundary.
// Evidence lifecycle remains owned by the Support backend.
//
// -----------------------------------------------------------------------------

export interface SupportCaseEvidence {
  /**
   * Public identifier of the Support Case evidence record.
   */
  publicId: string;

  /**
   * Public identifier of the member who submitted the evidence.
   *
   * This is an opaque identity reference.
   */
  submittedByPublicId: string;

  /**
   * Opaque Asset-domain public identifier.
   *
   * The Support feature does not treat this as a Support-owned entity.
   */
  assetId: string;

  /**
   * Optional explanation describing why the evidence is relevant to the case.
   */
  description?: string;

  /**
   * Server-recorded evidence creation timestamp.
   */
  createdAt: Date;
}