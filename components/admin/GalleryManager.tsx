'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Upload, X, Trash2, Image as ImageIcon, AlertCircle, Info } from 'lucide-react';
import { getGalleryImages, uploadGalleryImage, deleteGalleryImage } from '@/lib/supabase';

interface GalleryImage {
  id: string;
  image_url: string;
  category: 'previous_orders' | 'reviews';
  created_at: string;
  isStatic?: boolean; // For existing hardcoded images
}

// Existing static images from public folder
const staticPreviousOrders = Array.from({ length: 86 }, (_, i) => {
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
  return {
    id: `static-prev-${i}`,
    image_url: `/gallery/Previous/${files[i]}`,
    category: 'previous_orders' as const,
    created_at: new Date().toISOString(),
    isStatic: true
  };
});

const staticReviews = [
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
].map((review, i) => ({
  id: `static-review-${i}`,
  image_url: review.image,
  category: 'reviews' as const,
  created_at: new Date().toISOString(),
  isStatic: true
}));

interface GalleryManagerProps {
  onClose: () => void;
}

export default function GalleryManager({ onClose }: GalleryManagerProps) {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [hiddenStaticImages, setHiddenStaticImages] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'previous_orders' | 'reviews'>('previous_orders');
  const [error, setError] = useState('');

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    try {
      setIsLoading(true);
      const dbImages = await getGalleryImages();
      // Merge static images with database images, filter out hidden ones
      const visibleStaticPrevious = staticPreviousOrders.filter(img => !hiddenStaticImages.has(img.id));
      const visibleStaticReviews = staticReviews.filter(img => !hiddenStaticImages.has(img.id));
      const allImages = [...visibleStaticPrevious, ...visibleStaticReviews, ...dbImages];
      setImages(allImages);
    } catch (err) {
      setError('Failed to load gallery images');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    setError('');
    setIsUploading(true);

    try {
      for (const file of Array.from(files)) {
        if (!file.type.match(/image\/(jpeg|jpg|png|webp)/)) {
          setError('Please upload only JPEG, PNG, or WebP images');
          continue;
        }
        if (file.size > 10 * 1024 * 1024) {
          setError('File size must be less than 10MB');
          continue;
        }

        await uploadGalleryImage(file, selectedCategory);
      }
      
      await loadImages();
    } catch (err) {
      setError('Failed to upload images');
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string, imageUrl: string, isStatic?: boolean) => {
    if (!confirm('Are you sure you want to delete this image?')) return;

    try {
      if (isStatic) {
        // Hide static image from gallery
        setHiddenStaticImages(prev => {
          const newSet = new Set(prev);
          newSet.add(id);
          return newSet;
        });
        await loadImages();
      } else {
        // Delete database image
        await deleteGalleryImage(id, imageUrl);
        await loadImages();
      }
    } catch (err) {
      setError('Failed to delete image');
      console.error(err);
    }
  };

  const previousOrders = images.filter(img => img.category === 'previous_orders');
  const reviews = images.filter(img => img.category === 'reviews');

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#8B6F47] to-[#6B5444] text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Gallery Manager</h2>
              <p className="text-sm text-white/80 mt-1">Manage gallery images</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Info about existing images */}
          <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start space-x-2">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-semibold mb-1">Gallery Management</p>
              <p>Images marked with "Existing" badge are from the public folder. Deleting them will hide them from the gallery (files remain in public folder). New uploads are stored in Supabase and fully deleted.</p>
            </div>
          </div>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Upload Section */}
          <div className="mb-8 bg-[#FFF9F0] rounded-xl p-6 border-2 border-dashed border-[#E5D5C0]">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
              <div>
                <h3 className="text-lg font-bold text-[#6B5444] mb-2">Upload Images</h3>
                <p className="text-sm text-[#6B5444]/70">Add new images to the gallery</p>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setSelectedCategory('previous_orders')}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                    selectedCategory === 'previous_orders'
                      ? 'bg-[#8B6F47] text-white'
                      : 'bg-white text-[#6B5444] border border-[#E5D5C0] hover:border-[#C4A57B]'
                  }`}
                >
                  Previous Orders
                </button>
                <button
                  onClick={() => setSelectedCategory('reviews')}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                    selectedCategory === 'reviews'
                      ? 'bg-[#8B6F47] text-white'
                      : 'bg-white text-[#6B5444] border border-[#E5D5C0] hover:border-[#C4A57B]'
                  }`}
                >
                  Reviews
                </button>
              </div>
            </div>

            <div
              onClick={() => document.getElementById('gallery-file-input')?.click()}
              className="relative rounded-xl text-center cursor-pointer transition-all p-8 group bg-white border-2 border-dashed border-[#E5D5C0] hover:border-[#C4A57B]"
            >
              <input
                id="gallery-file-input"
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                multiple
                onChange={(e) => handleFileSelect(e.target.files)}
                className="hidden"
                disabled={isUploading}
              />
              <div className="flex flex-col items-center justify-center">
                <div className="w-16 h-16 mb-4 rounded-full bg-[#C4A57B]/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                  {isUploading ? (
                    <div className="w-8 h-8 border-4 border-[#8B6F47] border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Upload className="w-8 h-8 text-[#8B6F47]" />
                  )}
                </div>
                <p className="text-lg font-semibold text-[#6B5444] mb-2">
                  {isUploading ? 'Uploading...' : `Upload to ${selectedCategory === 'previous_orders' ? 'Previous Orders' : 'Reviews'}`}
                </p>
                <p className="text-sm text-[#9CA3AF]">
                  Drop images here or click to browse
                </p>
                <p className="text-xs text-[#9CA3AF] mt-2">
                  JPEG/PNG/WebP • Max 10MB each
                </p>
              </div>
            </div>
          </div>

          {/* Gallery Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Previous Orders */}
            <div className="bg-white rounded-xl border border-[#E5D5C0] p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-[#6B5444]">Previous Orders</h3>
                <span className="text-sm text-[#8B6F47] font-medium bg-[#FFF9F0] px-3 py-1 rounded-full">
                  {previousOrders.length} images
                </span>
              </div>
              
              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="w-8 h-8 border-4 border-[#8B6F47] border-t-transparent rounded-full animate-spin" />
                </div>
              ) : previousOrders.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-[#6B5444]/50">
                  <ImageIcon className="w-12 h-12 mb-2" />
                  <p className="text-sm">No images yet</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 max-h-[500px] overflow-y-auto">
                  {previousOrders.map((img) => (
                    <div key={img.id} className="relative group aspect-square rounded-lg overflow-hidden border border-[#E5D5C0]">
                      <Image
                        src={img.image_url}
                        alt="Gallery image"
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                      {img.isStatic && (
                        <div className="absolute top-2 left-2 bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded-full font-medium">
                          Existing
                        </div>
                      )}
                      <button
                        onClick={() => handleDelete(img.id, img.image_url, img.isStatic)}
                        className="absolute top-2 right-2 p-2 bg-red-600 hover:bg-red-700 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-xl border border-[#E5D5C0] p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-[#6B5444]">Customer Reviews</h3>
                <span className="text-sm text-[#8B6F47] font-medium bg-[#FFF9F0] px-3 py-1 rounded-full">
                  {reviews.length} images
                </span>
              </div>
              
              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="w-8 h-8 border-4 border-[#8B6F47] border-t-transparent rounded-full animate-spin" />
                </div>
              ) : reviews.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-[#6B5444]/50">
                  <ImageIcon className="w-12 h-12 mb-2" />
                  <p className="text-sm">No images yet</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 max-h-[500px] overflow-y-auto">
                  {reviews.map((img) => (
                    <div key={img.id} className="relative group aspect-square rounded-lg overflow-hidden border border-[#E5D5C0]">
                      <Image
                        src={img.image_url}
                        alt="Review image"
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                      {img.isStatic && (
                        <div className="absolute top-2 left-2 bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded-full font-medium">
                          Existing
                        </div>
                      )}
                      <button
                        onClick={() => handleDelete(img.id, img.image_url, img.isStatic)}
                        className="absolute top-2 right-2 p-2 bg-red-600 hover:bg-red-700 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
