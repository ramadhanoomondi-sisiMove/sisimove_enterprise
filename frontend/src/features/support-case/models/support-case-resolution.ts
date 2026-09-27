// -----------------------------------------------------------------------------
// sisiMove — Support Case Resolution
// -----------------------------------------------------------------------------
//
// API/application model for the resolution attached to a Support Case.
//
// Resolution is a member-readable Support result. It is not a member-controlled
// resource in the normal Support UX.
//
// Responsibilities:
// - represent the server-provided resolution;
// - expose resolution type and summary;
// - expose the resolving actor as an opaque public identity reference;
// - support read-only resolution presentation.
//
// Non-responsibilities:
// - creating a resolution;
// - determining whether a case can be resolved;
// - deciding the resolution type;
// - changing resolution state;
// - inferring case status from resolution existence;
// - reproducing SupportCaseAggregate resolution rules.
//
// The backend aggregate remains authoritative for resolution lifecycle.
//
// -----------------------------------------------------------------------------

import type { SupportResolutionType } from './support-resolution-type';

export interface SupportCaseResolution {
  /**
   * Public identifier of the resolution.
   */
  publicId: string;

  /**
   * Backend-defined resolution classification.
   */
  type: SupportResolutionType;

  /**
   * Human-readable resolution summary supplied by Support.
   */
  summary: string;

  /**
   * Public identifier of the actor who resolved the case.
   *
   * This is intentionally opaque to the Support frontend.
   */
  resolvedByPublicId: string;

  /**
   * Server-recorded resolution timestamp.
   */
  resolvedAt: Date;

  /**
   * Server-recorded resolution creation timestamp.
   */
  createdAt: Date;

  /**
   * Server-recorded resolution update timestamp.
   */
  updatedAt: Date;
}