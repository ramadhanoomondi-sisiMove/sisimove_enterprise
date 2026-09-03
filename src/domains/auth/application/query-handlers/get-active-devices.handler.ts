// -----------------------------------------------------------------------------
// Device — Get Active Devices Query Handler
// -----------------------------------------------------------------------------
//
// Application query handler for retrieving all active Device aggregates
// belonging to an Identity.
//
// Aggregate:
//
// DeviceAggregate
// └── DeviceEntity
//
// Responsibilities:
//
// - resolve active Devices through DeviceRepository;
// - ensure the query exists;
// - ensure the Identity public ID exists;
// - return all active Device aggregates belonging to the Identity.
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
// Active-device selection belongs to the repository query contract.
// Aggregate reconstruction belongs to the repository/infrastructure layer.
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
// deviceRepository.findActiveByIdentityPublicId()
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
// DeviceRepository.findActiveByIdentityPublicId() is responsible for
// returning the complete rehydrated Device aggregates:
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

import type { GetActiveDevicesQuery } from '../queries/get-active-devices.query';

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
 * Handles retrieval of all active Device aggregates belonging to an Identity.
 *
 * The repository is responsible for applying the active-state criterion and
 * rehydrating the complete Device aggregates:
 *
 * DeviceAggregate[]
 * └── DeviceEntity[]
 *
 * The handler performs no domain mutation.
 */
@Injectable()
export class GetActiveDevicesHandler implements QueryHandler<
  GetActiveDevicesQuery,
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
   * Executes the GetActiveDevicesQuery.
   *
   * Returns all active Device aggregates belonging to the supplied Identity.
   *
   * An empty array is a valid result when the Identity has no active Devices.
   */
  public async execute(
    query: GetActiveDevicesQuery,
  ): Promise<DeviceAggregate[]> {
    // -------------------------------------------------------------------------
    // 1. Query guard
    // -------------------------------------------------------------------------

    if (query === undefined) {
      throw new DeviceNotFoundException('Active Devices query is required.');
    }

    // -------------------------------------------------------------------------
    // 2. Identity public ID guard
    // -------------------------------------------------------------------------

    if (query.identityPublicId === undefined) {
      throw new DeviceNotFoundException(
        'Identity public ID is required to retrieve active Devices.',
      );
    }

    // -------------------------------------------------------------------------
    // 3. Load active Device aggregates
    // -------------------------------------------------------------------------
    //
    // DeviceRepository.findActiveByIdentityPublicId() is responsible for
    // applying the active-state persistence criterion and returning the
    // complete rehydrated Device aggregates.
    //
    // DeviceIdentityPublicId remains an opaque cross-aggregate reference.
    //
    // The Identity aggregate is intentionally not loaded or validated here.
    // -------------------------------------------------------------------------

    return this.deviceRepository.findActiveByIdentityPublicId(
      query.identityPublicId,
    );
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetActiveDevicesHandler;
