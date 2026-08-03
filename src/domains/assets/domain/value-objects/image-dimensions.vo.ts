// src/domains/assets/domain/value-objects/image-dimensions.vo.ts

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

import { InvalidColorDepthException } from '../exceptions/image/invalid-color-depth.exception';
import { InvalidImageHeightException } from '../exceptions/image/invalid-image-height.exception';
import { InvalidImageWidthException } from '../exceptions/image/invalid-image-width.exception';

interface ImageDimensionsProps {
  width: number;
  height: number;
  colorDepth?: number;
}

export class ImageDimensions extends ValueObject<ImageDimensionsProps> {
  constructor(props: ImageDimensionsProps) {
    ImageDimensions.validate(props);

    super(props);

    Object.freeze(this);
  }

  get width(): number {
    return this.props.width;
  }

  get height(): number {
    return this.props.height;
  }

  get colorDepth(): number | undefined {
    return this.props.colorDepth;
  }

  private static validate(props: ImageDimensionsProps): void {
    this.validateWidth(props.width);
    this.validateHeight(props.height);
    this.validateColorDepth(props.colorDepth);
  }

  private static validateWidth(width: number): void {
    if (width <= 0) {
      throw new InvalidImageWidthException();
    }
  }

  private static validateHeight(height: number): void {
    if (height <= 0) {
      throw new InvalidImageHeightException();
    }
  }

  private static validateColorDepth(colorDepth?: number): void {
    if (colorDepth !== undefined && colorDepth <= 0) {
      throw new InvalidColorDepthException();
    }
  }
}
