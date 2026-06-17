import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { user, token } = useAuth();
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0); // in percent
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  // Load cart and wishlist from DB if logged in, otherwise from localStorage
  useEffect(() => {
    if (user && token) {
      if (user.cart) {
        setCart(user.cart.map(item => ({
          book: item.book,
          quantity: item.quantity
        })));
      }
      if (user.wishlist) {
        setWishlist(user.wishlist);
      }
      if (user.recentlyViewed) {
        setRecentlyViewed(user.recentlyViewed);
      }
    } else {
      const localCart = localStorage.getItem('cart');
      const localWishlist = localStorage.getItem('wishlist');
      const localViewed = localStorage.getItem('recentlyViewed');
      
      if (localCart) setCart(JSON.parse(localCart));
      if (localWishlist) setWishlist(JSON.parse(localWishlist));
      if (localViewed) setRecentlyViewed(JSON.parse(localViewed));
    }
  }, [user, token]);

  // Save cart to localStorage/DB on update
  useEffect(() => {
    if (!user) {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart, user]);

  // Save wishlist to localStorage/DB on update
  useEffect(() => {
    if (!user) {
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
    }
  }, [wishlist, user]);

  // Sync Cart with Server DB
  const syncCartWithDB = async (updatedCart) => {
    if (!token) return;
    try {
      const cartItems = updatedCart.map(item => ({
        bookId: item.book._id || item.book,
        quantity: item.quantity
      }));
      await fetch('/api/books/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ cartItems })
      });
    } catch (error) {
      console.error('Error syncing cart with DB:', error);
    }
  };

  // Sync Wishlist with Server DB
  const syncWishlistWithDB = async (bookId) => {
    if (!token) return;
    try {
      await fetch('/api/books/wishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ bookId })
      });
    } catch (error) {
      console.error('Error syncing wishlist with DB:', error);
    }
  };

  const addToCart = (book, quantity = 1) => {
    let updatedCart = [...cart];
    const existingIndex = cart.findIndex(item => item.book._id === book._id || item.book === book._id);

    if (existingIndex > -1) {
      updatedCart[existingIndex].quantity += quantity;
    } else {
      updatedCart.push({ book, quantity });
    }

    setCart(updatedCart);
    if (user) {
      syncCartWithDB(updatedCart);
    }
  };

  const removeFromCart = (bookId) => {
    const updatedCart = cart.filter(item => item.book._id !== bookId && item.book !== bookId);
    setCart(updatedCart);
    if (user) {
      syncCartWithDB(updatedCart);
    }
  };

  const updateCartQuantity = (bookId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(bookId);
      return;
    }
    const updatedCart = cart.map(item => {
      const id = item.book._id || item.book;
      if (id === bookId) {
        return { ...item, quantity };
      }
      return item;
    });
    setCart(updatedCart);
    if (user) {
      syncCartWithDB(updatedCart);
    }
  };

  const clearCart = () => {
    setCart([]);
    setDiscount(0);
    setCouponCode('');
    if (user) {
      syncCartWithDB([]);
    }
  };

  const toggleWishlist = (book) => {
    const bookId = book._id || book;
    let isAlreadyIn = wishlist.some(item => item._id === bookId || item === bookId);
    let updatedWishlist = [];

    if (isAlreadyIn) {
      updatedWishlist = wishlist.filter(item => (item._id || item) !== bookId);
    } else {
      updatedWishlist = [...wishlist, book];
    }

    setWishlist(updatedWishlist);
    if (user) {
      syncWishlistWithDB(bookId);
    }
  };

  const applyCouponCode = async (code) => {
    if (!token) {
      // Offline mock discount validation for guest users
      const mockCoupons = { 'BOOKWORM10': 10, 'NEST20': 20, 'READMORE30': 30 };
      const disc = mockCoupons[code.toUpperCase()];
      if (disc !== undefined) {
        setDiscount(disc);
        setCouponCode(code.toUpperCase());
        return { success: true, message: `${disc}% discount applied successfully!` };
      }
      return { success: false, message: 'Invalid coupon code' };
    }

    try {
      const response = await fetch('/api/orders/coupon', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ code })
      });
      const data = await response.json();

      if (response.ok) {
        setDiscount(data.discount);
        setCouponCode(code.toUpperCase());
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.message || 'Invalid coupon code' };
      }
    } catch (error) {
      return { success: false, message: 'Error applying coupon' };
    }
  };

  const addRecentlyViewed = async (book) => {
    // Add locally
    let updatedViewed = recentlyViewed.filter(item => (item._id || item) !== book._id);
    updatedViewed.unshift(book);
    if (updatedViewed.length > 8) updatedViewed.pop();
    setRecentlyViewed(updatedViewed);

    if (!user) {
      localStorage.setItem('recentlyViewed', JSON.stringify(updatedViewed));
    } else if (token) {
      try {
        await fetch(`/api/books/${book._id}/view`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      } catch (error) {
        console.error('Error adding to recently viewed on server:', error);
      }
    }
  };

  // Calculations
  const getSubtotal = () => {
    return cart.reduce((acc, item) => acc + (item.book.price * item.quantity), 0);
  };

  const getDiscountAmount = () => {
    return (getSubtotal() * discount) / 100;
  };

  const getTotal = () => {
    return getSubtotal() - getDiscountAmount();
  };

  return (
    <CartContext.Provider value={{
      cart,
      wishlist,
      recentlyViewed,
      couponCode,
      discount,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      toggleWishlist,
      applyCouponCode,
      addRecentlyViewed,
      getSubtotal,
      getDiscountAmount,
      getTotal
    }}>
      {children}
    </CartContext.Provider>
  );
};
