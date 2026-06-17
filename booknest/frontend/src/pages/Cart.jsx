import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, Trash2, ArrowRight, Ticket, Gift } from 'lucide-react';

const Cart = () => {
  const { 
    cart, 
    updateCartQuantity, 
    removeFromCart, 
    applyCouponCode, 
    couponCode, 
    discount,
    getSubtotal,
    getDiscountAmount,
    getTotal
  } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [couponInput, setCouponInput] = useState('');
  const [couponMsg, setCouponMsg] = useState({ type: '', text: '' });

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    setCouponMsg({ type: '', text: '' });
    const res = await applyCouponCode(couponInput.trim());
    if (res.success) {
      setCouponMsg({ type: 'success', text: res.message });
      setCouponInput('');
    } else {
      setCouponMsg({ type: 'error', text: res.message });
    }
  };

  const handleCheckoutClick = () => {
    if (!user) {
      // Prompt user to log in before checking out, redirecting back to checkout
      navigate('/login?redirect=checkout');
    } else {
      navigate('/checkout');
    }
  };

  // Shipping calculation
  const subtotal = getSubtotal();
  const shippingCost = subtotal > 500 || subtotal === 0 ? 0 : 49.00;
  const finalTotal = getTotal() + shippingCost;

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-6">
        <div className="h-16 w-16 bg-cream-200 dark:bg-espresso-900 rounded-full flex items-center justify-center mx-auto text-terracotta-500">
          <ShoppingBag className="h-8 w-8 stroke-[1.5]" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-espresso-800 dark:text-cream-100">
          Your Shopping Cart is Empty
        </h2>
        <p className="text-xs text-espresso-500 max-w-sm mx-auto">
          It looks like you haven't added any books to your bookshelf yet. Explore our curated genres and find your next cozy read.
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center space-x-2 bg-terracotta-500 hover:bg-terracotta-600 text-white font-semibold px-6 py-3 rounded-full text-sm shadow-md transition-all"
        >
          <span>Start Browsing Books</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 transition-colors duration-200">
      <h1 className="font-serif text-3xl font-bold text-espresso-800 dark:text-cream-50 mb-8">
        Your Bookshelf Basket
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          {cart.map((item) => {
            const bookId = item.book._id || item.book;
            return (
              <div
                key={bookId}
                className="bg-white dark:bg-espresso-950 p-4 rounded-2xl border border-cream-200 dark:border-espresso-900 shadow-pin flex items-center gap-4 relative animate-fade-in-up"
              >
                {/* Book Cover */}
                <div className="aspect-[3/4.2] w-16 sm:w-20 rounded-lg overflow-hidden border border-cream-200/50 flex-shrink-0">
                  <img
                    src={item.book.coverImage}
                    alt={item.book.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Metadata */}
                <div className="flex-1 min-w-0">
                  <span className="text-[9px] font-bold text-terracotta-500 uppercase tracking-widest">
                    {item.book.category}
                  </span>
                  <h3 className="font-serif font-bold text-sm sm:text-base text-espresso-800 dark:text-cream-100 truncate mt-0.5">
                    <Link to={`/books/${bookId}`} className="hover:text-terracotta-500">
                      {item.book.title}
                    </Link>
                  </h3>
                  <p className="text-xs text-espresso-500 dark:text-espresso-100/50">by {item.book.author}</p>
                  
                  {/* Quantity controls */}
                  <div className="flex items-center space-x-3 mt-3">
                    <div className="flex items-center border border-cream-200 dark:border-espresso-900 bg-cream-50 dark:bg-espresso-900 rounded-lg px-2 py-0.5">
                      <button
                        onClick={() => updateCartQuantity(bookId, item.quantity - 1)}
                        className="text-espresso-800 dark:text-cream-100 px-1 font-bold text-xs"
                      >
                        -
                      </button>
                      <span className="text-xs px-2.5 font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateCartQuantity(bookId, item.quantity + 1)}
                        className="text-espresso-800 dark:text-cream-100 px-1 font-bold text-xs"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(bookId)}
                      className="text-red-500 hover:text-red-600 transition-colors p-1.5"
                      title="Remove Item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Subtotal Item price */}
                <div className="text-right flex-shrink-0 self-start sm:self-center">
                  <span className="text-xs text-espresso-500 block mb-1">
                    ₹{item.book.price.toFixed(2)} each
                  </span>
                  <span className="font-bold text-espresso-800 dark:text-cream-50 text-sm sm:text-base">
                    ₹{(item.book.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Summary & Checkout Details */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Summary Card */}
          <div className="bg-white dark:bg-espresso-950 p-6 rounded-3xl border border-cream-200 dark:border-espresso-900 shadow-pin space-y-6">
            <h3 className="font-serif text-lg font-bold text-espresso-800 dark:text-cream-100 border-b border-cream-100 dark:border-espresso-900/60 pb-3">
              Order Summary
            </h3>

            {/* Calculations lines */}
            <div className="space-y-3.5 text-xs text-espresso-800 dark:text-cream-200">
              <div className="flex justify-between">
                <span>Subtotal ({cart.length} unique titles)</span>
                <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-terracotta-500 font-semibold">
                  <span className="flex items-center gap-1">
                    <Gift className="h-3.5 w-3.5" /> Coupon Code ({couponCode})
                  </span>
                  <span>-₹{getDiscountAmount().toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Shipping cost</span>
                {shippingCost === 0 ? (
                  <span className="text-sage-500 font-semibold uppercase">Free Shipping</span>
                ) : (
                  <span className="font-semibold">₹{shippingCost.toFixed(2)}</span>
                )}
              </div>

              {shippingCost > 0 && (
                <p className="text-[10px] text-espresso-500/80 leading-relaxed bg-cream-50 dark:bg-espresso-900 p-2.5 rounded-lg">
                  Add <span className="font-bold text-terracotta-500">₹{(500 - subtotal).toFixed(2)}</span> more to qualify for Free Shipping.
                </p>
              )}

              <div className="h-px bg-cream-100 dark:bg-espresso-900 my-2"></div>

              <div className="flex justify-between text-base font-bold text-espresso-800 dark:text-cream-50 pt-1">
                <span>Grand Total</span>
                <span>₹{finalTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Checkout CTA */}
            <button
              onClick={handleCheckoutClick}
              className="w-full bg-terracotta-500 hover:bg-terracotta-600 text-white font-semibold py-3.5 rounded-xl text-xs flex items-center justify-center space-x-2 shadow-md transition-all active:scale-[0.98]"
            >
              <span>Proceed to Secure Checkout</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {/* Coupon Input Form Card */}
          <div className="bg-white dark:bg-espresso-950 p-5 rounded-2xl border border-cream-200 dark:border-espresso-900 shadow-pin">
            <h3 className="font-serif font-bold text-sm text-espresso-800 dark:text-cream-100 flex items-center gap-1.5 mb-3">
              <Ticket className="h-4 w-4 text-terracotta-500" />
              Apply Discount Coupon
            </h3>
            
            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. NEST20, BOOKWORM10"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                className="flex-1 bg-cream-50 dark:bg-espresso-900 border border-cream-300 dark:border-espresso-800 text-espresso-800 dark:text-cream-50 rounded-xl px-3 py-2 text-xs focus:outline-none"
              />
              <button
                type="submit"
                className="bg-espresso-800 hover:bg-espresso-950 dark:bg-cream-200 dark:hover:bg-white text-cream-100 dark:text-espresso-800 font-semibold px-4.5 rounded-xl text-xs transition-colors"
              >
                Apply
              </button>
            </form>

            {/* Messages */}
            {couponMsg.text && (
              <div className={`text-[10px] font-semibold mt-3 p-2.5 rounded-lg ${
                couponMsg.type === 'success' 
                  ? 'bg-sage-50 text-sage-600 border border-sage-500/20' 
                  : 'bg-red-50 text-red-600 border border-red-500/20'
              }`}>
                {couponMsg.text}
              </div>
            )}

            <div className="mt-4 pt-3 border-t border-cream-100 dark:border-espresso-900/40 text-[10px] text-espresso-500/70 space-y-1">
              <p className="font-semibold text-espresso-800 dark:text-cream-200">Available Active Coupons:</p>
              <p>• <span className="font-bold">BOOKWORM10</span>: 10% Off all orders</p>
              <p>• <span className="font-bold">NEST20</span>: 20% Off all orders</p>
              <p>• <span className="font-bold">READMORE30</span>: 30% Off all orders</p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default Cart;
