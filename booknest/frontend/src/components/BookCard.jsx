import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Heart, ShoppingBag, Star } from 'lucide-react';

const BookCard = ({ book }) => {
  const { addToCart, toggleWishlist, wishlist } = useCart();

  const isWishlisted = wishlist.some(
    (item) => item._id === book._id || item === book._id
  );

  const renderStars = (rating) => {
    const stars = [];
    const floor = Math.floor(rating);
    for (let i = 1; i <= 5; i++) {
      if (i <= floor) {
        stars.push(
          <Star key={i} className="h-3.5 w-3.5 fill-terracotta-500 text-terracotta-500" />
        );
      } else if (i - 0.5 <= rating) {
        stars.push(
          <div key={i} className="relative h-3.5 w-3.5">
            <Star className="absolute top-0 left-0 h-3.5 w-3.5 text-cream-300 dark:text-espresso-800" />
            <div className="absolute top-0 left-0 overflow-hidden w-1/2 h-full">
              <Star className="h-3.5 w-3.5 fill-terracotta-500 text-terracotta-500" />
            </div>
          </div>
        );
      } else {
        stars.push(
          <Star key={i} className="h-3.5 w-3.5 text-cream-300 dark:text-espresso-800" />
        );
      }
    }
    return stars;
  };

  return (
    <div className="group relative flex flex-col bg-white dark:bg-espresso-950 rounded-2xl p-3 border border-cream-200 dark:border-espresso-900 shadow-pin hover:shadow-pin-hover transition-all duration-300 ease-out animate-fade-in-up">
      {/* Cover Image container with floating controls */}
      <div className="relative aspect-[3/4.2] overflow-hidden rounded-xl bg-cream-50 dark:bg-espresso-900 mb-3 shadow-sm border border-cream-200/50 dark:border-espresso-900/50">
        <img
          src={book.coverImage}
          alt={book.title}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />

        {/* Floating Heart Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(book);
          }}
          className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md transition-all duration-200 ${
            isWishlisted
              ? 'bg-terracotta-500 text-white shadow-md'
              : 'bg-white/80 text-espresso-800 hover:bg-white hover:scale-105 shadow-sm'
          }`}
          title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart
            className={`h-4 w-4 stroke-[2] ${isWishlisted ? 'fill-current' : ''}`}
          />
        </button>

        {/* Quick Add To Cart Button - Hover Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-espresso-950/80 via-espresso-950/40 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out flex justify-center">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (book.stock > 0) {
                addToCart(book, 1);
              }
            }}
            disabled={book.stock <= 0}
            className={`w-full py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5 shadow-md transition-all ${
              book.stock <= 0
                ? 'bg-espresso-800/80 text-cream-300 cursor-not-allowed'
                : 'bg-terracotta-500 text-white hover:bg-terracotta-600 active:scale-[0.98]'
            }`}
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            <span>{book.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}</span>
          </button>
        </div>
      </div>

      {/* Book Metadata details */}
      <Link to={`/books/${book._id}`} className="flex-1 flex flex-col justify-between">
        <div>
          {/* Category Tag */}
          <span className="text-[10px] font-semibold tracking-wider text-terracotta-500 uppercase">
            {book.category}
          </span>
          {/* Title */}
          <h4 className="font-serif text-base font-semibold text-espresso-800 dark:text-cream-50 leading-tight mt-0.5 line-clamp-1 group-hover:text-terracotta-500 transition-colors">
            {book.title}
          </h4>
          {/* Author */}
          <p className="text-xs text-espresso-500 dark:text-espresso-100/60 mt-0.5 font-medium line-clamp-1">
            by {book.author}
          </p>
        </div>

        <div className="flex items-center justify-between mt-3 pt-2 border-t border-cream-100 dark:border-espresso-900/40">
          {/* Rating */}
          <div className="flex items-center space-x-1" title={`${book.rating.toFixed(1)} / 5.0`}>
            <div className="flex">{renderStars(book.rating)}</div>
            <span className="text-[10px] text-espresso-500 dark:text-espresso-100/40 font-semibold pl-0.5">
              ({book.reviewsCount || 0})
            </span>
          </div>
          {/* Price */}
          <span className="text-sm font-bold text-espresso-800 dark:text-cream-50">
            ₹{book.price.toFixed(2)}
          </span>
        </div>
      </Link>
    </div>
  );
};

export default BookCard;
