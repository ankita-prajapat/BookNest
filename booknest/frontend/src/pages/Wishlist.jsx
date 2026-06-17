import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';

const Wishlist = () => {
  const { wishlist, toggleWishlist, addToCart } = useCart();

  if (wishlist.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-6">
        <div className="h-16 w-16 bg-cream-200 dark:bg-espresso-900 rounded-full flex items-center justify-center mx-auto text-terracotta-500">
          <Heart className="h-8 w-8 stroke-[1.5]" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-espresso-800 dark:text-cream-100">
          Your Wishlist is Empty
        </h2>
        <p className="text-xs text-espresso-500 max-w-sm mx-auto">
          Keep track of books you love! Tap the floating heart icon on any book cover to add it to your cozy sanctuary wishlist.
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center space-x-2 bg-terracotta-500 hover:bg-terracotta-600 text-white font-semibold px-6 py-3 rounded-full text-sm shadow-md transition-all"
        >
          <span>Explore Catalog</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 transition-colors duration-200">
      <div className="flex items-center space-x-3 mb-8">
        <Heart className="h-7 w-7 text-terracotta-500 fill-terracotta-500" />
        <h1 className="font-serif text-3xl font-bold text-espresso-800 dark:text-cream-50">
          My Sanctuary Wishlist
        </h1>
      </div>

      {/* Grid List of Wishlist items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlist.map((book) => {
          const bookId = book._id || book;
          return (
            <div
              key={bookId}
              className="bg-white dark:bg-espresso-950 p-4 rounded-2xl border border-cream-200 dark:border-espresso-900 shadow-pin flex gap-4 items-center relative animate-fade-in-up"
            >
              {/* Cover */}
              <div className="aspect-[3/4.2] w-20 rounded-lg overflow-hidden border border-cream-200/50 flex-shrink-0">
                <img
                  src={book.coverImage}
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Info & actions */}
              <div className="flex-1 min-w-0 space-y-1">
                <span className="text-[9px] font-bold text-terracotta-500 uppercase tracking-widest">
                  {book.category}
                </span>
                <h3 className="font-serif font-bold text-sm sm:text-base text-espresso-800 dark:text-cream-100 truncate">
                  <Link to={`/books/${bookId}`} className="hover:text-terracotta-500">
                    {book.title}
                  </Link>
                </h3>
                <p className="text-xs text-espresso-500">by {book.author}</p>
                <p className="font-bold text-sm text-espresso-800 dark:text-cream-50 mt-2">${book.price.toFixed(2)}</p>

                {/* Actions */}
                <div className="flex items-center space-x-3 pt-3">
                  <button
                    onClick={() => {
                      if (book.stock > 0) {
                        addToCart(book, 1);
                      }
                    }}
                    disabled={book.stock <= 0}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold shadow-sm transition-colors ${
                      book.stock <= 0
                        ? 'bg-espresso-900/40 text-cream-300 cursor-not-allowed'
                        : 'bg-terracotta-500 text-white hover:bg-terracotta-600'
                    }`}
                  >
                    <ShoppingBag className="h-3 w-3" />
                    <span>{book.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}</span>
                  </button>

                  <button
                    onClick={() => toggleWishlist(book)}
                    className="text-espresso-500 hover:text-red-500 transition-colors p-1"
                    title="Remove from Wishlist"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Wishlist;
