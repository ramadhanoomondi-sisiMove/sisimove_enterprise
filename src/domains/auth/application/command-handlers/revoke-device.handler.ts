// -----------------------------------------------------------------------------
// Device — Revoke Command Handler
// -----------------------------------------------------------------------------
//
// Application handler responsible for revoking an existing Device.
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
// - validate required command input;
// - retrieve the Device aggregate;
// - request the aggregate to revoke the Device;
// - persist the changed aggregate.
//
// -----------------------------------------------------------------------------
//
// Domain responsibilities:
//
// DeviceAggregate:
//
// - coordinates Device revocation;
// - records DeviceRevokedEvent.
//
// DeviceEntity:
//
// - owns Device lifecycle status;
// - establishes REVOKED state;
// - owns revokedAt;
// - enforces terminal revocation invariants.
//
// -----------------------------------------------------------------------------
//
// Revocation is terminal.
//
// A revoked Device:
//
// - cannot authenticate;
// - cannot be activated;
// - cannot be trusted;
// - cannot record activity.
//
// -----------------------------------------------------------------------------
//
// This handler does NOT:
//
// - validate Identity domain state;
// - authenticate users;
// - generate tokens;
// - generate fingerprints;
// - access Prisma;
// - send notifications;
// - manage Sessions;
// - authorize requests.
//
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

import type { RevokeDeviceCommand } from '../commands/revoke-device.command';

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
 * Revokes an existing Device aggregate.
 *
 * Application flow:
 *
 *     RevokeDeviceCommand
 *             │
 *             ▼
 *       command validation
 *             │
 *             ▼
 *     repository.getByPublicId()
 *             │
 *             ▼
 *       aggregate.revoke()
 *             │
 *             ▼
 *       DeviceRevokedEvent
 *             │
 *             ▼
 *       repository.save()
 */
@Injectable()
export class RevokeDeviceHandler implements CommandHandler<RevokeDeviceCommand> {
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
   * Executes the RevokeDeviceCommand.
   */
  public async execute(command: RevokeDeviceCommand): Promise<void> {
    // -------------------------------------------------------------------------
    // 1. Command guard
    // -------------------------------------------------------------------------

    this.ensureCommand(command);

    // -------------------------------------------------------------------------
    // 2. Required command fields
    // -------------------------------------------------------------------------

    this.ensureRequiredCommandFields(command);

    // -------------------------------------------------------------------------
    // 3. Retrieve Device aggregate
    // -------------------------------------------------------------------------

    const aggregate = await this.deviceRepository.getByPublicId(
      command.devicePublicId,
    );

    if (aggregate === undefined || aggregate === null) {
      throw new DeviceException('Device aggregate could not be retrieved.');
    }

    // -------------------------------------------------------------------------
    // 4. Revoke Device
    // -------------------------------------------------------------------------
    //
    // The aggregate:
    //
    // - delegates the state transition to DeviceEntity;
    // - establishes REVOKED state;
    // - records DeviceRevokedEvent when appropriate.
    // -------------------------------------------------------------------------

    aggregate.revoke(
      command.revokedAt,
      command.correlationId,
      command.causationId,
    );

    // -------------------------------------------------------------------------
    // 5. Persist aggregate
    // -------------------------------------------------------------------------

    await this.deviceRepository.save(aggregate);
  }

  // ===========================================================================
  // Command Validation
  // ===========================================================================

  /**
   * Ensures that a command was supplied.
   */
  private ensureCommand(command: RevokeDeviceCommand): void {
    if (command === undefined || command === null) {
      throw new DeviceException('Revoke Device command is required.');
    }
  }

  /**
   * Validates required command properties.
   */
  private ensureRequiredCommandFields(command: RevokeDeviceCommand): void {
    if (command.devicePublicId === undefined) {
      throw new DeviceException('Device public ID is required.');
    }

    if (command.revokedAt === undefined) {
      throw new DeviceException('Device revoked-at timestamp is required.');
    }

    if (
      typeof command.correlationId !== 'string' ||
      command.correlationId.trim().length === 0
    ) {
      throw new DeviceException('Device correlation ID is required.');
    }

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

export default RevokeDeviceHandler;
