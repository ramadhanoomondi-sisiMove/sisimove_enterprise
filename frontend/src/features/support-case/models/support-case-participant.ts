// -----------------------------------------------------------------------------
// sisiMove — Support Case Participant
// -----------------------------------------------------------------------------
//
// API/application model for a Support Case participant.
//
// Participants may be returned as part of the Support Case aggregate response.
// They are represented here so the frontend can safely consume the server
// representation without reproducing participant-domain behavior.
//
// The normal member-facing Support UX does not provide participant management.
//
// Responsibilities:
// - represent participant identity as an opaque public ID;
// - represent participant role;
// - preserve server-provided membership lifecycle information;
// - support participant presentation where required.
//
// Non-responsibilities:
// - adding participants;
// - removing participants;
// - assigning participant roles;
// - determining participant permissions;
// - calculating active/left state;
// - reproducing SupportCaseAggregate participant rules.
//
// `isActive` and `hasLeft` are server-provided response flags. The frontend
// must consume them rather than reconstructing them from `leftAt`.
//
// -----------------------------------------------------------------------------

import type { SupportCaseParticipantRole } from './support-case-participant-role';

export interface SupportCaseParticipant {
  /**
   * Public identifier of the participant record.
   */
  publicId: string;

  /**
   * Public identifier of the participating member.
   *
   * This is an opaque Identity/Traveller reference.
   */
  memberPublicId: string;

  /**
   * Role held by the member within the Support Case.
   */
  role: SupportCaseParticipantRole;

  /**
   * Server-recorded time at which the participant joined the case.
   */
  joinedAt: Date;

  /**
   * Server-recorded time at which the participant left the case, when
   * applicable.
   */
  leftAt?: Date;

  /**
   * Server-provided indication that the participant is currently active.
   *
   * Do not derive this value from `leftAt`.
   */
  isActive: boolean;

  /**
   * Server-provided indication that the participant has left.
   *
   * Do not derive this value from `leftAt`.
   */
  hasLeft: boolean;

  /**
   * Server-recorded participant creation timestamp.
   */
  createdAt: Date;

  /**
   * Server-recorded participant update timestamp.
   */
  updatedAt: Date;
}