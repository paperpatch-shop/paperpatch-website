'use client';

import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
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

    // Send order confirmation emails
    try {
      const emailResponse = await fetch('/api/send-order-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: orderNumber,
          customerName: shipping.name,
          customerEmail: shipping.email,
          customerPhone: shipping.phone,
          customerAddress: `${shipping.address}, ${shipping.city}`,
          items: finalItems.map(item => ({
            imageUrl: item.imageUrl,
            width: item.width,
            height: item.height,
            withBoard: item.withBoard,
            price: item.price,
          })),
          subtotal: postersTotal,
          shippingCost,
          total: totalAmount,
          paymentMethod: paymentMethod === 'cod' ? 'Cash on Delivery' : `bKash (TxID: ${bkashTransactionId})`,
        }),
      });
      
      if (!emailResponse.ok) {
        const errorData = await emailResponse.json();
        console.error('Email API error:', errorData);
      } else {
        console.log('Emails sent successfully');
      }
    } catch (error) {
      console.error('Failed to send order emails:', error);
      // Don't block order completion if email fails
    }

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
          <a 
            href="https://instagram.com/paperpatchbd/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-base text-paper-100/80 hover:text-paper-100 transition-colors duration-200 group"
          >
            <span className="font-light">Reach us on</span>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-full shadow-sm group-hover:shadow-md transition-all duration-200 group-hover:scale-105">
              <Image 
                src="/instagram-icon.svg" 
                alt="Instagram" 
                width={16} 
                height={16}
                className="w-4 h-4 brightness-0 invert"
              />
              <span className="font-medium text-sm">Instagram</span>
            </div>
            <span className="font-light">for any query</span>
          </a>
        </div>
      </footer>
    </div>
  );
}
