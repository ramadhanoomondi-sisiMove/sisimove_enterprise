// src/domains/assets/domain/value-objects/asset-processing-failure-reason.vo.ts

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

interface AssetProcessingFailureReasonProps {
  value: string;
}

export class AssetProcessingFailureReason extends ValueObject<AssetProcessingFailureReasonProps> {
  private static readonly MAX_LENGTH = 500;

  constructor(value: string) {
    const normalized = value.trim();

    AssetProcessingFailureReason.validate(normalized);

    super({
      value: normalized,
    });

    Object.freeze(this);
  }

  // --------------------------------------------------------------------------
  // Properties
  // --------------------------------------------------------------------------

  get value(): string {
    return this.props.value;
  }

  // --------------------------------------------------------------------------
  // Queries
  // --------------------------------------------------------------------------

  isEmpty(): boolean {
    return this.value.length === 0;
  }

  // --------------------------------------------------------------------------
  // Validation
  // --------------------------------------------------------------------------

  private static validate(value: string): void {
    if (value.length === 0) {
      throw new Error('Asset processing failure reason cannot be empty.');
    }

    if (value.length > this.MAX_LENGTH) {
      throw new Error(
        `Asset processing failure reason cannot exceed ${this.MAX_LENGTH} characters.`,
      );
    }
  }

  // --------------------------------------------------------------------------
  // Representation
  // --------------------------------------------------------------------------

  override toString(): string {
    return this.value;
  }
}
