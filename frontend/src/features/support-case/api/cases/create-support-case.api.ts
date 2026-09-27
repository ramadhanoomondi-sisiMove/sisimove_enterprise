// -----------------------------------------------------------------------------
// sisiMove — Create Support Case API
// -----------------------------------------------------------------------------
//
// Feature API adapter for creating a Support Case.
//
// Backend endpoint:
//
//     POST /support-cases
//
// Backend DTO:
//
//     CreateSupportCaseRequestDto
//
// Required request fields:
//
//     requesterPublicId
//     priority
//     category
//     subject
//
// Optional request fields:
//
//     description
//     referenceType
//     referencePublicId
//
// IMPORTANT:
//
// `requesterPublicId` is required by the current backend transport contract,
// but it must NOT become an arbitrary identity selector in the member-facing
// UI.
//
// The application/authorization design should determine how the authenticated
// member's public identity is supplied. This adapter therefore mirrors the
// backend contract, while the UI must not expose a free-form requester ID.
//
// Also intentionally excluded:
//
// - correlationId;
// - causationId;
// - internal IDs;
// - aggregate/domain objects;
// - persistence identifiers.
//
// Those values are generated or handled inside the backend application layer.
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from '@/features/authentication/http';

import type { SupportCaseResponse } from './get-support-cases.api';

import type { SupportCaseCategory } from '../../models/support-case-category';
import type { SupportCasePriority } from '../../models/support-case-priority';

// =============================================================================
// Request
// =============================================================================

/**
 * HTTP request payload for creating a Support Case.
 *
 * This mirrors the currently exposed CreateSupportCaseRequestDto transport
 * contract.
 */
export interface CreateSupportCaseRequest {
  /**
   * Public identity of the requester.
   *
   * This is an opaque Identity-domain reference.
   *
   * The member-facing form must not allow arbitrary identity selection.
   */
  requesterPublicId: string;

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

  /**
   * Optional opaque type of the referenced domain resource.
   */
  referenceType?: string;

  /**
   * Optional public identity of the referenced domain resource.
   */
  referencePublicId?: string;
}

// =============================================================================
// API
// =============================================================================

/**
 * Creates a Support Case through the Support aggregate boundary.
 *
 * The backend returns the complete SupportCaseResponse, including aggregate
 * state and child collections.
 */
export async function createSupportCase(
  request: CreateSupportCaseRequest,
): Promise<SupportCaseResponse> {
  return authenticatedApiClient.post<SupportCaseResponse>(
    '/support-cases',
    request,
  );
}