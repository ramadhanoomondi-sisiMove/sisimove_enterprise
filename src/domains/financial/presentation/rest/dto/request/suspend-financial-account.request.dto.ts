import { ApiProperty } from '@nestjs/swagger';
import { Transform, type TransformFnParams } from 'class-transformer';
import { IsString, MaxLength, MinLength } from 'class-validator';

const trimString = ({ value }: TransformFnParams): unknown =>
  typeof value === 'string' ? value.trim() : value;

export class SuspendFinancialAccountDto {
  @ApiProperty({
    example: '2026-10-25T07:09:06.178Z',
    description: 'Timestamp at which the suspension takes effect.',
    minLength: 1,
    maxLength: 64,
  })
  @Transform(trimString)
  @IsString({ message: 'suspendedAt must be a string.' })
  @MinLength(1, { message: 'suspendedAt must not be empty.' })
  @MaxLength(64, {
    message: 'suspendedAt must not exceed 64 characters.',
  })
  public readonly suspendedAt!: string;
}
