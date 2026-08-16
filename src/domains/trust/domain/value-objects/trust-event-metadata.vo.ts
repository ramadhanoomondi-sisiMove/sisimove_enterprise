// src/domains/trust/domain/value-objects/trust-event-metadata.vo.ts

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export type TrustEventMetadataValue =
  | string
  | number
  | boolean
  | null
  | TrustEventMetadataValue[]
  | {
      [key: string]: TrustEventMetadataValue;
    };

interface TrustEventMetadataProps {
  value: Record<string, TrustEventMetadataValue>;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

export class TrustEventMetadata extends ValueObject<TrustEventMetadataProps> {
  constructor(metadata: Record<string, TrustEventMetadataValue> = {}) {
    if (
      metadata === null ||
      typeof metadata !== 'object' ||
      Array.isArray(metadata)
    ) {
      throw new Error('Trust event metadata must be a plain object.');
    }

    super({
      value: TrustEventMetadata.clone(metadata),
    });
  }

  // ===========================================================================
  // Accessors
  // ===========================================================================

  get value(): Record<string, TrustEventMetadataValue> {
    return TrustEventMetadata.clone(this.props.value);
  }

  get isEmpty(): boolean {
    return Object.keys(this.props.value).length === 0;
  }

  // ===========================================================================
  // Queries
  // ===========================================================================

  has(key: string): boolean {
    return Object.prototype.hasOwnProperty.call(this.props.value, key);
  }

  get(key: string): TrustEventMetadataValue | undefined {
    return this.props.value[key];
  }

  // ===========================================================================
  // Internal
  // ===========================================================================

  private static clone(
    metadata: Record<string, TrustEventMetadataValue>,
  ): Record<string, TrustEventMetadataValue> {
    return JSON.parse(JSON.stringify(metadata)) as Record<
      string,
      TrustEventMetadataValue
    >;
  }
}
