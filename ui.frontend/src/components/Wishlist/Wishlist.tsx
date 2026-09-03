import React from 'react';
import '../Wishlist/Wishlist.scss';

interface WishlistProps {
  count?: number;
  wishlistUrl?: string;
}

const Wishlist: React.FC<WishlistProps> = ({ count = 0, wishlistUrl = '/wishlist' }) => {
  return (
    <a
      href={wishlistUrl}
      className="wishlist-link"
      aria-label={`Wishlist with ${count} item${count !== 1 ? 's' : ''}`}
    >
      <svg className="icon icon--heart" aria-hidden="true">
        <use href="#icon-heart"></use>
      </svg>
      {count > 0 && (
        <span className="wishlist-link__badge" aria-label={`${count} items in wishlist`}>
          {count > 99 ? '99+' : count}
        </span>
      )}
    </a>
  );
};

export default Wishlist;