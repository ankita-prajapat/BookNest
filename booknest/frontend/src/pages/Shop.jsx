import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import BookCard from '../components/BookCard';
import { 
  Filter, 
  SlidersHorizontal, 
  Search, 
  ChevronLeft, 
  ChevronRight,
  RotateCcw
} from 'lucide-react';

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // State from URL Search Params
  const categoryParam = searchParams.get('category') || 'All';
  const searchParam = searchParams.get('search') || '';
  const sortParam = searchParams.get('sort') || 'newest';
  const pageParam = Number(searchParams.get('page')) || 1;
  const ratingParam = searchParams.get('rating') || '';
  const minPriceParam = searchParams.get('minPrice') || '';
  const maxPriceParam = searchParams.get('maxPrice') || '';

  // Local States
  const [books, setBooks] = useState([]);
  const [pages, setPages] = useState(1);
  const [totalBooks, setTotalBooks] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Sync inputs
  const [searchInput, setSearchInput] = useState(searchParam);
  const [minPrice, setMinPrice] = useState(minPriceParam);
  const [maxPrice, setMaxPrice] = useState(maxPriceParam);

  const categories = [
    'All',
    'Novels',
    'Romance',
    'Poetry',
    'Self Help',
    'Personal Development',
    'Business',
    'Finance',
    'Biographies',
    'Sports Personalities',
    'Motivation',
    'Fiction',
    'Mystery & Thriller',
    'Fantasy',
    'Young Adult'
  ];

  // Fetch books from server when search query, filter criteria or page changes
  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (searchParam) queryParams.set('search', searchParam);
        if (categoryParam && categoryParam !== 'All') queryParams.set('category', categoryParam);
        if (sortParam) queryParams.set('sort', sortParam);
        if (pageParam) queryParams.set('page', pageParam.toString());
        if (ratingParam) queryParams.set('rating', ratingParam);
        if (minPriceParam) queryParams.set('minPrice', minPriceParam);
        if (maxPriceParam) queryParams.set('maxPrice', maxPriceParam);

        const response = await fetch(`/api/books?${queryParams.toString()}`);
        if (response.ok) {
          const data = await response.json();
          setBooks(data.books);
          setPages(data.pages);
          setTotalBooks(data.totalBooks);
        }
      } catch (error) {
        console.error('Error fetching catalog books:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBooks();
  }, [categoryParam, searchParam, sortParam, pageParam, ratingParam, minPriceParam, maxPriceParam]);

  // Sync inputs with URL changes
  useEffect(() => {
    setSearchInput(searchParam);
    setMinPrice(minPriceParam);
    setMaxPrice(maxPriceParam);
  }, [searchParam, minPriceParam, maxPriceParam]);

  // Helpers to update URL search parameters
  const updateParam = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', '1'); // Reset to page 1 on filter change
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateParam('search', searchInput);
  };

  const handlePriceApply = (e) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', '1');
    if (minPrice) newParams.set('minPrice', minPrice);
    else newParams.delete('minPrice');
    
    if (maxPrice) newParams.set('maxPrice', maxPrice);
    else newParams.delete('maxPrice');

    setSearchParams(newParams);
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pages) return;
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', newPage.toString());
    setSearchParams(newParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetAllFilters = () => {
    setSearchParams({});
    setSearchInput('');
    setMinPrice('');
    setMaxPrice('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 transition-colors duration-200">
      
      {/* Header bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-cream-200 dark:border-espresso-900 pb-5">
        <div>
          <h1 className="font-serif text-3xl font-bold text-espresso-800 dark:text-cream-50">
            {categoryParam === 'All' ? 'The Nest Bookstore' : categoryParam}
          </h1>
          <p className="text-xs text-espresso-500 dark:text-cream-300 font-medium mt-1">
            Showing {totalBooks} {totalBooks === 1 ? 'book' : 'books'}
          </p>
        </div>

        {/* Sort & Mobile Filters button */}
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <button
            onClick={() => setShowMobileFilters(true)}
            className="flex lg:hidden items-center justify-center space-x-1.5 flex-1 bg-white dark:bg-espresso-950 border border-cream-200 dark:border-espresso-900 px-4 py-2 rounded-xl text-sm font-semibold text-espresso-800 dark:text-cream-100"
          >
            <Filter className="h-4 w-4 text-terracotta-500" />
            <span>Filters</span>
          </button>

          <div className="flex-1 md:flex-initial flex items-center space-x-2">
            <span className="text-xs font-semibold text-espresso-500 whitespace-nowrap hidden sm:inline">Sort By:</span>
            <select
              value={sortParam}
              onChange={(e) => updateParam('sort', e.target.value)}
              className="bg-white dark:bg-espresso-950 border border-cream-200 dark:border-espresso-900 rounded-xl px-3 py-2 text-sm text-espresso-800 dark:text-cream-50 focus:outline-none focus:ring-1 focus:ring-terracotta-500"
            >
              <option value="newest">Newest Releases</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* ==========================================
            DESKTOP SIDEBAR FILTERS
            ========================================== */}
        <aside className="hidden lg:block space-y-7">
          
          {/* Active Search */}
          <div className="bg-white dark:bg-espresso-950 p-5 rounded-2xl border border-cream-200 dark:border-espresso-900 shadow-pin">
            <h3 className="font-serif font-bold text-base text-espresso-800 dark:text-cream-100 mb-3">Search Catalog</h3>
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Find title/author..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full bg-cream-50 dark:bg-espresso-900 border border-cream-300 dark:border-espresso-800 text-espresso-800 dark:text-cream-50 rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-terracotta-500"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-espresso-500" />
            </form>
          </div>

          {/* Categories list */}
          <div className="bg-white dark:bg-espresso-950 p-5 rounded-2xl border border-cream-200 dark:border-espresso-900 shadow-pin">
            <h3 className="font-serif font-bold text-base text-espresso-800 dark:text-cream-100 mb-3">Book Genres</h3>
            <div className="flex flex-col space-y-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => updateParam('category', cat)}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${
                    categoryParam === cat
                      ? 'bg-terracotta-500 text-white font-semibold'
                      : 'text-espresso-800 dark:text-cream-300 hover:bg-cream-200 dark:hover:bg-espresso-900'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="bg-white dark:bg-espresso-950 p-5 rounded-2xl border border-cream-200 dark:border-espresso-900 shadow-pin">
            <h3 className="font-serif font-bold text-base text-espresso-800 dark:text-cream-100 mb-3">Price Range ($)</h3>
            <form onSubmit={handlePriceApply} className="space-y-3">
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full bg-cream-50 dark:bg-espresso-900 border border-cream-300 dark:border-espresso-800 text-espresso-800 dark:text-cream-50 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-terracotta-500"
                />
                <span className="text-espresso-500 dark:text-cream-300 text-xs">to</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full bg-cream-50 dark:bg-espresso-900 border border-cream-300 dark:border-espresso-800 text-espresso-800 dark:text-cream-50 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-terracotta-500"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-espresso-800 hover:bg-espresso-950 dark:bg-cream-200 dark:hover:bg-white text-cream-100 dark:text-espresso-800 py-1.5 rounded-lg text-xs font-semibold transition-colors"
              >
                Apply Price
              </button>
            </form>
          </div>

          {/* Rating filter */}
          <div className="bg-white dark:bg-espresso-950 p-5 rounded-2xl border border-cream-200 dark:border-espresso-900 shadow-pin">
            <h3 className="font-serif font-bold text-base text-espresso-800 dark:text-cream-100 mb-3">Customer Rating</h3>
            <div className="flex flex-col space-y-2">
              {[4, 3, 2].map((num) => (
                <button
                  key={num}
                  onClick={() => updateParam('rating', num.toString())}
                  className={`flex items-center space-x-2 text-sm text-left hover:text-terracotta-500 transition-colors ${
                    ratingParam === num.toString() ? 'text-terracotta-500 font-bold' : 'text-espresso-800 dark:text-cream-300'
                  }`}
                >
                  <span className="font-semibold">{num}+ Stars</span>
                </button>
              ))}
            </div>
          </div>

          {/* Reset Filters button */}
          <button
            onClick={resetAllFilters}
            className="w-full flex items-center justify-center space-x-1.5 border border-cream-300 dark:border-espresso-900 text-espresso-800 dark:text-cream-200 py-2.5 rounded-xl text-xs font-semibold hover:bg-cream-200 dark:hover:bg-espresso-900 transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset All Filters</span>
          </button>

        </aside>

        {/* ==========================================
            BOOKS DISPLAY GRID
            ========================================== */}
        <main className="lg:col-span-3 space-y-10">
          
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 animate-pulse">
              {[1, 2, 3, 6, 7, 8].map(n => (
                <div key={n} className="h-80 bg-cream-200 dark:bg-espresso-900 rounded-2xl"></div>
              ))}
            </div>
          ) : books.length > 0 ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                {books.map(book => (
                  <BookCard key={book._id} book={book} />
                ))}
              </div>

              {/* Pagination controls */}
              {pages > 1 && (
                <div className="flex items-center justify-center space-x-3 pt-6 border-t border-cream-200 dark:border-espresso-900">
                  <button
                    onClick={() => handlePageChange(pageParam - 1)}
                    disabled={pageParam === 1}
                    className="p-2.5 rounded-full border border-cream-200 dark:border-espresso-900 bg-white dark:bg-espresso-950 text-espresso-800 dark:text-cream-50 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-cream-200 dark:hover:bg-espresso-900 transition-all"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>

                  <span className="text-xs font-semibold text-espresso-800 dark:text-cream-200">
                    Page {pageParam} of {pages}
                  </span>

                  <button
                    onClick={() => handlePageChange(pageParam + 1)}
                    disabled={pageParam === pages}
                    className="p-2.5 rounded-full border border-cream-200 dark:border-espresso-900 bg-white dark:bg-espresso-950 text-espresso-800 dark:text-cream-50 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-cream-200 dark:hover:bg-espresso-900 transition-all"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20 bg-white dark:bg-espresso-950/40 rounded-2xl border border-cream-200 dark:border-espresso-900">
              <RotateCcw className="h-10 w-10 text-terracotta-500 mx-auto mb-4" />
              <h3 className="font-serif font-bold text-lg text-espresso-800 dark:text-cream-100">No Books Found</h3>
              <p className="text-xs text-espresso-500 dark:text-cream-300 mt-1.5 max-w-sm mx-auto">
                We couldn't find any books matching your specific filters. Try expanding your search queries or resetting filters.
              </p>
              <button
                onClick={resetAllFilters}
                className="mt-5 bg-terracotta-500 hover:bg-terracotta-600 text-white font-semibold text-xs px-5 py-2 rounded-full transition-colors"
              >
                Clear All Search Criteria
              </button>
            </div>
          )}

        </main>
      </div>

      {/* ==========================================
          MOBILE FILTERS OVERLAY DRAWER
          ========================================== */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
          {/* Backdrop overlay */}
          <div
            onClick={() => setShowMobileFilters(false)}
            className="absolute inset-0 bg-espresso-950/40 backdrop-blur-sm"
          ></div>
          
          {/* Drawer content */}
          <div className="relative w-full max-w-xs bg-cream-100 dark:bg-espresso-950 h-full p-6 flex flex-col justify-between shadow-2xl overflow-y-auto">
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-cream-200 dark:border-espresso-900 pb-3">
                <h2 className="font-serif text-lg font-bold text-espresso-800 dark:text-cream-50">Filter Catalog</h2>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="text-xs font-semibold text-espresso-500 dark:text-cream-300 hover:text-terracotta-500"
                >
                  Close
                </button>
              </div>

              {/* Mobile Search */}
              <form onSubmit={(e) => { e.preventDefault(); updateParam('search', searchInput); setShowMobileFilters(false); }} className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full bg-cream-50 dark:bg-espresso-900 border border-cream-300 dark:border-espresso-800 text-espresso-800 dark:text-cream-50 rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none"
                />
                <Search className="absolute left-3 top-2.5 h-4.5 w-4.5 text-espresso-500" />
              </form>

              {/* Mobile Genres */}
              <div>
                <h3 className="font-serif font-bold text-sm text-espresso-800 dark:text-cream-100 mb-2.5">Genres</h3>
                <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto pr-1">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => { updateParam('category', cat); setShowMobileFilters(false); }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        categoryParam === cat
                          ? 'bg-terracotta-500 text-white font-semibold'
                          : 'bg-white dark:bg-espresso-900 text-espresso-800 dark:text-cream-300 border border-cream-200 dark:border-espresso-900'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile price */}
              <div>
                <h3 className="font-serif font-bold text-sm text-espresso-800 dark:text-cream-100 mb-2.5">Price Range ($)</h3>
                <form onSubmit={(e) => { handlePriceApply(e); setShowMobileFilters(false); }} className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full bg-cream-50 dark:bg-espresso-900 border border-cream-300 dark:border-espresso-800 text-espresso-800 dark:text-cream-50 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full bg-cream-50 dark:bg-espresso-900 border border-cream-300 dark:border-espresso-800 text-espresso-800 dark:text-cream-50 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none"
                  />
                  <button type="submit" className="bg-espresso-800 dark:bg-cream-200 text-cream-100 dark:text-espresso-800 px-3 rounded-lg text-xs font-semibold">Apply</button>
                </form>
              </div>

              {/* Mobile ratings */}
              <div>
                <h3 className="font-serif font-bold text-sm text-espresso-800 dark:text-cream-100 mb-2">Customer Rating</h3>
                <div className="flex gap-2">
                  {[4, 3, 2].map((num) => (
                    <button
                      key={num}
                      onClick={() => { updateParam('rating', num.toString()); setShowMobileFilters(false); }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                        ratingParam === num.toString() ? 'bg-terracotta-500 text-white' : 'bg-white dark:bg-espresso-900 text-espresso-800 dark:text-cream-300'
                      }`}
                    >
                      {num}+ Stars
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => { resetAllFilters(); setShowMobileFilters(false); }}
              className="w-full mt-6 bg-red-500 hover:bg-red-600 text-white py-2 rounded-xl text-xs font-semibold transition-colors"
            >
              Reset Filters
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default Shop;
