// -----------------------------------------------------------------------------
// Device — Get Device Query
// -----------------------------------------------------------------------------
//
// Retrieves a single Device aggregate by its public identifier.
//
// Query responsibilities:
//
// - Carry the Device public identifier.
// - Ensure the required identifier is present.
// - Remain immutable.
// - Contain no business logic.
// - Contain no persistence logic.
// - Contain no Prisma dependencies.
// - Contain no repository dependencies.
//
// The corresponding query handler is responsible for:
//
// - loading the Device aggregate through DeviceRepository;
// - handling the not-found case;
// - returning the complete Device aggregate;
// - optionally mapping the aggregate to an application read model or DTO.
//
// -----------------------------------------------------------------------------
//
// Application flow:
//
//     GetDeviceQuery
//            │
//            ▼
//     GetDeviceHandler
//            │
//            ▼
// DeviceRepository.findByPublicId()
//            │
//            ├── not found → DeviceNotFoundException
//            │
//            ▼
//      DeviceAggregate
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Query } from '../../../../foundation/kernel/application/query';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import type { DevicePublicId } from '../../domain/value-objects/device-public-id.vo';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

/**
 * Query for retrieving a single Device aggregate by public identifier.
 *
 * The Device is identified through its public identifier rather than its
 * internal persistence identity.
 *
 * The query contains no repository, persistence, or domain behavior.
 */
export class GetDeviceQuery extends Query {
  // ===========================================================================

  // Constructor

  // ===========================================================================

  /**
   * Creates a query for retrieving a Device by its public identifier.
   */
  public constructor(public readonly devicePublicId: DevicePublicId) {
    super();

    if (devicePublicId === undefined) {
      throw new Error('Device public ID is required to retrieve Device.');
    }
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetDeviceQuery;
