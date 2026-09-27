// -----------------------------------------------------------------------------
// sisiMove — Support Case Message
// -----------------------------------------------------------------------------
//
// API/application model for a Support Case conversation message.
//
// This model represents the message response exposed by the Support HTTP API.
// It is not the backend SupportCaseMessageEntity and does not reproduce any
// domain methods or aggregate behavior.
//
// Responsibilities:
// - represent member-safe message data;
// - preserve opaque public IDs and asset references;
// - expose server-provided lifecycle presentation flags;
// - provide the frontend with a stable conversation model.
//
// Non-responsibilities:
// - validating message content;
// - determining sender permissions;
// - deciding whether a message may be edited or deleted;
// - determining message membership in a Support Case;
// - uploading or resolving assets;
// - reproducing SupportCaseAggregate message rules.
//
// -----------------------------------------------------------------------------

import type { SupportMessageType } from './support-message-type';

export interface SupportCaseMessage {
  /**
   * Public identifier of the Support Case message.
   */
  publicId: string;

  /**
   * Public identifier of the member/actor that sent the message.
   *
   * This is an opaque identity reference.
   */
  senderPublicId: string;

  /**
   * Message presentation type.
   */
  type: SupportMessageType;

  /**
   * Textual message content when supplied.
   *
   * IMAGE and FILE messages may rely primarily on `assetId`.
   */
  content?: string;

  /**
   * Optional opaque reference to an Asset owned by the Assets boundary.
   *
   * The Support feature does not resolve the asset itself.
   */
  assetId?: string;

  /**
   * Server-recorded message send time.
   */
  sentAt: Date;

  /**
   * Server-recorded edit time when the message has been edited.
   */
  editedAt?: Date;

  /**
   * Server-recorded deletion time when the message has been deleted.
   */
  deletedAt?: Date;

  /**
   * Server-provided presentation flag indicating that the message has been
   * edited.
   *
   * The frontend must not reconstruct this from `editedAt`.
   */
  isEdited: boolean;

  /**
   * Server-provided presentation flag indicating that the message has been
   * deleted.
   *
   * The frontend must not reconstruct this from `deletedAt`.
   */
  isDeleted: boolean;

  /**
   * Server-recorded entity creation timestamp.
   */
  createdAt: Date;

  /**
   * Server-recorded entity update timestamp.
   */
  updatedAt: Date;
}