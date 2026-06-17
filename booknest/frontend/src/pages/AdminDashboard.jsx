import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  BarChart3,
  Layers,
  ShoppingBag,
  Users,
  TrendingUp,
  Plus,
  Trash2,
  Edit3,
  AlertTriangle,
  CheckCircle,
  Truck,
  RotateCcw,
  X,
  PackageCheck,
  Percent
} from 'lucide-react';

const AdminDashboard = () => {
  const { token, user } = useAuth();
  const navigate = useNavigate();

  // Navigation state
  const [activeTab, setActiveTab] = useState('analytics');

  // Analytics states
  const [analytics, setAnalytics] = useState(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);

  // Books / Inventory states
  const [books, setBooks] = useState([]);
  const [loadingBooks, setLoadingBooks] = useState(true);
  const [editingBook, setEditingBook] = useState(null); // Book object being edited
  const [showBookModal, setShowBookModal] = useState(false);
  const [bookForm, setBookForm] = useState({
    title: '',
    author: '',
    description: '',
    price: 0,
    category: 'Novels',
    coverImage: '',
    stock: 10,
    tags: '',
    isBestseller: false,
    isNewArrival: false,
    featuredAuthor: ''
  });

  // Orders states
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Users states
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  // General Notification feedback
  const [feedback, setFeedback] = useState({ type: '', text: '' });

  const categoriesList = [
    'Novels',
    'Poetry',
    'Self-Help',
    'Fiction',
    'Romance',
    'Mystery & Thriller',
    'Fantasy',
    'Biography',
    'Academic Books',
    "Children's Books"
  ];

  // Colors for Recharts Pie Chart
  const COLORS = ['#C05C46', '#8A9A86', '#52433F', '#8A3C2A', '#DDA15E', '#BC6C25', '#2C3E50', '#27AE60', '#8E44AD', '#F39C12'];

  // Auth Protection Check
  useEffect(() => {
    if (!token) {
      navigate('/login?redirect=admin');
    } else if (user && user.role !== 'admin') {
      navigate('/profile');
    }
  }, [token, user, navigate]);

  // Fetch data on mount / tab change
  useEffect(() => {
    if (token && user?.role === 'admin') {
      if (activeTab === 'analytics') fetchAnalytics();
      if (activeTab === 'inventory') fetchBooks();
      if (activeTab === 'orders') fetchOrders();
      if (activeTab === 'users') fetchUsers();
      
      // Clear alerts
      setFeedback({ type: '', text: '' });
    }
  }, [activeTab, token, user]);

  const fetchAnalytics = async () => {
    setLoadingAnalytics(true);
    try {
      const res = await fetch('/api/admin/analytics', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setAnalytics(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAnalytics(false);
    }
  };

  const fetchBooks = async () => {
    setLoadingBooks(true);
    try {
      const res = await fetch('/api/books?limit=100');
      if (res.ok) {
        const data = await res.json();
        setBooks(data.books);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingBooks(false);
    }
  };

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const res = await fetch('/api/admin/orders', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingOrders(false);
    }
  };

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await fetch('/api/admin/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingUsers(false);
    }
  };

  // ==========================================
  // INVENTORY HANDLERS (CRUD)
  // ==========================================

  const handleOpenAddModal = () => {
    setEditingBook(null);
    setBookForm({
      title: '',
      author: '',
      description: '',
      price: '',
      category: 'Novels',
      coverImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600',
      stock: 10,
      tags: '',
      isBestseller: false,
      isNewArrival: false,
      featuredAuthor: ''
    });
    setShowBookModal(true);
  };

  const handleOpenEditModal = (book) => {
    setEditingBook(book);
    setBookForm({
      title: book.title,
      author: book.author,
      description: book.description,
      price: book.price,
      category: book.category,
      coverImage: book.coverImage,
      stock: book.stock,
      tags: book.tags ? book.tags.join(', ') : '',
      isBestseller: book.isBestseller || false,
      isNewArrival: book.isNewArrival || false,
      featuredAuthor: book.featuredAuthor || ''
    });
    setShowBookModal(true);
  };

  const handleBookSubmit = async (e) => {
    e.preventDefault();
    setFeedback({ type: '', text: '' });

    const payload = {
      ...bookForm,
      price: Number(bookForm.price),
      stock: Number(bookForm.stock),
      tags: bookForm.tags ? bookForm.tags.split(',').map(t => t.trim()) : []
    };

    const url = editingBook ? `/api/admin/books/${editingBook._id}` : '/api/admin/books';
    const method = editingBook ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setFeedback({
          type: 'success',
          text: `Book successfully ${editingBook ? 'updated' : 'added'}!`
        });
        setShowBookModal(false);
        fetchBooks();
      } else {
        const data = await response.json();
        setFeedback({ type: 'error', text: data.message || 'Error saving book' });
      }
    } catch (err) {
      setFeedback({ type: 'error', text: 'Server error saving book' });
    }
  };

  const handleDeleteBook = async (id) => {
    if (!window.confirm('Are you absolutely sure you want to delete this book?')) return;
    setFeedback({ type: '', text: '' });

    try {
      const response = await fetch(`/api/admin/books/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        setFeedback({ type: 'success', text: 'Book deleted successfully!' });
        fetchBooks();
      } else {
        const data = await response.json();
        setFeedback({ type: 'error', text: data.message || 'Could not delete book.' });
      }
    } catch (err) {
      setFeedback({ type: 'error', text: 'Server error deleting book.' });
    }
  };

  // ==========================================
  // ORDER STATUS HANDLERS
  // ==========================================

  const handleUpdateOrderStatus = async (id, status) => {
    setFeedback({ type: '', text: '' });
    try {
      const response = await fetch(`/api/admin/orders/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ orderStatus: status })
      });
      if (response.ok) {
        setFeedback({ type: 'success', text: 'Order status updated successfully!' });
        fetchOrders();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ==========================================
  // USER ROLE DEMOTE/PROMOTE
  // ==========================================

  const handleToggleUserRole = async (targetUser) => {
    const nextRole = targetUser.role === 'admin' ? 'user' : 'admin';
    if (!window.confirm(`Change ${targetUser.name}'s role to ${nextRole}?`)) return;

    setFeedback({ type: '', text: '' });
    try {
      const response = await fetch(`/api/admin/users/${targetUser._id}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ role: nextRole })
      });
      if (response.ok) {
        setFeedback({ type: 'success', text: `Role successfully updated to ${nextRole}!` });
        fetchUsers();
      } else {
        const data = await response.json();
        setFeedback({ type: 'error', text: data.message });
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 transition-colors duration-200">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 border-b border-cream-200 dark:border-espresso-900 pb-5">
        <div>
          <h1 className="font-serif text-3xl font-bold text-espresso-800 dark:text-cream-50">
            Admin Nerve Center
          </h1>
          <p className="text-xs text-espresso-500 dark:text-cream-300 font-medium mt-1">
            BookNest Management, Inventory, Sales & Analytics Dashboard
          </p>
        </div>

        {activeTab === 'inventory' && (
          <button
            onClick={handleOpenAddModal}
            className="bg-terracotta-500 hover:bg-terracotta-600 text-white font-semibold text-xs px-5 py-2.5 rounded-full flex items-center gap-1.5 shadow-md transition-all active:scale-[0.98]"
          >
            <Plus className="h-4 w-4" />
            <span>Add New Book</span>
          </button>
        )}
      </div>

      {/* Main Grid: Navigation + Tabs Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Navigation Sidebar */}
        <aside className="lg:col-span-3 flex lg:flex-col gap-2 w-full">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center space-x-2.5 px-4 py-3 rounded-xl text-sm font-semibold transition-colors w-full ${
              activeTab === 'analytics'
                ? 'bg-terracotta-500 text-white shadow-sm'
                : 'bg-white dark:bg-espresso-950 text-espresso-800 dark:text-cream-200 hover:bg-cream-100 border border-cream-200 dark:border-espresso-900'
            }`}
          >
            <BarChart3 className="h-4.5 w-4.5" />
            <span>Sales Analytics</span>
          </button>

          <button
            onClick={() => setActiveTab('inventory')}
            className={`flex items-center space-x-2.5 px-4 py-3 rounded-xl text-sm font-semibold transition-colors w-full ${
              activeTab === 'inventory'
                ? 'bg-terracotta-500 text-white shadow-sm'
                : 'bg-white dark:bg-espresso-950 text-espresso-800 dark:text-cream-200 hover:bg-cream-100 border border-cream-200 dark:border-espresso-900'
            }`}
          >
            <Layers className="h-4.5 w-4.5" />
            <span>Book Inventory</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center space-x-2.5 px-4 py-3 rounded-xl text-sm font-semibold transition-colors w-full ${
              activeTab === 'orders'
                ? 'bg-terracotta-500 text-white shadow-sm'
                : 'bg-white dark:bg-espresso-950 text-espresso-800 dark:text-cream-200 hover:bg-cream-100 border border-cream-200 dark:border-espresso-900'
            }`}
          >
            <ShoppingBag className="h-4.5 w-4.5" />
            <span>Manage Orders</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center space-x-2.5 px-4 py-3 rounded-xl text-sm font-semibold transition-colors w-full ${
              activeTab === 'users'
                ? 'bg-terracotta-500 text-white shadow-sm'
                : 'bg-white dark:bg-espresso-950 text-espresso-800 dark:text-cream-200 hover:bg-cream-100 border border-cream-200 dark:border-espresso-900'
            }`}
          >
            <Users className="h-4.5 w-4.5" />
            <span>Manage Users</span>
          </button>
        </aside>

        {/* Tab display pane */}
        <main className="lg:col-span-9 space-y-6">
          
          {/* Feedback banners */}
          {feedback.text && (
            <div className={`p-4 rounded-xl text-xs font-semibold border ${
              feedback.type === 'success'
                ? 'bg-sage-50 text-sage-600 border-sage-500/20'
                : 'bg-red-50 text-red-600 border-red-500/20'
            } animate-fade-in-up`}>
              {feedback.text}
            </div>
          )}

          {/* ==========================================
              TAB: ANALYTICS
              ========================================== */}
          {activeTab === 'analytics' && (
            <div className="space-y-8">
              {loadingAnalytics ? (
                <div className="text-center py-20 bg-white dark:bg-espresso-950/40 border rounded-2xl animate-pulse space-y-3">
                  <RotateCcw className="h-8 w-8 text-terracotta-500 animate-spin mx-auto" />
                  <p className="text-xs text-espresso-500">Compiling financial metrics...</p>
                </div>
              ) : analytics ? (
                <>
                  {/* Stat cards grid */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white dark:bg-espresso-950 p-5 rounded-2xl border border-cream-200 dark:border-espresso-900 shadow-pin">
                      <span className="text-[10px] uppercase font-bold text-espresso-500">Total Revenue</span>
                      <p className="text-xl md:text-2xl font-bold text-espresso-800 dark:text-cream-50 mt-1">₹{analytics.summary.totalRevenue.toFixed(2)}</p>
                      <span className="text-[10px] text-sage-500 font-semibold flex items-center gap-1 mt-1"><TrendingUp className="h-3 w-3" /> Paid Orders</span>
                    </div>

                    <div className="bg-white dark:bg-espresso-950 p-5 rounded-2xl border border-cream-200 dark:border-espresso-900 shadow-pin">
                      <span className="text-[10px] uppercase font-bold text-espresso-500">Orders Count</span>
                      <p className="text-xl md:text-2xl font-bold text-espresso-800 dark:text-cream-50 mt-1">{analytics.summary.ordersCount}</p>
                      <span className="text-[10px] text-espresso-500 mt-1 block font-medium">Checkout baskets</span>
                    </div>

                    <div className="bg-white dark:bg-espresso-950 p-5 rounded-2xl border border-cream-200 dark:border-espresso-900 shadow-pin">
                      <span className="text-[10px] uppercase font-bold text-espresso-500">Books Titles</span>
                      <p className="text-xl md:text-2xl font-bold text-espresso-800 dark:text-cream-50 mt-1">{analytics.summary.booksCount}</p>
                      <span className="text-[10px] text-espresso-500 mt-1 block font-medium">In catalog</span>
                    </div>

                    <div className="bg-white dark:bg-espresso-950 p-5 rounded-2xl border border-cream-200 dark:border-espresso-900 shadow-pin">
                      <span className="text-[10px] uppercase font-bold text-espresso-500">Active Readers</span>
                      <p className="text-xl md:text-2xl font-bold text-espresso-800 dark:text-cream-50 mt-1">{analytics.summary.usersCount}</p>
                      <span className="text-[10px] text-espresso-500 mt-1 block font-medium">Profiles registered</span>
                    </div>
                  </div>

                  {/* Recharts Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    
                    {/* Monthly Trend Chart */}
                    <div className="md:col-span-8 bg-white dark:bg-espresso-950 p-5 rounded-2xl border border-cream-200 dark:border-espresso-900 shadow-pin">
                      <h4 className="font-serif font-bold text-sm text-espresso-800 dark:text-cream-100 mb-4 uppercase tracking-wider">Revenue Trend (Last 6 Months)</h4>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={analytics.monthlySales}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                            <XAxis dataKey="name" stroke="#888888" fontSize={10} />
                            <YAxis stroke="#888888" fontSize={10} />
                            <Tooltip contentStyle={{ background: '#FAF6F0', borderRadius: '12px', borderColor: '#C05C46', color: '#2C1B18' }} />
                            <Legend fontSize={10} />
                            <Line type="monotone" dataKey="revenue" name="Revenue (₹)" stroke="#C05C46" strokeWidth={2.5} activeDot={{ r: 6 }} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Category Distribution Chart */}
                    <div className="md:col-span-4 bg-white dark:bg-espresso-950 p-5 rounded-2xl border border-cream-200 dark:border-espresso-900 shadow-pin">
                      <h4 className="font-serif font-bold text-sm text-espresso-800 dark:text-cream-100 mb-4 uppercase tracking-wider">Category sales</h4>
                      <div className="h-64 flex flex-col justify-between">
                        <div className="h-44">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={analytics.categorySales}
                                cx="50%"
                                cy="50%"
                                innerRadius={45}
                                outerRadius={60}
                                paddingAngle={4}
                                dataKey="value"
                              >
                                {analytics.categorySales.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip contentStyle={{ fontSize: '10px' }} formatter={(val) => [`₹${val.toFixed(2)}`, 'Sales']} />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                        {/* Custom Legend */}
                        <div className="max-h-20 overflow-y-auto space-y-1 pr-1 text-[10px] text-espresso-500">
                          {analytics.categorySales.map((entry, index) => (
                            <div key={index} className="flex justify-between items-center">
                              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full inline-block" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>{entry.name}</span>
                              <span className="font-bold">₹{entry.value.toFixed(1)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Stock Warnings & Top Sellers */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Low Stock Warns */}
                    <div className="bg-white dark:bg-espresso-950 p-5 rounded-2xl border border-cream-200 dark:border-espresso-900 shadow-pin space-y-4">
                      <h4 className="font-serif font-bold text-sm text-espresso-800 dark:text-cream-100 uppercase tracking-wider flex items-center gap-1.5">
                        <AlertTriangle className="h-4.5 w-4.5 text-yellow-500 animate-pulse" />
                        Low Stock Warnings (Stock ≤ 3)
                      </h4>

                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-espresso-800 dark:text-cream-200">
                          <thead>
                            <tr className="border-b border-cream-100 dark:border-espresso-900/40 text-[10px] text-espresso-500 uppercase font-semibold">
                              <th className="pb-2">Title</th>
                              <th className="pb-2 text-center">Stock</th>
                              <th className="pb-2 text-right">Price</th>
                            </tr>
                          </thead>
                          <tbody>
                            {analytics.lowStockBooks.length > 0 ? (
                              analytics.lowStockBooks.map((item) => (
                                <tr key={item._id} className="border-b border-cream-50 dark:border-espresso-900/20 last:border-0">
                                  <td className="py-2.5 pr-2 font-serif font-semibold truncate max-w-[120px]">{item.title}</td>
                                  <td className="py-2.5 text-center font-bold text-red-500">{item.stock} left</td>
                                  <td className="py-2.5 text-right font-medium">₹{item.price.toFixed(2)}</td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan="3" className="py-4 text-center text-espresso-500 italic">No low stock warnings. All books filled!</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Top Sellers */}
                    <div className="bg-white dark:bg-espresso-950 p-5 rounded-2xl border border-cream-200 dark:border-espresso-900 shadow-pin space-y-4">
                      <h4 className="font-serif font-bold text-sm text-espresso-800 dark:text-cream-100 uppercase tracking-wider flex items-center gap-1.5">
                        <PackageCheck className="h-4.5 w-4.5 text-sage-500" />
                        Top Selling Bookstore Items
                      </h4>

                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-espresso-800 dark:text-cream-200">
                          <thead>
                            <tr className="border-b border-cream-100 dark:border-espresso-900/40 text-[10px] text-espresso-500 uppercase font-semibold">
                              <th className="pb-2">Title</th>
                              <th className="pb-2 text-center">Units Sold</th>
                              <th className="pb-2 text-right">Sales (₹)</th>
                            </tr>
                          </thead>
                          <tbody>
                            {analytics.topSellers.map((item, key) => (
                              <tr key={key} className="border-b border-cream-50 dark:border-espresso-900/20 last:border-0">
                                <td className="py-2.5 pr-2 font-serif font-semibold truncate max-w-[140px]">{item.title}</td>
                                <td className="py-2.5 text-center font-bold text-sage-500">{item.unitsSold} sold</td>
                                <td className="py-2.5 text-right font-bold">₹{item.revenueGenerated.toFixed(2)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                  </div>

                </>
              ) : (
                <div className="text-center py-10 text-espresso-500">Failed to render dashboard reports.</div>
              )}
            </div>
          )}

          {/* ==========================================
              TAB: INVENTORY (CRUD MANAGER)
              ========================================== */}
          {activeTab === 'inventory' && (
            <div className="bg-white dark:bg-espresso-950 p-6 rounded-2xl border border-cream-200 dark:border-espresso-900 shadow-pin space-y-4">
              <h3 className="font-serif text-xl font-bold text-espresso-800 dark:text-cream-100 border-b border-cream-100 dark:border-espresso-900/60 pb-3 uppercase tracking-wider">
                Book Catalog Inventory
              </h3>

              {loadingBooks ? (
                <div className="text-center py-12 space-y-2">
                  <RotateCcw className="h-7 w-7 text-terracotta-500 animate-spin mx-auto" />
                  <p className="text-xs text-espresso-500">Loading catalog...</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-espresso-800 dark:text-cream-200">
                    <thead>
                      <tr className="border-b border-cream-100 dark:border-espresso-900/40 text-[10px] text-espresso-500 uppercase font-semibold">
                        <th className="pb-2">Cover</th>
                        <th className="pb-2">Book Title / Author</th>
                        <th className="pb-2">Category</th>
                        <th className="pb-2 text-center">Stock</th>
                        <th className="pb-2 text-right">Price</th>
                        <th className="pb-2 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {books.map((book) => (
                        <tr key={book._id} className="border-b border-cream-50 dark:border-espresso-900/20 last:border-0 hover:bg-cream-50/20">
                          <td className="py-2.5">
                            <div className="h-10 w-7 bg-cream-100 rounded overflow-hidden">
                              <img src={book.coverImage} alt="" className="w-full h-full object-cover" />
                            </div>
                          </td>
                          <td className="py-2.5 pr-2">
                            <h4 className="font-serif font-bold text-espresso-800 dark:text-cream-100 line-clamp-1">{book.title}</h4>
                            <span className="text-[10px] text-espresso-500">{book.author}</span>
                          </td>
                          <td className="py-2.5 pr-2">{book.category}</td>
                          <td className="py-2.5 text-center">
                            <span className={`font-bold px-2 py-0.5 rounded-full ${
                              book.stock <= 0 ? 'bg-red-50 text-red-500 text-[10px]' : book.stock <= 3 ? 'bg-yellow-50 text-yellow-600 text-[10px]' : 'font-semibold'
                            }`}>
                              {book.stock}
                            </span>
                          </td>
                          <td className="py-2.5 text-right font-bold">₹{book.price.toFixed(2)}</td>
                          <td className="py-2.5">
                            <div className="flex justify-center items-center space-x-2">
                              <button
                                onClick={() => handleOpenEditModal(book)}
                                className="p-1.5 text-espresso-500 hover:text-terracotta-500 transition-colors"
                                title="Edit Details"
                              >
                                <Edit3 className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteBook(book._id)}
                                className="p-1.5 text-espresso-500 hover:text-red-500 transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ==========================================
              TAB: ORDER MANAGER
              ========================================== */}
          {activeTab === 'orders' && (
            <div className="bg-white dark:bg-espresso-950 p-6 rounded-2xl border border-cream-200 dark:border-espresso-900 shadow-pin space-y-4">
              <h3 className="font-serif text-xl font-bold text-espresso-800 dark:text-cream-100 border-b border-cream-100 dark:border-espresso-900/60 pb-3 uppercase tracking-wider">
                Manage Store Orders
              </h3>

              {loadingOrders ? (
                <div className="text-center py-12 space-y-2">
                  <RotateCcw className="h-7 w-7 text-terracotta-500 animate-spin mx-auto" />
                  <p className="text-xs text-espresso-500">Loading order logbooks...</p>
                </div>
              ) : orders.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-espresso-800 dark:text-cream-200">
                    <thead>
                      <tr className="border-b border-cream-100 dark:border-espresso-900/40 text-[10px] text-espresso-500 uppercase font-semibold">
                        <th className="pb-2">Buyer Name</th>
                        <th className="pb-2">Purchased Items</th>
                        <th className="pb-2">Grand Total</th>
                        <th className="pb-2">Ship Status</th>
                        <th className="pb-2 text-center">Change State</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((ord) => (
                        <tr key={ord._id} className="border-b border-cream-50 dark:border-espresso-900/20 last:border-0">
                          <td className="py-2.5 pr-2">
                            <h4 className="font-bold text-espresso-850">{ord.user?.name || 'Guest User'}</h4>
                            <p className="text-[10px] text-espresso-500 mt-0.5">{ord.user?.email || 'N/A'}</p>
                          </td>
                          <td className="py-2.5 pr-2">
                            <div className="max-w-[200px] truncate text-[11px]">
                              {ord.items.map(i => `${i.book?.title} (x${i.quantity})`).join(', ')}
                            </div>
                          </td>
                          <td className="py-2.5 font-bold">₹{ord.totalAmount.toFixed(2)}</td>
                          <td className="py-2.5 font-semibold text-[10px] uppercase">
                            {ord.orderStatus}
                          </td>
                          <td className="py-2.5">
                            <div className="flex justify-center">
                              <select
                                value={ord.orderStatus}
                                onChange={(e) => handleUpdateOrderStatus(ord._id, e.target.value)}
                                className="bg-cream-50 dark:bg-espresso-900 border border-cream-250 dark:border-espresso-800 rounded-lg p-1 text-[10px]"
                              >
                                <option value="processing">Processing</option>
                                <option value="shipped">Shipped</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-10 text-espresso-500 italic">No orders logged in database yet.</div>
              )}
            </div>
          )}

          {/* ==========================================
              TAB: USER MANAGER
              ========================================== */}
          {activeTab === 'users' && (
            <div className="bg-white dark:bg-espresso-950 p-6 rounded-2xl border border-cream-200 dark:border-espresso-900 shadow-pin space-y-4">
              <h3 className="font-serif text-xl font-bold text-espresso-800 dark:text-cream-100 border-b border-cream-100 dark:border-espresso-900/60 pb-3 uppercase tracking-wider">
                Manage Registered Users
              </h3>

              {loadingUsers ? (
                <div className="text-center py-12 space-y-2">
                  <RotateCcw className="h-7 w-7 text-terracotta-500 animate-spin mx-auto" />
                  <p className="text-xs text-espresso-500">Loading user profiles...</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-espresso-800 dark:text-cream-200">
                    <thead>
                      <tr className="border-b border-cream-100 dark:border-espresso-900/40 text-[10px] text-espresso-500 uppercase font-semibold">
                        <th className="pb-2">User Name</th>
                        <th className="pb-2">Email Address</th>
                        <th className="pb-2">Access Role</th>
                        <th className="pb-2 text-center">Toggle Privilege</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u) => (
                        <tr key={u._id} className="border-b border-cream-50 dark:border-espresso-900/20 last:border-0">
                          <td className="py-2.5 font-semibold">{u.name}</td>
                          <td className="py-2.5">{u.email}</td>
                          <td className="py-2.5">
                            <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                              u.role === 'admin' ? 'bg-terracotta-100 text-terracotta-700' : 'bg-cream-200 text-espresso-550'
                            }`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="py-2.5 text-center">
                            {u._id !== user._id ? (
                              <button
                                onClick={() => handleToggleUserRole(u)}
                                className={`text-[10px] px-3 py-1.5 rounded-lg font-bold shadow-sm transition-colors ${
                                  u.role === 'admin' 
                                    ? 'bg-red-50 text-red-500 border border-red-500/10 hover:bg-red-100' 
                                    : 'bg-sage-50 text-sage-600 border border-sage-500/10 hover:bg-sage-100'
                                }`}
                              >
                                {u.role === 'admin' ? 'Demote to User' : 'Promote to Admin'}
                              </button>
                            ) : (
                              <span className="text-[10px] text-espresso-500 italic">Self (Admin)</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

        </main>
      </div>

      {/* ==========================================
          ADD/EDIT BOOK MODAL INVENTORY
          ========================================== */}
      {showBookModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop overlay */}
          <div onClick={() => setShowBookModal(false)} className="absolute inset-0 bg-espresso-950/40 backdrop-blur-sm"></div>

          {/* Modal Container */}
          <div className="relative bg-cream-100 dark:bg-espresso-950 p-6 rounded-2xl border border-cream-200 dark:border-espresso-900 shadow-2xl max-w-xl w-full max-h-[85vh] overflow-y-auto z-10 animate-fade-in-up">
            <div className="flex justify-between items-center border-b border-cream-200 dark:border-espresso-900 pb-3 mb-4">
              <h3 className="font-serif text-lg font-bold text-espresso-800 dark:text-cream-50">
                {editingBook ? 'Edit Book Specifications' : 'Add New Book to Catalog'}
              </h3>
              <button onClick={() => setShowBookModal(false)} className="p-1 rounded-md hover:bg-cream-200 text-espresso-500">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleBookSubmit} className="space-y-4 text-xs">
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold uppercase text-espresso-500 mb-1">Book Title</label>
                  <input
                    type="text"
                    required
                    value={bookForm.title}
                    onChange={(e) => setBookForm({ ...bookForm, title: e.target.value })}
                    className="w-full bg-cream-50 dark:bg-espresso-900 border border-cream-300 dark:border-espresso-800 rounded-lg p-2 text-espresso-800 dark:text-cream-50 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold uppercase text-espresso-500 mb-1">Author Name</label>
                  <input
                    type="text"
                    required
                    value={bookForm.author}
                    onChange={(e) => setBookForm({ ...bookForm, author: e.target.value })}
                    className="w-full bg-cream-50 dark:bg-espresso-900 border border-cream-300 dark:border-espresso-800 rounded-lg p-2 text-espresso-800 dark:text-cream-50 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold uppercase text-espresso-500 mb-1">Synopsis / Description</label>
                <textarea
                  rows="3"
                  required
                  value={bookForm.description}
                  onChange={(e) => setBookForm({ ...bookForm, description: e.target.value })}
                  className="w-full bg-cream-50 dark:bg-espresso-900 border border-cream-300 dark:border-espresso-800 rounded-lg p-2 text-espresso-800 dark:text-cream-50 focus:outline-none"
                ></textarea>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold uppercase text-espresso-500 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={bookForm.price}
                    onChange={(e) => setBookForm({ ...bookForm, price: e.target.value })}
                    className="w-full bg-cream-50 dark:bg-espresso-900 border border-cream-300 dark:border-espresso-800 rounded-lg p-2 text-espresso-800 dark:text-cream-50 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold uppercase text-espresso-500 mb-1">Stock Level</label>
                  <input
                    type="number"
                    required
                    value={bookForm.stock}
                    onChange={(e) => setBookForm({ ...bookForm, stock: e.target.value })}
                    className="w-full bg-cream-50 dark:bg-espresso-900 border border-cream-300 dark:border-espresso-800 rounded-lg p-2 text-espresso-800 dark:text-cream-50 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold uppercase text-espresso-500 mb-1">Genre Category</label>
                  <select
                    value={bookForm.category}
                    onChange={(e) => setBookForm({ ...bookForm, category: e.target.value })}
                    className="w-full bg-cream-50 dark:bg-espresso-900 border border-cream-300 dark:border-espresso-800 rounded-lg p-2 text-espresso-800 dark:text-cream-50 focus:outline-none"
                  >
                    {categoriesList.filter(c => c !== 'All').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold uppercase text-espresso-500 mb-1">Tags (separated by comma)</label>
                  <input
                    type="text"
                    placeholder="Philosophy, Growth, Science"
                    value={bookForm.tags}
                    onChange={(e) => setBookForm({ ...bookForm, tags: e.target.value })}
                    className="w-full bg-cream-50 dark:bg-espresso-900 border border-cream-300 dark:border-espresso-800 rounded-lg p-2 text-espresso-800 dark:text-cream-50 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold uppercase text-espresso-500 mb-1">Cover Image URL</label>
                  <input
                    type="text"
                    required
                    value={bookForm.coverImage}
                    onChange={(e) => setBookForm({ ...bookForm, coverImage: e.target.value })}
                    className="w-full bg-cream-50 dark:bg-espresso-900 border border-cream-300 dark:border-espresso-800 rounded-lg p-2 text-espresso-800 dark:text-cream-50 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-1">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isBestseller"
                    checked={bookForm.isBestseller}
                    onChange={(e) => setBookForm({ ...bookForm, isBestseller: e.target.checked })}
                    className="rounded text-terracotta-500"
                  />
                  <label htmlFor="isBestseller" className="font-semibold uppercase text-espresso-500">Flag as Bestseller</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isNewArrival"
                    checked={bookForm.isNewArrival}
                    onChange={(e) => setBookForm({ ...bookForm, isNewArrival: e.target.checked })}
                    className="rounded text-terracotta-500"
                  />
                  <label htmlFor="isNewArrival" className="font-semibold uppercase text-espresso-500">Flag as New Arrival</label>
                </div>
              </div>

              <div>
                <label className="block font-semibold uppercase text-espresso-500 mb-1">Featured Author highlight name (optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Paulo Coelho"
                  value={bookForm.featuredAuthor}
                  onChange={(e) => setBookForm({ ...bookForm, featuredAuthor: e.target.value })}
                  className="w-full bg-cream-50 dark:bg-espresso-900 border border-cream-300 dark:border-espresso-800 rounded-lg p-2 text-espresso-800 dark:text-cream-50 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-terracotta-500 hover:bg-terracotta-600 text-white font-semibold py-2.5 rounded-lg mt-2 text-xs transition-colors"
              >
                Save Changes to Catalog
              </button>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
