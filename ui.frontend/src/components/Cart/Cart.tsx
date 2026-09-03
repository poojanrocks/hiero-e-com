import React from 'react';
import '../Cart/Cart.scss';

interface CartProps {
  count?: number;
  cartUrl?: string;
}

const Cart: React.FC<CartProps> = ({ count = 0, cartUrl = '/cart' }) => {
  return (
    <a
      href={cartUrl}
      className="cart-link"
      aria-label={`Shopping cart with ${count} item${count !== 1 ? 's' : ''}`}
    >
      <svg className="icon icon--cart" aria-hidden="true">
        <use href="#icon-cart"></use>
      </svg>
      {count > 0 && (
        <span className="cart-link__badge" aria-label={`${count} items in cart`}>
          {count > 99 ? '99+' : count}
        </span>
      )}
    </a>
  );
};

export default Cart;