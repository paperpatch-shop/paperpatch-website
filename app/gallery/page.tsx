'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Star, Package, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import { getGalleryImages } from '@/lib/supabase';

// Generate array of previous order images
const previousOrders = Array.from({ length: 86 }, (_, i) => {
  const files = [
    'paperpatchbd_1675337453_3029272580646865000_49566010705.webp',
    'paperpatchbd_1675337453_3029272580646936604_49566010705.webp',
    'paperpatchbd_1675337453_3029272580646960736_49566010705.webp',
    'paperpatchbd_1675337453_3029272580646964380_49566010705.webp',
    'paperpatchbd_1675337453_3029272580647002777_49566010705.webp',
    'paperpatchbd_1675337453_3029272580655368351_49566010705.webp',
    'paperpatchbd_1675337453_3029272580671993016_49566010705.webp',
    'paperpatchbd_1675337453_3029272580856612362_49566010705.webp',
    'paperpatchbd_1685628260_3115598126640555692_49566010705.webp',
    'paperpatchbd_1685628260_3115598126657359507_49566010705.webp',
    'paperpatchbd_1685628260_3115598126657387048_49566010705.webp',
    'paperpatchbd_1685628260_3115598126657548053_49566010705.webp',
    'paperpatchbd_1685628260_3115598126657558150_49566010705.webp',
    'paperpatchbd_1685628260_3115598126799958054_49566010705.webp',
    'paperpatchbd_1695034643_3194504582131132447_49566010705.webp',
    'paperpatchbd_1695034643_3194504582131347832_49566010705.webp',
    'paperpatchbd_1695034643_3194504582139702798_49566010705.webp',
    'paperpatchbd_1695034643_3194504582139734011_49566010705.webp',
    'paperpatchbd_1710524854_3324445889560945633_49566010705.webp',
    'paperpatchbd_1710524854_3324445889560953344_49566010705.webp',
    'paperpatchbd_1710524854_3324445889561000164_49566010705.webp',
    'paperpatchbd_1710524854_3324445889561013051_49566010705.webp',
    'paperpatchbd_1710524854_3324445889678480435_49566010705.webp',
    'paperpatchbd_1710524854_3324445889703611248_49566010705.webp',
    'paperpatchbd_1713894926_3352716101460461227_49566010705.webp',
    'paperpatchbd_1713894926_3352716101460528963_49566010705.webp',
    'paperpatchbd_1713894926_3352716101460536834_49566010705.webp',
    'paperpatchbd_1713894926_3352716101460633191_49566010705.webp',
    'paperpatchbd_1713894926_3352716101552938153_49566010705.webp',
    'paperpatchbd_1713894926_3352716101594649737_49566010705.webp',
    'paperpatchbd_1713895036_3352717022739427832_49566010705.webp',
    'paperpatchbd_1713895036_3352717022739450791_49566010705.webp',
    'paperpatchbd_1713895036_3352717022739510266_49566010705.webp',
    'paperpatchbd_1713895036_3352717022873751691_49566010705.webp',
    'paperpatchbd_1713895213_3352718507699322950_49566010705.webp',
    'paperpatchbd_1713895213_3352718507707511867_49566010705.webp',
    'paperpatchbd_1713895213_3352718507824953392_49566010705.webp',
    'paperpatchbd_1713895213_3352718507824956032_49566010705.webp',
    'paperpatchbd_1713895213_3352718507825116769_49566010705.webp',
    'paperpatchbd_1713895213_3352718507833504506_49566010705.webp',
    'paperpatchbd_1713895213_3352718507841720308_49566010705.webp',
    'paperpatchbd_1714819225_3360469682881570248_49566010705.webp',
    'paperpatchbd_1714819225_3360469682881593735_49566010705.webp',
    'paperpatchbd_1714819225_3360469682881603526_49566010705.webp',
    'paperpatchbd_1714819225_3360469682881733583_49566010705.webp',
    'paperpatchbd_1714819225_3360469682881754007_49566010705.webp',
    'paperpatchbd_1714819225_3360469682881762369_49566010705.webp',
    'paperpatchbd_1714819225_3360469682881780797_49566010705.webp',
    'paperpatchbd_1714819225_3360469682881795559_49566010705.webp',
    'paperpatchbd_1714819225_3360469683183588527_49566010705.webp',
    'paperpatchbd_1714819225_3360469683200452628_49566010705.webp',
    'paperpatchbd_1725889133_3453330807765650050_49566010705.webp',
    'paperpatchbd_1725889133_3453330807765723118_49566010705.webp',
    'paperpatchbd_1725889133_3453330807774154317_49566010705.webp',
    'paperpatchbd_1725889133_3453330807899980120_49566010705.webp',
    'paperpatchbd_1725889133_3453330808000644223_49566010705.webp',
    'paperpatchbd_1732800272_3511305638670582725_49566010705.webp',
    'paperpatchbd_1732800272_3511305638670598069_49566010705.webp',
    'paperpatchbd_1732800272_3511305638670618829_49566010705.webp',
    'paperpatchbd_1732800272_3511305638670680137_49566010705.webp',
    'paperpatchbd_1732800272_3511305638670740534_49566010705.webp',
    'paperpatchbd_1732800272_3511305638897173532_49566010705.webp',
    'paperpatchbd_1732802000_3511320136472611535_49566010705.webp',
    'paperpatchbd_1732802000_3511320136481176556_49566010705.webp',
    'paperpatchbd_1732802000_3511320136489441198_49566010705.webp',
    'paperpatchbd_1732802000_3511320136489631521_49566010705.webp',
    'paperpatchbd_1732802000_3511320136573477885_49566010705.webp',
    'paperpatchbd_1732802000_3511320136598495993_49566010705.webp',
    'paperpatchbd_1737299254_3549045837357693554_49566010705.webp',
    'paperpatchbd_1737299254_3549045837357884207_49566010705.webp',
    'paperpatchbd_1737299254_3549045837357887631_49566010705.webp',
    'paperpatchbd_1737299254_3549045837374513606_49566010705.webp',
    'paperpatchbd_1737299254_3549045837374538576_49566010705.webp',
    'paperpatchbd_1737299254_3549045837374611096_49566010705.webp',
    'paperpatchbd_1737299254_3549045837374614529_49566010705.webp',
    'paperpatchbd_1737299254_3549045837374644389_49566010705.webp',
    'paperpatchbd_1737299254_3549045837382966314_49566010705.webp',
    'paperpatchbd_1737299254_3549045837533985008_49566010705.webp',
    'paperpatchbd_1737299254_3549045837777192434_49566010705.webp',
    'paperpatchbd_1751291701_3666422988129444863_49566010705.webp',
    'paperpatchbd_1751291701_3666422988137945790_49566010705.webp',
    'paperpatchbd_1751291701_3666422988247047082_49566010705.webp',
    'paperpatchbd_1751291701_3666422988255521872_49566010705.webp',
    'paperpatchbd_1751291701_3666422988297228555_49566010705.webp',
    'paperpatchbd_1751291701_3666422988423103652_49566010705.webp',
  ];
  return `/gallery/Previous/${files[i]}`;
});

const reviews = [
  { image: '/gallery/Reviews/paperpatchbd_1634057724_highlight17982483427378100.jpg' },
  { image: '/gallery/Reviews/paperpatchbd_1635075850_highlight17982483427378100.webp' },
  { image: '/gallery/Reviews/paperpatchbd_1635149670_highlight17982483427378100.webp' },
  { image: '/gallery/Reviews/paperpatchbd_1635781338_highlight17982483427378100.webp' },
  { image: '/gallery/Reviews/paperpatchbd_1636037804_highlight17982483427378100.webp' },
  { image: '/gallery/Reviews/paperpatchbd_1636218570_highlight17982483427378100.webp' },
  { image: '/gallery/Reviews/paperpatchbd_1636218620_highlight17982483427378100.webp' },
  { image: '/gallery/Reviews/paperpatchbd_1661055726_highlight17982483427378100.webp' },
  { image: '/gallery/Reviews/paperpatchbd_1675418610_highlight17982483427378100.jpg' },
  { image: '/gallery/Reviews/paperpatchbd_1685703392_highlight17982483427378100.webp' },
  { image: '/gallery/Reviews/paperpatchbd_1686063709_highlight17982483427378100.webp' },
  { image: '/gallery/Reviews/paperpatchbd_1687100314_highlight17982483427378100.webp' },
  { image: '/gallery/Reviews/paperpatchbd_1687719104_highlight17982483427378100.webp' },
];

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

  // Combine static and database images
  const dbPreviousOrders = dbImages.filter(img => img.category === 'previous_orders');
  const dbReviews = dbImages.filter(img => img.category === 'reviews');
  
  const allPreviousOrders = [...previousOrders, ...dbPreviousOrders.map(img => img.image_url)];
  const allReviews = [...reviews, ...dbReviews.map(img => ({ image: img.image_url }))];

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
                {allPreviousOrders.length}
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
                {allReviews.length}
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
                {allPreviousOrders.length} photos
              </span>
            </div>
            
            <div className="h-[600px] overflow-y-auto custom-scrollbar pr-2">
              <div className="grid grid-cols-2 gap-3">
                {allPreviousOrders.map((src, idx) => (
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
                {allReviews.length} reviews
              </span>
            </div>
            
            <div className="h-[600px] overflow-y-auto custom-scrollbar pr-2">
              <div className="space-y-4">
                {allReviews.map((review, idx) => (
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
