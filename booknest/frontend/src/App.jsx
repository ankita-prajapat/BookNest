import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Layout
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Shop from './pages/Shop';
import BookDetails from './pages/BookDetails';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Checkout from './pages/Checkout';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import AuthorDetails from './pages/AuthorDetails';

import { Sun, Moon } from 'lucide-react';

function App() {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('theme') === 'dark'
  );

  // Sync dark mode class on mount and change
  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <div className="flex flex-col min-h-screen bg-cream-50 dark:bg-espresso-950 text-espresso-850 dark:text-espresso-100 transition-colors duration-200">
            {/* Header Navbar */}
            <Navbar />

            {/* Main Outlet */}
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/books/:id" element={<BookDetails />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/authors/:id" element={<AuthorDetails />} />
                
                {/* Fallback to Home */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>

            {/* Footer */}
            <Footer />

            {/* Cozy Floating Theme Toggle Switch */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="fixed bottom-6 right-6 z-40 p-3 bg-espresso-800 dark:bg-cream-100 text-cream-100 dark:text-espresso-800 rounded-full shadow-lg hover:scale-105 transition-all duration-200"
              title="Toggle Theme Mode"
            >
              {darkMode ? <Sun className="h-5 w-5 stroke-[2]" /> : <Moon className="h-5 w-5 stroke-[2]" />}
            </button>
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
