'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  LogOut, 
  Package, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  XCircle,
  TrendingUp,
  Filter,
  Search,
  FileText,
  Settings,
  Image as ImageIcon
} from 'lucide-react';
import { getOrders } from '@/lib/supabase';
import { Order, AdminStats } from '@/lib/types';
import OrderCard from './OrderCard';
import PriceManager from './PriceManager';
import GalleryManager from './GalleryManager';
import Link from 'next/link';

interface AdminDashboardProps {
  onLogout: () => void;
}

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<AdminStats>({
    totalOrders: 0,
    pendingOrders: 0,
    approvedOrders: 0,
    rejectedOrders: 0,
    totalRevenue: 0,
  });
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showPriceManager, setShowPriceManager] = useState(false);
  const [showGalleryManager, setShowGalleryManager] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, filterStatus, searchQuery]);

  const loadOrders = async () => {
    setIsLoading(true);
    const fetchedOrders = await getOrders();
    setOrders(fetchedOrders);
    calculateStats(fetchedOrders);
    setIsLoading(false);
  };

  const calculateStats = (ordersList: Order[]) => {
    const newStats: AdminStats = {
      totalOrders: ordersList.length,
      pendingOrders: ordersList.filter(o => o.status === 'pending').length,
      approvedOrders: ordersList.filter(o => o.status === 'approved').length,
      rejectedOrders: ordersList.filter(o => o.status === 'rejected').length,
      totalRevenue: ordersList
        .filter(o => o.status === 'approved' || o.status === 'completed')
        .reduce((sum, o) => sum + o.totalAmount, 0),
    };
    setStats(newStats);
  };

  const filterOrders = () => {
    let filtered = [...orders];

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(o => o.status === filterStatus);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(o => 
        o.orderNumber.toLowerCase().includes(query) ||
        o.shipping.name.toLowerCase().includes(query) ||
        o.shipping.phone.includes(query) ||
        o.shipping.email.toLowerCase().includes(query)
      );
    }

    setFilteredOrders(filtered);
  };

  const handleOrderUpdate = () => {
    loadOrders();
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white border-b-2 border-paper-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link href="/" className="flex items-center space-x-3 group">
                <Image
                  src="/logo.png"
                  alt="Paperpatch"
                  width={150}
                  height={50}
                  className="h-12 w-auto"
                  priority
                />
                <div className="border-l-2 border-paper-300 pl-3">
                  <h1 className="text-xl font-display font-bold text-paper-900">
                    Admin Panel
                  </h1>
                  <p className="text-xs text-paper-600">Order Management</p>
                </div>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowGalleryManager(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-[#8B6F47] hover:bg-[#6B5444] text-white rounded-lg transition-colors font-medium"
              >
                <ImageIcon className="w-5 h-5" />
                <span className="hidden sm:inline">Gallery</span>
              </button>
              <button
                onClick={() => setShowPriceManager(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-[#8B6F47] hover:bg-[#6B5444] text-white rounded-lg transition-colors font-medium"
              >
                <Settings className="w-5 h-5" />
                <span className="hidden sm:inline">Prices</span>
              </button>
              <button
                onClick={onLogout}
                className="flex items-center space-x-2 text-paper-600 hover:text-red-600 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="paper-card p-4">
            <div className="flex items-center justify-between mb-2">
              <Package className="w-8 h-8 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-paper-900">{stats.totalOrders}</p>
            <p className="text-sm text-paper-600">Total Orders</p>
          </div>

          <div className="paper-card p-4">
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
            <p className="text-2xl font-bold text-paper-900">{stats.pendingOrders}</p>
            <p className="text-sm text-paper-600">Pending</p>
          </div>

          <div className="paper-card p-4">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-paper-900">{stats.approvedOrders}</p>
            <p className="text-sm text-paper-600">Approved</p>
          </div>

          <div className="paper-card p-4">
            <div className="flex items-center justify-between mb-2">
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
            <p className="text-2xl font-bold text-paper-900">{stats.rejectedOrders}</p>
            <p className="text-sm text-paper-600">Rejected</p>
          </div>

          <div className="paper-card p-4 bg-gradient-to-br from-warm-50 to-warm-100">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-8 h-8 text-warm-700" />
            </div>
            <p className="text-2xl font-bold text-warm-800">৳{stats.totalRevenue}</p>
            <p className="text-sm text-warm-700">Total Revenue</p>
          </div>
        </div>

        {/* Filters */}
        <div className="paper-card p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-paper-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by order number, name, phone..."
                  className="input-field pl-10"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-paper-600" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="input-field"
              >
                <option value="all">All Orders</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders List */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-warm-600 mx-auto mb-4"></div>
            <p className="text-paper-600">Loading orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="paper-card p-12 text-center">
            <Package className="w-16 h-16 text-paper-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-paper-900 mb-2">No orders found</p>
            <p className="text-paper-600">
              {searchQuery || filterStatus !== 'all'
                ? 'Try adjusting your filters'
                : 'Orders will appear here once customers place them'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onUpdate={handleOrderUpdate}
              />
            ))}
          </div>
        )}
      </main>

      {/* Price Manager Modal */}
      {showPriceManager && (
        <PriceManager onClose={() => setShowPriceManager(false)} />
      )}

      {/* Gallery Manager Modal */}
      {showGalleryManager && (
        <GalleryManager onClose={() => setShowGalleryManager(false)} />
      )}
    </div>
  );
}
