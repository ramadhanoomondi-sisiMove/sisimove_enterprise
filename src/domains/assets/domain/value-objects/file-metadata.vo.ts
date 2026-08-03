// src/domains/assets/domain/value-objects/file-metadata.vo.ts

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

import { InvalidAssetSizeException } from '../exceptions/file/invalid-asset-size.exception';
import { InvalidFileNameException } from '../exceptions/file/invalid-file-name.exception';
import { InvalidMimeTypeException } from '../exceptions/file/invalid-mime-type.exception';

interface FileMetadataProps {
  originalFilename?: string;
  storedFilename?: string;
  mimeType: string;
  extension?: string;
  sizeBytes: bigint;
}

export class FileMetadata extends ValueObject<FileMetadataProps> {
  constructor(props: FileMetadataProps) {
    FileMetadata.validate(props);

    const normalized: FileMetadataProps = {
      mimeType: props.mimeType.trim().toLowerCase(),
      sizeBytes: props.sizeBytes,
    };

    if (props.originalFilename !== undefined) {
      normalized.originalFilename = props.originalFilename.trim();
    }

    if (props.storedFilename !== undefined) {
      normalized.storedFilename = props.storedFilename.trim();
    }

    if (props.extension !== undefined) {
      normalized.extension = props.extension.trim().toLowerCase();
    }

    super(normalized);

    Object.freeze(this);
  }

  get originalFilename(): string | undefined {
    return this.props.originalFilename;
  }

  get storedFilename(): string | undefined {
    return this.props.storedFilename;
  }

  get mimeType(): string {
    return this.props.mimeType;
  }

  get extension(): string | undefined {
    return this.props.extension;
  }

  get sizeBytes(): bigint {
    return this.props.sizeBytes;
  }

  get hasExtension(): boolean {
    return this.props.extension !== undefined;
  }

  get fileName(): string | undefined {
    return this.props.storedFilename ?? this.props.originalFilename;
  }

  private static validate(props: FileMetadataProps): void {
    this.validateMimeType(props.mimeType);
    this.validateSize(props.sizeBytes);
    this.validateFileName(props.originalFilename);
    this.validateFileName(props.storedFilename);
  }

  private static validateMimeType(mimeType: string): void {
    if (mimeType.trim().length === 0) {
      throw new InvalidMimeTypeException();
    }
  }

  private static validateSize(sizeBytes: bigint): void {
    if (sizeBytes <= 0n) {
      throw new InvalidAssetSizeException();
    }
  }

  private static validateFileName(fileName?: string): void {
    if (fileName === undefined) {
      return;
    }

    if (fileName.trim().length === 0) {
      throw new InvalidFileNameException();
    }
  }
}
