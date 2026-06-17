import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import BookCard from '../components/BookCard';
import { 
  Heart, 
  ShoppingBag, 
  Star, 
  ChevronRight, 
  Sparkles, 
  ArrowLeft,
  MessageSquareQuote,
  Flame,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

const BookDetails = () => {
  const { id } = useParams();
  const { addToCart, toggleWishlist, wishlist, addRecentlyViewed, recentlyViewed } = useCart();
  const { user, token } = useAuth();

  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Review Form state
  const [ratingInput, setRatingInput] = useState(5);
  const [commentInput, setCommentInput] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');
  const [reviewError, setReviewError] = useState('');

  // Fetch book and recommendations
  useEffect(() => {
    const fetchBookDetails = async () => {
      setLoading(true);
      try {
        const resBook = await fetch(`/api/books/${id}`);
        if (resBook.ok) {
          const data = await resBook.json();
          setBook(data.book);
          setReviews(data.reviews);
          
          // Log viewed book locally and remotely
          addRecentlyViewed(data.book);
        }

        const resRecs = await fetch(`/api/books/${id}/recommendations`);
        if (resRecs.ok) {
          const dataRecs = await resRecs.json();
          setRecommendations(dataRecs);
        }
      } catch (error) {
        console.error('Error fetching book details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
    setQty(1);
    setReviewSuccess('');
    setReviewError('');
    setCommentInput('');
  }, [id]);

  // Sync wishlist status
  useEffect(() => {
    if (book) {
      setIsWishlisted(wishlist.some(item => item._id === book._id || item === book._id));
    }
  }, [wishlist, book]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!commentInput.trim()) {
      setReviewError('Please write a comment for your review.');
      return;
    }

    try {
      const response = await fetch(`/api/books/${book._id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ rating: ratingInput, comment: commentInput })
      });
      const data = await response.json();

      if (response.ok) {
        setReviewSuccess('Thank you! Your review has been saved.');
        setReviewError('');
        setCommentInput('');
        
        // Refresh book details (updated rating and reviews)
        const resBook = await fetch(`/api/books/${book._id}`);
        if (resBook.ok) {
          const updated = await resBook.json();
          setBook(updated.book);
          setReviews(updated.reviews);
        }
      } else {
        setReviewError(data.message || 'Error submitting review.');
      }
    } catch (error) {
      setReviewError('Server error submitting review.');
    }
  };

  const renderStars = (rating, size = "h-4 w-4") => {
    const stars = [];
    const floor = Math.floor(rating);
    for (let i = 1; i <= 5; i++) {
      if (i <= floor) {
        stars.push(<Star key={i} className={`${size} fill-terracotta-500 text-terracotta-500`} />);
      } else if (i - 0.5 <= rating) {
        stars.push(
          <div key={i} className={`relative ${size}`}>
            <Star className={`absolute top-0 left-0 ${size} text-cream-300 dark:text-espresso-800`} />
            <div className="absolute top-0 left-0 overflow-hidden w-1/2 h-full">
              <Star className={`${size} fill-terracotta-500 text-terracotta-500`} />
            </div>
          </div>
        );
      } else {
        stars.push(<Star key={i} className={`${size} text-cream-300 dark:text-espresso-800`} />);
      }
    }
    return stars;
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse space-y-8">
        <div className="h-6 w-32 bg-cream-200 dark:bg-espresso-900 rounded-md"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="h-96 bg-cream-200 dark:bg-espresso-900 rounded-2xl"></div>
          <div className="space-y-6">
            <div className="h-10 bg-cream-200 dark:bg-espresso-900 rounded-lg"></div>
            <div className="h-6 w-40 bg-cream-200 dark:bg-espresso-900 rounded-md"></div>
            <div className="h-24 bg-cream-200 dark:bg-espresso-900 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="font-serif text-2xl font-bold">Book Not Found</h2>
        <p className="text-espresso-500 mt-2">The book you are looking for does not exist in our catalog.</p>
        <Link to="/shop" className="mt-5 inline-block text-terracotta-500 font-semibold hover:underline">
          Go back to shop
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16 transition-colors duration-200">
      
      {/* Breadcrumbs */}
      <div className="flex items-center space-x-2 text-xs font-semibold text-espresso-500 dark:text-cream-300">
        <Link to="/" className="hover:text-terracotta-500">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <Link to="/shop" className="hover:text-terracotta-500">Shop</Link>
        <ChevronRight className="h-3 w-3" />
        <Link to={`/shop?category=${encodeURIComponent(book.category)}`} className="hover:text-terracotta-500">{book.category}</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-espresso-800 dark:text-cream-50 max-w-[200px] truncate">{book.title}</span>
      </div>

      {/* Main product column details */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-16 items-start">
        
        {/* Left: Cover Image */}
        <div className="md:col-span-5 flex justify-center sticky top-24">
          <div className="relative aspect-[3/4.2] w-full max-w-[340px] rounded-2xl overflow-hidden border border-cream-200 dark:border-espresso-900 shadow-pin">
            <img
              src={book.coverImage}
              alt={book.title}
              className="w-full h-full object-cover"
            />
            {book.isBestseller && (
              <span className="absolute top-4 left-4 bg-terracotta-500 text-white font-bold text-[10px] tracking-wider uppercase px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
                <Flame className="h-3 w-3 fill-current" />
                Bestseller
              </span>
            )}
          </div>
        </div>

        {/* Right: Book details metadata */}
        <div className="md:col-span-7 space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-terracotta-500">
              {book.category}
            </span>
            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-espresso-800 dark:text-cream-50 leading-tight">
              {book.title}
            </h1>
            <p className="text-base font-semibold text-espresso-500 dark:text-cream-300">
              by{' '}
              {book.authorRef ? (
                <Link
                  to={`/authors/${book.authorRef._id || book.authorRef}`}
                  className="text-espresso-800 dark:text-cream-50 hover:text-terracotta-500 underline decoration-terracotta-500 underline-offset-4 transition-colors duration-150 font-bold"
                >
                  {book.author}
                </Link>
              ) : (
                <span className="text-espresso-800 dark:text-cream-50 underline decoration-terracotta-500 underline-offset-4">
                  {book.author}
                </span>
              )}
            </p>
          </div>

          {/* Rating overview */}
          <div className="flex items-center space-x-3 pb-4 border-b border-cream-200 dark:border-espresso-900">
            <div className="flex">{renderStars(book.rating, "h-5 w-5")}</div>
            <span className="text-sm text-espresso-800 dark:text-cream-200 font-bold">{book.rating.toFixed(1)}</span>
            <span className="text-espresso-500 dark:text-espresso-100/40 text-xs">({reviews.length} reviews)</span>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="font-serif font-bold text-lg text-espresso-800 dark:text-cream-100">Synopsis</h3>
            <p className="text-sm text-espresso-500 dark:text-cream-300 leading-relaxed">
              {book.description}
            </p>
          </div>

          {/* Stock state and pricing */}
          <div className="flex items-center space-x-6 p-4 rounded-xl bg-white dark:bg-espresso-950 border border-cream-200 dark:border-espresso-900">
            <div className="space-y-1">
              <span className="text-xs text-espresso-500 dark:text-espresso-100/40 font-semibold uppercase">Pricing</span>
              <p className="text-2xl font-bold text-espresso-800 dark:text-cream-50">₹{book.price.toFixed(2)}</p>
            </div>
            
            <span className="h-8 w-px bg-cream-200 dark:bg-espresso-900"></span>

            <div className="space-y-1">
              <span className="text-xs text-espresso-500 dark:text-espresso-100/40 font-semibold uppercase">Availability</span>
              <div className="flex items-center space-x-1.5">
                {book.stock <= 0 ? (
                  <span className="text-xs font-semibold text-red-500 flex items-center gap-1">
                    <AlertTriangle className="h-4 w-4" /> Out of Stock
                  </span>
                ) : book.stock <= 3 ? (
                  <span className="text-xs font-semibold text-yellow-500 flex items-center gap-1">
                    <AlertTriangle className="h-4 w-4" /> Low Stock ({book.stock} left)
                  </span>
                ) : (
                  <span className="text-xs font-semibold text-sage-500 flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4" /> In Stock
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Add to Cart Actions */}
          {book.stock > 0 && (
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              {/* Qty Selector */}
              <div className="flex items-center border border-cream-200 dark:border-espresso-900 rounded-xl bg-white dark:bg-espresso-950 px-3 py-2 justify-between w-full sm:w-28">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="text-espresso-800 dark:text-cream-100 px-2 font-bold"
                >
                  -
                </button>
                <span className="font-semibold text-sm">{qty}</span>
                <button
                  onClick={() => setQty(Math.min(book.stock, qty + 1))}
                  className="text-espresso-800 dark:text-cream-100 px-2 font-bold"
                >
                  +
                </button>
              </div>

              {/* Add Cart */}
              <button
                onClick={() => addToCart(book, qty)}
                className="flex-1 bg-terracotta-500 hover:bg-terracotta-600 text-white font-semibold py-3 px-6 rounded-xl flex items-center justify-center space-x-2 shadow-md transition-all active:scale-[0.98]"
              >
                <ShoppingBag className="h-4 w-4" />
                <span>Add to Cart</span>
              </button>

              {/* Add Wishlist */}
              <button
                onClick={() => toggleWishlist(book)}
                className={`p-3 rounded-xl border flex items-center justify-center transition-all ${
                  isWishlisted 
                    ? 'border-terracotta-500 bg-terracotta-500 text-white' 
                    : 'border-cream-200 dark:border-espresso-900 bg-white dark:bg-espresso-950 text-espresso-800 dark:text-cream-100 hover:bg-cream-100'
                }`}
                title="Add to Wishlist"
              >
                <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
            </div>
          )}

        </div>
      </section>

      {/* AI recommendation details */}
      {recommendations.length > 0 && (
        <section className="bg-gradient-to-r from-cream-200 to-cream-50 dark:from-espresso-950 dark:to-espresso-900 p-8 rounded-3xl border border-cream-300 dark:border-espresso-900 relative overflow-hidden transition-colors">
          <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
            <Sparkles className="h-40 w-40 text-terracotta-500 fill-terracotta-500" />
          </div>
          
          <div className="flex items-center space-x-2 text-terracotta-500 font-bold text-xs uppercase tracking-wider mb-4">
            <Sparkles className="h-4 w-4 text-terracotta-500 fill-terracotta-500 animate-spin" />
            <span>AI-Powered Personal Recommendations</span>
          </div>

          <h3 className="font-serif text-2xl font-bold text-espresso-800 dark:text-cream-100 mb-6">
            Recommended Read Matching This Book
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.slice(0, 3).map((item) => (
              <div key={item._id} className="bg-white dark:bg-espresso-950/60 p-5 rounded-2xl border border-cream-200 dark:border-espresso-900 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between">
                    <span className="text-[9px] font-bold bg-terracotta-100 text-terracotta-700 px-2 py-0.5 rounded-full">
                      AI Match
                    </span>
                    <span className="text-xs font-bold text-espresso-800 dark:text-cream-50">₹{item.price.toFixed(2)}</span>
                  </div>
                  <h4 className="font-serif font-bold text-sm text-espresso-800 dark:text-cream-100 mt-2 line-clamp-1">
                    {item.title}
                  </h4>
                  <p className="text-[10px] text-espresso-500 mt-0.5">by {item.author}</p>
                  
                  {/* AI reason explanation */}
                  <p className="text-xs italic text-espresso-500 dark:text-cream-300/80 mt-3 border-l-2 border-terracotta-500 pl-2">
                    {item.aiReason}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-cream-100 dark:border-espresso-900/40 flex justify-between items-center">
                  <Link to={`/books/${item._id}`} className="text-xs font-semibold text-terracotta-500 hover:underline">
                    View Details
                  </Link>
                  <button
                    onClick={() => addToCart(item, 1)}
                    className="bg-espresso-800 dark:bg-cream-200 text-white dark:text-espresso-800 hover:bg-espresso-950 p-1.5 rounded-lg text-[10px] font-semibold"
                  >
                    Quick Add
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Reviews list & Submissions */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 border-t border-cream-200 dark:border-espresso-900 pt-12">
        
        {/* Review list */}
        <div className="lg:col-span-7 space-y-6">
          <h3 className="font-serif text-2xl font-bold text-espresso-800 dark:text-cream-100 flex items-center gap-2">
            <MessageSquareQuote className="h-6 w-6 text-terracotta-500" />
            Reader Reviews ({reviews.length})
          </h3>

          {reviews.length > 0 ? (
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
              {reviews.map((rev) => (
                <div key={rev._id} className="bg-white dark:bg-espresso-950/60 p-5 rounded-xl border border-cream-100 dark:border-espresso-900">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-sm text-espresso-800 dark:text-cream-100">{rev.user.name}</h4>
                      <div className="flex mt-1">{renderStars(rev.rating, "h-3 w-3")}</div>
                    </div>
                    <span className="text-[10px] text-espresso-500 font-semibold">
                      {new Date(rev.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs text-espresso-500 dark:text-cream-300 mt-3 leading-relaxed">
                    "{rev.comment}"
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm italic text-espresso-500 py-6">
              Be the first to review this book! No community reviews posted yet.
            </p>
          )}
        </div>

        {/* Add review form */}
        <div className="lg:col-span-5 bg-white dark:bg-espresso-950 p-6 rounded-2xl border border-cream-200 dark:border-espresso-900 shadow-pin">
          <h3 className="font-serif text-xl font-bold text-espresso-800 dark:text-cream-100 mb-4">
            Write a Review
          </h3>

          {user ? (
            <form onSubmit={handleReviewSubmit} className="space-y-4">
              
              {/* Rating selection */}
              <div>
                <label className="block text-xs font-semibold text-espresso-500 dark:text-cream-200 uppercase mb-2">
                  Overall Rating
                </label>
                <div className="flex items-center space-x-1.5">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setRatingInput(num)}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`h-6 w-6 stroke-[1.5] ${
                          ratingInput >= num
                            ? 'fill-terracotta-500 text-terracotta-500'
                            : 'text-cream-300 dark:text-espresso-800'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment text area */}
              <div>
                <label className="block text-xs font-semibold text-espresso-500 dark:text-cream-200 uppercase mb-2">
                  Review Comment
                </label>
                <textarea
                  rows="4"
                  placeholder="Share your thoughts on the characters, the writing style, or what this book meant to you..."
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  className="w-full bg-cream-50 dark:bg-espresso-900 border border-cream-300 dark:border-espresso-800 rounded-xl px-4 py-3 text-xs text-espresso-800 dark:text-cream-50 focus:outline-none focus:ring-1 focus:ring-terracotta-500"
                ></textarea>
              </div>

              {/* Success/Error displays */}
              {reviewSuccess && (
                <div className="text-xs text-sage-500 font-semibold bg-sage-50 dark:bg-sage-950/20 border border-sage-500/20 p-2.5 rounded-lg">
                  {reviewSuccess}
                </div>
              )}
              {reviewError && (
                <div className="text-xs text-red-500 font-semibold bg-red-50 dark:bg-red-950/20 border border-red-500/20 p-2.5 rounded-lg">
                  {reviewError}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-espresso-800 hover:bg-espresso-950 dark:bg-cream-200 dark:hover:bg-white text-cream-100 dark:text-espresso-800 font-semibold py-2.5 rounded-xl text-xs transition-colors"
              >
                Submit Review
              </button>

            </form>
          ) : (
            <div className="text-center py-8">
              <MessageSquareQuote className="h-8 w-8 text-espresso-500/40 mx-auto mb-2" />
              <p className="text-xs text-espresso-500">
                You must be logged in to review books.
              </p>
              <Link
                to="/login"
                className="mt-4 inline-block bg-terracotta-500 hover:bg-terracotta-600 text-white font-semibold text-xs px-4 py-2 rounded-full"
              >
                Log In Now
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Recently Viewed Shelf */}
      {recentlyViewed.length > 1 && (
        <section className="border-t border-cream-200 dark:border-espresso-900 pt-12">
          <h3 className="font-serif text-2xl font-bold text-espresso-800 dark:text-cream-100 mb-6">
            Recently Viewed Nest Items
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-6">
            {recentlyViewed
              .filter(item => item._id !== book._id)
              .slice(0, 5)
              .map((item) => (
                <div key={item._id} className="relative group border border-cream-100 dark:border-espresso-900 bg-white dark:bg-espresso-950 p-2 rounded-xl text-center">
                  <div className="aspect-[3/4.2] overflow-hidden rounded-lg mb-2">
                    <img src={item.coverImage} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </div>
                  <h4 className="font-serif font-bold text-xs truncate text-espresso-800 dark:text-cream-50 leading-tight">
                    {item.title}
                  </h4>
                  <Link to={`/books/${item._id}`} className="absolute inset-0"></Link>
                </div>
              ))}
          </div>
        </section>
      )}

    </div>
  );
};

export default BookDetails;
