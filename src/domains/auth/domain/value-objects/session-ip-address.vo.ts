// -----------------------------------------------------------------------------
// Session IP Address
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface SessionIpAddressProps {
  value: string;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * IP address associated with a Session.
 *
 * Represents the network address observed when a Session was authenticated
 * or used.
 *
 * The value object supports both IPv4 and IPv6 textual representations.
 *
 * IP address validation is intentionally structural. Network ownership,
 * geolocation, reputation, proxy detection, and similar concerns belong to
 * infrastructure or application services.
 */
export class SessionIpAddress extends ValueObject<SessionIpAddressProps> {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  private constructor(value: string) {
    super({ value });
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  /**
   * Creates a Session IP address value object.
   *
   * Surrounding whitespace is removed before validation.
   */
  public static create(value: string): SessionIpAddress {
    const normalized = value.trim();

    SessionIpAddress.validate(normalized);

    return new SessionIpAddress(normalized);
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(value: string): void {
    if (!value) {
      throw new Error('Session IP address is required.');
    }

    if (!SessionIpAddress.isValid(value)) {
      throw new Error(`Invalid Session IP address: ${value}`);
    }
  }

  /**
   * Performs structural validation for IPv4 and IPv6 addresses.
   *
   * IPv4 validation supports dotted-decimal notation.
   *
   * IPv6 validation supports standard textual IPv6 notation, including
   * compressed representations such as `::1`.
   */
  public static isValid(value: string): boolean {
    return (
      SessionIpAddress.isValidIpv4(value) || SessionIpAddress.isValidIpv6(value)
    );
  }

  // ---------------------------------------------------------------------------
  // IPv4 Validation
  // ---------------------------------------------------------------------------

  private static isValidIpv4(value: string): boolean {
    const parts = value.split('.');

    if (parts.length !== 4) {
      return false;
    }

    return parts.every((part) => {
      if (!/^\d+$/.test(part)) {
        return false;
      }

      if (part.length > 1 && part.startsWith('0')) {
        return false;
      }

      const number = Number(part);

      return number >= 0 && number <= 255;
    });
  }

  // ---------------------------------------------------------------------------
  // IPv6 Validation
  // ---------------------------------------------------------------------------

  private static isValidIpv6(value: string): boolean {
    if (!value.includes(':')) {
      return false;
    }

    if (!/^[0-9a-fA-F:.]+$/.test(value)) {
      return false;
    }

    const doubleColonCount = (value.match(/::/g) ?? []).length;

    if (doubleColonCount > 1) {
      return false;
    }

    const normalized = value;

    if (normalized === '::') {
      return true;
    }

    const parts = normalized.split(':');

    let hextetCount = 0;

    for (const part of parts) {
      if (part === '') {
        continue;
      }

      if (part.includes('.')) {
        if (!SessionIpAddress.isValidIpv4(part)) {
          return false;
        }

        hextetCount += 2;
        continue;
      }

      if (!/^[0-9a-fA-F]{1,4}$/.test(part)) {
        return false;
      }

      hextetCount += 1;
    }

    if (doubleColonCount === 1) {
      return hextetCount < 8;
    }

    return hextetCount === 8;
  }

  // ---------------------------------------------------------------------------
  // State Checks
  // ---------------------------------------------------------------------------

  public isIpv4(): boolean {
    return SessionIpAddress.isValidIpv4(this.props.value);
  }

  public isIpv6(): boolean {
    return SessionIpAddress.isValidIpv6(this.props.value);
  }

  // ---------------------------------------------------------------------------
  // Accessor
  // ---------------------------------------------------------------------------

  public get value(): string {
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

export type { SessionIpAddressProps };
