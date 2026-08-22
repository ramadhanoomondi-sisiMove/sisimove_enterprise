// src/domains/commercial/domain/value-objects/commercial-commission-rule-version.vo.ts

// -----------------------------------------------------------------------------
// Commercial Commission Rule Version
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface CommercialCommissionRuleVersionProps {
  value: number;
}

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const MIN_VERSION = 1;

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Version of a Commercial Commission Rule.
 *
 * Versions are immutable identifiers of successive rule definitions for the
 * same Commercial Commission Type.
 *
 * Version numbering starts at 1 and must always be a positive integer.
 */
export class CommercialCommissionRuleVersion extends ValueObject<CommercialCommissionRuleVersionProps> {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  private constructor(value: number) {
    super({ value });
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  /**
   * Creates a Commercial Commission Rule Version.
   *
   * Numeric strings are accepted at the boundary and normalized into a
   * number before validation.
   */
  public static create(
    value: number | string,
  ): CommercialCommissionRuleVersion {
    const normalized = typeof value === 'string' ? Number(value.trim()) : value;

    CommercialCommissionRuleVersion.validate(normalized);

    return new CommercialCommissionRuleVersion(normalized);
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(value: number): void {
    if (!Number.isFinite(value)) {
      throw new Error(
        'Commercial Commission Rule version must be a finite number',
      );
    }

    if (!Number.isInteger(value)) {
      throw new Error('Commercial Commission Rule version must be an integer');
    }

    if (value < MIN_VERSION) {
      throw new Error(
        `Commercial Commission Rule version must be at least ${MIN_VERSION}`,
      );
    }
  }

  // ---------------------------------------------------------------------------
  // Predicates
  // ---------------------------------------------------------------------------

  public isInitial(): boolean {
    return this.props.value === MIN_VERSION;
  }

  public isGreaterThan(version: CommercialCommissionRuleVersion): boolean {
    return this.props.value > version.value;
  }

  public isLessThan(version: CommercialCommissionRuleVersion): boolean {
    return this.props.value < version.value;
  }

  public isGreaterThanOrEqual(
    version: CommercialCommissionRuleVersion,
  ): boolean {
    return this.props.value >= version.value;
  }

  public isLessThanOrEqual(version: CommercialCommissionRuleVersion): boolean {
    return this.props.value <= version.value;
  }

  // ---------------------------------------------------------------------------
  // Versioning
  // ---------------------------------------------------------------------------

  /**
   * Creates the next sequential version.
   */
  public next(): CommercialCommissionRuleVersion {
    return new CommercialCommissionRuleVersion(this.props.value + 1);
  }

  // ---------------------------------------------------------------------------
  // Accessor
  // ---------------------------------------------------------------------------

  public get value(): number {
    return this.props.value;
  }

  // ---------------------------------------------------------------------------
  // Serialization
  // ---------------------------------------------------------------------------

  public override toString(): string {
    return this.props.value.toString();
  }
}

// -----------------------------------------------------------------------------
// Exported Constants
// -----------------------------------------------------------------------------

export { MIN_VERSION as COMMERCIAL_COMMISSION_RULE_MIN_VERSION };

// -----------------------------------------------------------------------------
// Exported Types
// -----------------------------------------------------------------------------

export type { CommercialCommissionRuleVersionProps };
