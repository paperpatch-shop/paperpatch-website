'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Package, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import { getGalleryImages } from '@/lib/supabase';

export default function GalleryPage() {
  const [activeTab, setActiveTab] = useState<'orders' | 'reviews'>('orders');
  const [dbImages, setDbImages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    try {
      const images = await getGalleryImages();
      setDbImages(images);
    } catch (error) {
      console.error('Error loading gallery images:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter images by category and sort by order_index
  const previousOrders = dbImages
    .filter(img => img.category === 'previous_orders')
    .sort((a, b) => (a.order_index || 0) - (b.order_index || 0))
    .map(img => img.image_url);
  
  const reviews = dbImages
    .filter(img => img.category === 'reviews')
    .sort((a, b) => (a.order_index || 0) - (b.order_index || 0))
    .map(img => ({ image: img.image_url }));

  return (
    <div className="min-h-screen bg-[#FFF9F0]">
      <Header />
      
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 10px;
          height: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #E5D5C0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #C4A57B 0%, #8B6F47 100%);
          border-radius: 10px;
          border: 2px solid #E5D5C0;
          transition: all 0.3s ease;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #8B6F47 0%, #6B5444 100%);
          border-color: #C4A57B;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:active {
          background: #6B5444;
        }
      `}</style>
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <Link href="/" className="inline-flex items-center space-x-2 text-[#6B5444] hover:text-[#8B6F47] mb-8 transition-colors font-medium">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        <div className="mb-8 text-center">
          <h1 className="text-5xl font-bold text-[#6B5444] mb-4">
            Our Gallery
          </h1>
          <p className="text-lg text-[#6B5444]/80">
            Explore our previous work and customer reviews
          </p>
        </div>

        {/* Sticky Tab Switcher - Mobile Only */}
        <div className="lg:hidden sticky top-0 z-40 bg-[#FFF9F0] pb-4 -mx-4 px-4">
          <div className="flex bg-white/80 backdrop-blur-sm rounded-xl border-2 border-[#E5D5C0] p-1 shadow-md">
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
                activeTab === 'orders'
                  ? 'bg-[#8B6F47] text-white shadow-lg'
                  : 'text-[#6B5444] hover:bg-[#FFF9F0]'
              }`}
            >
              <Package className="w-5 h-5" />
              <span>Previous Orders</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                activeTab === 'orders' 
                  ? 'bg-white/20 text-white' 
                  : 'bg-[#FFF9F0] text-[#8B6F47]'
              }`}>
                {previousOrders.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
                activeTab === 'reviews'
                  ? 'bg-[#8B6F47] text-white shadow-lg'
                  : 'text-[#6B5444] hover:bg-[#FFF9F0]'
              }`}
            >
              <MessageSquare className="w-5 h-5" />
              <span>Reviews</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                activeTab === 'reviews' 
                  ? 'bg-white/20 text-white' 
                  : 'bg-[#FFF9F0] text-[#8B6F47]'
              }`}>
                {reviews.length}
              </span>
            </button>
          </div>
        </div>

        {/* Side by Side Scrolling Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Previous Orders */}
          <div className={`bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-[#E5D5C0] p-6 overflow-hidden ${
            activeTab === 'reviews' ? 'hidden lg:block' : ''
          }`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-[#6B5444]">Previous Orders</h2>
              <span className="text-sm text-[#8B6F47] font-medium bg-[#FFF9F0] px-3 py-1 rounded-full">
                {previousOrders.length} photos
              </span>
            </div>
            
            <div className="h-[600px] overflow-y-auto custom-scrollbar pr-2">
              <div className="grid grid-cols-2 gap-3">
                {previousOrders.map((src: string, idx: number) => (
                  <div
                    key={idx}
                    className="relative aspect-square rounded-xl overflow-hidden border-2 border-[#E5D5C0] hover:border-[#C4A57B] transition-all duration-200 hover:shadow-xl hover:scale-105"
                  >
                    <Image
                      src={src}
                      alt={`Previous order ${idx + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Customer Reviews */}
          <div className={`bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-[#E5D5C0] p-6 overflow-hidden ${
            activeTab === 'orders' ? 'hidden lg:block' : ''
          }`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-[#6B5444]">Customer Reviews</h2>
              <span className="text-sm text-[#8B6F47] font-medium bg-[#FFF9F0] px-3 py-1 rounded-full">
                {reviews.length} reviews
              </span>
            </div>
            
            <div className="h-[600px] overflow-y-auto custom-scrollbar pr-2">
              <div className="space-y-4">
                {reviews.map((review: { image: string }, idx: number) => (
                  <div
                    key={idx}
                    className="relative rounded-xl overflow-hidden border-2 border-[#E5D5C0] hover:border-[#C4A57B] transition-all duration-200 hover:shadow-xl hover:scale-[1.02]"
                  >
                    <div className="relative w-full aspect-[3/4]">
                      <Image
                        src={review.image}
                        alt={`Customer review ${idx + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
