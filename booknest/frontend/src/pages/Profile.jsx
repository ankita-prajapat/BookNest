import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  User, 
  ShoppingBag, 
  History, 
  MapPin, 
  Calendar,
  Lock,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  Truck,
  RotateCcw
} from 'lucide-react';

const Profile = () => {
  const { user, token, updateProfile, logout } = useAuth();
  const navigate = useNavigate();

  // Profile Form state
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' or 'settings'
  const [openOrderIndex, setOpenOrderIndex] = useState(null); // Accordion index

  // Feedback states
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');

  // Protect route
  useEffect(() => {
    if (!token) {
      navigate('/login?redirect=profile');
    } else if (user) {
      setProfileForm({
        name: user.name,
        email: user.email,
        password: '',
        confirmPassword: ''
      });
      fetchUserOrders();
    }
  }, [token, user, navigate]);

  const fetchUserOrders = async () => {
    setLoadingOrders(true);
    try {
      const response = await fetch('/api/orders/myorders', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error('Error loading my orders:', error);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleProfileChange = (e) => {
    setProfileForm({
      ...profileForm,
      [e.target.name]: e.target.value
    });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileSuccess('');
    setProfileError('');

    if (profileForm.password !== profileForm.confirmPassword) {
      setProfileError('Passwords do not match');
      return;
    }

    const updateData = { name: profileForm.name, email: profileForm.email };
    if (profileForm.password) {
      updateData.password = profileForm.password;
    }

    const res = await updateProfile(updateData);
    if (res.success) {
      setProfileSuccess('Profile credentials updated successfully!');
      setProfileForm(prev => ({ ...prev, password: '', confirmPassword: '' }));
    } else {
      setProfileError(res.message || 'There was a problem updating your profile.');
    }
  };

  const toggleOrderAccordion = (index) => {
    if (openOrderIndex === index) {
      setOpenOrderIndex(null);
    } else {
      setOpenOrderIndex(index);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'processing':
        return <span className="bg-yellow-50 text-yellow-600 px-2 py-0.5 rounded-full font-bold text-[10px] border border-yellow-500/10 uppercase">Processing</span>;
      case 'shipped':
        return <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-bold text-[10px] border border-blue-500/10 uppercase flex items-center gap-1"><Truck className="h-3 w-3" /> Shipped</span>;
      case 'delivered':
        return <span className="bg-sage-50 text-sage-600 px-2 py-0.5 rounded-full font-bold text-[10px] border border-sage-500/10 uppercase flex items-center gap-1"><CheckCircle className="h-3 w-3" /> Delivered</span>;
      case 'cancelled':
        return <span className="bg-red-50 text-red-600 px-2 py-0.5 rounded-full font-bold text-[10px] border border-red-500/10 uppercase">Cancelled</span>;
      default:
        return <span className="bg-cream-200 text-espresso-500 px-2 py-0.5 rounded-full font-bold text-[10px] uppercase">{status}</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 transition-colors duration-200">
      
      {/* Upper grid panel */}
      <div className="bg-white dark:bg-espresso-950 p-6 rounded-3xl border border-cream-200 dark:border-espresso-900 shadow-pin flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
        <div className="flex items-center space-x-4">
          <div className="h-16 w-16 bg-terracotta-100 text-terracotta-700 font-serif font-bold text-2xl rounded-full flex items-center justify-center border border-terracotta-500/10 shadow-sm">
            {user?.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="font-serif text-2xl font-bold text-espresso-800 dark:text-cream-50 leading-tight">
              {user?.name}
            </h2>
            <p className="text-xs text-espresso-500 dark:text-cream-300 mt-1">{user?.email}</p>
            <span className="inline-block bg-terracotta-100 text-terracotta-700 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full mt-2">
              Role: {user?.role}
            </span>
          </div>
        </div>

        <button
          onClick={logout}
          className="border border-red-200 text-red-500 hover:bg-red-50 px-5 py-2.5 rounded-full text-xs font-semibold transition-colors"
        >
          Sign Out of Nest
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Navigation Sidebar Controls */}
        <aside className="lg:col-span-3 flex lg:flex-col gap-2 w-full">
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center space-x-2.5 px-4 py-3 rounded-xl text-sm font-semibold transition-colors w-full ${
              activeTab === 'orders'
                ? 'bg-terracotta-500 text-white shadow-sm'
                : 'bg-white dark:bg-espresso-950 text-espresso-800 dark:text-cream-200 hover:bg-cream-100 border border-cream-200 dark:border-espresso-900'
            }`}
          >
            <History className="h-4.5 w-4.5" />
            <span>Order History ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center space-x-2.5 px-4 py-3 rounded-xl text-sm font-semibold transition-colors w-full ${
              activeTab === 'settings'
                ? 'bg-terracotta-500 text-white shadow-sm'
                : 'bg-white dark:bg-espresso-950 text-espresso-800 dark:text-cream-200 hover:bg-cream-100 border border-cream-200 dark:border-espresso-900'
            }`}
          >
            <User className="h-4.5 w-4.5" />
            <span>Profile Settings</span>
          </button>
        </aside>

        {/* Tab display contents */}
        <main className="lg:col-span-9">
          
          {/* TAB 1: ORDER HISTORY */}
          {activeTab === 'orders' && (
            <div className="bg-white dark:bg-espresso-950 p-6 rounded-2xl border border-cream-200 dark:border-espresso-900 shadow-pin space-y-6">
              <h3 className="font-serif text-xl font-bold text-espresso-800 dark:text-cream-100 border-b border-cream-100 dark:border-espresso-900/60 pb-3 flex items-center gap-2">
                <ShoppingBag className="h-5.5 w-5.5 text-terracotta-500" />
                Previous Order Records
              </h3>

              {loadingOrders ? (
                <div className="text-center py-12 animate-pulse space-y-3">
                  <RotateCcw className="h-8 w-8 text-terracotta-500 animate-spin mx-auto" />
                  <p className="text-xs text-espresso-500">Loading your purchase history...</p>
                </div>
              ) : orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.map((ord, idx) => {
                    const isOpen = openOrderIndex === idx;
                    return (
                      <div
                        key={ord._id}
                        className="border border-cream-200 dark:border-espresso-900 rounded-2xl overflow-hidden"
                      >
                        {/* Summary Header */}
                        <div
                          onClick={() => toggleOrderAccordion(idx)}
                          className="bg-cream-50 dark:bg-espresso-900/30 p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 cursor-pointer hover:bg-cream-100 transition-colors"
                        >
                          <div className="space-y-1">
                            <span className="text-[10px] text-espresso-500 font-semibold block">ORDER ID: {ord._id}</span>
                            <div className="flex flex-wrap items-center gap-3">
                              <span className="text-xs font-semibold text-espresso-800 dark:text-cream-200 flex items-center gap-1">
                                <Calendar className="h-3.5 w-3.5 text-espresso-500" />
                                {new Date(ord.createdAt).toLocaleDateString()}
                              </span>
                              <span className="h-3 w-px bg-cream-300 dark:bg-espresso-800 hidden sm:inline"></span>
                              <span className="text-xs font-bold text-espresso-800 dark:text-cream-100">₹{ord.totalAmount.toFixed(2)}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-end">
                            {getStatusBadge(ord.orderStatus)}
                            {isOpen ? <ChevronUp className="h-4 w-4 text-espresso-500" /> : <ChevronDown className="h-4 w-4 text-espresso-500" />}
                          </div>
                        </div>

                        {/* Collapsible Details */}
                        {isOpen && (
                          <div className="p-4 bg-white dark:bg-espresso-950 border-t border-cream-200 dark:border-espresso-900/50 space-y-4 animate-fade-in-up">
                            
                            {/* Shipping address details */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-cream-50 dark:bg-espresso-900/10 p-3 rounded-xl border border-cream-100 dark:border-espresso-900/40 text-xs">
                              <div className="space-y-1">
                                <span className="font-semibold text-espresso-800 dark:text-cream-100 flex items-center gap-1 mb-1">
                                  <MapPin className="h-3.5 w-3.5 text-terracotta-500" /> Shipping Destination
                                </span>
                                <p>{ord.shippingAddress.street}</p>
                                <p>{ord.shippingAddress.city}, {ord.shippingAddress.state} {ord.shippingAddress.zip}</p>
                                <p>{ord.shippingAddress.country}</p>
                              </div>
                              <div className="space-y-1">
                                <span className="font-semibold text-espresso-800 dark:text-cream-100 flex items-center gap-1 mb-1">
                                  <Lock className="h-3.5 w-3.5 text-sage-500" /> Order Summary Details
                                </span>
                                <p><span className="text-espresso-500">Payment:</span> {ord.paymentStatus.toUpperCase()}</p>
                                <p><span className="text-espresso-500">Coupons:</span> {ord.couponCode || 'None'}</p>
                                {ord.discountApplied > 0 && <p><span className="text-espresso-500">Saved:</span> -₹{ord.discountApplied.toFixed(2)}</p>}
                              </div>
                            </div>

                            {/* Books list purchased */}
                            <div className="space-y-2.5">
                              {ord.items.map((item, key) => (
                                <div key={key} className="flex justify-between items-center text-xs">
                                  <div className="flex items-center space-x-2.5">
                                    <div className="h-9 w-7 bg-cream-100 rounded overflow-hidden flex-shrink-0">
                                      <img src={item.book.coverImage} alt={item.book.title} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="min-w-0">
                                      <h4 className="font-serif font-bold text-espresso-800 dark:text-cream-100 truncate max-w-[200px] sm:max-w-xs">{item.book.title}</h4>
                                      <p className="text-[10px] text-espresso-500 mt-0.5">by {item.book.author} • Qty: {item.quantity}</p>
                                    </div>
                                  </div>
                                  <span className="font-semibold text-espresso-850">₹{(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                              ))}
                            </div>

                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12 text-espresso-500 text-xs">
                  You haven't ordered any books yet. Add books to your cart to check out.
                </div>
              )}
            </div>
          )}

          {/* TAB 2: PROFILE SETTINGS */}
          {activeTab === 'settings' && (
            <div className="bg-white dark:bg-espresso-950 p-6 rounded-2xl border border-cream-200 dark:border-espresso-900 shadow-pin space-y-6">
              <h3 className="font-serif text-xl font-bold text-espresso-800 dark:text-cream-100 border-b border-cream-100 dark:border-espresso-900/60 pb-3 flex items-center gap-2">
                <User className="h-5.5 w-5.5 text-terracotta-500" />
                Edit Profile Credentials
              </h3>

              <form onSubmit={handleProfileSubmit} className="space-y-4 max-w-lg">
                <div>
                  <label className="block text-[10px] font-semibold uppercase text-espresso-500 dark:text-cream-300 mb-1">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={profileForm.name}
                    onChange={handleProfileChange}
                    className="w-full bg-cream-50 dark:bg-espresso-900 border border-cream-300 dark:border-espresso-800 rounded-xl px-4 py-2.5 text-xs text-espresso-800 dark:text-cream-50 focus:outline-none focus:ring-1 focus:ring-terracotta-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold uppercase text-espresso-500 dark:text-cream-300 mb-1">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={profileForm.email}
                    onChange={handleProfileChange}
                    className="w-full bg-cream-50 dark:bg-espresso-900 border border-cream-300 dark:border-espresso-800 rounded-xl px-4 py-2.5 text-xs text-espresso-800 dark:text-cream-50 focus:outline-none focus:ring-1 focus:ring-terracotta-500"
                  />
                </div>

                <hr className="border-cream-100 dark:border-espresso-900 my-4" />
                <p className="text-[10px] text-espresso-500 leading-normal">Leave password fields blank if you do not wish to modify your current password.</p>

                <div>
                  <label className="block text-[10px] font-semibold uppercase text-espresso-500 dark:text-cream-300 mb-1">New Password</label>
                  <input
                    type="password"
                    name="password"
                    value={profileForm.password}
                    onChange={handleProfileChange}
                    className="w-full bg-cream-50 dark:bg-espresso-900 border border-cream-300 dark:border-espresso-800 rounded-xl px-4 py-2.5 text-xs text-espresso-800 dark:text-cream-50 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold uppercase text-espresso-500 dark:text-cream-300 mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={profileForm.confirmPassword}
                    onChange={handleProfileChange}
                    className="w-full bg-cream-50 dark:bg-espresso-900 border border-cream-300 dark:border-espresso-800 rounded-xl px-4 py-2.5 text-xs text-espresso-800 dark:text-cream-50 focus:outline-none"
                  />
                </div>

                {/* Notifications */}
                {profileSuccess && (
                  <div className="text-xs text-sage-500 font-semibold bg-sage-50 dark:bg-sage-950/20 border border-sage-500/20 p-2.5 rounded-lg">
                    {profileSuccess}
                  </div>
                )}
                {profileError && (
                  <div className="text-xs text-red-500 font-semibold bg-red-50 dark:bg-red-950/20 border border-red-500/20 p-2.5 rounded-lg">
                    {profileError}
                  </div>
                )}

                <button
                  type="submit"
                  className="bg-espresso-800 hover:bg-espresso-950 dark:bg-cream-200 dark:hover:bg-white text-cream-100 dark:text-espresso-800 font-semibold px-5 py-2.5 rounded-xl text-xs transition-colors"
                >
                  Save Profile Settings
                </button>
              </form>
            </div>
          )}

        </main>
      </div>

    </div>
  );
};

export default Profile;
