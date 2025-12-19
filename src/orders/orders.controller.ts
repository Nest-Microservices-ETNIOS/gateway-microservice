import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { ORDER_SERVICE } from 'src/config';
import { CreateOrderDto, OrderPaginationDto } from './dto';
import { PaginationDto } from 'src/common';
import { StatusDto } from './dto/status.dto';

@Controller('orders')
export class OrdersController {
  constructor(
    @Inject(ORDER_SERVICE) private readonly ordersClient: ClientProxy,
  ) {}

  // Helper method to handle RPC errors consistently
  private handleRpcError() {
    return catchError((err: unknown) => {
      throw new RpcException(
        typeof err === 'object' && err !== null ? err : String(err),
      );
    });
  }

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersClient
      .send('createOrder', createOrderDto)
      .pipe(this.handleRpcError());
  }

  @Get()
  findAll(@Query() orderPaginationDto: OrderPaginationDto) {
    return this.ordersClient
      .send('findAllOrders', orderPaginationDto)
      .pipe(this.handleRpcError());
  }

  @Get('/id/:id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.ordersClient
      .send('findOneOrder', { id })
      .pipe(this.handleRpcError());
  }
  // try {
  //   const order = await firstValueFrom(
  //     this.ordersClient.send('findOneOrder', { id }),
  //   );

  //   return order;
  // } catch (error) {
  //   throw new RpcException(error);
  // }

  @Get(':status')
  findAllByStatus(
    @Param() statusDto: StatusDto,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.ordersClient
      .send('findAllOrders', { ...paginationDto, status: statusDto.status })
      .pipe(this.handleRpcError());
  }

  @Patch(':id')
  changeStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() statusDto: StatusDto,
  ) {
    return this.ordersClient
      .send('changeOrderStatus', { id, status: statusDto.status })
      .pipe(this.handleRpcError());
  }
}
