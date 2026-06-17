import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import BookCard from '../components/BookCard';
import { 
  ChevronRight, 
  ArrowLeft, 
  Award, 
  BookOpen, 
  Sparkles, 
  Users, 
  Star,
  Quote
} from 'lucide-react';

const AuthorDetails = () => {
  const { id } = useParams();
  const [author, setAuthor] = useState(null);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAuthorDetails = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`/api/authors/${id}`);
        if (res.ok) {
          const data = await res.json();
          setAuthor(data.author);
          setBooks(data.books || []);
        } else {
          const errData = await res.json();
          setError(errData.message || 'Failed to fetch author details');
        }
      } catch (err) {
        console.error('Error fetching author details:', err);
        setError('Server error fetching author details');
      } finally {
        setLoading(false);
      }
    };

    fetchAuthorDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse space-y-8">
        <div className="h-6 w-32 bg-cream-200 dark:bg-espresso-900 rounded-md"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="md:col-span-1 h-96 bg-cream-200 dark:bg-espresso-900 rounded-2xl"></div>
          <div className="md:col-span-2 space-y-6">
            <div className="h-10 w-2/3 bg-cream-200 dark:bg-espresso-900 rounded-lg"></div>
            <div className="h-6 w-40 bg-cream-200 dark:bg-espresso-900 rounded-md"></div>
            <div className="h-32 bg-cream-200 dark:bg-espresso-900 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !author) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="font-serif text-2xl font-bold text-espresso-800 dark:text-cream-50">Author Profile Not Found</h2>
        <p className="text-espresso-500 mt-2">{error || "The author profile you are looking for does not exist."}</p>
        <Link to="/" className="mt-5 inline-block text-terracotta-500 font-semibold hover:underline">
          Go back to homepage
        </Link>
      </div>
    );
  }

  // Calculate statistics
  const avgRating = books.length 
    ? (books.reduce((acc, book) => acc + book.rating, 0) / books.length).toFixed(1)
    : 'N/A';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16 transition-colors duration-200">
      
      {/* Breadcrumbs */}
      <div className="flex items-center space-x-2 text-xs font-semibold text-espresso-500 dark:text-cream-300">
        <Link to="/" className="hover:text-terracotta-500">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-espresso-500 dark:text-cream-300">Authors</span>
        <ChevronRight className="h-3 w-3" />
        <span className="text-espresso-800 dark:text-cream-50">{author.name}</span>
      </div>

      {/* Hero Profile Layout */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-16 items-start">
        
        {/* Left: Portrait Cover & Quick stats */}
        <div className="md:col-span-4 space-y-6">
          <div className="relative aspect-[3/4] w-full max-w-[340px] mx-auto rounded-3xl overflow-hidden border border-cream-200 dark:border-espresso-900 shadow-pin bg-cream-100 dark:bg-espresso-900">
            <img
              src={author.photo}
              alt={author.name}
              className="w-full h-full object-cover"
            />
            {author.isFeatured && (
              <span className="absolute top-4 left-4 bg-terracotta-500 text-white font-bold text-[10px] tracking-wider uppercase px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
                <Sparkles className="h-3 w-3 fill-current animate-pulse" />
                Featured Author
              </span>
            )}
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-4 max-w-[340px] mx-auto">
            <div className="bg-white dark:bg-espresso-950 p-4 rounded-2xl border border-cream-200 dark:border-espresso-900 text-center shadow-sm">
              <BookOpen className="h-5 w-5 text-terracotta-500 mx-auto mb-1.5" />
              <span className="block text-xs font-semibold text-espresso-500 dark:text-espresso-100/40 uppercase">Books</span>
              <span className="text-xl font-bold text-espresso-800 dark:text-cream-50">{books.length}</span>
            </div>
            <div className="bg-white dark:bg-espresso-950 p-4 rounded-2xl border border-cream-200 dark:border-espresso-900 text-center shadow-sm">
              <Star className="h-5 w-5 text-terracotta-500 fill-current mx-auto mb-1.5" />
              <span className="block text-xs font-semibold text-espresso-500 dark:text-espresso-100/40 uppercase">Avg Rating</span>
              <span className="text-xl font-bold text-espresso-800 dark:text-cream-50">{avgRating}</span>
            </div>
          </div>
        </div>

        {/* Right: Biography Details */}
        <div className="md:col-span-8 space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-terracotta-500 flex items-center gap-1.5">
              <Award className="h-4 w-4" />
              {author.field.toUpperCase()} SPECIALIST
            </span>
            <h1 className="font-serif text-3xl md:text-5xl font-bold text-espresso-800 dark:text-cream-50 leading-tight">
              {author.name}
            </h1>
          </div>

          <div className="relative p-6 rounded-2xl bg-cream-100/60 dark:bg-espresso-900/40 border border-cream-200/50 dark:border-espresso-900/50">
            <Quote className="absolute top-4 right-4 h-8 w-8 text-terracotta-500/10 dark:text-cream-100/10" />
            <h3 className="font-serif font-bold text-lg text-espresso-800 dark:text-cream-100 mb-3">Biography</h3>
            <p className="text-sm text-espresso-600 dark:text-cream-300 leading-relaxed whitespace-pre-line">
              {author.bio}
            </p>
          </div>

          {/* Related Authors Slider/Grid if available */}
          {author.relatedAuthors && author.relatedAuthors.length > 0 && (
            <div className="space-y-4 pt-4">
              <h3 className="font-serif font-bold text-lg text-espresso-800 dark:text-cream-100 flex items-center gap-2">
                <Users className="h-5 w-5 text-terracotta-500" />
                Related Authors
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {author.relatedAuthors.map((relAuth) => (
                  <Link 
                    key={relAuth._id || relAuth.id} 
                    to={`/authors/${relAuth._id || relAuth.id}`}
                    className="group flex items-center space-x-3 p-3 rounded-xl bg-white dark:bg-espresso-950 border border-cream-200 dark:border-espresso-900 hover:border-terracotta-500 transition-all shadow-sm"
                  >
                    <img
                      src={relAuth.photo}
                      alt={relAuth.name}
                      className="w-10 h-10 rounded-full object-cover border border-cream-200 dark:border-espresso-900"
                    />
                    <div className="truncate">
                      <h4 className="text-xs font-bold text-espresso-800 dark:text-cream-50 group-hover:text-terracotta-500 transition-colors truncate">
                        {relAuth.name}
                      </h4>
                      <p className="text-[10px] text-espresso-500 dark:text-espresso-100/40 capitalize">
                        {relAuth.field}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

      </section>

      {/* Books Written Section */}
      <section className="space-y-6 pt-6 border-t border-cream-200 dark:border-espresso-900">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-espresso-800 dark:text-cream-50">
            Published Works ({books.length})
          </h2>
          <span className="text-xs font-semibold text-espresso-500 dark:text-cream-300">
            Curated from BookNest's Catalog
          </span>
        </div>

        {books.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {books.map((book) => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-white dark:bg-espresso-950 rounded-2xl border border-cream-200 dark:border-espresso-900">
            <p className="text-espresso-500">No books found in this category currently.</p>
          </div>
        )}
      </section>

    </div>
  );
};

export default AuthorDetails;
