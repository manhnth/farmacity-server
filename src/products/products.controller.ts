import { UpdateProductDto } from './dto/update-product.dto';
import { CreateProductDto } from './dto/create-product.dto';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private productService: ProductsService) {}

  @Post('create')
  async createProduct(@Body() createProductDto: CreateProductDto) {
    return await this.productService.createProduct(createProductDto);
  }

  @Get('all')
  async fetchProducts() {
    return this.productService.all();
  }

  @Get('search')
  async findProduct(@Query() query: any) {
    const { category, sort, q } = query;
    const builder = await this.productService.queryBuilder('product');

    if (category) {
      builder.where('product.category=:c', { c: category });
    }

    if (q) {
      builder.where('product.name LIKE :q OR product.description LIKE :q', {
        q: `%${q}%`,
      });
    }

    if (sort) {
      builder.orderBy('product.price', sort.toUpperCase());
    } else {
      builder.orderBy('product.createAt', 'DESC');
    }

    const page: number = parseInt(query.page as any) || 1;
    const perPage: number = parseInt(query.perPage as any) || 9;
    const total = await builder.getCount();

    builder.offset((page - 1) * perPage).limit(perPage);

    return {
      data: await builder.getMany(),
      total,
      page,
      last_page: Math.ceil(total / perPage),
    };
  }

  @Get(':id')
  async getProductById(@Param('id') id: number) {
    const product = await this.productService.getProductById(id);

    if (!product) {
      throw new BadRequestException(`Product with id: ${id} not found`);
    }
    return product;
  }

  @Patch('update/:id')
  async updateProduct(
    @Param('id') id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    const product = await this.productService.getProductById(id);

    if (!product) {
      throw new BadRequestException(`Product with id: ${id} not found`);
    }

    await this.productService.updateProduct(updateProductDto, product);

    return { message: 'Update Success!' };
  }

  @Delete(':id')
  async removeById(@Param('id') id: number) {
    const product = this.productService.getProductById(id);

    if (!product) {
      throw new BadRequestException(`Product with id: ${id} not found`);
    }

    await this.productService.removeOne(id);

    return { message: 'Delete Success', status: HttpStatus.OK };
  }
}
