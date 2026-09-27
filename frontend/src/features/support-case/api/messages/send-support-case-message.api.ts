// -----------------------------------------------------------------------------
// sisiMove — Send Support Case Message API
// -----------------------------------------------------------------------------
//
// Feature API adapter for adding a message to a Support Case.
//
// Backend endpoint:
//
//     POST /support-cases/:supportCasePublicId/messages
//
// Current backend request contract:
//
//     senderPublicId
//     type
//     content?
//     assetId?
//     sentAt?
//
// The Support aggregate remains responsible for validating sender participation,
// message lifecycle, temporal consistency, and message invariants.
//
// This adapter only represents the HTTP contract.
//
// IMPORTANT:
//
// `senderPublicId` is an opaque Identity-domain reference. It must not be
// exposed as an arbitrary identity selector in the member-facing composer.
// The eventual UI/application boundary should obtain the authenticated
// member's identity from the existing authenticated identity context.
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from '@/features/authentication/http';

import type { SupportMessageType } from '../../models/support-message-type';

import type { SupportCaseMessageResponse } from './get-support-case-messages.api';

// =============================================================================
// Request
// =============================================================================

/**
 * HTTP request payload for sending a Support Case message.
 */
export interface SendSupportCaseMessageRequest {
  /**
   * Public identity of the authenticated sender.
   *
   * This is an opaque cross-domain identity reference.
   */
  senderPublicId: string;

  /**
   * Message representation.
   *
   * TEXT, IMAGE, FILE, and SYSTEM are backend-supported message types.
   */
  type: SupportMessageType;

  /**
   * Textual message content.
   *
   * Whether this is required depends on the selected message type and backend
   * validation; the API adapter does not impose additional rules.
   */
  content?: string;

  /**
   * Optional Asset-domain public identity associated with the message.
   */
  assetId?: string;

  /**
   * Optional client-supplied message timestamp.
   *
   * The backend DTO accepts this field when supplied. The UI should not
   * invent timestamps for display; this field is only part of the transport
   * contract.
   */
  sentAt?: string;
}

// =============================================================================
// API
// =============================================================================

/**
 * Sends a new message to a Support Case.
 */
export async function sendSupportCaseMessage(
  supportCasePublicId: string,
  request: SendSupportCaseMessageRequest,
): Promise<SupportCaseMessageResponse> {
  return authenticatedApiClient.post<SupportCaseMessageResponse>(
    `/support-cases/${encodeURIComponent(supportCasePublicId)}/messages`,
    request,
  );
}