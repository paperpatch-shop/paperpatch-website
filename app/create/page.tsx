'use client';

import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/Header';
import MultiImageUpload from '@/components/MultiImageUpload';
import CheckoutForm from '@/components/CheckoutForm';
import OrderConfirmation from '@/components/OrderConfirmation';
import { OrderItem, ShippingInfo, Order } from '@/lib/types';
import { SHIPPING_COST } from '@/lib/types';
import { generateOrderNumber } from '@/lib/pricing';
import { uploadImage, saveOrder } from '@/lib/supabase';

export default function CreatePage() {
  const [step, setStep] = useState(1);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  const handleMultipleImagesUpload = (items: OrderItem[]) => {
    setOrderItems(items);
    setStep(2);
  };

  const handleCheckout = async (shipping: ShippingInfo, paymentMethod: 'cod' | 'bkash', bkashTransactionId?: string) => {
    const shippingCost = shipping.insideDhaka 
      ? SHIPPING_COST.INSIDE_DHAKA 
      : SHIPPING_COST.OUTSIDE_DHAKA;
    
    const orderId = `order-${Date.now()}`;
    const orderNumber = generateOrderNumber();

    let finalItems: OrderItem[] = [];
    let postersTotal = 0;

    for (const item of orderItems) {
      let imageUrl = item.imageUrl;
      if (item.imageFile) {
        const uploadedUrl = await uploadImage(item.imageFile, `${orderId}-${orderItems.indexOf(item)}`);
        if (uploadedUrl) imageUrl = uploadedUrl;
      }
      finalItems.push({ ...item, imageUrl });
      postersTotal += item.price;
    }

    const totalAmount = postersTotal + shippingCost;

    const order: Order = {
      id: orderId,
      orderNumber,
      item: finalItems[0],
      items: finalItems,
      shipping,
      paymentMethod,
      bkashTransactionId,
      shippingCost,
      totalAmount,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    await saveOrder(order);
    setCompletedOrder(order);
    setStep(3);
  };

  const handleStartNew = () => {
    setStep(1);
    setOrderItems([]);
    setCompletedOrder(null);
  };

  return (
    <div className="min-h-screen bg-[#FFF9F0]">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {step === 1 && (
          <Link href="/" className="inline-flex items-center space-x-2 text-[#6B5444] hover:text-[#8B6F47] mb-8 transition-colors font-medium">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
        )}

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {[
              { num: 1, label: 'Upload Images' },
              { num: 2, label: 'Checkout' },
              { num: 3, label: 'Confirmation' },
            ].map((s, idx) => (
              <div key={s.num} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                      step >= s.num
                        ? 'bg-[#8B6F47] text-white shadow-md'
                        : 'bg-[#E5D5C0] text-[#9CA3AF]'
                    }`}
                  >
                    {s.num}
                  </div>
                  <span className={`text-xs mt-1 hidden sm:block ${
                    step >= s.num ? 'text-[#8B6F47] font-medium' : 'text-[#9CA3AF]'
                  }`}>
                    {s.label}
                  </span>
                </div>
                {idx < 2 && (
                  <div
                    className={`w-12 sm:w-20 h-1 mx-2 rounded transition-all ${
                      step > s.num ? 'bg-[#8B6F47]' : 'bg-[#E5D5C0]'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div>
          {step === 1 && (
            <MultiImageUpload
              onContinue={handleMultipleImagesUpload}
              onBack={() => window.history.back()}
              initialItems={orderItems}
            />
          )}
          
          {step === 2 && orderItems.length > 0 && (
            <CheckoutForm
              orderItem={orderItems[0]}
              orderItems={orderItems}
              onSubmit={handleCheckout}
              onBack={() => setStep(1)}
            />
          )}
          
          {step === 3 && completedOrder && (
            <OrderConfirmation
              order={completedOrder}
              onStartNew={handleStartNew}
            />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-paper-800 text-paper-100 py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">
            © 2025 Paperpatch. All rights reserved.
          </p>
          <p className="text-xs mt-2 text-paper-300">
            Handcrafted with care in Dhaka, Bangladesh
          </p>
        </div>
      </footer>
    </div>
  );
}
