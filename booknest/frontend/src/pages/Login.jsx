import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, ShieldCheck, Mail, Lock, Loader2 } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, token } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '';

  // Redirect if user already logged in
  useEffect(() => {
    if (token) {
      navigate(redirect ? `/${redirect}` : '/profile');
    }
  }, [token, navigate, redirect]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setIsSubmitting(true);
    const result = await login(email, password);
    setIsSubmitting(false);

    if (!result.success) {
      setErrorMsg(result.message);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 transition-colors duration-200">
      <div className="bg-white dark:bg-espresso-950 p-8 rounded-3xl border border-cream-200 dark:border-espresso-900 shadow-pin space-y-6">
        
        {/* Logo and title */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center space-x-2 text-espresso-800 dark:text-cream-50 mx-auto">
            <BookOpen className="h-8 w-8 text-terracotta-500" />
            <span className="font-serif text-2xl font-bold">
              Book<span className="text-terracotta-500">Nest</span>
            </span>
          </Link>
          <h2 className="font-serif text-xl font-bold text-espresso-800 dark:text-cream-100">Welcome Back</h2>
          <p className="text-xs text-espresso-500">Log in to enter your bookstore sanctuary</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-semibold uppercase text-espresso-500 dark:text-cream-300 mb-1">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="reader@booknest.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-cream-50 dark:bg-espresso-900 border border-cream-300 dark:border-espresso-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-espresso-800 dark:text-cream-50 focus:outline-none focus:ring-1 focus:ring-terracotta-500"
              />
              <Mail className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-espresso-500" />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-semibold uppercase text-espresso-500 dark:text-cream-300 mb-1">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-cream-50 dark:bg-espresso-900 border border-cream-300 dark:border-espresso-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-espresso-800 dark:text-cream-50 focus:outline-none focus:ring-1 focus:ring-terracotta-500"
              />
              <Lock className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-espresso-500" />
            </div>
          </div>

          {/* Errors */}
          {errorMsg && (
            <div className="text-xs text-red-600 bg-red-50 border border-red-500/20 p-2.5 rounded-lg font-semibold">
              {errorMsg}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-terracotta-500 hover:bg-terracotta-600 text-white font-semibold py-3 rounded-xl text-xs flex items-center justify-center space-x-1.5 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Entering nest...</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>

        <hr className="border-cream-100 dark:border-espresso-900" />

        {/* Footer info */}
        <div className="text-center text-xs space-y-2">
          <p className="text-espresso-500">
            Don't have an account?{' '}
            <Link to={redirect ? `/register?redirect=${redirect}` : '/register'} className="text-terracotta-500 hover:underline font-semibold">
              Create one here
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Login;
