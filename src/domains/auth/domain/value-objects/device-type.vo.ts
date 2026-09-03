// -----------------------------------------------------------------------------
// Device Type
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export type DeviceTypeValue =
  'WEB' | 'MOBILE' | 'TABLET' | 'DESKTOP' | 'UNKNOWN';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface DeviceTypeProps {
  value: DeviceTypeValue;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Represents the type of client device associated with a Device.
 *
 * Valid types:
 *
 * - WEB      — Browser-based web client without a more specific device type.
 * - MOBILE   — Mobile phone or similar handheld mobile device.
 * - TABLET   — Tablet or similar larger touch-based mobile device.
 * - DESKTOP  — Desktop computer.
 * - UNKNOWN  — Device type could not be reliably determined.
 *
 * Device classification and detection belong to application or infrastructure
 * services. This value object represents only the resulting domain value.
 */
export class DeviceType extends ValueObject<DeviceTypeProps> {
  // ---------------------------------------------------------------------------
  // Constants
  // ---------------------------------------------------------------------------

  public static readonly WEB = 'WEB' as const;

  public static readonly MOBILE = 'MOBILE' as const;

  public static readonly TABLET = 'TABLET' as const;

  public static readonly DESKTOP = 'DESKTOP' as const;

  public static readonly UNKNOWN = 'UNKNOWN' as const;

  private static readonly VALID_VALUES: ReadonlySet<DeviceTypeValue> = new Set([
    DeviceType.WEB,
    DeviceType.MOBILE,
    DeviceType.TABLET,
    DeviceType.DESKTOP,
    DeviceType.UNKNOWN,
  ]);

  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  private constructor(value: DeviceTypeValue) {
    super({ value });
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  /**
   * Creates a Device type value object.
   */
  public static create(value: DeviceTypeValue): DeviceType {
    DeviceType.validate(value);

    return new DeviceType(value);
  }

  public static web(): DeviceType {
    return new DeviceType(DeviceType.WEB);
  }

  public static mobile(): DeviceType {
    return new DeviceType(DeviceType.MOBILE);
  }

  public static tablet(): DeviceType {
    return new DeviceType(DeviceType.TABLET);
  }

  public static desktop(): DeviceType {
    return new DeviceType(DeviceType.DESKTOP);
  }

  public static unknown(): DeviceType {
    return new DeviceType(DeviceType.UNKNOWN);
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(value: string): asserts value is DeviceTypeValue {
    if (!DeviceType.VALID_VALUES.has(value as DeviceTypeValue)) {
      throw new Error(`Invalid Device type: ${value}`);
    }
  }

  // ---------------------------------------------------------------------------
  // State Checks
  // ---------------------------------------------------------------------------

  public isWeb(): boolean {
    return this.props.value === DeviceType.WEB;
  }

  public isMobile(): boolean {
    return this.props.value === DeviceType.MOBILE;
  }

  public isTablet(): boolean {
    return this.props.value === DeviceType.TABLET;
  }

  public isDesktop(): boolean {
    return this.props.value === DeviceType.DESKTOP;
  }

  public isUnknown(): boolean {
    return this.props.value === DeviceType.UNKNOWN;
  }

  // ---------------------------------------------------------------------------
  // Accessor
  // ---------------------------------------------------------------------------

  public get value(): DeviceTypeValue {
    return this.props.value;
  }

  // ---------------------------------------------------------------------------
  // Serialization
  // ---------------------------------------------------------------------------

  public override toString(): string {
    return this.props.value;
  }
}

// -----------------------------------------------------------------------------
// Exported Types
// -----------------------------------------------------------------------------

export type { DeviceTypeProps };
