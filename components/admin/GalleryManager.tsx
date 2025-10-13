'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Upload, X, Trash2, Image as ImageIcon, AlertCircle, Info, GripVertical } from 'lucide-react';
import { getGalleryImages, uploadGalleryImage, deleteGalleryImage, updateGalleryImageOrder } from '@/lib/supabase';

interface GalleryImage {
  id: string;
  image_url: string;
  category: 'previous_orders' | 'reviews';
  created_at: string;
  order_index: number;
  isStatic?: boolean; // For existing hardcoded images
}


interface GalleryManagerProps {
  onClose: () => void;
}

export default function GalleryManager({ onClose }: GalleryManagerProps) {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'previous_orders' | 'reviews'>('previous_orders');
  const [error, setError] = useState('');
  const [draggedItem, setDraggedItem] = useState<GalleryImage | null>(null);

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    try {
      setIsLoading(true);
      const dbImages = await getGalleryImages();
      setImages(dbImages);
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

  const handleDelete = async (id: string, imageUrl: string) => {
    if (!confirm('Are you sure you want to permanently delete this image? This cannot be undone.')) return;

    try {
      await deleteGalleryImage(id, imageUrl);
      await loadImages();
    } catch (err) {
      setError('Failed to delete image');
      console.error(err);
    }
  };

  const handleDragStart = (e: React.DragEvent, image: GalleryImage) => {
    console.log('Drag started:', image.id);
    setDraggedItem(image);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnd = () => {
    console.log('Drag ended');
    setDraggedItem(null);
  };

  const handleDrop = async (e: React.DragEvent, targetImage: GalleryImage) => {
    e.preventDefault();
    
    if (!draggedItem || draggedItem.id === targetImage.id || draggedItem.category !== targetImage.category) {
      setDraggedItem(null);
      return;
    }

    try {
      console.log('Dropping', draggedItem.id, 'onto', targetImage.id);
      
      // Get all images in the same category
      const categoryImages = images
        .filter(img => img.category === targetImage.category)
        .sort((a, b) => (a.order_index || 0) - (b.order_index || 0));

      console.log('Category images:', categoryImages.map(img => ({ id: img.id, order: img.order_index })));

      const draggedIndex = categoryImages.findIndex(img => img.id === draggedItem.id);
      const targetIndex = categoryImages.findIndex(img => img.id === targetImage.id);

      console.log('Dragged index:', draggedIndex, 'Target index:', targetIndex);

      if (draggedIndex === -1 || targetIndex === -1) {
        console.error('Could not find image indices');
        setDraggedItem(null);
        return;
      }

      // Reorder the array
      const reordered = [...categoryImages];
      const [removed] = reordered.splice(draggedIndex, 1);
      reordered.splice(targetIndex, 0, removed);

      console.log('New order:', reordered.map((img, idx) => ({ id: img.id, newOrder: idx })));

      // Update order_index for all affected images
      const updates = reordered.map((img, index) => 
        updateGalleryImageOrder(img.id, index)
      );

      await Promise.all(updates);
      console.log('Order updated successfully');
      await loadImages();
    } catch (err) {
      setError('Failed to reorder images. Make sure the order_index column exists in your database.');
      console.error('Reorder error:', err);
    } finally {
      setDraggedItem(null);
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
          {/* Info about gallery management */}
          <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start space-x-2">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-semibold mb-1">Gallery Management</p>
              <p>Upload new images or delete existing ones. <strong>Drag and drop images to rearrange them</strong> - the order will be reflected on the public gallery.</p>
              <p className="mt-2 text-xs"><strong>Note:</strong> If drag-and-drop doesn't work, you need to add the order_index column to your gallery_images table in Supabase.</p>
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
                    <div 
                      key={img.id} 
                      draggable
                      onDragStart={(e) => handleDragStart(e, img)}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, img)}
                      onDragEnd={handleDragEnd}
                      className={`relative group aspect-square rounded-lg overflow-hidden border-2 transition-all cursor-move ${
                        draggedItem?.id === img.id 
                          ? 'border-[#8B6F47] opacity-50 scale-95' 
                          : 'border-[#E5D5C0] hover:border-[#C4A57B]'
                      }`}
                    >
                      <div className="absolute top-2 left-2 p-1.5 bg-white/90 rounded-lg opacity-0 group-hover:opacity-100 transition-all shadow-lg z-10">
                        <GripVertical className="w-4 h-4 text-[#6B5444]" />
                      </div>
                      <Image
                        src={img.image_url}
                        alt="Gallery image"
                        fill
                        className="object-cover pointer-events-none"
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                      <button
                        onClick={() => handleDelete(img.id, img.image_url)}
                        className="absolute top-2 right-2 p-2 bg-red-600 hover:bg-red-700 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-lg z-10"
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
                    <div 
                      key={img.id} 
                      draggable
                      onDragStart={(e) => handleDragStart(e, img)}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, img)}
                      onDragEnd={handleDragEnd}
                      className={`relative group aspect-square rounded-lg overflow-hidden border-2 transition-all cursor-move ${
                        draggedItem?.id === img.id 
                          ? 'border-[#8B6F47] opacity-50 scale-95' 
                          : 'border-[#E5D5C0] hover:border-[#C4A57B]'
                      }`}
                    >
                      <div className="absolute top-2 left-2 p-1.5 bg-white/90 rounded-lg opacity-0 group-hover:opacity-100 transition-all shadow-lg z-10">
                        <GripVertical className="w-4 h-4 text-[#6B5444]" />
                      </div>
                      <Image
                        src={img.image_url}
                        alt="Review image"
                        fill
                        className="object-cover pointer-events-none"
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                      <button
                        onClick={() => handleDelete(img.id, img.image_url)}
                        className="absolute top-2 right-2 p-2 bg-red-600 hover:bg-red-700 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-lg z-10"
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
