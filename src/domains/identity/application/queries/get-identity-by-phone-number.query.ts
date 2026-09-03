// -----------------------------------------------------------------------------
// Identity — Get Identity By Phone Number Query
// -----------------------------------------------------------------------------
//
// Application query for retrieving an existing Identity aggregate by its
// phone number.
//
// The query carries a domain-ready IdentityPhoneNumber value object.
//
// Query behavior belongs to the application/query layer.
// Repository access and aggregate rehydration belong to the query handler.
//
// The query does NOT:
//
// - access persistence directly;
// - expose persistence models;
// - resolve internal entity identifiers;
// - mutate the Identity aggregate;
// - execute authentication;
// - manage sessions or devices;
// - perform OTP verification;
// - perform external provider operations.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Query } from '../../../../foundation/kernel/application/query';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import type { IdentityPhoneNumber } from '../../domain/value-objects';

// =============================================================================
// Query
// =============================================================================

/**
 * Query for retrieving an Identity aggregate by phone number.
 *
 * The phone number remains represented by the domain value object at the
 * application boundary.
 *
 * The query handler is responsible for resolving the aggregate through the
 * IdentityRepository.
 *
 * Repository lookup may internally translate the value object into the
 * persistence representation required by the underlying infrastructure.
 */
export class GetIdentityByPhoneNumberQuery extends Query {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    /**
     * Phone number associated with the Identity.
     *
     * This remains a domain value object and is intentionally not represented
     * as a raw string at the query boundary.
     */
    public readonly phoneNumber: IdentityPhoneNumber,
  ) {
    super();
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetIdentityByPhoneNumberQuery;
