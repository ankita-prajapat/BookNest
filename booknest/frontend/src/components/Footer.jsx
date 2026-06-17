import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Send, Github, Twitter, Instagram } from 'lucide-react';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  const categories = [
    'Novels', 'Poetry', 'Self-Help', 'Fiction', 'Romance',
    'Mystery & Thriller', 'Fantasy', 'Biography', 'Academic Books', "Children's Books"
  ];

  return (
    <footer className="bg-espresso-950 text-espresso-100 border-t border-espresso-900 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Brand & Slogan */}
          <div className="flex flex-col space-y-4">
            <Link to="/" className="flex items-center space-x-2 text-cream-50">
              <BookOpen className="h-6 w-6 text-terracotta-500 stroke-[2]" />
              <span className="font-serif text-2xl font-bold tracking-tight">
                Book<span className="text-terracotta-500">Nest</span>
              </span>
            </Link>
            <p className="font-serif italic text-cream-300/80 text-sm max-w-xs">
              "Every Book Opens a New World"
            </p>
            <p className="text-xs text-cream-300/60 leading-relaxed max-w-xs">
              BookNest is a premium digital bookstore sanctuary created for bibliophiles, thinkers, and explorers. We curate and deliver exceptional reading experiences right to your nest.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="hover:text-terracotta-500 transition-colors text-cream-300/70"><Twitter className="h-4 w-4" /></a>
              <a href="#" className="hover:text-terracotta-500 transition-colors text-cream-300/70"><Instagram className="h-4 w-4" /></a>
              <a href="#" className="hover:text-terracotta-500 transition-colors text-cream-300/70"><Github className="h-4 w-4" /></a>
            </div>
          </div>

          {/* Categories Grid */}
          <div>
            <h3 className="text-cream-100 font-semibold text-sm tracking-wider uppercase mb-4">Book Genres</h3>
            <ul className="grid grid-cols-2 gap-2 text-sm text-cream-300/70">
              {categories.slice(0, 8).map((cat) => (
                <li key={cat}>
                  <Link to={`/shop?category=${encodeURIComponent(cat)}`} className="hover:text-terracotta-500 transition-colors">
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-cream-100 font-semibold text-sm tracking-wider uppercase mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-cream-300/70">
              <li>
                <Link to="/shop" className="hover:text-terracotta-500 transition-colors">Browse Bookstore</Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-terracotta-500 transition-colors">Shopping Cart</Link>
              </li>
              <li>
                <Link to="/wishlist" className="hover:text-terracotta-500 transition-colors">My Wishlist</Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-terracotta-500 transition-colors">User Dashboard</Link>
              </li>
            </ul>
          </div>

          {/* Newsletter subscription */}
          <div>
            <h3 className="text-cream-100 font-semibold text-sm tracking-wider uppercase mb-4">Newsletter</h3>
            <p className="text-xs text-cream-300/60 leading-relaxed mb-4">
              Subscribe to get notified about new arrivals, featured authors, and exclusive coupon codes.
            </p>
            {subscribed ? (
              <div className="bg-sage-600/20 border border-sage-500/30 text-sage-400 text-xs rounded-xl p-3 text-center animate-fade-in-up">
                Thanks for subscribing to our nest!
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="relative flex">
                <input
                  type="email"
                  required
                  placeholder="Enter your email address..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-espresso-900 border border-espresso-800 text-cream-100 placeholder-cream-300/30 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-terracotta-500 focus:border-terracotta-500 transition-all"
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1.5 bottom-1.5 bg-terracotta-500 hover:bg-terracotta-600 text-white px-3.5 rounded-lg flex items-center justify-center transition-colors"
                >
                  <Send className="h-3 w-3" />
                </button>
              </form>
            )}
          </div>
        </div>

        <hr className="border-espresso-900 my-8" />

        <div className="flex flex-col sm:flex-row justify-between items-center text-xs text-cream-300/40">
          <p>&copy; {new Date().getFullYear()} BookNest Inc. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <a href="#" className="hover:underline">Privacy Policy</a>
            <a href="#" className="hover:underline">Terms of Service</a>
            <a href="#" className="hover:underline">Status</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
