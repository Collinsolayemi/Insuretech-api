import { IsInt, IsPositive } from 'class-validator';

export class PurchasePlanDto {
  @IsInt()
  @IsPositive()
  quantity: number;
}
