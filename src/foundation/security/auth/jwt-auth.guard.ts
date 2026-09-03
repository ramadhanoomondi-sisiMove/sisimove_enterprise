// -----------------------------------------------------------------------------
// Authentication — JWT Auth Guard
// -----------------------------------------------------------------------------
//
// NestJS / Passport guard for JWT-authenticated endpoints.
//
// Passport's `jwt` strategy is responsible for:
//
// - extracting the JWT;
// - verifying the JWT through the configured authentication strategy;
// - validating the token;
// - producing the authenticated identity;
// - attaching the authenticated identity to `request.user`.
//
// This guard contains no authentication business logic.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import { Injectable } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Passport
// -----------------------------------------------------------------------------

import { AuthGuard } from '@nestjs/passport';

// =============================================================================
// Guard
// =============================================================================

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default JwtAuthGuard;
