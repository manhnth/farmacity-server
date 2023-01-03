import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './../typeorm/product.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
  ) {}

  async createProduct(createProductDto: CreateProductDto) {
    const myDate = new Date().toUTCString();

    const product = this.productsRepository.create({
      ...createProductDto,
      createAt: myDate,
      updateAt: myDate,
    });

    await this.productsRepository.save(product);
  }

  async all() {
    return await this.productsRepository.find();
  }

  async getProductById(id: number) {
    return this.productsRepository.findOne({ where: { id } });
  }

  async fetchProductsByCategory(category: any) {
    return (await this.productsRepository.findBy(category)) || null;
  }

  async queryBuilder(alias: string) {
    return this.productsRepository.createQueryBuilder(alias);
  }

  async updateProduct(updateProductDto: UpdateProductDto, product: Product) {
    const productId = product.id;
    const myDate = new Date().toUTCString();

    const updateProduct = {
      ...product,
      ...updateProductDto,
      updateAt: myDate,
    };

    return await this.productsRepository.update(
      { id: productId },
      { ...updateProduct },
    );
  }

  async removeOne(condition: any) {
    await this.productsRepository.delete(condition);
  }
}
