// src/domains/assets/domain/value-objects/media-metadata.vo.ts

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

import { InvalidBitrateException } from '../exceptions/media/invalid-bitrate.exception';
import { InvalidDurationException } from '../exceptions/media/invalid-duration.exception';
import { InvalidFrameRateException } from '../exceptions/media/invalid-frame-rate.exception';

interface MediaMetadataProps {
  durationSeconds: number;
  bitrate?: number;
  frameRate?: number;
}

export class MediaMetadata extends ValueObject<MediaMetadataProps> {
  constructor(props: MediaMetadataProps) {
    MediaMetadata.validate(props);

    super(props);

    Object.freeze(this);
  }

  get durationSeconds(): number {
    return this.props.durationSeconds;
  }

  get bitrate(): number | undefined {
    return this.props.bitrate;
  }

  get frameRate(): number | undefined {
    return this.props.frameRate;
  }

  private static validate(props: MediaMetadataProps): void {
    this.validateDuration(props.durationSeconds);
    this.validateBitrate(props.bitrate);
    this.validateFrameRate(props.frameRate);
  }

  private static validateDuration(durationSeconds: number): void {
    if (durationSeconds < 0) {
      throw new InvalidDurationException();
    }
  }

  private static validateBitrate(bitrate?: number): void {
    if (bitrate !== undefined && bitrate <= 0) {
      throw new InvalidBitrateException();
    }
  }

  private static validateFrameRate(frameRate?: number): void {
    if (frameRate !== undefined && frameRate <= 0) {
      throw new InvalidFrameRateException();
    }
  }
}
