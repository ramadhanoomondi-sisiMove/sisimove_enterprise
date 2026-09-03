// -----------------------------------------------------------------------------
// Device — Trust Command Handler
// -----------------------------------------------------------------------------
//
// Application handler responsible for trusting an existing Device aggregate.
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
// - invoke the aggregate trust operation;
// - persist the changed Device aggregate.
//
// -----------------------------------------------------------------------------
//
// Domain responsibilities:
//
// DeviceEntity:
//
// - validates Device trust invariants;
// - prevents revoked Devices from becoming trusted;
// - establishes TRUSTED state;
// - stores trustedAt.
//
// DeviceAggregate:
//
// - owns the aggregate boundary;
// - coordinates the trust transition;
// - records DeviceTrustedEvent;
// - preserves correlation/causation metadata.
//
// DeviceRepository:
//
// - retrieves the Device aggregate;
// - persists the changed aggregate.
//
// -----------------------------------------------------------------------------
//
// Trust policy boundary:
//
// This handler performs the requested trust transition.
//
// It does NOT independently decide whether a Device should be trusted.
// Any external security/trust policy must be evaluated by the application
// workflow before this command is dispatched.
//
// -----------------------------------------------------------------------------
//
// Identity boundary:
//
// The handler operates on DevicePublicId.
//
// It does NOT:
//
// - load Identity;
// - validate Identity state;
// - mutate Identity.
//
// -----------------------------------------------------------------------------
//
// This handler does NOT:
//
// - create Devices;
// - generate fingerprints;
// - recognize Devices;
// - authenticate users;
// - generate authentication tokens;
// - generate refresh tokens;
// - manage Sessions;
// - revoke Devices;
// - record Device activity;
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

import type { TrustDeviceCommand } from '../commands/trust-device.command';

// -----------------------------------------------------------------------------
// Domain Aggregate
// -----------------------------------------------------------------------------

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
 * Trusts an existing Device aggregate.
 *
 * Application flow:
 *
 *     TrustDeviceCommand
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
 *       aggregate.trust()
 *              │
 *              ├── DeviceEntity.trust()
 *              │
 *              └── DeviceTrustedEvent
 *              │
 *              ▼
 *       DeviceRepository.save()
 *
 * The handler coordinates the use case.
 *
 * The aggregate owns the actual Device trust transition and domain event.
 */
@Injectable()
export class TrustDeviceHandler implements CommandHandler<TrustDeviceCommand> {
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
   * Executes the TrustDeviceCommand.
   *
   * The Device aggregate is loaded by public identity, trusted through the
   * aggregate boundary, and then persisted.
   */
  public async execute(command: TrustDeviceCommand): Promise<void> {
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
    // The repository owns the persistence lookup and rehydrates the complete
    // Device aggregate.
    // -------------------------------------------------------------------------

    const device = await this.deviceRepository.findByPublicId(
      command.devicePublicId,
    );

    if (device === undefined) {
      throw new DeviceException('Device could not be found.');
    }

    // -------------------------------------------------------------------------
    // 4. Trust Device
    // -------------------------------------------------------------------------
    //
    // The aggregate owns:
    //
    // - trust transition;
    // - revoked-device protection;
    // - trustedAt invariant;
    // - DeviceTrustedEvent.
    //
    // The handler does not manipulate DeviceEntity state directly.
    // -------------------------------------------------------------------------

    device.trust(command.trustedAt, command.correlationId, command.causationId);

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
  private ensureCommand(command: TrustDeviceCommand): void {
    if (command === undefined || command === null) {
      throw new DeviceException('Trust Device command is required.');
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
  private ensureRequiredCommandFields(command: TrustDeviceCommand): void {
    // -------------------------------------------------------------------------
    // Device public ID
    // -------------------------------------------------------------------------

    if (command.devicePublicId === undefined) {
      throw new DeviceException('Device public ID is required.');
    }

    // -------------------------------------------------------------------------
    // Trusted timestamp
    // -------------------------------------------------------------------------

    if (command.trustedAt === undefined) {
      throw new DeviceException('Device trusted-at timestamp is required.');
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

export default TrustDeviceHandler;
