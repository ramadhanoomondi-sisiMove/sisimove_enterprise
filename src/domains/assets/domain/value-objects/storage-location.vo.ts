// src/domains/assets/domain/value-objects/storage-location.vo.ts

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

import { InvalidBucketException } from '../exceptions/storage/invalid-bucket.exception';
import { InvalidObjectKeyException } from '../exceptions/storage/invalid-object-key.exception';

import type { StorageProvider } from './storage-provider.enum';

interface StorageLocationProps {
  provider: StorageProvider;
  bucket: string;
  objectKey: string;
}

export class StorageLocation extends ValueObject<StorageLocationProps> {
  constructor(props: StorageLocationProps) {
    StorageLocation.validate(props);

    super({
      provider: props.provider,
      bucket: props.bucket.trim(),
      objectKey: props.objectKey.trim(),
    });

    Object.freeze(this);
  }

  get provider(): StorageProvider {
    return this.props.provider;
  }

  get bucket(): string {
    return this.props.bucket;
  }

  get objectKey(): string {
    return this.props.objectKey;
  }

  private static validate(props: StorageLocationProps): void {
    this.validateBucket(props.bucket);
    this.validateObjectKey(props.objectKey);
  }

  private static validateBucket(bucket: string): void {
    if (bucket.trim().length === 0) {
      throw new InvalidBucketException();
    }

    // Future:
    // - AWS S3 bucket naming rules
    // - Azure Blob container naming rules
    // - Google Cloud Storage bucket naming rules
  }

  private static validateObjectKey(objectKey: string): void {
    if (objectKey.trim().length === 0) {
      throw new InvalidObjectKeyException();
    }

    // Future:
    // - maximum length
    // - forbidden characters
    // - path normalization
  }
}
