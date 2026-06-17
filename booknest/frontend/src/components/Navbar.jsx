import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { 
  BookOpen, 
  Heart, 
  ShoppingBag, 
  User, 
  LogOut, 
  Menu, 
  X, 
  Search,
  Settings
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cart, wishlist } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const getCartCount = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  };

  return (
    <nav className="sticky top-0 z-50 bg-cream-100/90 dark:bg-espresso-950/95 backdrop-blur-md border-b border-cream-200 dark:border-espresso-900 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center space-x-2 text-espresso-800 dark:text-cream-50">
              <BookOpen className="h-7 w-7 text-terracotta-500 stroke-[2]" />
              <span className="font-serif text-2xl font-bold tracking-tight">
                Book<span className="text-terracotta-500">Nest</span>
              </span>
            </Link>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                type="text"
                placeholder="Search books by title or author..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-cream-50 dark:bg-espresso-900 border border-cream-300 dark:border-espresso-800 text-espresso-800 dark:text-cream-50 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-terracotta-500 focus:border-terracotta-500 transition-all"
              />
              <Search className="absolute left-3.5 top-2.5 h-4.5 w-4.5 text-espresso-500 dark:text-espresso-100/50" />
            </form>
          </div>

          {/* Nav Links & Actions - Desktop */}
          <div className="hidden lg:flex items-center space-x-6">
            <Link to="/shop" className="text-sm font-medium text-espresso-800 dark:text-cream-200 hover:text-terracotta-500 dark:hover:text-terracotta-500 transition-colors">
              Browse Store
            </Link>
            
            {/* Wishlist Link */}
            <Link to="/wishlist" className="relative p-2 text-espresso-800 dark:text-cream-200 hover:text-terracotta-500 dark:hover:text-terracotta-500 transition-colors">
              <Heart className="h-5 w-5 stroke-[1.75]" />
              {wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-terracotta-500 text-white rounded-full text-[10px] w-4 h-4 flex items-center justify-center font-bold">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart Link */}
            <Link to="/cart" className="relative p-2 text-espresso-800 dark:text-cream-200 hover:text-terracotta-500 dark:hover:text-terracotta-500 transition-colors">
              <ShoppingBag className="h-5 w-5 stroke-[1.75]" />
              {getCartCount() > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-sage-500 text-white rounded-full text-[10px] w-4 h-4 flex items-center justify-center font-bold animate-pulse">
                  {getCartCount()}
                </span>
              )}
            </Link>

            <span className="h-5 w-px bg-cream-300 dark:bg-espresso-800"></span>

            {/* User Account Controls */}
            {user ? (
              <div className="flex items-center space-x-4">
                <Link to="/profile" className="flex items-center space-x-2 text-sm font-medium text-espresso-800 dark:text-cream-200 hover:text-terracotta-500 transition-colors">
                  <User className="h-4 w-4" />
                  <span className="max-w-[100px] truncate">{user.name.split(' ')[0]}</span>
                </Link>

                {user.role === 'admin' && (
                  <Link to="/admin" className="flex items-center space-x-1.5 bg-terracotta-500 text-white text-xs px-3 py-1.5 rounded-full hover:bg-terracotta-600 transition-colors font-medium">
                    <Settings className="h-3.5 w-3.5" />
                    <span>Admin Panel</span>
                  </Link>
                )}

                <button
                  onClick={logout}
                  className="p-2 text-espresso-800 dark:text-cream-200 hover:text-terracotta-500 dark:hover:text-terracotta-500 transition-colors"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5 stroke-[1.75]" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login" className="text-sm font-medium text-espresso-800 dark:text-cream-200 hover:text-terracotta-500 transition-colors">
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="bg-espresso-800 hover:bg-espresso-950 dark:bg-cream-200 dark:hover:bg-white text-cream-100 dark:text-espresso-800 text-sm font-medium px-4 py-2 rounded-full transition-all"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger icon */}
          <div className="flex lg:hidden items-center space-x-3">
            {/* Wishlist Link - Mobile shortcut */}
            <Link to="/wishlist" className="relative p-1.5 text-espresso-800 dark:text-cream-200 hover:text-terracotta-500">
              <Heart className="h-5 w-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-0 right-0 bg-terracotta-500 text-white rounded-full text-[9px] w-3.5 h-3.5 flex items-center justify-center font-bold">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart Link - Mobile shortcut */}
            <Link to="/cart" className="relative p-1.5 text-espresso-800 dark:text-cream-200 hover:text-terracotta-500">
              <ShoppingBag className="h-5 w-5" />
              {getCartCount() > 0 && (
                <span className="absolute top-0 right-0 bg-sage-500 text-white rounded-full text-[9px] w-3.5 h-3.5 flex items-center justify-center font-bold">
                  {getCartCount()}
                </span>
              )}
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-md text-espresso-800 dark:text-cream-100 hover:text-terracotta-500 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-cream-200 dark:border-espresso-950 bg-cream-100 dark:bg-espresso-950 px-4 pt-2 pb-6 space-y-3 shadow-lg">
          <form onSubmit={handleSearchSubmit} className="relative w-full mt-2">
            <input
              type="text"
              placeholder="Search books..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-cream-50 dark:bg-espresso-900 border border-cream-300 dark:border-espresso-800 text-espresso-800 dark:text-cream-50 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-terracotta-500 focus:border-terracotta-500"
            />
            <Search className="absolute left-3.5 top-2.5 h-4.5 w-4.5 text-espresso-500" />
          </form>

          <div className="flex flex-col space-y-3 pt-3">
            <Link
              to="/shop"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-medium text-espresso-800 dark:text-cream-200 hover:text-terracotta-500 px-2 py-1.5 rounded-md hover:bg-cream-200 dark:hover:bg-espresso-900"
            >
              Browse Store
            </Link>
            
            <Link
              to="/wishlist"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-medium text-espresso-800 dark:text-cream-200 hover:text-terracotta-500 px-2 py-1.5 rounded-md hover:bg-cream-200 dark:hover:bg-espresso-900"
            >
              Wishlist ({wishlist.length})
            </Link>

            <Link
              to="/cart"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-medium text-espresso-800 dark:text-cream-200 hover:text-terracotta-500 px-2 py-1.5 rounded-md hover:bg-cream-200 dark:hover:bg-espresso-900"
            >
              Shopping Cart ({getCartCount()})
            </Link>

            {user && user.role === 'admin' && (
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-medium text-terracotta-500 px-2 py-1.5 rounded-md hover:bg-cream-200 dark:hover:bg-espresso-900 flex items-center space-x-1.5"
              >
                <Settings className="h-4 w-4" />
                <span>Admin Dashboard</span>
              </Link>
            )}

            <hr className="border-cream-300 dark:border-espresso-900" />

            {user ? (
              <>
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-base font-medium text-espresso-800 dark:text-cream-200 px-2 py-1.5 rounded-md hover:bg-cream-200 dark:hover:bg-espresso-900"
                >
                  My Profile ({user.name})
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left text-base font-medium text-red-500 px-2 py-1.5 rounded-md hover:bg-cream-200 dark:hover:bg-espresso-900 flex items-center space-x-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Log out</span>
                </button>
              </>
            ) : (
              <div className="flex flex-col space-y-2 px-2 pt-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center font-medium text-espresso-800 dark:text-cream-200 hover:text-terracotta-500 py-2 border border-cream-300 dark:border-espresso-800 rounded-full"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center font-medium text-cream-100 bg-espresso-800 dark:text-espresso-800 dark:bg-cream-200 py-2 rounded-full"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
