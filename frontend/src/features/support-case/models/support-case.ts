// -----------------------------------------------------------------------------
// sisiMove — Support Case
// -----------------------------------------------------------------------------
//
// API/application model for the member-facing Support Case representation.
//
// This model intentionally follows the Support HTTP response rather than
// reproducing the backend SupportCaseEntity or SupportCaseAggregate.
//
// The backend aggregate contains the complete Support consistency boundary.
// The frontend receives the resulting representation and presents it.
//
// Responsibilities:
// - represent member-safe Support Case data;
// - preserve backend-provided lifecycle flags;
// - preserve backend-provided child counts and presence flags;
// - expose aggregate-shaped child collections where returned;
// - provide a stable model for Support queries, mutations, and components.
//
// Non-responsibilities:
// - enforcing Support Case lifecycle rules;
// - changing status locally;
// - deciding whether an operation is permitted;
// - orchestrating participants/messages/evidence/resolution;
// - reproducing aggregate methods;
// - resolving cross-domain references;
// - managing internal Support notes;
// - performing authorization.
//
// The backend SupportCaseAggregate remains the sole domain orchestrator.
//
// -----------------------------------------------------------------------------

import type { SupportCaseCategory } from './support-case-category';
import type { SupportCaseEvidence } from './support-case-evidence';
import type { SupportCaseMessage } from './support-case-message';
import type { SupportCaseParticipant } from './support-case-participant';
import type { SupportCasePriority } from './support-case-priority';
import type { SupportCaseResolution } from './support-case-resolution';
import type { SupportCaseStatus } from './support-case-status';

export interface SupportCase {
  /**
   * Public identifier of the Support Case.
   *
   * Internal database IDs are intentionally not represented.
   */
  publicId: string;

  /**
   * Public identifier of the member who requested the Support Case.
   *
   * This remains an opaque identity reference.
   */
  requesterPublicId: string;

  /**
   * Current Support Case lifecycle status returned by the backend.
   */
  status: SupportCaseStatus;

  /**
   * Current Support Case priority returned by the backend.
   */
  priority: SupportCasePriority;

  /**
   * Current Support Case category returned by the backend.
   */
  category: SupportCaseCategory;

  /**
   * Member-visible case subject.
   */
  subject: string;

  /**
   * Optional member-provided case description.
   */
  description?: string;

  /**
   * Optional cross-domain reference classification.
   *
   * The Support feature does not resolve this reference itself.
   */
  referenceType?: string;

  /**
   * Optional opaque public identifier of the referenced resource.
   */
  referencePublicId?: string;

  /**
   * Public identifier of the assigned Support actor when one is assigned.
   *
   * This is intentionally opaque.
   */
  assignedToPublicId?: string;

  /**
   * Server-provided assignment presence flag.
   *
   * Do not derive this from `assignedToPublicId`.
   */
  isAssigned: boolean;

  /**
   * Server-recorded time at which the case was opened.
   */
  openedAt: Date;

  /**
   * Server-recorded resolution time, when resolved.
   */
  resolvedAt?: Date;

  /**
   * Server-recorded close time, when closed.
   */
  closedAt?: Date;

  /**
   * Server-recorded cancellation time, when cancelled.
   */
  cancelledAt?: Date;

  /**
   * Server-provided lifecycle presentation flag.
   *
   * Do not derive this from `status`.
   */
  isResolved: boolean;

  /**
   * Server-provided lifecycle presentation flag.
   *
   * Do not derive this from `status`.
   */
  isClosed: boolean;

  /**
   * Server-provided lifecycle presentation flag.
   *
   * Do not derive this from `status`.
   */
  isCancelled: boolean;

  /**
   * Server-provided indication that the case is currently open/operational.
   *
   * Do not recreate the backend aggregate's lifecycle rules on the client.
   */
  isOpen: boolean;

  /**
   * Backend aggregate version.
   *
   * The value is preserved because it is part of the API representation.
   * Concurrency behavior must not be invented until the relevant HTTP
   * contracts require it.
   */
  version: number;

  /**
   * Server-provided number of participants represented by the case response.
   */
  participantCount: number;

  /**
   * Server-provided indication that participants exist.
   */
  hasParticipants: boolean;

  /**
   * Participants included in the aggregate response.
   */
  participants: SupportCaseParticipant[];

  /**
   * Server-provided number of messages represented by the case response.
   */
  messageCount: number;

  /**
   * Server-provided indication that messages exist.
   */
  hasMessages: boolean;

  /**
   * Messages included in the aggregate response.
   */
  messages: SupportCaseMessage[];

  /**
   * Server-provided number of evidence records represented by the case
   * response.
   */
  evidenceCount: number;

  /**
   * Server-provided indication that evidence exists.
   */
  hasEvidence: boolean;

  /**
   * Evidence records included in the aggregate response.
   */
  evidence: SupportCaseEvidence[];

  /**
   * Server-provided indication that a resolution exists.
   *
   * Do not infer this from `resolution`.
   */
  hasResolution: boolean;

  /**
   * Resolution included in the aggregate response when available.
   *
   * Resolution is read-only in the normal member-facing Support UX.
   */
  resolution?: SupportCaseResolution;
}