import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, ShoppingBag, CreditCard, Loader2, ArrowLeft, CheckCircle2 } from 'lucide-react';

const Checkout = () => {
  const { cart, couponCode, discount, getSubtotal, getDiscountAmount, getTotal, clearCart } = useCart();
  const { token, user } = useAuth();
  const navigate = useNavigate();

  // Shipping form state
  const [shippingAddress, setShippingAddress] = useState({
    street: '',
    city: '',
    state: '',
    zip: '',
    country: 'India'
  });

  // Credit Card form state
  const [cardDetails, setCardDetails] = useState({
    name: '',
    number: '',
    expiry: '',
    cvv: ''
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [orderId, setOrderId] = useState('');

  // Protect page
  useEffect(() => {
    if (!token) {
      navigate('/login?redirect=checkout');
    } else if (cart.length === 0 && !isCompleted) {
      navigate('/cart');
    }
  }, [token, cart, navigate, isCompleted]);

  const handleAddressChange = (e) => {
    setShippingAddress({
      ...shippingAddress,
      [e.target.name]: e.target.value
    });
  };

  const handleCardChange = (e) => {
    let value = e.target.value;
    
    // Auto format card number spaces
    if (e.target.name === 'number') {
      value = value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim().substring(0, 19);
    }
    // Auto format expiry slash
    if (e.target.name === 'expiry') {
      value = value.replace(/\//g, '').replace(/(\d{2})/g, '$1/').trim().substring(0, 5);
      if (value.endsWith('/')) value = value.substring(0, 2);
    }
    // CVV max length 3
    if (e.target.name === 'cvv') {
      value = value.replace(/\D/g, '').substring(0, 3);
    }

    setCardDetails({
      ...cardDetails,
      [e.target.name]: value
    });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    // Basic Validations
    if (!shippingAddress.street || !shippingAddress.city || !shippingAddress.state || !shippingAddress.zip) {
      setErrorMsg('Please complete all shipping address fields.');
      return;
    }

    if (!cardDetails.name || cardDetails.number.length < 19 || cardDetails.expiry.length < 5 || cardDetails.cvv.length < 3) {
      setErrorMsg('Please provide valid credit card payment details.');
      return;
    }

    setIsProcessing(true);

    try {
      // Structure order items for backend
      const orderItems = cart.map(item => ({
        bookId: item.book._id || item.book,
        title: item.book.title,
        price: item.book.price,
        quantity: item.quantity
      }));

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          orderItems,
          shippingAddress,
          totalAmount: getTotal() + (getSubtotal() > 500 ? 0 : 49.00),
          couponCode,
          discountApplied: getDiscountAmount()
        })
      });

      const data = await response.json();

      if (response.ok) {
        setOrderId(data._id);
        setIsCompleted(true);
        clearCart();
      } else {
        setErrorMsg(data.message || 'There was a problem placing your order.');
      }
    } catch (error) {
      setErrorMsg('Server error placing your order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const subtotal = getSubtotal();
  const shippingCost = subtotal > 500 ? 0 : 49.00;
  const grandTotal = getTotal() + shippingCost;

  if (isCompleted) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-6 animate-fade-in-up">
        <div className="h-16 w-16 bg-sage-100 text-sage-500 rounded-full flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <h2 className="font-serif text-3xl font-bold text-espresso-800 dark:text-cream-50">
          Order Placed Successfully!
        </h2>
        <p className="text-xs text-espresso-500 dark:text-cream-300 max-w-sm mx-auto leading-relaxed">
          Thank you for shopping at BookNest! We have received your order and are preparing it for shipment. A receipt details list has been registered.
        </p>
        <div className="bg-white dark:bg-espresso-950 p-4 rounded-xl border border-cream-200 dark:border-espresso-900 text-left text-xs text-espresso-800 dark:text-cream-200 max-w-sm mx-auto space-y-2">
          <p><span className="font-bold text-espresso-500">Order ID:</span> {orderId}</p>
          <p><span className="font-bold text-espresso-500">Recipient:</span> {user?.name}</p>
          <p><span className="font-bold text-espresso-500">Delivery Status:</span> Processing</p>
          <p><span className="font-bold text-espresso-500">Amount Paid:</span> ₹{grandTotal.toFixed(2)}</p>
        </div>
        <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/profile"
            className="bg-espresso-800 hover:bg-espresso-950 dark:bg-cream-200 dark:hover:bg-white text-cream-100 dark:text-espresso-800 font-semibold px-5 py-2.5 rounded-full text-xs transition-colors"
          >
            Check Order History
          </Link>
          <Link
            to="/shop"
            className="border border-cream-300 dark:border-espresso-900 hover:bg-cream-200 dark:hover:bg-espresso-900 text-espresso-800 dark:text-cream-200 font-semibold px-5 py-2.5 rounded-full text-xs transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 transition-colors duration-200">
      
      {/* Back button */}
      <Link to="/cart" className="inline-flex items-center space-x-1 text-xs font-semibold text-espresso-500 hover:text-terracotta-500 mb-6 transition-colors">
        <ArrowLeft className="h-4 w-4" />
        <span>Return to Bookshelf</span>
      </Link>

      <h1 className="font-serif text-3xl font-bold text-espresso-800 dark:text-cream-50 mb-8">
        Checkout Sanctuary
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Input details */}
        <div className="lg:col-span-8 space-y-6">
          <form onSubmit={handlePlaceOrder} className="space-y-6">
            
            {/* Shipping Card */}
            <div className="bg-white dark:bg-espresso-950 p-6 rounded-2xl border border-cream-200 dark:border-espresso-900 shadow-pin space-y-4">
              <h3 className="font-serif text-lg font-bold text-espresso-800 dark:text-cream-100 border-b border-cream-100 dark:border-espresso-900/60 pb-3">
                1. Shipping Address
              </h3>

              <div className="space-y-3">
                <div>
                  <label className="block text-[10px] font-semibold uppercase text-espresso-500 dark:text-cream-300 mb-1">Street Address</label>
                  <input
                    type="text"
                    name="street"
                    required
                    placeholder="123 Cozy Lane Apt 4B"
                    value={shippingAddress.street}
                    onChange={handleAddressChange}
                    className="w-full bg-cream-50 dark:bg-espresso-900 border border-cream-300 dark:border-espresso-800 rounded-xl px-4 py-2.5 text-xs text-espresso-800 dark:text-cream-50 focus:outline-none focus:ring-1 focus:ring-terracotta-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-semibold uppercase text-espresso-500 dark:text-cream-300 mb-1">City</label>
                    <input
                      type="text"
                      name="city"
                      required
                      placeholder="Boston"
                      value={shippingAddress.city}
                      onChange={handleAddressChange}
                      className="w-full bg-cream-50 dark:bg-espresso-900 border border-cream-300 dark:border-espresso-800 rounded-xl px-4 py-2.5 text-xs text-espresso-800 dark:text-cream-50 focus:outline-none focus:ring-1 focus:ring-terracotta-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold uppercase text-espresso-500 dark:text-cream-300 mb-1">State / Province</label>
                    <input
                      type="text"
                      name="state"
                      required
                      placeholder="MA"
                      value={shippingAddress.state}
                      onChange={handleAddressChange}
                      className="w-full bg-cream-50 dark:bg-espresso-900 border border-cream-300 dark:border-espresso-800 rounded-xl px-4 py-2.5 text-xs text-espresso-800 dark:text-cream-50 focus:outline-none focus:ring-1 focus:ring-terracotta-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-semibold uppercase text-espresso-500 dark:text-cream-300 mb-1">Zip / Postal Code</label>
                    <input
                      type="text"
                      name="zip"
                      required
                      placeholder="02108"
                      value={shippingAddress.zip}
                      onChange={handleAddressChange}
                      className="w-full bg-cream-50 dark:bg-espresso-900 border border-cream-300 dark:border-espresso-800 rounded-xl px-4 py-2.5 text-xs text-espresso-800 dark:text-cream-50 focus:outline-none focus:ring-1 focus:ring-terracotta-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold uppercase text-espresso-500 dark:text-cream-300 mb-1">Country</label>
                    <input
                      type="text"
                      name="country"
                      required
                      placeholder="United States"
                      value={shippingAddress.country}
                      onChange={handleAddressChange}
                      className="w-full bg-cream-50 dark:bg-espresso-900 border border-cream-300 dark:border-espresso-800 rounded-xl px-4 py-2.5 text-xs text-espresso-800 dark:text-cream-50 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Details Card */}
            <div className="bg-white dark:bg-espresso-950 p-6 rounded-2xl border border-cream-200 dark:border-espresso-900 shadow-pin space-y-4">
              <div className="flex justify-between items-center border-b border-cream-100 dark:border-espresso-900/60 pb-3">
                <h3 className="font-serif text-lg font-bold text-espresso-800 dark:text-cream-100 flex items-center gap-1.5">
                  <CreditCard className="h-5 w-5 text-terracotta-500" />
                  2. Secure Card Payment
                </h3>
                <span className="flex items-center gap-1 text-[10px] text-sage-500 font-bold bg-sage-50 px-2.5 py-1 rounded-full border border-sage-500/10">
                  <ShieldCheck className="h-3.5 w-3.5" /> SSL Secured
                </span>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-[10px] font-semibold uppercase text-espresso-500 dark:text-cream-300 mb-1">Cardholder Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="Jane Austen"
                    value={cardDetails.name}
                    onChange={handleCardChange}
                    className="w-full bg-cream-50 dark:bg-espresso-900 border border-cream-300 dark:border-espresso-800 rounded-xl px-4 py-2.5 text-xs text-espresso-800 dark:text-cream-50 focus:outline-none focus:ring-1 focus:ring-terracotta-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold uppercase text-espresso-500 dark:text-cream-300 mb-1">Card Number</label>
                  <input
                    type="text"
                    name="number"
                    required
                    placeholder="4000 1234 5678 9010"
                    value={cardDetails.number}
                    onChange={handleCardChange}
                    className="w-full bg-cream-50 dark:bg-espresso-900 border border-cream-300 dark:border-espresso-800 rounded-xl px-4 py-2.5 text-xs text-espresso-800 dark:text-cream-50 focus:outline-none focus:ring-1 focus:ring-terracotta-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-semibold uppercase text-espresso-500 dark:text-cream-300 mb-1">Expiry Date (MM/YY)</label>
                    <input
                      type="text"
                      name="expiry"
                      required
                      placeholder="12/28"
                      value={cardDetails.expiry}
                      onChange={handleCardChange}
                      className="w-full bg-cream-50 dark:bg-espresso-900 border border-cream-300 dark:border-espresso-800 rounded-xl px-4 py-2.5 text-xs text-espresso-800 dark:text-cream-50 focus:outline-none focus:ring-1 focus:ring-terracotta-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold uppercase text-espresso-500 dark:text-cream-300 mb-1">CVV Security Code</label>
                    <input
                      type="password"
                      name="cvv"
                      required
                      placeholder="•••"
                      value={cardDetails.cvv}
                      onChange={handleCardChange}
                      className="w-full bg-cream-50 dark:bg-espresso-900 border border-cream-300 dark:border-espresso-800 rounded-xl px-4 py-2.5 text-xs text-espresso-800 dark:text-cream-50 focus:outline-none focus:ring-1 focus:ring-terracotta-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Error notifications */}
            {errorMsg && (
              <div className="bg-red-50 text-red-600 text-xs font-semibold p-3.5 border border-red-500/20 rounded-xl">
                {errorMsg}
              </div>
            )}

            {/* Submit Action */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full bg-terracotta-500 hover:bg-terracotta-600 text-white font-semibold py-4 rounded-xl flex items-center justify-center space-x-2 shadow-md transition-all disabled:opacity-50 disabled:cursor-wait active:scale-[0.99]"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Processing secure payment...</span>
                </>
              ) : (
                <span>Pay & Finalize BookNest Order (₹{grandTotal.toFixed(2)})</span>
              )}
            </button>
          </form>
        </div>

        {/* Right: Summary panel */}
        <div className="lg:col-span-4 bg-white dark:bg-espresso-950 p-6 rounded-2xl border border-cream-200 dark:border-espresso-900 shadow-pin space-y-6">
          <h3 className="font-serif text-lg font-bold text-espresso-800 dark:text-cream-100 border-b border-cream-100 dark:border-espresso-900/60 pb-3 flex items-center gap-1.5">
            <ShoppingBag className="h-5 w-5 text-terracotta-500" />
            Your Order Basket
          </h3>

          {/* List of items summary */}
          <div className="space-y-4 max-h-60 overflow-y-auto pr-1">
            {cart.map((item) => {
              const bookId = item.book._id || item.book;
              return (
                <div key={bookId} className="flex gap-3 text-xs">
                  <div className="aspect-[3/4.2] w-10 rounded border border-cream-100 flex-shrink-0 overflow-hidden">
                    <img src={item.book.coverImage} alt={item.book.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif font-bold truncate text-espresso-800 dark:text-cream-100">{item.book.title}</h4>
                    <p className="text-[10px] text-espresso-500 mt-0.5">Qty: {item.quantity}</p>
                  </div>
                  <span className="font-semibold text-espresso-800 dark:text-cream-50">₹{(item.book.price * item.quantity).toFixed(2)}</span>
                </div>
              );
            })}
          </div>

          <hr className="border-cream-100 dark:border-espresso-900" />

          {/* Calculations */}
          <div className="space-y-3.5 text-xs text-espresso-800 dark:text-cream-200">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
            </div>

            {discount > 0 && (
              <div className="flex justify-between text-terracotta-500 font-semibold">
                <span>Discount Applied ({couponCode})</span>
                <span>-₹{getDiscountAmount().toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span>Shipping</span>
              {shippingCost === 0 ? (
                <span className="text-sage-500 font-semibold uppercase">Free Shipping</span>
              ) : (
                <span className="font-semibold">₹{shippingCost.toFixed(2)}</span>
              )}
            </div>

            <div className="h-px bg-cream-100 dark:bg-espresso-900 my-1"></div>

            <div className="flex justify-between text-sm font-bold text-espresso-800 dark:text-cream-50">
              <span>Grand Total</span>
              <span>₹{grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default Checkout;
