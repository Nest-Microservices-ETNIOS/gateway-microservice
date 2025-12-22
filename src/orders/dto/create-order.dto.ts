import { ArrayMinSize, IsArray, ValidateNested } from 'class-validator';

import { OrderItemDto } from './order-item.dto';
import { Type } from 'class-transformer';

export class CreateOrderDto {
  // @IsNumber()
  // @IsPositive()
  // totalAmount: number;

  // @IsNumber()
  // @IsPositive()
  // totalItems: number;

  // // podemos poner valores por defecto aca tambien, al igual que en el schema.prisma
  // @IsEnum(OrderStatusList, {
  //   message: `Possible status are: ${OrderStatusList.join(', ')}`,
  // })
  // @IsOptional()
  // status: OrderStatus = OrderStatus.PENDING;

  // @IsBoolean()
  // @IsOptional()
  // paid: boolean = false;

  // ahora lo haremos asi
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true }) // validamos internamente los elementos
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}
