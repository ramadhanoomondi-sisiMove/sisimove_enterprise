import { ApiProperty } from '@nestjs/swagger';

import { IsInt, IsString, Min } from 'class-validator';

export class ChangeRoleDisplayOrderDto {
  @ApiProperty()
  @IsString()
  rolePublicId!: string;

  @ApiProperty()
  @IsInt()
  @Min(0)
  displayOrder!: number;
}
