// -----------------------------------------------------------------------------
// Device — Get Device Query Handler
// -----------------------------------------------------------------------------
//
// Application query handler for retrieving a Device aggregate.
//
// Aggregate:
//
// DeviceAggregate
// └── DeviceEntity
//
// Responsibilities:
//
// - resolve the Device aggregate through DeviceRepository;
// - ensure the query exists;
// - ensure the Device public ID exists;
// - ensure the aggregate exists;
// - return the complete rehydrated aggregate.
//
// The handler does NOT:
//
// - mutate DeviceEntity;
// - activate the Device;
// - trust or untrust the Device;
// - record Device activity;
// - revoke the Device;
// - create domain events;
// - persist the aggregate;
// - access Prisma directly;
// - resolve persistence models;
// - validate Identity domain state;
// - load the Identity aggregate;
// - load or manage Sessions;
// - authenticate users;
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
//     GetDeviceQuery
//            │
//            ▼
// deviceRepository.findByPublicId()
//            │
//            ├── not found → throw
//            │
//            ▼
//       DeviceAggregate
//            │
//            ▼
//          return
//
// -----------------------------------------------------------------------------
//
// Aggregate retrieval:
//
// DeviceRepository.findByPublicId() is responsible for returning the
// complete Device aggregate:
//
// DeviceAggregate
// └── DeviceEntity
//
// The handler intentionally does not reconstruct the aggregate itself.
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

import type { GetDeviceQuery } from '../queries/get-device.query';

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
 * Handles retrieval of a Device aggregate by public identifier.
 *
 * The repository is responsible for rehydrating the complete aggregate:
 *
 * DeviceAggregate
 * └── DeviceEntity
 *
 * The handler performs no domain mutation.
 */
@Injectable()
export class GetDeviceHandler implements QueryHandler<
  GetDeviceQuery,
  DeviceAggregate
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
   * Executes the GetDeviceQuery.
   *
   * Returns the complete Device aggregate when it exists.
   */
  public async execute(query: GetDeviceQuery): Promise<DeviceAggregate> {
    // -------------------------------------------------------------------------
    // 1. Query guard
    // -------------------------------------------------------------------------

    if (query === undefined) {
      throw new DeviceNotFoundException('Device query is required.');
    }

    // -------------------------------------------------------------------------
    // 2. Device public ID guard
    // -------------------------------------------------------------------------

    if (query.devicePublicId === undefined) {
      throw new DeviceNotFoundException('Device public ID is required.');
    }

    // -------------------------------------------------------------------------
    // 3. Load complete aggregate
    // -------------------------------------------------------------------------
    //
    // DeviceRepository.findByPublicId() is responsible for returning
    // the rehydrated Device aggregate:
    //
    // DeviceAggregate
    // └── DeviceEntity
    //
    // Rehydration must not emit domain events.
    // -------------------------------------------------------------------------

    const aggregate = await this.deviceRepository.findByPublicId(
      query.devicePublicId,
    );

    // -------------------------------------------------------------------------
    // 4. Ensure aggregate exists
    // -------------------------------------------------------------------------

    if (aggregate === undefined) {
      throw new DeviceNotFoundException(
        `Device ${query.devicePublicId.value} was not found.`,
      );
    }

    // -------------------------------------------------------------------------
    // 5. Return aggregate
    // -------------------------------------------------------------------------

    return aggregate;
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetDeviceHandler;
