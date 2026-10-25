import { ApiProperty } from '@nestjs/swagger';
import { Transform, type TransformFnParams } from 'class-transformer';
import { IsString, MaxLength, MinLength } from 'class-validator';

const trimString = ({ value }: TransformFnParams): unknown =>
  typeof value === 'string' ? value.trim() : value;

export class CloseFinancialAccountDto {
  @ApiProperty({
    example: '2026-10-25T07:09:06.178Z',
    description: 'Timestamp at which the account closure takes effect.',
    minLength: 1,
    maxLength: 64,
  })
  @Transform(trimString)
  @IsString({ message: 'closedAt must be a string.' })
  @MinLength(1, { message: 'closedAt must not be empty.' })
  @MaxLength(64, {
    message: 'closedAt must not exceed 64 characters.',
  })
  public readonly closedAt!: string;
}
