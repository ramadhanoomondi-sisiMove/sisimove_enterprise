// -----------------------------------------------------------------------------
// Device — Get Devices Query Handler
// -----------------------------------------------------------------------------
//
// Application query handler for retrieving all Device aggregates belonging
// to an Identity.
//
// Aggregate:
//
// DeviceAggregate
// └── DeviceEntity
//
// Responsibilities:
//
// - resolve Devices through DeviceRepository;
// - ensure the query exists;
// - ensure the Identity public ID exists;
// - return all Device aggregates belonging to the Identity.
//
// The handler does NOT:
//
// - mutate DeviceEntity;
// - activate Devices;
// - trust or untrust Devices;
// - record Device activity;
// - revoke Devices;
// - create domain events;
// - persist aggregates;
// - access Prisma directly;
// - resolve persistence models;
// - validate Identity domain state;
// - load the Identity aggregate;
// - authenticate users;
// - manage Sessions;
// - authorize requests;
// - perform external side effects.
//
// Query behavior belongs to the application layer.
// Aggregate reconstruction belongs to the repository/infrastructure layer.
//
// -----------------------------------------------------------------------------
//
// Application flow:
//
//     GetDevicesQuery
//            │
//            ▼
// deviceRepository.findByIdentityPublicId()
//            │
//            ▼
//     DeviceAggregate[]
//            │
//            ▼
//          return
//
// -----------------------------------------------------------------------------
//
// Aggregate retrieval:
//
// DeviceRepository.findByIdentityPublicId() is responsible for returning
// the complete rehydrated Device aggregates:
//
// DeviceAggregate[]
// └── DeviceEntity[]
//
// The handler intentionally does not reconstruct the aggregates itself.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Application — Tokens
// -----------------------------------------------------------------------------

import { AUTH_TOKENS } from '../auth.tokens';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { QueryHandler } from '../../../../foundation/kernel/application/query-handler';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

import type { GetDevicesQuery } from '../queries/get-devices.query';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import type { DeviceAggregate } from '../../domain/aggregates/device.aggregate';

// -----------------------------------------------------------------------------
// Repository
// -----------------------------------------------------------------------------

import type { DeviceRepository } from '../../domain/repositories/device.repository';

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { DeviceNotFoundException } from '../../domain/exceptions/device-not-found.exception';

// =============================================================================
// Handler
// =============================================================================

/**
 * Handles retrieval of all Device aggregates belonging to an Identity.
 *
 * The repository is responsible for rehydrating the complete Device
 * aggregates:
 *
 * DeviceAggregate[]
 * └── DeviceEntity[]
 *
 * The handler performs no domain mutation.
 */
@Injectable()
export class GetDevicesHandler implements QueryHandler<
  GetDevicesQuery,
  DeviceAggregate[]
> {
  // ===========================================================================

  // Constructor

  // ===========================================================================

  public constructor(
    @Inject(AUTH_TOKENS.REPOSITORIES.DEVICE)
    private readonly deviceRepository: DeviceRepository,
  ) {}

  // ===========================================================================

  // Execute

  // ===========================================================================

  /**
   * Executes the GetDevicesQuery.
   *
   * Returns all Device aggregates belonging to the supplied Identity.
   */
  public async execute(query: GetDevicesQuery): Promise<DeviceAggregate[]> {
    // -------------------------------------------------------------------------
    // 1. Query guard
    // -------------------------------------------------------------------------

    if (query === undefined) {
      throw new DeviceNotFoundException('Device query is required.');
    }

    // -------------------------------------------------------------------------
    // 2. Identity public ID guard
    // -------------------------------------------------------------------------

    if (query.identityPublicId === undefined) {
      throw new DeviceNotFoundException(
        'Identity public ID is required to retrieve Devices.',
      );
    }

    // -------------------------------------------------------------------------
    // 3. Load Device aggregates
    // -------------------------------------------------------------------------
    //
    // DeviceRepository.findByIdentityPublicId() is responsible for returning
    // the complete rehydrated Device aggregates:
    //
    // DeviceAggregate[]
    // └── DeviceEntity[]
    //
    // An Identity aggregate is intentionally not loaded here.
    // DeviceIdentityPublicId is an opaque cross-aggregate reference.
    // -------------------------------------------------------------------------

    return this.deviceRepository.findByIdentityPublicId(query.identityPublicId);
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetDevicesHandler;
