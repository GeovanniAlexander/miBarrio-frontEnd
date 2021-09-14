import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { CartItem } from '../common/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems : CartItem[] = [];

  totalPrice : Subject<number> = new Subject<number>();
  totalQuantity : Subject<number> = new Subject<number>();

  constructor() { }

  addToCart(cartItem : CartItem){
    let exists : number = -1;  
    exists = this.cartItems.findIndex(item => item.id == cartItem.id)

    if (exists != -1)
      this.cartItems[exists].quantity++;
    else
      this.cartItems.push(cartItem);

    this.computeCartTotals();
  } 

  computeCartTotals() {
    let totalPrice : number = 0;
    let totalQuantity : number = 0;
    
    for (let cartItem of this.cartItems){
      totalPrice += (cartItem.quantity * cartItem.unitPrice);
      totalQuantity += cartItem.quantity; 
    }

    this.totalPrice.next(totalPrice);
    this.totalQuantity.next(totalQuantity);
  }

  decrementQuantity(cartItem : CartItem){
    let index : number = -1;  
    index = this.cartItems.findIndex(item => item.id == cartItem.id)

    if (cartItem.quantity > 1) 
      this.cartItems[index].quantity--;
    else
      this.removeCartItem(index);

      this.computeCartTotals();
  }

  removeCartItem(index : number){
    this.cartItems.splice(index, 1);
  }
}
