import { UpdateItemDto } from './dto/update-item-dto';
import { Product } from './../typeorm/product.entity';
import { CartItem } from '../typeorm/cart-item.entity';
import { Cart } from '../typeorm/cart.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/typeorm/user.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
  ) {}

  async createCart(user: User) {
    const cart = new Cart();

    cart.user = user;

    await this.cartRepository.save(cart);
  }

  async getAllCarts() {
    return await this.cartRepository.find();
  }

  async getCartByUserId(userId: number) {
    const cart = await this.cartRepository
      .createQueryBuilder('cart')
      .leftJoinAndSelect('cart.user', 'user')
      .leftJoinAndSelect('cart.items', 'cartItem')
      .leftJoinAndSelect('cartItem.product', 'product')
      .where('user.id=:id', { id: userId })
      .getOne();

    return cart;
  }

  async getCartById(cartId: number) {
    const cart = await this.cartRepository.findOne({ where: { id: cartId } });

    return cart;
  }

  async deleteCart(cartId: number) {
    await this.cartRepository.delete(cartId);
  }

  async refreshCart(cartId: number) {
    await this.cartItemRepository
      .createQueryBuilder('cartItem')
      .innerJoin('cartItem.cart', 'cart')
      .delete()
      .from(CartItem)
      .where('cart.id=:id', { id: cartId })
      .execute();
  }

  async addItem(product: Product, cart: Cart, quantity: number) {
    //check if product already in cart
    const alreadyCartItem = await this.cartItemRepository
      .createQueryBuilder('cartItem')
      .innerJoin('cartItem.product', 'product')
      .innerJoin('cartItem.cart', 'cart')
      .where('cart.id=:id', { id: cart.id })
      .andWhere('product.id=:productId', { productId: product.id })
      .getOne();

    // if product already exist in user cart
    // update cart item quantity
    // if not, create new cart item
    if (!alreadyCartItem) {
      const cartItem = new CartItem();
      cartItem.product = product;
      cartItem.quantity = quantity;
      cartItem.cart = cart;

      await this.cartItemRepository.save(cartItem);
    } else {
      await this.cartItemRepository
        .createQueryBuilder('cartItem')
        .innerJoin('cartItem.product', 'product')
        .innerJoin('cartItem.cart', 'cart')
        .update(CartItem)
        .set({
          quantity: () => `quantity + ${quantity}`,
        })
        .where('cart.id=:id', { id: cart.id })
        .where('product.id=:id', { id: product.id })
        .execute();
    }
  }

  async getCartItemById(cartItemId: number) {
    return await this.cartItemRepository.findOne({ where: { id: cartItemId } });
  }

  async updateCartItem(quantity: number, cartItem: CartItem) {
    const cartItemId = cartItem.id;

    const updateCartItem = {
      ...cartItem,
      quantity,
    };

    return await this.cartItemRepository.update(
      { id: cartItemId },
      { ...updateCartItem },
    );
  }

  async deleteCartItem(cartItemId: number) {
    await this.cartItemRepository.delete({ id: cartItemId });
  }
}
