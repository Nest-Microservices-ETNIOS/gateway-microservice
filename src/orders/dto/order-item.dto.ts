import { IsNumber, IsPositive, IsString, IsUUID } from 'class-validator';

export class OrderItemDto {
  @IsString()
  @IsUUID()
  productId: string;

  @IsNumber()
  @IsPositive()
  quantity: number;

  @IsNumber()
  @IsPositive()
  price: number;
}
