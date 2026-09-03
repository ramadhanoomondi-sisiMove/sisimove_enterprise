// -----------------------------------------------------------------------------
// Device — Get Active Devices Query
// -----------------------------------------------------------------------------
//
// Retrieves multiple currently active Device aggregates belonging to an
// Identity.
//
// Query responsibilities:
//
// - Carry the Identity public identifier.
// - Request active Devices for that Identity.
// - Ensure the required Identity public identifier is present.
// - Remain immutable.
// - Contain no business logic.
// - Contain no persistence logic.
// - Contain no Prisma dependencies.
// - Contain no repository dependencies.
//
// The corresponding query handler is responsible for:
//
// - retrieving active Devices through the repository;
// - using the Identity public identifier as the lookup criterion;
// - handling pagination or ordering when required;
// - mapping aggregates to application read models or DTOs.
//
// The repository is responsible for applying the active-device persistence
// criterion.
//
// -----------------------------------------------------------------------------
//
// Application flow:
//
//     GetActiveDevicesQuery
//            │
//            │ identityPublicId
//            ▼
// GetActiveDevicesHandler
//            │
//            ▼
// DeviceRepository.findActiveByIdentityPublicId()
//            │
//            ▼
//     DeviceAggregate[]
//
// -----------------------------------------------------------------------------
//
// Cross-aggregate boundary:
//
// DeviceIdentityPublicId is an opaque reference to the Identity aggregate.
//
// The query does not load, validate, or otherwise interact with the Identity
// aggregate.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Query } from '../../../../foundation/kernel/application/query';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import type { DeviceIdentityPublicId } from '../../domain/value-objects/device-identity-public-id.vo';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

/**
 * Query for retrieving active Device aggregates belonging to an Identity.
 *
 * The Identity is identified through its public identifier rather than its
 * internal persistence identity.
 *
 * The query contains no repository, persistence, or domain behavior.
 */
export class GetActiveDevicesQuery extends Query {
  // ===========================================================================

  // Constructor

  // ===========================================================================

  /**
   * Creates a query for retrieving active Devices belonging to an Identity.
   */
  public constructor(public readonly identityPublicId: DeviceIdentityPublicId) {
    super();

    if (identityPublicId === undefined) {
      throw new Error(
        'Identity public ID is required to retrieve active Devices.',
      );
    }
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetActiveDevicesQuery;
