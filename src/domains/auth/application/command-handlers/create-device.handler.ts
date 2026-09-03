// -----------------------------------------------------------------------------
// Device — Create Command Handler
// -----------------------------------------------------------------------------
//
// Application handler responsible for creating a new Device aggregate.
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
// - receive an already-generated DeviceFingerprint;
// - create the DeviceEntity;
// - create the DeviceAggregate;
// - record DeviceCreatedEvent through the aggregate;
// - persist the Device aggregate.
//
// -----------------------------------------------------------------------------
//
// Domain responsibilities:
//
// DeviceEntity:
//
// - establishes Device identity;
// - establishes ACTIVE lifecycle status;
// - establishes LOW trust by default;
// - stores the Device fingerprint;
// - stores Device metadata;
// - validates Device creation invariants;
// - owns Device lifecycle state.
//
// DeviceAggregate:
//
// - owns the aggregate boundary;
// - validates aggregate-level consistency;
// - records DeviceCreatedEvent;
// - preserves correlation/causation metadata.
//
// DeviceRepository:
//
// - persists the complete Device aggregate.
//
// -----------------------------------------------------------------------------
//
// Device recognition boundary:
//
// The command supplies DeviceFingerprint as an already-created value object.
//
// This handler does NOT:
//
// - generate a fingerprint;
// - interpret a fingerprint;
// - perform device recognition;
// - resolve browser/device intelligence;
// - access request headers;
// - access Prisma.
//
// Fingerprint generation and recognition belong to the appropriate
// infrastructure/application boundary.
//
// -----------------------------------------------------------------------------
//
// Identity boundary:
//
// identityPublicId is an opaque reference to the Identity aggregate.
//
// This handler does NOT:
//
// - load Identity;
// - validate Identity domain state;
// - mutate Identity.
//
// Cross-aggregate validation belongs to the application workflow that invokes
// this handler.
//
// -----------------------------------------------------------------------------
//
// Trust boundary:
//
// A newly created Device defaults to LOW trust.
//
// Trusting a Device is a separate application command:
//
//     TrustDeviceCommand
//
// The create workflow therefore does NOT:
//
// - establish TRUSTED state;
// - establish trustedAt;
// - evaluate trust policy.
//
// -----------------------------------------------------------------------------
//
// Timestamp boundary:
//
// DeviceEntity establishes:
//
// - createdAt;
// - updatedAt.
//
// Device creation does not accept timestamps from the command.
//
// -----------------------------------------------------------------------------
//
// This handler does NOT:
//
// - trust Device;
// - record Device activity;
// - revoke Device;
// - authenticate users;
// - generate authentication tokens;
// - generate refresh tokens;
// - manage Sessions;
// - send notifications;
// - access Prisma;
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

import type { CreateDeviceCommand } from '../commands/create-device.command';

// -----------------------------------------------------------------------------
// Domain Aggregate
// -----------------------------------------------------------------------------

import { DeviceAggregate } from '../../domain/aggregates/device.aggregate';

// -----------------------------------------------------------------------------
// Domain Entity
// -----------------------------------------------------------------------------

import { DeviceEntity } from '../../domain/entities/device.entity';

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
 * Creates and persists a new Device aggregate.
 *
 * Application flow:
 *
 *     CreateDeviceCommand
 *              │
 *              ▼
 *       command validation
 *              │
 *              ▼
 *      DeviceEntity.create()
 *              │
 *              ▼
 *      DeviceAggregate.create()
 *              │
 *              ▼
 *      aggregate.recordCreated()
 *              │
 *              ▼
 *       repository.save()
 *
 * The Device fingerprint is supplied as an already-created domain value
 * object. Fingerprint generation and recognition remain outside this handler.
 */
@Injectable()
export class CreateDeviceHandler implements CommandHandler<CreateDeviceCommand> {
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
   * Executes the CreateDeviceCommand.
   *
   * Device creation establishes a new ACTIVE Device with LOW trust unless
   * the DeviceEntity factory policy is explicitly changed.
   */
  public async execute(command: CreateDeviceCommand): Promise<void> {
    // -------------------------------------------------------------------------
    // 1. Command guard
    // -------------------------------------------------------------------------

    this.ensureCommand(command);

    // -------------------------------------------------------------------------
    // 2. Required command fields
    // -------------------------------------------------------------------------

    this.ensureRequiredCommandFields(command);

    // -------------------------------------------------------------------------
    // 3. Build Device creation options
    // -------------------------------------------------------------------------
    //
    // IMPORTANT:
    //
    // exactOptionalPropertyTypes is enabled.
    //
    // Therefore optional properties must not be supplied as:
    //
    //     name: undefined
    //
    // They must simply be omitted when they are not present.
    //
    // DeviceEntity.create() owns:
    //
    // - ACTIVE initial status;
    // - LOW initial trust;
    // - createdAt;
    // - updatedAt;
    // - revokedAt = undefined.
    // -------------------------------------------------------------------------

    const options = this.buildCreationOptions(command);

    // -------------------------------------------------------------------------
    // 4. Create Device entity
    // -------------------------------------------------------------------------
    //
    // The fingerprint has already been represented as a domain value object.
    //
    // The entity owns Device-level invariants.
    // -------------------------------------------------------------------------

    const device = DeviceEntity.create(
      command.identityPublicId,
      command.fingerprint,
      command.deviceType,
      options,
    );

    // -------------------------------------------------------------------------
    // 5. Create Device aggregate
    // -------------------------------------------------------------------------

    const aggregate = DeviceAggregate.create(device);

    // -------------------------------------------------------------------------
    // 6. Record DeviceCreatedEvent
    // -------------------------------------------------------------------------
    //
    // The aggregate records the event.
    //
    // The event intentionally does not expose:
    //
    // - Device fingerprint;
    // - authentication credentials;
    // - session credentials;
    // - security-sensitive recognition material.
    // -------------------------------------------------------------------------

    aggregate.recordCreated(command.correlationId, command.causationId);

    // -------------------------------------------------------------------------
    // 7. Persist aggregate
    // -------------------------------------------------------------------------

    await this.deviceRepository.save(aggregate);
  }

  // ===========================================================================
  // Command Validation
  // ===========================================================================

  /**
   * Ensures that a command was supplied.
   */
  private ensureCommand(command: CreateDeviceCommand): void {
    if (command === undefined || command === null) {
      throw new DeviceException('Create Device command is required.');
    }
  }

  /**
   * Validates required command properties.
   *
   * Structural validation belongs at the application boundary.
   *
   * Domain semantics remain owned by the value objects and DeviceEntity.
   */
  private ensureRequiredCommandFields(command: CreateDeviceCommand): void {
    // -------------------------------------------------------------------------
    // Identity public ID
    // -------------------------------------------------------------------------

    if (command.identityPublicId === undefined) {
      throw new DeviceException('Device Identity public ID is required.');
    }

    // -------------------------------------------------------------------------
    // Device fingerprint
    // -------------------------------------------------------------------------

    if (command.fingerprint === undefined) {
      throw new DeviceException('Device fingerprint is required.');
    }

    // -------------------------------------------------------------------------
    // Device type
    // -------------------------------------------------------------------------

    if (command.deviceType === undefined) {
      throw new DeviceException('Device type is required.');
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

  // ===========================================================================
  // Entity Creation Options
  // ===========================================================================

  /**
   * Builds the optional DeviceEntity creation options.
   *
   * Optional properties are added only when actually supplied.
   *
   * This is intentional because the project uses:
   *
   *     exactOptionalPropertyTypes: true
   *
   * Therefore:
   *
   *     { name: undefined }
   *
   * is not equivalent to:
   *
   *     {}
   *
   * for an optional property.
   */
  private buildCreationOptions(command: CreateDeviceCommand): {
    name?: NonNullable<CreateDeviceCommand['name']>;
    platform?: NonNullable<CreateDeviceCommand['platform']>;
    operatingSystem?: NonNullable<CreateDeviceCommand['operatingSystem']>;
    operatingSystemVersion?: NonNullable<
      CreateDeviceCommand['operatingSystemVersion']
    >;
    browser?: NonNullable<CreateDeviceCommand['browser']>;
    browserVersion?: NonNullable<CreateDeviceCommand['browserVersion']>;
  } {
    const options: {
      name?: NonNullable<CreateDeviceCommand['name']>;
      platform?: NonNullable<CreateDeviceCommand['platform']>;
      operatingSystem?: NonNullable<CreateDeviceCommand['operatingSystem']>;
      operatingSystemVersion?: NonNullable<
        CreateDeviceCommand['operatingSystemVersion']
      >;
      browser?: NonNullable<CreateDeviceCommand['browser']>;
      browserVersion?: NonNullable<CreateDeviceCommand['browserVersion']>;
    } = {};

    if (command.name !== undefined) {
      options.name = command.name;
    }

    if (command.platform !== undefined) {
      options.platform = command.platform;
    }

    if (command.operatingSystem !== undefined) {
      options.operatingSystem = command.operatingSystem;
    }

    if (command.operatingSystemVersion !== undefined) {
      options.operatingSystemVersion = command.operatingSystemVersion;
    }

    if (command.browser !== undefined) {
      options.browser = command.browser;
    }

    if (command.browserVersion !== undefined) {
      options.browserVersion = command.browserVersion;
    }

    return options;
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default CreateDeviceHandler;
