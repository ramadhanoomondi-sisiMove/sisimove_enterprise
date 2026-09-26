// -----------------------------------------------------------------------------
// sisiMove — Get Messaging Conversation Messages API
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Define the raw HTTP response contract for messages belonging to a
//   conversation.
// - Define the endpoint query contract.
// - Call the authenticated Messaging HTTP endpoint.
// - Preserve backend-provided serialized values.
//
// Non-responsibilities:
// - Domain/model mapping.
// - Date conversion.
// - Pagination business rules.
// - Authorization decisions.
// - Message lifecycle logic.
// - React Query caching.
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from '@/features/authentication/http/authenticated-api-client';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

export interface GetMessagingConversationMessagesQuery {
  /**
   * Requested result page.
   */
  page?: number;

  /**
   * Maximum number of messages requested for the page.
   */
  limit?: number;
}

// -----------------------------------------------------------------------------
// Raw message response
// -----------------------------------------------------------------------------

export interface GetMessagingConversationMessagesApiResponse {
  publicId: string;

  conversationPublicId: string;

  senderPublicId: string;

  type: string;

  status: string;

  content?: string;

  assetPublicId?: string;

  isText: boolean;

  isImage: boolean;

  isFile: boolean;

  isSystem: boolean;

  isSent: boolean;

  isEdited: boolean;

  isDeleted: boolean;

  isModerated: boolean;

  isUsable: boolean;

  canBeModified: boolean;

  canBeEdited: boolean;

  canBeDeleted: boolean;

  canBeModerated: boolean;

  hasContent: boolean;

  hasAsset: boolean;

  sentAt: string;

  editedAt?: string;

  deletedAt?: string;

  moderatedAt?: string;

  createdAt: string;

  updatedAt: string;
}

// -----------------------------------------------------------------------------
// API
// -----------------------------------------------------------------------------

export async function getMessagingConversationMessages(
  conversationPublicId: string,
  query?: GetMessagingConversationMessagesQuery,
): Promise<GetMessagingConversationMessagesApiResponse[]> {
  /**
   * authenticatedApiClient expects its generic query parameter shape to be
   * Record<string, string | number | boolean | null | undefined>.
   *
   * Keep the feature-level query interface strict and adapt it only at the
   * HTTP boundary.
   */
  const queryParameters: Record<
    string,
    string | number | boolean | null | undefined
  > = {
    page: query?.page,
    limit: query?.limit,
  };

  return authenticatedApiClient.get<
    GetMessagingConversationMessagesApiResponse[]
  >(
    `/messaging/conversations/${encodeURIComponent(
      conversationPublicId,
    )}/messages`,
    {
      query: queryParameters,
    },
  );
}