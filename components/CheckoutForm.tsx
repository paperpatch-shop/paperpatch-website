'use client';

import { useState } from 'react';
import { ShoppingCart, MapPin, Phone, Mail, CreditCard, Banknote, ArrowLeft } from 'lucide-react';
import { OrderItem, ShippingInfo, SHIPPING_COST } from '@/lib/types';

interface CheckoutFormProps {
  orderItem: OrderItem;
  orderItems?: OrderItem[];
  onSubmit: (shipping: ShippingInfo, paymentMethod: 'cod' | 'bkash', bkashTransactionId?: string) => void;
  onBack: () => void;
}

export default function CheckoutForm({ orderItem, orderItems, onSubmit, onBack }: CheckoutFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
  });
  const [insideDhaka, setInsideDhaka] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bkash'>('cod');
  const [bkashTransactionId, setBkashTransactionId] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const shippingCost = insideDhaka ? SHIPPING_COST.INSIDE_DHAKA : SHIPPING_COST.OUTSIDE_DHAKA;
  const postersTotal = orderItems ? orderItems.reduce((sum, item) => sum + item.price, 0) : orderItem.price;
  const totalAmount = postersTotal + shippingCost;

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^01[3-9]\d{8}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid Bangladeshi phone number';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (paymentMethod === 'bkash' && !bkashTransactionId.trim()) {
      newErrors.bkashTransactionId = 'Transaction ID is required for bKash payment';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    const shipping: ShippingInfo = {
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      address: formData.address,
      city: formData.city,
      insideDhaka,
    };

    await onSubmit(
      shipping,
      paymentMethod,
      paymentMethod === 'bkash' ? bkashTransactionId : undefined
    );

    setIsSubmitting(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-[#E5D5C0] p-6">
      <div className="flex items-center space-x-2 mb-6">
        <ShoppingCart className="w-6 h-6 text-[#8B6F47]" />
        <h2 className="text-2xl font-bold text-[#6B5444]">
          Checkout
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Shipping Information */}
        <div>
          <h3 className="font-semibold text-[#6B5444] mb-4 flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-[#8B6F47]" />
            <span>Shipping Information</span>
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#6B5444] mb-2">
                Full Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`input-field ${errors.name ? 'border-red-500' : ''}`}
                placeholder="Enter your full name"
              />
              {errors.name && (
                <p className="text-sm text-red-600 mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#6B5444] mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className={`input-field ${errors.phone ? 'border-red-500' : ''}`}
                placeholder="01XXXXXXXXX"
              />
              {errors.phone && (
                <p className="text-sm text-red-600 mt-1">{errors.phone}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#6B5444] mb-2">
                Email Address *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`input-field ${errors.email ? 'border-red-500' : ''}`}
                placeholder="your@email.com"
              />
              {errors.email && (
                <p className="text-sm text-red-600 mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#6B5444] mb-2">
                Delivery Address *
              </label>
              <textarea
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className={`input-field ${errors.address ? 'border-red-500' : ''}`}
                rows={3}
                placeholder="House/Flat, Road, Area"
              />
              {errors.address && (
                <p className="text-sm text-red-600 mt-1">{errors.address}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#6B5444] mb-2">
                City *
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                className={`input-field ${errors.city ? 'border-red-500' : ''}`}
                placeholder="e.g., Dhaka, Chittagong"
              />
              {errors.city && (
                <p className="text-sm text-red-600 mt-1">{errors.city}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-paper-700 mb-3">
                Delivery Location
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setInsideDhaka(true)}
                  className={`py-3 px-4 rounded-lg border-2 transition-all duration-150 ${insideDhaka ? 'bg-[#FFFEF9] border-[#A67C52]' : 'bg-white border-[#E5D5C0] hover:border-[#C4A57B]'}`}
                >
                  <div className="text-center">
                    <p className="font-semibold text-[#6B5444]">Inside Dhaka</p>
                    <p className="text-sm text-[#8B6F47] font-medium mt-1">
                      ৳{SHIPPING_COST.INSIDE_DHAKA}
                    </p>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setInsideDhaka(false)}
                  className={`py-3 px-4 rounded-lg border-2 transition-all duration-150 ${!insideDhaka ? 'bg-[#FFFEF9] border-[#A67C52]' : 'bg-white border-[#E5D5C0] hover:border-[#C4A57B]'}`}
                >
                  <div className="text-center">
                    <p className="font-semibold text-[#6B5444]">Outside Dhaka</p>
                    <p className="text-sm text-[#8B6F47] font-medium mt-1">
                      ৳{SHIPPING_COST.OUTSIDE_DHAKA}
                    </p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div>
          <h3 className="font-semibold text-[#6B5444] mb-4 flex items-center space-x-2">
            <CreditCard className="w-5 h-5 text-[#8B6F47]" />
            <span>Payment Method</span>
          </h3>

          <div className="space-y-3">
            <button
              type="button"
              onClick={() => setPaymentMethod('cod')}
              className={`py-3 px-4 rounded-lg border-2 transition-all duration-150 w-full ${paymentMethod === 'cod' ? 'bg-[#FFFEF9] border-[#A67C52]' : 'bg-white border-[#E5D5C0] hover:border-[#C4A57B]'}`}
            >
              <div className="flex items-center space-x-3">
                <Banknote className="w-6 h-6 text-[#8B6F47]" />
                <div className="text-left">
                  <p className="font-semibold text-[#6B5444]">Cash on Delivery</p>
                  <p className="text-sm text-[#6B5444]/70">Pay when you receive</p>
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('bkash')}
              className={`py-3 px-4 rounded-lg border-2 transition-all duration-150 w-full ${paymentMethod === 'bkash' ? 'bg-[#FFFEF9] border-[#A67C52]' : 'bg-white border-[#E5D5C0] hover:border-[#C4A57B]'}`}
            >
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-pink-600 rounded flex items-center justify-center text-white font-bold text-xs">
                  bK
                </div>
                <div className="text-left">
                  <p className="font-semibold text-[#6B5444]">bKash</p>
                  <p className="text-sm text-[#6B5444]/70">Mobile payment</p>
                </div>
              </div>
            </button>
          </div>

          {paymentMethod === 'bkash' && (
            <div className="mt-4 bg-[#FFF9F0] border border-[#E5D5C0] rounded-lg p-4">
              <p className="text-sm text-[#6B5444] font-medium mb-2">
                bKash Payment Instructions:
              </p>
              <ol className="text-sm text-[#6B5444]/80 space-y-1 mb-3">
                <li>1. Send money to: <strong>01822705659</strong></li>
                <li>2. Enter the transaction ID below</li>
                <li>3. Your order will be confirmed by admin after verification</li>
              </ol>
              <input
                type="text"
                value={bkashTransactionId}
                onChange={(e) => {
                  setBkashTransactionId(e.target.value);
                  if (errors.bkashTransactionId) {
                    setErrors({ ...errors, bkashTransactionId: '' });
                  }
                }}
                className={`input-field ${errors.bkashTransactionId ? 'border-red-500' : ''}`}
                placeholder="Enter bKash Transaction ID"
              />
              {errors.bkashTransactionId && (
                <p className="text-sm text-red-600 mt-1">{errors.bkashTransactionId}</p>
              )}
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="bg-[#FFF9F0] border border-[#E5D5C0] rounded-lg p-4">
          <h3 className="font-semibold text-[#6B5444] mb-3">Order Summary</h3>
          <div className="space-y-2 text-sm">
            {orderItems ? (
              <>
                <div className="font-medium text-[#6B5444] mb-2">
                  {orderItems.length} {orderItems.length === 1 ? 'Poster' : 'Posters'}
                </div>
                {orderItems.map((item, idx) => (
                  <div key={idx} className="flex justify-between py-1 border-b border-[#E5D5C0] last:border-0">
                    <span className="text-[#6B5444]/80">
                      {item.width}" × {item.height}" {item.withBoard ? '(with board)' : ''}
                    </span>
                    <span className="font-medium">৳{item.price}</span>
                  </div>
                ))}
                <div className="flex justify-between pt-2 border-t border-[#C4A57B]">
                  <span className="text-[#6B5444]/80">Posters Subtotal</span>
                  <span className="font-medium">৳{postersTotal}</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-between">
                  <span className="text-[#6B5444]/80">Poster ({orderItem.width}" × {orderItem.height}")</span>
                  <span className="font-medium">৳{orderItem.price}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B5444]/80">Board Option</span>
                  <span className="font-medium">{orderItem.withBoard ? 'With Board' : 'Without Board'}</span>
                </div>
              </>
            )}
            <div className="flex justify-between">
              <span className="text-[#6B5444]/80">Shipping</span>
              <span className="font-medium">৳{shippingCost}</span>
            </div>
            <div className="border-t border-[#C4A57B] pt-2 mt-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-[#6B5444]">Total Amount</span>
                <span className="text-2xl font-bold text-[#8B6F47]">৳{totalAmount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-3 bg-white/80 backdrop-blur-sm border border-[#E5D5C0] hover:border-[#C4A57B] rounded-xl font-semibold text-[#6B5444] transition-all duration-150 flex items-center space-x-2"
            disabled={isSubmitting}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 px-6 py-3 bg-[#8B6F47] hover:bg-[#6B5444] text-white rounded-xl font-bold text-lg transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl"
          >
            {isSubmitting ? 'Processing...' : 'Place Order'}
          </button>
        </div>
      </form>
    </div>
  );
}
