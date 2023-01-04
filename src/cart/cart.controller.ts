import { RefreshCartDto } from './dto/refresh-cart-dto';
import { UpdateItemDto } from './dto/update-item-dto';
import { AddItemDto } from './dto/add-item-dto';
import { ProductsService } from './../products/products.service';
import { CartService } from './cart.service';
import { UsersService } from './../users/users.service';
import { JwtAuthGuard } from './../auth/guards/jwt-auth.guard';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
  constructor(
    private userService: UsersService,
    private cartService: CartService,
    private productService: ProductsService,
  ) {}

  @Get('all')
  async getAllCarts() {
    return await this.cartService.getAllCarts();
  }

  @Get()
  async getCartUser(@Req() req: any) {
    const { userId } = req.user;
    const user = await this.userService.getUserById(userId);
    if (!user) {
      throw new BadRequestException(
        'Not found user request! re-login and try again!',
      );
    }

    let cart = await this.cartService.getCartByUserId(userId);
    if (!cart) {
      await this.cartService.createCart(user);
    }
    const quantity = cart?.items.reduce((acc, crr) => acc + crr.quantity, 0);
    return {
      ...cart,
      quantity,
    };
  }

  @Post('addItem')
  async addItem(@Req() req: any, @Body() addItemDto: AddItemDto) {
    const { productId, quantity } = addItemDto;

    const { userId } = req.user;

    const product = await this.productService.getProductById(productId);

    if (!product) {
      throw new NotFoundException(`Not found product with id: ${productId}`);
    }

    const cart = await this.cartService.getCartByUserId(userId);

    if (!cart) {
      throw new NotFoundException(`Not found cart`);
    }

    // update product inventory
    const updateInventory = product.inventory - quantity;

    await this.productService.updateProduct(
      { inventory: updateInventory },
      product,
    );

    return await this.cartService.addItem(product, cart, quantity);
  }

  @Post('updateCartItemQuantity')
  async updateCartItemQuantity(
    @Req() req: any,
    @Body() updateItemDto: UpdateItemDto,
  ) {
    const { type, cartItemId, productId } = updateItemDto;
    const { userId } = req;

    const cartItem = await this.cartService.getCartItemById(cartItemId);
    const product = await this.productService.getProductById(productId);

    if (!cartItem) {
      throw new NotFoundException(`Not found cart item with id: ${cartItemId}`);
    }

    if (!product) {
      throw new NotFoundException(`Not found cart item with id: ${cartItemId}`);
    }

    let updateInventory;
    let updateQuantity = 0;

    if (type === 'inc') {
      updateInventory = product.inventory - 1;
      updateQuantity = cartItem.quantity + 1;
    }
    if (type === 'dec') {
      updateInventory = product.inventory + 1;
      updateQuantity = cartItem.quantity - 1;
    }

    await this.productService.updateProduct(
      { inventory: updateInventory },
      product,
    );
    return await this.cartService.updateCartItem(updateQuantity, cartItem);
  }

  @Post('refresh')
  async refreshCart(@Body() refreshCartDto: RefreshCartDto) {
    await this.cartService.refreshCart(refreshCartDto.cartId);
    // await this.cartService.deleteCart(refreshCartDto.cartId);
  }

  @Delete('delete/:cartItemId')
  async delete(@Param('cartItemId') cartItemId: number) {
    await this.cartService.deleteCartItem(cartItemId);
    return { message: 'Delete cart item success!' };
  }
}
