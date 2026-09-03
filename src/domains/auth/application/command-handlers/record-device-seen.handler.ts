// -----------------------------------------------------------------------------
// Device — Record Seen Command Handler
// -----------------------------------------------------------------------------
//
// Application handler responsible for recording activity for an existing
// Device aggregate.
//
// Aggregate boundary:
//
// DeviceAggregate
// └── DeviceEntity
//
// -----------------------------------------------------------------------------
//
// Application responsibilities:
//
// - validate command input;
// - load the Device aggregate;
// - invoke the aggregate activity operation;
// - persist the changed Device aggregate.
//
// -----------------------------------------------------------------------------
//
// Domain responsibilities:
//
// DeviceEntity:
//
// - validates Device activity invariants;
// - prevents revoked Devices from recording activity;
// - prevents lastSeenAt from moving backwards;
// - updates the Device activity state.
//
// DeviceAggregate:
//
// - owns the aggregate boundary;
// - coordinates the Device activity transition;
// - records DeviceSeenEvent when appropriate;
// - preserves correlation/causation metadata.
//
// DeviceRepository:
//
// - retrieves the Device aggregate;
// - persists the changed aggregate.
//
// -----------------------------------------------------------------------------
//
// Activity boundary:
//
// lastSeenAt represents the timestamp at which the Device was observed.
//
// The handler does NOT:
//
// - determine whether the Device was actually observed;
// - generate the timestamp;
// - perform device recognition;
// - generate fingerprints;
// - inspect HTTP request metadata.
//
// Those responsibilities belong to the appropriate application/infrastructure
// boundary.
//
// -----------------------------------------------------------------------------
//
// This handler does NOT:
//
// - create Devices;
// - trust Devices;
// - revoke Devices;
// - authenticate users;
// - generate authentication tokens;
// - generate refresh tokens;
// - manage Sessions;
// - validate Identity state;
// - access Prisma;
// - send notifications;
// - communicate with external systems.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

// -----------------------------------------------------------------------------
// Authentication Tokens
// -----------------------------------------------------------------------------

import { AUTH_TOKENS } from '../auth.tokens';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

import type { RecordDeviceSeenCommand } from '../commands/record-device-seen.command';

// -----------------------------------------------------------------------------
// Domain Repository
// -----------------------------------------------------------------------------

import type { DeviceRepository } from '../../domain/repositories/device.repository';

// -----------------------------------------------------------------------------
// Domain Exception
// -----------------------------------------------------------------------------

import { DeviceException } from '../../domain/exceptions/device.exception';

// =============================================================================
// Handler
// =============================================================================

/**
 * Records that a Device was observed.
 *
 * Application flow:
 *
 *     RecordDeviceSeenCommand
 *              │
 *              ▼
 *       command validation
 *              │
 *              ▼
 *     DeviceRepository
 *              │
 *              ▼
 *       DeviceAggregate
 *              │
 *              ▼
 *       aggregate.recordSeen()
 *              │
 *              ├── DeviceEntity.recordSeen()
 *              │
 *              └── DeviceSeenEvent
 *                  (when timestamp advances)
 *              │
 *              ▼
 *       DeviceRepository.save()
 *
 * The handler coordinates the use case.
 *
 * The aggregate owns the Device activity transition and domain event.
 */
@Injectable()
export class RecordDeviceSeenHandler implements CommandHandler<RecordDeviceSeenCommand> {
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
   * Executes the RecordDeviceSeenCommand.
   *
   * The Device aggregate is loaded by public identity, the observation is
   * recorded through the aggregate boundary, and the changed aggregate is
   * persisted.
   */
  public async execute(command: RecordDeviceSeenCommand): Promise<void> {
    // -------------------------------------------------------------------------
    // 1. Command guard
    // -------------------------------------------------------------------------

    this.ensureCommand(command);

    // -------------------------------------------------------------------------
    // 2. Required command fields
    // -------------------------------------------------------------------------

    this.ensureRequiredCommandFields(command);

    // -------------------------------------------------------------------------
    // 3. Load Device aggregate
    // -------------------------------------------------------------------------
    //
    // The application layer uses the public Device identity.
    //
    // The repository owns persistence lookup and aggregate rehydration.
    // -------------------------------------------------------------------------

    const device = await this.deviceRepository.findByPublicId(
      command.devicePublicId,
    );

    if (device === undefined) {
      throw new DeviceException('Device could not be found.');
    }

    // -------------------------------------------------------------------------
    // 4. Record Device activity
    // -------------------------------------------------------------------------
    //
    // The aggregate owns:
    //
    // - revoked-device protection;
    // - lastSeenAt ordering;
    // - activity state transition;
    // - DeviceSeenEvent creation.
    //
    // The handler does not manipulate DeviceEntity state directly.
    // -------------------------------------------------------------------------

    device.recordSeen(
      command.lastSeenAt,
      command.correlationId,
      command.causationId,
    );

    // -------------------------------------------------------------------------
    // 5. Persist aggregate
    // -------------------------------------------------------------------------

    await this.deviceRepository.save(device);
  }

  // ===========================================================================
  // Command Validation
  // ===========================================================================

  /**
   * Ensures that a command was supplied.
   */
  private ensureCommand(command: RecordDeviceSeenCommand): void {
    if (command === undefined || command === null) {
      throw new DeviceException('Record Device Seen command is required.');
    }
  }

  /**
   * Validates required command properties.
   *
   * Structural validation belongs at the application boundary.
   *
   * Domain semantics remain owned by the Device value objects, entity,
   * and aggregate.
   */
  private ensureRequiredCommandFields(command: RecordDeviceSeenCommand): void {
    // -------------------------------------------------------------------------
    // Device public ID
    // -------------------------------------------------------------------------

    if (command.devicePublicId === undefined) {
      throw new DeviceException('Device public ID is required.');
    }

    // -------------------------------------------------------------------------
    // Last-seen timestamp
    // -------------------------------------------------------------------------

    if (command.lastSeenAt === undefined) {
      throw new DeviceException('Device last-seen timestamp is required.');
    }

    // -------------------------------------------------------------------------
    // Correlation ID
    // -------------------------------------------------------------------------

    if (
      typeof command.correlationId !== 'string' ||
      command.correlationId.trim().length === 0
    ) {
      throw new DeviceException('Device correlation ID is required.');
    }

    // -------------------------------------------------------------------------
    // Causation ID
    // -------------------------------------------------------------------------

    if (
      command.causationId !== undefined &&
      (typeof command.causationId !== 'string' ||
        command.causationId.trim().length === 0)
    ) {
      throw new DeviceException(
        'Device causation ID must be a non-empty string when provided.',
      );
    }
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default RecordDeviceSeenHandler;
