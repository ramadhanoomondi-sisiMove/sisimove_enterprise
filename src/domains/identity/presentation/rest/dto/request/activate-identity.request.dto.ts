// -----------------------------------------------------------------------------
// Identity — Activate Request DTO
// -----------------------------------------------------------------------------
//
// REST request DTO for activating an Identity.
//
// Aggregate:
//
// IdentityAggregate
// └── IdentityEntity
//     └── IdentityRoleEntity[]
//
// The Identity aggregate is identified exclusively by the `identityPublicId`
// path parameter:
//
//     PATCH /api/v1/identities/{identityPublicId}/activate
//
// This request has NO body.
//
// The DTO intentionally contains no fields because:
//
// - identityPublicId belongs to the HTTP route;
// - correlationId is application/message metadata;
// - causationId is application/message metadata;
// - activation timestamp is a domain fact;
// - lifecycle state is controlled by IdentityAggregate.
//
// The application layer is responsible for constructing the activation
// command from the route parameter and application context.
//
// Expected lifecycle:
//
// PENDING ───────► ACTIVE
// SUSPENDED ─────► ACTIVE
//
// CLOSED is terminal and cannot be activated.
//
// The Identity aggregate enforces all lifecycle transition rules.
//
// This DTO does NOT:
//
// - identify the Identity;
// - supply the activation timestamp;
// - supply lifecycle state;
// - mutate IdentityEntity;
// - construct IdentityEntity;
// - construct IdentityRoleEntity;
// - perform persistence;
// - emit domain events directly;
// - activate authentication;
// - create a session;
// - perform verification;
// - send notifications.
//
// -----------------------------------------------------------------------------
//
// HTTP:
//
// PATCH /api/v1/identities/ID-LTCGEMS/activate
//
// Body:
//
// {}
//
// -----------------------------------------------------------------------------
//
// Transport boundary:
//
// HTTP path
//     │
//     └── identityPublicId
//              │
//              ▼
//     ActivateIdentityCommand
//              │
//              ├── identityPublicId
//              ├── correlationId
//              └── causationId
//                       │
//                       ▼
//            ActivateIdentityHandler
//                       │
//                       ▼
//            IdentityAggregate.activate()
//                       │
//                       ├── determines activatedAt
//                       ├── mutates IdentityEntity
//                       └── records IdentityActivatedEvent
//
// -----------------------------------------------------------------------------
//
// IMPORTANT:
//
// correlationId and causationId are NOT HTTP request-body fields.
//
// If your application requires these values, they should be created/resolved
// at the application/message boundary rather than duplicated in the REST body.
//
// -----------------------------------------------------------------------------

import { ApiBody } from '@nestjs/swagger';

// -----------------------------------------------------------------------------
// DTO
// -----------------------------------------------------------------------------

/**
 * Empty REST request for activating an Identity.
 *
 * The Identity is identified by the `identityPublicId` route parameter.
 *
 * No request-body fields are required.
 */
export class ActivateIdentityRequestDto {}

// -----------------------------------------------------------------------------
// Swagger helper
// -----------------------------------------------------------------------------

export const ACTIVATE_IDENTITY_EMPTY_BODY = ApiBody({
  required: false,
  type: ActivateIdentityRequestDto,
});
