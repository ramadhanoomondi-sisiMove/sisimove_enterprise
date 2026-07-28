import { ApiProperty } from '@nestjs/swagger';

import { IsString, MaxLength } from 'class-validator';

export class RenameRoleDto {
  @ApiProperty()
  @IsString()
  rolePublicId!: string;

  @ApiProperty()
  @IsString()
  @MaxLength(100)
  name!: string;
}
