import { IsNotEmpty, IsString } from 'class-validator';

/**
 * Request values required to activate a Financial Account.
 *
 * The account is identified by the route parameter.
 * Correlation metadata is established by the backend.
 */
export class ActivateFinancialAccountDto {
  @IsString()
  @IsNotEmpty()
  public readonly activatedAt!: string;
}
