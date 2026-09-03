// -----------------------------------------------------------------------------
// Device — Create Request DTO
// -----------------------------------------------------------------------------
//
// REST request DTO for creating a Device.
//
// Aggregate:
//
// DeviceAggregate
// └── DeviceEntity
//
// This DTO contains transport-level primitive values only.
//
// The DTO intentionally does NOT import or depend on Device domain value
// objects, aggregates, or application commands.
//
// DTO-to-command/domain conversion belongs at the presentation/application
// mapping boundary.
//
// Application mapping:
//
//     identityPublicId          → DeviceIdentityPublicId
//     fingerprint               → DeviceFingerprint
//     name                      → DeviceName
//     platform                  → DevicePlatform
//     operatingSystem           → DeviceOperatingSystem
//     operatingSystemVersion    → DeviceOperatingSystemVersion
//     browser                   → DeviceBrowser
//     browserVersion            → DeviceBrowserVersion
//     deviceType                → DeviceType
//
// The Device aggregate is responsible for:
//
// - generating the Device public identifier;
// - establishing Device lifecycle state;
// - enforcing Device invariants;
// - recording the appropriate domain event.
//
// This DTO does NOT:
//
// - generate DevicePublicId;
// - establish Device status;
// - access Prisma;
// - create DeviceEntity;
// - create DeviceAggregate;
// - persist the Device;
// - validate Identity domain state;
// - create Sessions;
// - authenticate credentials;
// - perform external side effects.
//
// Those responsibilities belong to the appropriate application workflow,
// aggregate, repository, and infrastructure boundaries.
//
// -----------------------------------------------------------------------------
//
// Example:
//
//     {
//       "identityPublicId": "IDN-01K3R8Y7Q2",
//       "fingerprint": "fp_01K3R8Y8M4",
//       "name": "John's iPhone",
//       "platform": "IOS",
//       "operatingSystem": "iOS",
//       "operatingSystemVersion": "18.6",
//       "browser": "Safari",
//       "browserVersion": "18.6",
//       "deviceType": "MOBILE",
//       "correlationId": "COR-01K3R8Y7Q2",
//       "causationId": "CMD-01K3R8Y6M4"
//     }
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS Swagger
// -----------------------------------------------------------------------------

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// -----------------------------------------------------------------------------
// Class Transformer
// -----------------------------------------------------------------------------

import { Transform, type TransformFnParams } from 'class-transformer';

// -----------------------------------------------------------------------------
// Class Validator
// -----------------------------------------------------------------------------

import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

const trimString = ({ value }: TransformFnParams): unknown =>
  typeof value === 'string' ? value.trim() : value;

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const MIN_PUBLIC_ID_LENGTH = 1;
const MAX_PUBLIC_ID_LENGTH = 128;

const MIN_FINGERPRINT_LENGTH = 1;
const MAX_FINGERPRINT_LENGTH = 512;

const MIN_NAME_LENGTH = 1;
const MAX_NAME_LENGTH = 255;

const MIN_PLATFORM_LENGTH = 1;
const MAX_PLATFORM_LENGTH = 64;

const MIN_OPERATING_SYSTEM_LENGTH = 1;
const MAX_OPERATING_SYSTEM_LENGTH = 128;

const MIN_OPERATING_SYSTEM_VERSION_LENGTH = 1;
const MAX_OPERATING_SYSTEM_VERSION_LENGTH = 64;

const MIN_BROWSER_LENGTH = 1;
const MAX_BROWSER_LENGTH = 128;

const MIN_BROWSER_VERSION_LENGTH = 1;
const MAX_BROWSER_VERSION_LENGTH = 64;

const MIN_DEVICE_TYPE_LENGTH = 1;
const MAX_DEVICE_TYPE_LENGTH = 64;

const MIN_CORRELATION_ID_LENGTH = 1;
const MAX_CORRELATION_ID_LENGTH = 128;

const MIN_CAUSATION_ID_LENGTH = 1;
const MAX_CAUSATION_ID_LENGTH = 128;

// -----------------------------------------------------------------------------
// DTO
// -----------------------------------------------------------------------------

/**
 * REST request for creating a Device.
 *
 * Required transport input:
 *
 * - identityPublicId;
 * - fingerprint;
 * - deviceType;
 * - correlationId.
 *
 * Optional transport input:
 *
 * - name;
 * - platform;
 * - operatingSystem;
 * - operatingSystemVersion;
 * - browser;
 * - browserVersion;
 * - causationId.
 *
 * All properties are primitive transport values.
 *
 * Domain value objects are created only after this DTO crosses the
 * presentation/application mapping boundary.
 */
export class CreateDeviceRequestDto {
  // ===========================================================================
  // Identity Public ID
  // ===========================================================================

  /**
   * Public identifier of the Identity associated with the Device.
   *
   * Transport representation:
   *
   * - string
   *
   * Application mapping:
   *
   *     string → DeviceIdentityPublicId
   */
  @ApiProperty({
    example: 'IDN-01K3R8Y7Q2',
    description:
      'Public identifier of the Identity associated with this Device.',
    minLength: MIN_PUBLIC_ID_LENGTH,
    maxLength: MAX_PUBLIC_ID_LENGTH,
  })
  @Transform(trimString)
  @IsString({
    message: 'identityPublicId must be a string.',
  })
  @MinLength(MIN_PUBLIC_ID_LENGTH, {
    message: 'identityPublicId must not be empty.',
  })
  @MaxLength(MAX_PUBLIC_ID_LENGTH, {
    message: `identityPublicId must not exceed ${MAX_PUBLIC_ID_LENGTH} characters.`,
  })
  identityPublicId!: string;

  // ===========================================================================
  // Fingerprint
  // ===========================================================================

  /**
   * Stable device fingerprint used to identify the physical/logical device.
   *
   * The fingerprint is treated as an opaque transport string.
   *
   * Application mapping:
   *
   *     string → DeviceFingerprint
   */
  @ApiProperty({
    example: 'fp_01K3R8Y8M4',
    description: 'Opaque device fingerprint used to identify the Device.',
    minLength: MIN_FINGERPRINT_LENGTH,
    maxLength: MAX_FINGERPRINT_LENGTH,
  })
  @Transform(trimString)
  @IsString({
    message: 'fingerprint must be a string.',
  })
  @MinLength(MIN_FINGERPRINT_LENGTH, {
    message: 'fingerprint must not be empty.',
  })
  @MaxLength(MAX_FINGERPRINT_LENGTH, {
    message: `fingerprint must not exceed ${MAX_FINGERPRINT_LENGTH} characters.`,
  })
  fingerprint!: string;

  // ===========================================================================
  // Device Name
  // ===========================================================================

  /**
   * Optional human-readable name assigned to the Device.
   *
   * Application mapping:
   *
   *     string → DeviceName
   */
  @ApiPropertyOptional({
    example: "John's iPhone",
    description: 'Optional human-readable name assigned to the Device.',
    minLength: MIN_NAME_LENGTH,
    maxLength: MAX_NAME_LENGTH,
    nullable: true,
  })
  @Transform(trimString)
  @IsOptional()
  @IsString({
    message: 'name must be a string.',
  })
  @MinLength(MIN_NAME_LENGTH, {
    message: 'name must not be empty.',
  })
  @MaxLength(MAX_NAME_LENGTH, {
    message: `name must not exceed ${MAX_NAME_LENGTH} characters.`,
  })
  name?: string;

  // ===========================================================================
  // Platform
  // ===========================================================================

  /**
   * Optional application/platform classification.
   *
   * Application mapping:
   *
   *     string → DevicePlatform
   */
  @ApiPropertyOptional({
    example: 'IOS',
    description: 'Optional platform associated with the Device.',
    minLength: MIN_PLATFORM_LENGTH,
    maxLength: MAX_PLATFORM_LENGTH,
    nullable: true,
  })
  @Transform(trimString)
  @IsOptional()
  @IsString({
    message: 'platform must be a string.',
  })
  @MinLength(MIN_PLATFORM_LENGTH, {
    message: 'platform must not be empty.',
  })
  @MaxLength(MAX_PLATFORM_LENGTH, {
    message: `platform must not exceed ${MAX_PLATFORM_LENGTH} characters.`,
  })
  platform?: string;

  // ===========================================================================
  // Operating System
  // ===========================================================================

  /**
   * Optional operating system name.
   *
   * Application mapping:
   *
   *     string → DeviceOperatingSystem
   */
  @ApiPropertyOptional({
    example: 'iOS',
    description: 'Optional operating system name associated with the Device.',
    minLength: MIN_OPERATING_SYSTEM_LENGTH,
    maxLength: MAX_OPERATING_SYSTEM_LENGTH,
    nullable: true,
  })
  @Transform(trimString)
  @IsOptional()
  @IsString({
    message: 'operatingSystem must be a string.',
  })
  @MinLength(MIN_OPERATING_SYSTEM_LENGTH, {
    message: 'operatingSystem must not be empty.',
  })
  @MaxLength(MAX_OPERATING_SYSTEM_LENGTH, {
    message: `operatingSystem must not exceed ${MAX_OPERATING_SYSTEM_LENGTH} characters.`,
  })
  operatingSystem?: string;

  // ===========================================================================
  // Operating System Version
  // ===========================================================================

  /**
   * Optional operating system version.
   *
   * Application mapping:
   *
   *     string → DeviceOperatingSystemVersion
   */
  @ApiPropertyOptional({
    example: '18.6',
    description:
      'Optional operating system version associated with the Device.',
    minLength: MIN_OPERATING_SYSTEM_VERSION_LENGTH,
    maxLength: MAX_OPERATING_SYSTEM_VERSION_LENGTH,
    nullable: true,
  })
  @Transform(trimString)
  @IsOptional()
  @IsString({
    message: 'operatingSystemVersion must be a string.',
  })
  @MinLength(MIN_OPERATING_SYSTEM_VERSION_LENGTH, {
    message: 'operatingSystemVersion must not be empty.',
  })
  @MaxLength(MAX_OPERATING_SYSTEM_VERSION_LENGTH, {
    message: `operatingSystemVersion must not exceed ${MAX_OPERATING_SYSTEM_VERSION_LENGTH} characters.`,
  })
  operatingSystemVersion?: string;

  // ===========================================================================
  // Browser
  // ===========================================================================

  /**
   * Optional browser name.
   *
   * Application mapping:
   *
   *     string → DeviceBrowser
   */
  @ApiPropertyOptional({
    example: 'Safari',
    description: 'Optional browser associated with the Device.',
    minLength: MIN_BROWSER_LENGTH,
    maxLength: MAX_BROWSER_LENGTH,
    nullable: true,
  })
  @Transform(trimString)
  @IsOptional()
  @IsString({
    message: 'browser must be a string.',
  })
  @MinLength(MIN_BROWSER_LENGTH, {
    message: 'browser must not be empty.',
  })
  @MaxLength(MAX_BROWSER_LENGTH, {
    message: `browser must not exceed ${MAX_BROWSER_LENGTH} characters.`,
  })
  browser?: string;

  // ===========================================================================
  // Browser Version
  // ===========================================================================

  /**
   * Optional browser version.
   *
   * Application mapping:
   *
   *     string → DeviceBrowserVersion
   */
  @ApiPropertyOptional({
    example: '18.6',
    description: 'Optional browser version associated with the Device.',
    minLength: MIN_BROWSER_VERSION_LENGTH,
    maxLength: MAX_BROWSER_VERSION_LENGTH,
    nullable: true,
  })
  @Transform(trimString)
  @IsOptional()
  @IsString({
    message: 'browserVersion must be a string.',
  })
  @MinLength(MIN_BROWSER_VERSION_LENGTH, {
    message: 'browserVersion must not be empty.',
  })
  @MaxLength(MAX_BROWSER_VERSION_LENGTH, {
    message: `browserVersion must not exceed ${MAX_BROWSER_VERSION_LENGTH} characters.`,
  })
  browserVersion?: string;

  // ===========================================================================
  // Device Type
  // ===========================================================================

  /**
   * Classification of the Device.
   *
   * The transport value remains a primitive string.
   *
   * The application mapping boundary converts it into DeviceType.
   */
  @ApiProperty({
    example: 'MOBILE',
    description:
      'Classification of the Device. The transport string is converted to DeviceType at the application boundary.',
    minLength: MIN_DEVICE_TYPE_LENGTH,
    maxLength: MAX_DEVICE_TYPE_LENGTH,
  })
  @Transform(trimString)
  @IsString({
    message: 'deviceType must be a string.',
  })
  @MinLength(MIN_DEVICE_TYPE_LENGTH, {
    message: 'deviceType must not be empty.',
  })
  @MaxLength(MAX_DEVICE_TYPE_LENGTH, {
    message: `deviceType must not exceed ${MAX_DEVICE_TYPE_LENGTH} characters.`,
  })
  deviceType!: string;

  // ===========================================================================
  // Correlation
  // ===========================================================================

  /**
   * Correlation identifier for the Device-creation operation.
   *
   * This identifies the complete business operation and is propagated to
   * resulting domain events.
   */
  @ApiProperty({
    example: 'COR-01K3R8Y7Q2',
    description:
      'Correlation identifier for the Device-creation operation and resulting domain events.',
    minLength: MIN_CORRELATION_ID_LENGTH,
    maxLength: MAX_CORRELATION_ID_LENGTH,
  })
  @Transform(trimString)
  @IsString({
    message: 'correlationId must be a string.',
  })
  @MinLength(MIN_CORRELATION_ID_LENGTH, {
    message: 'correlationId must not be empty.',
  })
  @MaxLength(MAX_CORRELATION_ID_LENGTH, {
    message: `correlationId must not exceed ${MAX_CORRELATION_ID_LENGTH} characters.`,
  })
  correlationId!: string;

  // ===========================================================================
  // Causation
  // ===========================================================================

  /**
   * Optional identifier of the command, event, or workflow that caused this
   * Device-creation operation.
   */
  @ApiPropertyOptional({
    example: 'CMD-01K3R8Y6M4',
    description:
      'Optional identifier of the command, domain event, or workflow that caused this Device-creation operation.',
    minLength: MIN_CAUSATION_ID_LENGTH,
    maxLength: MAX_CAUSATION_ID_LENGTH,
    nullable: true,
  })
  @Transform(trimString)
  @IsOptional()
  @IsString({
    message: 'causationId must be a string.',
  })
  @MinLength(MIN_CAUSATION_ID_LENGTH, {
    message: 'causationId must not be empty.',
  })
  @MaxLength(MAX_CAUSATION_ID_LENGTH, {
    message: `causationId must not exceed ${MAX_CAUSATION_ID_LENGTH} characters.`,
  })
  causationId?: string;
}

// -----------------------------------------------------------------------------
// Exported Constants
// -----------------------------------------------------------------------------

export {
  MIN_PUBLIC_ID_LENGTH as DEVICE_PUBLIC_ID_MIN_LENGTH,
  MAX_PUBLIC_ID_LENGTH as DEVICE_PUBLIC_ID_MAX_LENGTH,
  MIN_FINGERPRINT_LENGTH as DEVICE_FINGERPRINT_MIN_LENGTH,
  MAX_FINGERPRINT_LENGTH as DEVICE_FINGERPRINT_MAX_LENGTH,
  MIN_NAME_LENGTH as DEVICE_NAME_MIN_LENGTH,
  MAX_NAME_LENGTH as DEVICE_NAME_MAX_LENGTH,
  MIN_PLATFORM_LENGTH as DEVICE_PLATFORM_MIN_LENGTH,
  MAX_PLATFORM_LENGTH as DEVICE_PLATFORM_MAX_LENGTH,
  MIN_OPERATING_SYSTEM_LENGTH as DEVICE_OPERATING_SYSTEM_MIN_LENGTH,
  MAX_OPERATING_SYSTEM_LENGTH as DEVICE_OPERATING_SYSTEM_MAX_LENGTH,
  MIN_OPERATING_SYSTEM_VERSION_LENGTH as DEVICE_OPERATING_SYSTEM_VERSION_MIN_LENGTH,
  MAX_OPERATING_SYSTEM_VERSION_LENGTH as DEVICE_OPERATING_SYSTEM_VERSION_MAX_LENGTH,
  MIN_BROWSER_LENGTH as DEVICE_BROWSER_MIN_LENGTH,
  MAX_BROWSER_LENGTH as DEVICE_BROWSER_MAX_LENGTH,
  MIN_BROWSER_VERSION_LENGTH as DEVICE_BROWSER_VERSION_MIN_LENGTH,
  MAX_BROWSER_VERSION_LENGTH as DEVICE_BROWSER_VERSION_MAX_LENGTH,
  MIN_DEVICE_TYPE_LENGTH as DEVICE_TYPE_MIN_LENGTH,
  MAX_DEVICE_TYPE_LENGTH as DEVICE_TYPE_MAX_LENGTH,
  MIN_CORRELATION_ID_LENGTH as DEVICE_CORRELATION_ID_MIN_LENGTH,
  MAX_CORRELATION_ID_LENGTH as DEVICE_CORRELATION_ID_MAX_LENGTH,
  MIN_CAUSATION_ID_LENGTH as DEVICE_CAUSATION_ID_MIN_LENGTH,
  MAX_CAUSATION_ID_LENGTH as DEVICE_CAUSATION_ID_MAX_LENGTH,
};

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default CreateDeviceRequestDto;
