import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import BookCard from '../components/BookCard';
import { 
  Search, 
  ArrowRight, 
  BookOpen, 
  Sparkles, 
  Star, 
  ChevronLeft, 
  ChevronRight, 
  Flame, 
  Layers
} from 'lucide-react';

const Home = () => {
  const [books, setBooks] = useState([]);
  const [featuredAuthors, setFeaturedAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHomepageData = async () => {
      try {
        const [booksRes, authorsRes] = await Promise.all([
          fetch('/api/books?limit=100'),
          fetch('/api/authors?isFeatured=true')
        ]);
        
        if (booksRes.ok) {
          const data = await booksRes.json();
          setBooks(data.books || []);
        }

        if (authorsRes.ok) {
          const data = await authorsRes.json();
          setFeaturedAuthors(data || []);
        }
      } catch (error) {
        console.error('Error fetching homepage data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchHomepageData();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Group books for different homepage sections
  const bestSellers = books.filter(b => b.isBestseller).slice(0, 8);
  const newArrivals = books.filter(b => b.isNewArrival || b.createdAt).slice(0, 8);
  const featuredAuthorBooks = books.filter(b => b.author === 'James Clear').slice(0, 4);
  const featuredAuthorName = 'James Clear';

  const categories = [
    { name: 'Novels', count: '40+ Books', color: 'bg-orange-50 dark:bg-orange-950/20 text-orange-700' },
    { name: 'Romance', count: '35+ Books', color: 'bg-rose-50 dark:bg-rose-950/20 text-rose-700' },
    { name: 'Poetry', count: '25+ Books', color: 'bg-pink-50 dark:bg-pink-950/20 text-pink-700' },
    { name: 'Self Help', count: '45+ Books', color: 'bg-green-50 dark:bg-green-950/20 text-green-700' },
    { name: 'Personal Development', count: '30+ Books', color: 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700' },
    { name: 'Business', count: '28+ Books', color: 'bg-indigo-50 dark:bg-indigo-950/20 text-indigo-700' },
    { name: 'Finance', count: '32+ Books', color: 'bg-blue-50 dark:bg-blue-950/20 text-blue-700' },
    { name: 'Biographies', count: '20+ Books', color: 'bg-violet-50 dark:bg-violet-950/20 text-violet-700' },
    { name: 'Sports Personalities', count: '15+ Books', color: 'bg-amber-50 dark:bg-amber-950/20 text-amber-700' },
    { name: 'Motivation', count: '25+ Books', color: 'bg-yellow-50 dark:bg-yellow-950/20 text-yellow-700' },
    { name: 'Fiction', count: '50+ Books', color: 'bg-sky-50 dark:bg-sky-950/20 text-sky-700' },
    { name: 'Mystery & Thriller', count: '30+ Books', color: 'bg-purple-50 dark:bg-purple-950/20 text-purple-700' },
    { name: 'Fantasy', count: '40+ Books', color: 'bg-teal-50 dark:bg-teal-950/20 text-teal-700' },
    { name: 'Young Adult', count: '25+ Books', color: 'bg-fuchsia-50 dark:bg-fuchsia-950/20 text-fuchsia-700' }
  ];

  const testimonials = [
    {
      name: 'Sarah Jenkins',
      role: 'Avid Novel Reader',
      comment: 'BookNest completely changed how I buy books online. The design is absolutely gorgeous, and the curation is spot-on. It feels like stepping into a cozy indie bookshop in the countryside.',
      rating: 5,
      avatar: 'SJ'
    },
    {
      name: 'Prof. David Vance',
      role: 'Academician',
      comment: 'The user dashboard and academic section are extremely well-organized. I can find algorithm textbooks and reference guides in seconds. Safe checkout and instant confirmation.',
      rating: 5,
      avatar: 'DV'
    },
    {
      name: 'Maya Lin',
      role: 'Poetry Enthusiast',
      comment: 'I love the Pinterest-style book grids. The cover art is given full focus, which makes browsing and discovering new poetry collections a sheer visual joy.',
      rating: 5,
      avatar: 'ML'
    }
  ];

  return (
    <div className="space-y-16 pb-16 transition-colors duration-200">
      
      {/* 1. ELEGANT HERO SECTION */}
      <section className="relative bg-cream-200 dark:bg-espresso-950 overflow-hidden py-20 lg:py-28 transition-colors">
        <div className="absolute inset-0 opacity-40 dark:opacity-20 pointer-events-none">
          <div className="absolute -top-1/2 -left-1/4 w-[600px] h-[600px] rounded-full bg-terracotta-100 dark:bg-terracotta-900/10 blur-3xl"></div>
          <div className="absolute -bottom-1/2 -right-1/4 w-[600px] h-[600px] rounded-full bg-sage-100 dark:bg-sage-900/10 blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center space-y-8">
          <div className="inline-flex items-center space-x-1.5 bg-white/60 dark:bg-espresso-900/50 backdrop-blur-md border border-cream-300 dark:border-espresso-800 rounded-full px-4.5 py-1.5 shadow-sm text-xs font-semibold text-espresso-800 dark:text-cream-200 animate-fade-in-up">
            <Sparkles className="h-3.5 w-3.5 text-terracotta-500 fill-terracotta-500" />
            <span>Discover your next literary escape</span>
          </div>

          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-espresso-800 dark:text-cream-50 tracking-tight leading-[1.1] animate-fade-in-up delay-100">
            Every Book Opens <br className="hidden sm:inline" />
            <span className="text-terracotta-500 italic">a New World</span>
          </h1>

          <p className="text-base md:text-lg text-espresso-500 dark:text-cream-300 max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-200">
            Step inside our digital sanctuary. Browse through thousands of hand-picked titles across diverse genres, read reviews, and build your perfect cozy bookshelf.
          </p>

          {/* Hero Search Box */}
          <div className="max-w-xl mx-auto animate-fade-in-up delay-300">
            <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-2.5 p-1.5 bg-white dark:bg-espresso-900 rounded-2xl sm:rounded-full border border-cream-300 dark:border-espresso-800 shadow-md">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-3.5 h-5 w-5 text-espresso-500/60 dark:text-cream-300/40" />
                <input
                  type="text"
                  placeholder="Search by title, author, category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent border-0 pl-11 pr-4 py-3 text-sm text-espresso-800 dark:text-cream-50 focus:outline-none focus:ring-0"
                />
              </div>
              <button
                type="submit"
                className="bg-terracotta-500 hover:bg-terracotta-600 text-white font-semibold rounded-xl sm:rounded-full px-6 py-3 text-sm transition-all"
              >
                Search Nest
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* 2. CATEGORIES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-terracotta-500">Categories</span>
          <h2 className="font-serif text-3xl md:text-4xl font-semibold text-espresso-800 dark:text-cream-100">
            Explore Genres
          </h2>
          <div className="h-0.5 w-12 bg-terracotta-500 mx-auto mt-2"></div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat, idx) => (
            <Link
              key={idx}
              to={`/shop?category=${encodeURIComponent(cat.name)}`}
              className="group flex flex-col p-6 rounded-2xl border border-cream-200 dark:border-espresso-900 bg-white dark:bg-espresso-950/60 shadow-pin hover:shadow-pin-hover hover:-translate-y-1 transition-all duration-300 text-center"
            >
              <div className={`mx-auto h-12 w-12 rounded-full flex items-center justify-center mb-4 ${cat.color} group-hover:scale-110 transition-transform duration-300`}>
                <BookOpen className="h-5 w-5" />
              </div>
              <h3 className="font-serif font-semibold text-espresso-800 dark:text-cream-100 text-base leading-tight group-hover:text-terracotta-500 transition-colors">
                {cat.name}
              </h3>
              <p className="text-xs text-espresso-500 dark:text-espresso-100/40 mt-1">
                {cat.count}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. BEST SELLERS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8 border-b border-cream-200 dark:border-espresso-900 pb-4">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-widest text-terracotta-500 flex items-center gap-1">
              <Flame className="h-3.5 w-3.5 fill-current" />
              Popular Right Now
            </span>
            <h2 className="font-serif text-3xl font-semibold text-espresso-800 dark:text-cream-100">
              Reader Bestsellers
            </h2>
          </div>
          <Link to="/shop?sort=rating" className="text-sm font-semibold text-terracotta-500 hover:text-terracotta-600 flex items-center space-x-1 hover:underline">
            <span>View All</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-pulse">
            {[1, 2, 3, 4].map(n => (
              <div key={n} className="h-80 bg-cream-200 dark:bg-espresso-900 rounded-2xl"></div>
            ))}
          </div>
        ) : bestSellers.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {bestSellers.map(book => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-espresso-500">
            No bestsellers available yet. Run database seeding.
          </div>
        )}
      </section>

      {/* 4. FEATURED AUTHOR SECTON */}
      <section className="bg-cream-200 dark:bg-espresso-950/70 border-y border-cream-300 dark:border-espresso-900/50 py-16 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Author Intro */}
            <div className="lg:col-span-4 space-y-5">
              <span className="text-xs font-bold uppercase tracking-widest text-terracotta-500">Featured Author</span>
              <h2 className="font-serif text-4xl font-bold text-espresso-800 dark:text-cream-100">
                {featuredAuthorName}
              </h2>
              <p className="text-sm text-espresso-500 dark:text-cream-300 leading-relaxed">
                Known for his deep understanding of habits and behavioral science, James Clear publishes literature that shapes how millions build daily systems and optimize performance.
              </p>
              <div className="pt-2">
                <Link
                  to={`/shop?search=${encodeURIComponent(featuredAuthorName)}`}
                  className="inline-flex items-center space-x-2 bg-espresso-800 hover:bg-espresso-950 dark:bg-cream-200 dark:hover:bg-white text-cream-100 dark:text-espresso-800 text-sm font-semibold px-5 py-2.5 rounded-full transition-all"
                >
                  <span>Explore Author Books</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Author Books */}
            <div className="lg:col-span-8">
              {loading ? (
                <div className="h-60 bg-cream-100 animate-pulse rounded-2xl"></div>
              ) : featuredAuthorBooks.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {featuredAuthorBooks.slice(0, 3).map(book => (
                    <BookCard key={book._id} book={book} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 bg-white dark:bg-espresso-900/30 rounded-2xl text-espresso-500">
                  Author's works are currently loading.
                </div>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* FEATURED PERSONALITIES SECTION */}
      {featuredAuthors && featuredAuthors.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex justify-between items-end mb-4 border-b border-cream-200 dark:border-espresso-900 pb-4">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-widest text-terracotta-500 flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5 fill-current animate-pulse animate-duration-1000" />
                Featured Personalities
              </span>
              <h2 className="font-serif text-3xl font-semibold text-espresso-800 dark:text-cream-100">
                Meet the Authors & Icons
              </h2>
            </div>
            <span className="text-xs font-semibold text-espresso-500 dark:text-cream-300">
              Leading Minds & Innovators
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {featuredAuthors.slice(0, 4).map((author) => (
              <div 
                key={author._id}
                className="group relative bg-white dark:bg-espresso-950 rounded-2xl p-4 border border-cream-200 dark:border-espresso-900 shadow-pin hover:shadow-pin-hover hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Author portrait image */}
                  <div className="aspect-square w-full rounded-xl overflow-hidden bg-cream-50 dark:bg-espresso-900 border border-cream-200/50 mb-4">
                    <img
                      src={author.photo}
                      alt={author.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  
                  {/* Category/Field Badge */}
                  <span className="text-[9px] font-bold text-terracotta-500 uppercase tracking-widest block mb-1">
                    {author.field}
                  </span>

                  {/* Name */}
                  <h3 className="font-serif font-bold text-base text-espresso-800 dark:text-cream-50 group-hover:text-terracotta-500 transition-colors">
                    {author.name}
                  </h3>

                  {/* Biography snippet */}
                  <p className="text-xs text-espresso-500 dark:text-espresso-100/60 mt-1 line-clamp-2 leading-relaxed">
                    {author.bio}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-cream-100 dark:border-espresso-900/40">
                  <Link
                    to={`/authors/${author._id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-terracotta-500 hover:text-terracotta-600 group/link"
                  >
                    <span>View Profile</span>
                    <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover/link:translate-x-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 5. NEW ARRIVALS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8 border-b border-cream-200 dark:border-espresso-900 pb-4">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-widest text-terracotta-500 flex items-center gap-1">
              <Layers className="h-3.5 w-3.5 text-terracotta-500" />
              Fresh Off The Press
            </span>
            <h2 className="font-serif text-3xl font-semibold text-espresso-800 dark:text-cream-100">
              New Arrivals
            </h2>
          </div>
          <Link to="/shop?sort=newest" className="text-sm font-semibold text-terracotta-500 hover:text-terracotta-600 flex items-center space-x-1 hover:underline">
            <span>View All</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-pulse">
            {[1, 2, 3, 4].map(n => (
              <div key={n} className="h-80 bg-cream-200 dark:bg-espresso-900 rounded-2xl"></div>
            ))}
          </div>
        ) : newArrivals.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {newArrivals.map(book => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-espresso-500">
            No new arrivals available.
          </div>
        )}
      </section>

      {/* 6. READER TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-terracotta-500">Community Voices</span>
          <h2 className="font-serif text-3xl font-semibold text-espresso-800 dark:text-cream-100">
            Words From Our Readers
          </h2>
          <div className="h-0.5 w-12 bg-terracotta-500 mx-auto mt-2"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((test, index) => (
            <div
              key={index}
              className="bg-white dark:bg-espresso-950 rounded-2xl p-6 border border-cream-200 dark:border-espresso-900 shadow-pin relative flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex text-terracotta-500 space-x-0.5">
                  {[...Array(test.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="text-sm text-espresso-500 dark:text-cream-300 italic leading-relaxed">
                  "{test.comment}"
                </p>
              </div>

              <div className="flex items-center space-x-3 mt-6 pt-4 border-t border-cream-100 dark:border-espresso-900/40">
                <div className="h-10 w-10 bg-terracotta-100 text-terracotta-700 font-semibold rounded-full flex items-center justify-center text-sm">
                  {test.avatar}
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-espresso-800 dark:text-cream-50 leading-tight">
                    {test.name}
                  </h4>
                  <span className="text-xs text-espresso-500 dark:text-espresso-100/40">
                    {test.role}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default Home;
