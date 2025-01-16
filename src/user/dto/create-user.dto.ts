import { IsString, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  walletBalance: number;
}
