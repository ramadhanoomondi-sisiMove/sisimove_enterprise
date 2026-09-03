// -----------------------------------------------------------------------------
// Domain Exception → HTTP Status Mapper
// -----------------------------------------------------------------------------
//
// Infrastructure mapper responsible for translating domain exception codes
// into HTTP status codes.
//
// Architectural boundary:
//
// Domain
// └── DomainException
//
// Infrastructure / HTTP
// └── DomainExceptionHttpStatusMapper
//
// IMPORTANT:
//
// - DomainException does NOT know about HTTP.
// - DomainException does NOT contain an HTTP status.
// - This mapper is the only place responsible for translating domain errors
//   into HTTP semantics.
// - Unknown domain exception codes fail safely to HTTP 400 Bad Request.
//
// This keeps the domain layer independent from NestJS and HTTP.
// -----------------------------------------------------------------------------

import { Injectable } from '@nestjs/common';

import type { DomainException } from '../../../foundation/kernel/domain/domain-exception';

@Injectable()
export class DomainExceptionHttpStatusMapper {
  /**
   * Maps a domain exception to its corresponding HTTP status code.
   *
   * Domain exceptions intentionally contain no HTTP concerns, therefore
   * translation happens here at the infrastructure boundary.
   */
  public map(exception: DomainException): number {
    switch (exception.code) {
      // -----------------------------------------------------------------------
      // Generic domain errors
      // -----------------------------------------------------------------------

      case 'DOMAIN.ERROR':
        return 400;

      // -----------------------------------------------------------------------
      // Identity domain
      // -----------------------------------------------------------------------

      case 'IDENTITY.DOMAIN.ERROR':
        return this.mapIdentityException(exception);

      // -----------------------------------------------------------------------
      // Unknown domain code
      // -----------------------------------------------------------------------

      default:
        return 400;
    }
  }

  /**
   * Maps Identity domain exceptions.
   *
   * Identity currently exposes a shared domain error code. Until individual
   * Identity exception codes are introduced, the exception class name is used
   * to distinguish well-known conflict/not-found cases.
   */
  private mapIdentityException(exception: DomainException): number {
    switch (exception.constructor.name) {
      // ---------------------------------------------------------------------
      // Conflict
      // ---------------------------------------------------------------------

      case 'IdentityAlreadyExistsException':
        return 409;

      // ---------------------------------------------------------------------
      // Not Found
      // ---------------------------------------------------------------------

      case 'IdentityNotFoundException':
        return 404;

      // ---------------------------------------------------------------------
      // Validation / state / business rule failure
      // ---------------------------------------------------------------------

      default:
        return 400;
    }
  }
}
