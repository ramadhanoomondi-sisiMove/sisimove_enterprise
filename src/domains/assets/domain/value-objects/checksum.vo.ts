// src/domains/assets/domain/value-objects/checksum.vo.ts

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

import { ChecksumAlgorithm } from './checksum-algorithm.enum';

import { ChecksumAlgorithmMismatchException } from '../exceptions/checksum/checksum-algorithm-mismatch.exception';
import { InvalidChecksumException } from '../exceptions/checksum/invalid-checksum.exception';

interface ChecksumProps {
  algorithm: ChecksumAlgorithm;
  value: string;
}

export class Checksum extends ValueObject<ChecksumProps> {
  constructor(props: ChecksumProps) {
    Checksum.validate(props);

    super({
      algorithm: props.algorithm,
      value: props.value.trim().toUpperCase(),
    });

    Object.freeze(this);
  }

  get algorithm(): ChecksumAlgorithm {
    return this.props.algorithm;
  }

  get value(): string {
    return this.props.value;
  }

  private static validate(props: ChecksumProps): void {
    const value = props.value.trim();

    if (value.length === 0) {
      throw new InvalidChecksumException();
    }

    if (!/^[A-Fa-f0-9]+$/.test(value)) {
      throw new InvalidChecksumException();
    }

    this.validateLength(props.algorithm, value);
  }

  private static validateLength(
    algorithm: ChecksumAlgorithm,
    value: string,
  ): void {
    const expectedLength = this.expectedLength(algorithm);

    if (value.length !== expectedLength) {
      throw new ChecksumAlgorithmMismatchException();
    }
  }

  private static expectedLength(algorithm: ChecksumAlgorithm): number {
    switch (algorithm) {
      case ChecksumAlgorithm.MD5:
        return 32;

      case ChecksumAlgorithm.SHA1:
        return 40;

      case ChecksumAlgorithm.SHA256:
        return 64;

      case ChecksumAlgorithm.SHA512:
        return 128;
    }
  }
}
