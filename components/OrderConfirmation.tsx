'use client';

import { CheckCircle2, Package, MapPin, CreditCard, Home } from 'lucide-react';
import { Order } from '@/lib/types';

interface OrderConfirmationProps {
  order: Order;
  onStartNew: () => void;
}

export default function OrderConfirmation({ order, onStartNew }: OrderConfirmationProps) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-[#E5D5C0] p-6">
      {/* Success Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <CheckCircle2 className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-3xl font-bold text-[#6B5444] mb-2">
          Order Placed Successfully!
        </h2>
        <p className="text-[#6B5444]/80">
          Thank you for your order. We'll review your design and get back to you soon.
        </p>
      </div>

      {/* Order Number */}
      <div className="bg-[#FFF9F0] border-2 border-[#C4A57B] rounded-lg p-4 mb-6 text-center">
        <p className="text-sm text-[#6B5444]/70 mb-1">Order Number</p>
        <p className="text-2xl font-bold text-[#8B6F47] font-mono">
          {order.orderNumber}
        </p>
        <p className="text-xs text-[#6B5444]/60 mt-2">
          Please save this number for tracking your order
        </p>
      </div>

      {/* Order Details */}
      <div className="space-y-4 mb-6">
        <div className="flex items-start space-x-3">
          <Package className="w-5 h-5 text-[#8B6F47] flex-shrink-0 mt-1" />
          <div className="flex-1">
            <p className="font-semibold text-paper-900">
              {order.items && order.items.length > 1 ? `${order.items.length} Posters` : 'Poster Details'}
            </p>
            {order.items && order.items.length > 1 ? (
              <div className="space-y-2 mt-2">
                {order.items.map((item, idx) => (
                  <div key={idx} className="text-sm text-[#6B5444]/80 bg-[#FFF9F0] p-2 rounded">
                    <p className="font-medium">Poster {idx + 1}: {item.width}" × {item.height}"</p>
                    <p>{item.withBoard ? 'With Board' : 'Without Board'} - ৳{item.price}</p>
                  </div>
                ))}
                <p className="text-sm font-medium text-[#8B6F47] mt-2">
                  Subtotal: ৳{order.items.reduce((sum, item) => sum + item.price, 0)}
                </p>
              </div>
            ) : (
              <>
                <p className="text-sm text-[#6B5444]/80">
                  Size: {order.item.width}" × {order.item.height}"
                </p>
                <p className="text-sm text-[#6B5444]/80">
                  {order.item.withBoard ? 'With Board' : 'Without Board'}
                </p>
                <p className="text-sm font-medium text-[#8B6F47] mt-1">
                  ৳{order.item.price}
                </p>
              </>
            )}
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <MapPin className="w-5 h-5 text-[#8B6F47] flex-shrink-0 mt-1" />
          <div className="flex-1">
            <p className="font-semibold text-[#6B5444]">Delivery Address</p>
            <p className="text-sm text-[#6B5444]/80">{order.shipping.name}</p>
            <p className="text-sm text-[#6B5444]/80">{order.shipping.phone}</p>
            <p className="text-sm text-[#6B5444]/80">{order.shipping.address}</p>
            <p className="text-sm text-[#6B5444]/80">{order.shipping.city}</p>
            <p className="text-sm font-medium text-[#8B6F47] mt-1">
              Delivery: ৳{order.shippingCost}
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <CreditCard className="w-5 h-5 text-[#8B6F47] flex-shrink-0 mt-1" />
          <div className="flex-1">
            <p className="font-semibold text-[#6B5444]">Payment Method</p>
            <p className="text-sm text-[#6B5444]/80">
              {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'bKash'}
            </p>
            {order.bkashTransactionId && (
              <p className="text-sm text-[#6B5444]/80">
                Transaction ID: {order.bkashTransactionId}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Total Amount */}
      <div className="bg-[#FFF9F0] border-2 border-[#C4A57B] rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center">
          <span className="font-bold text-[#6B5444]">Total Amount</span>
          <span className="text-2xl font-bold text-[#8B6F47]">
            ৳{order.totalAmount}
          </span>
        </div>
      </div>

      {/* Next Steps */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-[#6B5444] mb-2">What's Next?</h3>
        <ol className="text-sm text-[#6B5444]/80 space-y-2">
          <li className="flex items-start">
            <span className="font-bold mr-2">1.</span>
            <span>Our team will review your design for print quality</span>
          </li>
          <li className="flex items-start">
            <span className="font-bold mr-2">2.</span>
            <span>You'll receive a confirmation email within 24 hours</span>
          </li>
          <li className="flex items-start">
            <span className="font-bold mr-2">3.</span>
            <span>Once approved, we'll start printing your poster</span>
          </li>
          <li className="flex items-start">
            <span className="font-bold mr-2">4.</span>
            <span>Delivery typically takes 3-5 business days</span>
          </li>
        </ol>
      </div>

      {/* Confirmation Email Notice */}
      <div className="bg-[#FFF9F0] rounded-lg p-4 mb-6">
        <p className="text-sm text-[#6B5444]/80 text-center">
          A confirmation email has been sent to{' '}
          <strong>{order.shipping.email}</strong>
        </p>
      </div>

      {/* Action Button */}
      <button
        onClick={onStartNew}
        className="w-full px-6 py-3 bg-[#8B6F47] hover:bg-[#6B5444] text-white rounded-xl font-bold text-lg transition-all duration-150 shadow-xl flex items-center justify-center space-x-2"
      >
        <Home className="w-5 h-5" />
        <span>Create Another Poster</span>
      </button>
    </div>
  );
}
