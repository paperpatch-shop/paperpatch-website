'use client';

import { useState } from 'react';
import { 
  Package, 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  CreditCard,
  Calendar,
  ChevronDown,
  ChevronUp,
  Check,
  X,
  Edit2,
  Image as ImageIcon,
  Download,
  Trash2
} from 'lucide-react';
import { Order } from '@/lib/types';
import { updateOrderStatus, updateOrderPrice, deleteOrder } from '@/lib/supabase';

interface OrderCardProps {
  order: Order;
  onUpdate: () => void;
}

export default function OrderCard({ order, onUpdate }: OrderCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isEditingPrice, setIsEditingPrice] = useState(false);
  const [newPrice, setNewPrice] = useState(order.item.price.toString());
  const [notes, setNotes] = useState(order.notes || '');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-paper-100 text-paper-800 border-paper-300';
    }
  };

  const handleStatusUpdate = async (newStatus: string) => {
    setIsUpdating(true);
    const success = await updateOrderStatus(order.id, newStatus, notes);
    if (success) {
      onUpdate();
    } else {
      alert('Failed to update order status');
    }
    setIsUpdating(false);
  };

  const handlePriceUpdate = async () => {
    const price = parseFloat(newPrice);
    if (isNaN(price) || price <= 0) {
      alert('Please enter a valid price');
      return;
    }

    setIsUpdating(true);
    const success = await updateOrderPrice(order.id, price);
    if (success) {
      setIsEditingPrice(false);
      onUpdate();
    } else {
      alert('Failed to update price');
    }
    setIsUpdating(false);
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete order #${order.id.slice(0, 8)}? This action cannot be undone.`)) {
      return;
    }

    setIsUpdating(true);
    try {
      const success = await deleteOrder(order.id);
      if (success) {
        onUpdate();
      } else {
        alert('Failed to delete order');
      }
    } catch (error) {
      alert('Failed to delete order');
    }
    setIsUpdating(false);
  };

  const handleDownloadImages = async () => {
    if (!order.items || order.items.length === 0) return;

    try {
      // Dynamically import JSZip
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();

      // Group images by size and board option
      const imagesByCategory: { [key: string]: string[] } = {};

      for (const item of order.items) {
        if (item.imageUrl) {
          const boardStatus = item.withBoard ? 'with_board' : 'without_board';
          const categoryKey = `${item.width}x${item.height}_${boardStatus}`;
          if (!imagesByCategory[categoryKey]) {
            imagesByCategory[categoryKey] = [];
          }
          imagesByCategory[categoryKey].push(item.imageUrl);
        }
      }

      // Download and add images to zip
      for (const [category, urls] of Object.entries(imagesByCategory)) {
        const folder = zip.folder(category);
        if (!folder) continue;

        for (let i = 0; i < urls.length; i++) {
          try {
            let blob: Blob;
            
            // Check if it's a data URL (base64)
            if (urls[i].startsWith('data:')) {
              const response = await fetch(urls[i]);
              blob = await response.blob();
            } else {
              // Regular URL
              const response = await fetch(urls[i]);
              blob = await response.blob();
            }
            
            const extension = urls[i].includes('data:image/') 
              ? urls[i].split('data:image/')[1]?.split(';')[0] || 'jpg'
              : urls[i].split('.').pop()?.split('?')[0] || 'jpg';
            
            folder.file(`image_${i + 1}.${extension}`, blob);
          } catch (error) {
            console.error(`Failed to download image ${i + 1}:`, error);
          }
        }
      }

      // Generate and download zip
      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.download = `order_${order.orderNumber}_images.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error creating zip:', error);
      alert('Failed to download images. Please try again.');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="paper-card overflow-hidden">
      {/* Header */}
      <div
        className="p-4 cursor-pointer hover:bg-paper-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1">
            <div className="flex-shrink-0">
              <Package className="w-6 h-6 text-warm-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-3 mb-1">
                <p className="font-bold text-paper-900 font-mono">
                  {order.orderNumber}
                </p>
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                  {order.status.toUpperCase()}
                </span>
              </div>
              <p className="text-sm text-paper-600 truncate">
                {order.shipping.name} • {order.items && order.items.length > 1 ? `${order.items.length} posters` : `${order.item.width}" × ${order.item.height}"`} • ৳{order.totalAmount}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {order.status === 'pending' && (
              <div className="flex space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStatusUpdate('approved');
                  }}
                  disabled={isUpdating}
                  className="p-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition-colors"
                  title="Approve"
                >
                  <Check className="w-5 h-5" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStatusUpdate('rejected');
                  }}
                  disabled={isUpdating}
                  className="p-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
                  title="Reject"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
              disabled={isUpdating}
              className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
              title="Delete Order"
            >
              <Trash2 className="w-5 h-5" />
            </button>
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-paper-600" />
            ) : (
              <ChevronDown className="w-5 h-5 text-paper-600" />
            )}
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-paper-200 p-4 bg-paper-50">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              {/* Order Details */}
              <div>
                <h4 className="font-semibold text-paper-900 mb-3 flex items-center space-x-2">
                  <Package className="w-4 h-4" />
                  <span>Order Details</span>
                </h4>
                <div className="bg-white rounded-lg p-3 space-y-2 text-sm">
                  {order.items && order.items.length > 1 ? (
                    <>
                      <div className="font-medium text-paper-800 mb-2">
                        {order.items.length} Posters
                      </div>
                      {order.items.map((item, idx) => (
                        <div key={idx} className="py-2 border-b border-paper-100 last:border-0">
                          <div className="flex justify-between">
                            <span className="text-paper-600">Poster {idx + 1}:</span>
                            <span className="font-medium">{item.width}" × {item.height}"</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-paper-500">{item.withBoard ? 'With Board' : 'Without Board'}</span>
                            <span className="font-medium">৳{item.price}</span>
                          </div>
                        </div>
                      ))}
                      <div className="flex justify-between pt-2 border-t border-paper-200">
                        <span className="text-paper-600">Posters Total:</span>
                        <span className="font-medium">৳{order.items.reduce((sum, item) => sum + item.price, 0)}</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between">
                        <span className="text-paper-600">Size:</span>
                        <span className="font-medium">{order.item.width}" × {order.item.height}"</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-paper-600">Board:</span>
                        <span className="font-medium">{order.item.withBoard ? 'With Board' : 'Without Board'}</span>
                      </div>
                    </>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-paper-600">{order.items && order.items.length > 1 ? 'Order Total:' : 'Poster Price:'}</span>
                    {isEditingPrice ? (
                      <div className="flex items-center space-x-2">
                        <input
                          type="number"
                          value={newPrice}
                          onChange={(e) => setNewPrice(e.target.value)}
                          className="w-24 px-2 py-1 border border-paper-300 rounded text-right"
                          onClick={(e) => e.stopPropagation()}
                        />
                        <button
                          onClick={handlePriceUpdate}
                          disabled={isUpdating}
                          className="p-1 bg-green-100 hover:bg-green-200 text-green-700 rounded"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setIsEditingPrice(false);
                            setNewPrice(order.item.price.toString());
                          }}
                          className="p-1 bg-red-100 hover:bg-red-200 text-red-700 rounded"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">৳{order.item.price}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsEditingPrice(true);
                          }}
                          className="p-1 hover:bg-paper-200 rounded"
                        >
                          <Edit2 className="w-3 h-3 text-paper-600" />
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-between">
                    <span className="text-paper-600">Shipping:</span>
                    <span className="font-medium">৳{order.shippingCost}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-paper-200">
                    <span className="font-semibold text-paper-900">Total:</span>
                    <span className="font-bold text-warm-700">৳{order.totalAmount}</span>
                  </div>
                </div>
              </div>

              {/* Customer Info */}
              <div>
                <h4 className="font-semibold text-paper-900 mb-3 flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>Customer Information</span>
                </h4>
                <div className="bg-white rounded-lg p-3 space-y-2 text-sm">
                  <div className="flex items-start space-x-2">
                    <User className="w-4 h-4 text-paper-600 mt-0.5" />
                    <div>
                      <p className="font-medium">{order.shipping.name}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Phone className="w-4 h-4 text-paper-600 mt-0.5" />
                    <div>
                      <p className="font-medium">{order.shipping.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Mail className="w-4 h-4 text-paper-600 mt-0.5" />
                    <div>
                      <p className="font-medium break-all">{order.shipping.email}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <MapPin className="w-4 h-4 text-paper-600 mt-0.5" />
                    <div>
                      <p className="font-medium">{order.shipping.address}</p>
                      <p className="text-paper-600">{order.shipping.city}</p>
                      <p className="text-xs text-paper-500 mt-1">
                        {order.shipping.insideDhaka ? 'Inside Dhaka' : 'Outside Dhaka'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Info */}
              <div>
                <h4 className="font-semibold text-paper-900 mb-3 flex items-center space-x-2">
                  <CreditCard className="w-4 h-4" />
                  <span>Payment Information</span>
                </h4>
                <div className="bg-white rounded-lg p-3 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-paper-600">Method:</span>
                    <span className="font-medium">
                      {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'bKash'}
                    </span>
                  </div>
                  {order.bkashTransactionId && (
                    <div className="flex justify-between">
                      <span className="text-paper-600">Transaction ID:</span>
                      <span className="font-medium font-mono">{order.bkashTransactionId}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-paper-600">Order Date:</span>
                    <span className="font-medium">{formatDate(order.createdAt)}</span>
                  </div>
                  {order.approvedAt && (
                    <div className="flex justify-between">
                      <span className="text-paper-600">Approved:</span>
                      <span className="font-medium">{formatDate(order.approvedAt)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {/* Images Preview */}
              {order.items && order.items.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-paper-900 flex items-center space-x-2">
                      <ImageIcon className="w-4 h-4" />
                      <span>Uploaded Images ({order.items.length})</span>
                    </h4>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownloadImages();
                      }}
                      className="flex items-center space-x-2 px-3 py-1.5 bg-[#8B6F47] hover:bg-[#6B5444] text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download All</span>
                    </button>
                  </div>
                  <div className="bg-white rounded-lg p-3 space-y-3 max-h-96 overflow-y-auto">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="border border-paper-200 rounded-lg p-2">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium text-paper-600">
                            {item.width}" × {item.height}" {item.withBoard ? '(with board)' : ''}
                          </span>
                          <span className="text-xs text-paper-500">৳{item.price}</span>
                        </div>
                        {item.imageUrl && (
                          <>
                            <img
                              src={item.imageUrl}
                              alt={`Upload ${idx + 1}`}
                              className="w-full h-auto rounded shadow-sm"
                            />
                            <a
                              href={item.imageUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block mt-1 text-xs text-warm-600 hover:text-warm-700 text-center"
                              onClick={(e) => e.stopPropagation()}
                            >
                              View Full Size
                            </a>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Admin Notes */}
              <div>
                <h4 className="font-semibold text-paper-900 mb-3">Admin Notes</h4>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="input-field"
                  rows={4}
                  placeholder="Add notes about this order..."
                  onClick={(e) => e.stopPropagation()}
                />
              </div>

              {/* Status Actions */}
              {order.status === 'pending' && (
                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-semibold text-paper-900 mb-3">Update Status</h4>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleStatusUpdate('approved')}
                      disabled={isUpdating}
                      className="flex-1 btn-primary bg-green-600 hover:bg-green-700"
                    >
                      <Check className="w-4 h-4 inline mr-2" />
                      Approve Order
                    </button>
                    <button
                      onClick={() => handleStatusUpdate('rejected')}
                      disabled={isUpdating}
                      className="flex-1 btn-primary bg-red-600 hover:bg-red-700"
                    >
                      <X className="w-4 h-4 inline mr-2" />
                      Reject Order
                    </button>
                  </div>
                </div>
              )}

              {order.status === 'approved' && (
                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-semibold text-paper-900 mb-3">Mark as Completed</h4>
                  <button
                    onClick={() => handleStatusUpdate('completed')}
                    disabled={isUpdating}
                    className="w-full btn-primary bg-blue-600 hover:bg-blue-700"
                  >
                    <Check className="w-4 h-4 inline mr-2" />
                    Mark as Completed
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
