
// -----------------------------------------------------------------------------
// sisiMove — Create Journey Support Case API
// -----------------------------------------------------------------------------
//
// Feature API adapter for creating a Support Case associated with a Journey.
//
// Backend endpoint:
//
//     POST /support-cases/journeys/:journeyPublicId
//
// Backend DTO:
//
//     CreateJourneySupportCaseRequestDto
//
// Required request fields:
//
//     priority
//     category
//     subject
//
// Optional request fields:
//
//     description
//
// The authenticated backend identity determines the requester.
// The Journey public ID is supplied through the endpoint URL.
//
// Intentionally excluded:
//
// - requesterPublicId;
// - referenceType;
// - referencePublicId;
// - correlationId;
// - causationId;
// - internal IDs;
// - aggregate/domain objects;
// - persistence identifiers.
//
// The backend establishes the requester and Journey reference.
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from '@/features/authentication/http';

import type { SupportCaseResponse } from './get-support-cases.api';

import type { SupportCaseCategory } from '../../models/support-case-category';
import type { SupportCasePriority } from '../../models/support-case-priority';

// =============================================================================
// Request
// =============================================================================

/**
 * HTTP request payload for creating a Journey-specific Support Case.
 *
 * This mirrors the CreateJourneySupportCaseRequestDto backend contract.
 */
export interface CreateJourneySupportCaseRequest {
  /**
   * Initial Support Case priority.
   */
  priority: SupportCasePriority;

  /**
   * Support Case category.
   */
  category: SupportCaseCategory;

  /**
   * Short Support Case subject.
   */
  subject: string;

  /**
   * Optional description of the issue.
   */
  description?: string;
}

// =============================================================================
// API
// =============================================================================

/**
 * Creates a Support Case associated with the specified Journey.
 *
 * The backend verifies the Journey and authorizes the requester before
 * creating the Support Case.
 *
 * @param journeyPublicId - Public identifier of the Journey requiring support.
 * @param request - Member-provided Support Case details.
 * @returns The created SupportCaseResponse.
 */
export async function createJourneySupportCase(
  journeyPublicId: string,
  request: CreateJourneySupportCaseRequest,
): Promise<SupportCaseResponse> {
  if (!journeyPublicId.trim()) {
    throw new Error('Journey public ID is required to create a support case.');
  }

  return authenticatedApiClient.post<SupportCaseResponse>(
    `/support-cases/journeys/${encodeURIComponent(journeyPublicId)}`,
    request,
  );
}
