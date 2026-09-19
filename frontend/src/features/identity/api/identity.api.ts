// -----------------------------------------------------------------------------
// sisiMove — Identity API
// -----------------------------------------------------------------------------
//
// HTTP adapter for the Identity feature.
//
// Responsibilities:
//
// - call Identity HTTP endpoints;
// - use the authenticated HTTP boundary for protected Identity operations;
// - translate transport responses into frontend Identity models.
//
// Non-responsibilities:
//
// - authentication;
// - session management;
// - token storage;
// - authorization;
// - Identity business rules;
// - direct Prisma access.
//
// Authentication owns the authenticated transport:
//
//     authenticatedApiClient
//
// Identity owns the endpoint:
//
//     GET /identities/me
//
// This separation is intentional:
//
//     Identity
//         │
//         └── uses ──► Authentication transport
//
// Authentication does NOT need to know anything about the Identity domain.
//
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from '@/features/authentication';

import type { Identity, IdentityStatus } from '../models';

// =============================================================================
// API Path
// =============================================================================

const IDENTITIES_API_PATH = '/identities';

// =============================================================================
// Transport Response
// =============================================================================
//
// This represents the JSON shape emitted by:
//
//     IdentityResponseMapper.toResponse(aggregate)
//
// Keep this type local to the HTTP adapter. The rest of the frontend should
// consume the normalized Identity model instead.
//
// -----------------------------------------------------------------------------

interface IdentityResponse {
  readonly publicId: string;
  readonly email: string;
  readonly phoneNumber: string;
  readonly status: string;
  readonly createdAt: string;
  readonly updatedAt: string;

  readonly activatedAt: string | null;
  readonly suspendedAt: string | null;
  readonly closedAt: string | null;
}

// =============================================================================
// Status Mapping
// =============================================================================

function mapIdentityStatus(status: string): IdentityStatus {
  switch (status) {
    case 'PENDING':
    case 'ACTIVE':
    case 'SUSPENDED':
    case 'CLOSED':
      return status;

    default:
      throw new Error(`Unsupported Identity status: ${status}`);
  }
}

// =============================================================================
// Response Mapper
// =============================================================================

function mapIdentityResponse(response: IdentityResponse): Identity {
  return {
    publicId: response.publicId,
    email: response.email,
    phoneNumber: response.phoneNumber,
    status: mapIdentityStatus(response.status),
    createdAt: response.createdAt,
    updatedAt: response.updatedAt,
    activatedAt: response.activatedAt,
    suspendedAt: response.suspendedAt,
    closedAt: response.closedAt,
  };
}

// =============================================================================
// Get Current Identity
// =============================================================================
//
// GET /identities/me
//
// Authentication:
//
//     JwtAuthGuard
//
// Authorization:
//
//     No PermissionsGuard
//
// The backend derives the target Identity from the authenticated principal:
//
//     request.user.identityPublicId
//
// Therefore the frontend must never send:
//
//     identityPublicId
//
// as part of this request.
//
// -----------------------------------------------------------------------------

export async function getCurrentIdentity(): Promise<Identity | null> {
  const response =
    await authenticatedApiClient.get<IdentityResponse | null>(
      `${IDENTITIES_API_PATH}/me`,
    );

  if (response === null) {
    return null;
  }

  return mapIdentityResponse(response);
}