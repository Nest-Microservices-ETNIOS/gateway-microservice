import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { PaginationDto } from 'src/common';
import { PRODUCT_SERVICE } from 'src/config';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(
    // inyeccion de dependencias del microservicio de productos (inyectamos el token del microservicio, en este caso el token es PRODUCT_SERVICE)
    @Inject(PRODUCT_SERVICE) private readonly productClient: ClientProxy,
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
  createProduct(@Body() createProductDto: CreateProductDto) {
    return this.productClient
      .send({ cmd: 'create_product' }, createProductDto)
      .pipe(this.handleRpcError());
  }

  @Get()
  findAllProducts(@Query() paginationDto: PaginationDto) {
    return this.productClient
      .send({ cmd: 'find_all_products' }, paginationDto)
      .pipe(this.handleRpcError());
  }

  @Get(':id')
  findProductById(@Param('id') id: string) {
    return this.productClient
      .send({ cmd: 'find_one_product' }, { id })
      .pipe(this.handleRpcError());
  }

  @Delete(':id')
  deleteProductById(@Param('id') id: string) {
    return this.productClient
      .send({ cmd: 'delete_product' }, { id })
      .pipe(this.handleRpcError());
  }

  @Patch(':id')
  updateProductById(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productClient
      .send({ cmd: 'update_product' }, { id, ...updateProductDto })
      .pipe(this.handleRpcError());
  }
}
