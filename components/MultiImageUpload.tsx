'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Upload, X, Plus, Image as ImageIcon, ArrowLeft, ChevronLeft, ChevronRight, Move } from 'lucide-react';
import { OrderItem, StandardSize } from '@/lib/types';
import { getPrices } from '@/lib/supabase';
import { calculatePosterPrice } from '@/lib/pricing';

interface ImageWithSize {
  id: string;
  file: File;
  preview: string;
  orderItem: OrderItem;
  position: { x: number; y: number };
  scale: number;
}

interface MultiImageUploadProps {
  onContinue: (items: OrderItem[]) => void;
  onBack: () => void;
  initialItems?: OrderItem[];
}

// Background images
const BACKGROUND_IMAGES = [
  '/background-1.png',
  '/background-2.png',
  '/background-3.png',
];

// Poster size presets with scale ratios (0.5:0.75:1:1.5)
const BASE_SIZE = 150;
const POSTER_SIZES = [
  { width: 12, height: 8, label: '12" × 8"', scale: 0.5 },
  { width: 18, height: 12, label: '18" × 12"', scale: 0.75 },
  { width: 24, height: 16, label: '24" × 16"', scale: 1 },
  { width: 35, height: 24, label: '35" × 24"', scale: 1.5 },
];

export default function MultiImageUpload({ onContinue, onBack, initialItems }: MultiImageUploadProps) {
  const [priceData, setPriceData] = useState<StandardSize[]>([]);
  const [isLoadingPrices, setIsLoadingPrices] = useState(true);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);
  const [pulsingImageId, setPulsingImageId] = useState<string | null>(null);
  const posterBoxRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  
  // Initialize from initialItems if provided
  const [images, setImages] = useState<ImageWithSize[]>(() => {
    if (initialItems && initialItems.length > 0) {
      return initialItems.map((item, idx) => ({
        id: `img-${Date.now()}-${idx}`,
        file: item.imageFile!,
        preview: item.imageUrl || '',
        position: { x: 0, y: 0 },
        scale: 1,
        orderItem: item,
      }));
    }
    return [];
  });
  const [selectedImageId, setSelectedImageId] = useState<string | null>(() => {
    if (initialItems && initialItems.length > 0) {
      return `img-${Date.now()}-0`;
    }
    return null;
  });
  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  const [error, setError] = useState('');
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [initialPosition, setInitialPosition] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const isDraggingRef = useRef(false);
  const dragImageIdRef = useRef<string | null>(null);

  // Load prices from Supabase
  useEffect(() => {
    console.log('[MultiImageUpload] Loading prices...');
    const loadPrices = async () => {
      const prices = await getPrices();
      console.log('[MultiImageUpload] Prices loaded:', prices);
      setPriceData(prices);
      setIsLoadingPrices(false);
    };
    loadPrices();
  }, []);

  // Handle window resize for responsive image scaling
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Helper function to get price for a size
  const getPriceForSize = (width: number, height: number, withBoard: boolean): number => {
    const sizeData = priceData.find(s => s.width === width && s.height === height);
    if (sizeData) {
      return withBoard && sizeData.priceWithBoard ? sizeData.priceWithBoard : sizeData.priceWithoutBoard;
    }
    // Fallback to calculated price
    return calculatePosterPrice(width, height, withBoard);
  };

  const validateFile = (file: File): boolean => {
    if (!file.type.match(/image\/(jpeg|jpg|png)/)) {
      setError('Please upload JPEG or PNG images only');
      return false;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return false;
    }
    return true;
  };

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;
    setError('');

    Array.from(files).forEach((file) => {
      if (validateFile(file)) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const preview = e.target?.result as string;
          const newImage: ImageWithSize = {
            id: `img-${Date.now()}-${Math.random()}`,
            file,
            preview,
            position: { x: 0, y: 0 },
            scale: 1,
            orderItem: {
              width: 12,
              height: 8,
              withBoard: false,
              price: getPriceForSize(12, 8, false),
              imageFile: file,
              imageUrl: preview,
            },
          };
          setImages(prev => {
            const updated = [...prev, newImage];
            if (!selectedImageId) {
              setSelectedImageId(newImage.id);
            }
            return updated;
          });
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleFileSelect(e.dataTransfer.files);
  };

  const removeImage = (id: string) => {
    setImages(images.filter(img => img.id !== id));
    if (selectedImageId === id) {
      setSelectedImageId(images.length > 1 ? images[0].id : null);
    }
  };

  const updateImageSize = (id: string, sizeIndex: number) => {
    const size = POSTER_SIZES[sizeIndex];
    setImages(images.map(img => 
      img.id === id 
        ? { 
            ...img, 
            orderItem: { 
              ...img.orderItem, 
              width: size.width, 
              height: size.height,
              price: getPriceForSize(size.width, size.height, img.orderItem.withBoard)
            } 
          }
        : img
    ));
  };

  const updateBoardOption = (id: string, withBoard: boolean) => {
    setImages(images.map(img => 
      img.id === id 
        ? { 
            ...img, 
            orderItem: { 
              ...img.orderItem, 
              withBoard,
              price: getPriceForSize(img.orderItem.width, img.orderItem.height, withBoard)
            } 
          }
        : img
    ));
  };

  const handleImageDragStart = useCallback((e: React.MouseEvent | React.TouchEvent, imageId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    const currentImage = images.find(img => img.id === imageId);
    if (currentImage) {
      setInitialPosition({ x: currentImage.position.x, y: currentImage.position.y });
    }
    
    isDraggingRef.current = true;
    dragImageIdRef.current = imageId;
    setIsDragging(true);
    setDragStart({ x: clientX, y: clientY });
    setSelectedImageId(imageId);
  }, [images]);

  const handleImageDrag = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isDraggingRef.current || !dragStart || !initialPosition || !dragImageIdRef.current) return;
    e.preventDefault();
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    const deltaX = clientX - dragStart.x;
    const deltaY = clientY - dragStart.y;
    
    setImages(prev => prev.map(img => 
      img.id === dragImageIdRef.current
        ? { ...img, position: { x: initialPosition.x + deltaX, y: initialPosition.y + deltaY } }
        : img
    ));
  }, [dragStart, initialPosition]);

  const handleImageDragEnd = useCallback(() => {
    isDraggingRef.current = false;
    dragImageIdRef.current = null;
    setIsDragging(false);
    setDragStart(null);
    setInitialPosition(null);
  }, []);

  // Global mouse/touch move and end handlers for smoother dragging
  useEffect(() => {
    const handleGlobalMove = (e: MouseEvent | TouchEvent) => {
      if (isDraggingRef.current) {
        handleImageDrag(e as any);
      }
    };

    const handleGlobalEnd = () => {
      if (isDraggingRef.current) {
        handleImageDragEnd();
      }
    };

    document.addEventListener('mousemove', handleGlobalMove);
    document.addEventListener('touchmove', handleGlobalMove, { passive: false });
    document.addEventListener('mouseup', handleGlobalEnd);
    document.addEventListener('touchend', handleGlobalEnd);

    return () => {
      document.removeEventListener('mousemove', handleGlobalMove);
      document.removeEventListener('touchmove', handleGlobalMove);
      document.removeEventListener('mouseup', handleGlobalEnd);
      document.removeEventListener('touchend', handleGlobalEnd);
    };
  }, [handleImageDrag, handleImageDragEnd]);

  const getDisplayDimensions = (img: ImageWithSize) => {
    const sizeIndex = POSTER_SIZES.findIndex(
      s => s.width === img.orderItem.width && s.height === img.orderItem.height
    );
    const scale = POSTER_SIZES[sizeIndex]?.scale || 1;
    
    // Scale down images on mobile (65% of desktop size)
    const isMobile = windowWidth < 640;
    const mobileScale = isMobile ? 0.65 : 1;
    const maxSize = BASE_SIZE * scale * mobileScale;
    
    const tempImg = new Image();
    tempImg.src = img.preview;
    const aspectRatio = tempImg.naturalWidth / tempImg.naturalHeight || 1;
    
    let width = maxSize;
    let height = maxSize / aspectRatio;
    
    if (height > maxSize) {
      height = maxSize;
      width = maxSize * aspectRatio;
    }
    
    return { width, height };
  };

  const nextBackground = () => {
    setCurrentBgIndex((prev) => (prev + 1) % BACKGROUND_IMAGES.length);
  };

  const prevBackground = () => {
    setCurrentBgIndex((prev) => (prev - 1 + BACKGROUND_IMAGES.length) % BACKGROUND_IMAGES.length);
  };

  const handleContinue = () => {
    if (images.length === 0) {
      setError('Please upload at least one image');
      return;
    }
    onContinue(images.map(img => img.orderItem));
  };

  const getTotalPrice = () => {
    return images.reduce((sum, img) => sum + img.orderItem.price, 0);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-24 lg:pb-6">
      {/* Left Column - Upload & Poster Boxes */}
      <div className="space-y-6">
        {/* Upload Box */}
        <div className="relative bg-card/80 backdrop-blur-sm rounded-2xl shadow-lg border border-[#E5D5C0] hover:border-[#C4A57B] transition-all duration-150 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500" />
          <div className="relative p-6">
            <div className="flex items-center space-x-2 mb-4">
              <ImageIcon className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold text-foreground">
                Upload Images
              </h2>
            </div>

            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className="relative rounded-xl text-center cursor-pointer transition-all p-2 group"
              onClick={() => document.getElementById('multi-file-input')?.click()}
            >
              <input
                id="multi-file-input"
                type="file"
                accept="image/jpeg,image/jpg,image/png"
                multiple
                onChange={(e) => handleFileSelect(e.target.files)}
                className="hidden"
              />
              {/* Inner dashed frame */}
              <div className="border-2 border-dashed border-[#E5D5C0] group-hover:border-[#C4A57B] rounded-xl bg-white/50 p-12 transition-all duration-150">
                <div className="flex flex-col items-center justify-center">
                  <div className="w-16 h-16 mb-4 rounded-full bg-[#C4A57B]/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                    <Plus className="w-8 h-8 text-[#8B6F47]" />
                  </div>
                  <p className="text-lg font-semibold text-[#6B5444] mb-2">
                    {images.length === 0 ? 'Upload your images' : 'Add more images'}
                  </p>
                  <p className="text-sm text-[#9CA3AF]">
                    Drop images here or click to browse
                  </p>
                  <p className="text-xs text-[#9CA3AF] mt-2">
                    JPEG/PNG • Max 10MB each
                  </p>
                </div>
              </div>
            </div>

            {error && (
              <div className="mt-4 bg-destructive/10 border border-destructive/20 rounded-lg p-3 text-sm text-destructive">
                {error}
              </div>
            )}
          </div>
        </div>

        {/* Poster Boxes */}
        {images.length > 0 && (
          <div className="relative bg-card/80 backdrop-blur-sm rounded-2xl shadow-lg border border-[#E5D5C0] transition-all duration-150 overflow-hidden">
            <div className="relative p-6">
              <h3 className="text-xl font-bold text-foreground mb-4">Your Posters</h3>
              <div className="space-y-4">
                {images.map((img) => (
                  <div
                    key={img.id}
                    ref={(el) => { posterBoxRefs.current[img.id] = el; }}
                    className={`relative group flex items-start space-x-4 p-4 rounded-xl border transition-all duration-150 cursor-pointer overflow-hidden ${
                      selectedImageId === img.id
                        ? 'bg-white/50 border-[#C4A57B]'
                        : 'bg-white/50 border-[#E5D5C0] hover:border-[#C4A57B]'
                    } ${
                      pulsingImageId === img.id ? 'animate-pulse-gentle' : ''
                    }`}
                    onClick={() => setSelectedImageId(img.id)}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {/* Thumbnail */}
                    <div className="relative z-10">
                      <img
                        src={img.preview}
                        alt="Thumbnail"
                        className="w-24 h-24 object-cover rounded-lg shadow-md"
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeImage(img.id);
                        }}
                        className="absolute -top-1 -right-1 p-1 bg-[#8B6F47] hover:bg-[#6B5444] text-white rounded-full transition-colors shadow-md"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Controls */}
                    <div className="flex-1 relative z-10">
                      <p className="text-xs sm:text-sm font-semibold text-foreground mb-1.5 sm:mb-2">Select Size:</p>
                      <div className="grid grid-cols-2 gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                        {POSTER_SIZES.map((size, idx) => (
                          <button
                            key={idx}
                            onClick={(e) => {
                              e.stopPropagation();
                              updateImageSize(img.id, idx);
                            }}
                            className={`py-1.5 sm:py-2 px-2 sm:px-3 rounded-lg font-medium text-xs sm:text-sm transition-all duration-150 ${
                              img.orderItem.width === size.width && img.orderItem.height === size.height
                                ? 'bg-[#FFFEF9] text-[#6B5444] border-2 border-[#A67C52]'
                                : 'bg-[#FEFEFE] border-2 border-[#E5E5E0] text-[#9CA3AF] hover:border-[#C4A57B] hover:bg-[#FFF9F0] hover:text-[#6B5444]'
                            }`}
                          >
                            {size.label}
                          </button>
                        ))}
                      </div>

                      {/* Board Selection */}
                      <div className="mb-2 sm:mb-3">
                        <p className="text-xs sm:text-sm font-semibold text-foreground mb-1.5 sm:mb-2">Type:</p>
                        <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              updateBoardOption(img.id, false);
                            }}
                            className={`py-1.5 sm:py-2 px-2 sm:px-3 rounded-lg font-medium text-xs sm:text-sm transition-all duration-150 flex items-center justify-center space-x-1 sm:space-x-2 ${
                              !img.orderItem.withBoard
                                ? 'bg-[#FFFEF9] text-[#6B5444] border-2 border-[#A67C52]'
                                : 'bg-[#FEFEFE] border-2 border-[#E5E5E0] text-[#9CA3AF] hover:border-[#C4A57B] hover:bg-[#FFF9F0] hover:text-[#6B5444]'
                            }`}
                          >
                            <div className={`w-2.5 h-2.5 sm:w-4 sm:h-4 rounded-full border-2 flex items-center justify-center ${
                              !img.orderItem.withBoard ? 'border-[#6B5444]' : 'border-[#C4A57B]'
                            }`}>
                              {!img.orderItem.withBoard && (
                                <div className="w-1 h-1 sm:w-2 sm:h-2 rounded-full bg-[#6B5444]"></div>
                              )}
                            </div>
                            <span className="whitespace-nowrap">Poster Sheet</span>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (img.orderItem.width === 35 && img.orderItem.height === 24) return;
                              updateBoardOption(img.id, true);
                            }}
                            disabled={img.orderItem.width === 35 && img.orderItem.height === 24}
                            className={`py-1.5 sm:py-2 px-2 sm:px-3 rounded-lg font-medium text-xs sm:text-sm transition-all duration-150 flex items-center justify-center space-x-1 sm:space-x-2 ${
                              img.orderItem.width === 35 && img.orderItem.height === 24
                                ? 'bg-gray-100 border-2 border-gray-300 text-gray-400 cursor-not-allowed'
                                : img.orderItem.withBoard
                                ? 'bg-[#FFFEF9] text-[#6B5444] border-2 border-[#A67C52]'
                                : 'bg-[#FEFEFE] border-2 border-[#E5E5E0] text-[#9CA3AF] hover:border-[#C4A57B] hover:bg-[#FFF9F0] hover:text-[#6B5444]'
                            }`}
                          >
                            <div className={`w-2.5 h-2.5 sm:w-4 sm:h-4 rounded-full border-2 flex items-center justify-center ${
                              img.orderItem.withBoard ? 'border-[#6B5444]' : 'border-[#C4A57B]'
                            }`}>
                              {img.orderItem.withBoard && (
                                <div className="w-1 h-1 sm:w-2 sm:h-2 rounded-full bg-[#6B5444]"></div>
                              )}
                            </div>
                            <span className="whitespace-nowrap">Board Poster</span>
                          </button>
                        </div>
                        {img.orderItem.width === 35 && img.orderItem.height === 24 && (
                          <p className="text-xs text-gray-500 mt-1">Board option not available for 35" × 24"</p>
                        )}
                      </div>

                      <p className="text-lg font-bold text-primary">
                        ৳{img.orderItem.price}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="mt-6 bg-[#FFF9F0] backdrop-blur-sm border border-[#E5D5C0] rounded-xl p-4">
                <div className="flex justify-between items-center">
                  <span className="text-foreground font-semibold">Total Posters Price:</span>
                  <span className="text-2xl font-bold text-[#8B6F47]">
                    ৳{getTotalPrice()}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  + Shipping cost (calculated at checkout)
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Right Column - Sticky Preview Window */}
      {images.length > 0 && (
        <div className="lg:sticky lg:top-8 lg:bottom-24 h-fit lg:self-start">
          <div className="relative bg-card/80 backdrop-blur-sm rounded-2xl shadow-lg border border-[#E5D5C0] transition-all duration-150 overflow-hidden">
            <div className="relative p-3 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold text-foreground mb-3 sm:mb-4">Preview</h3>

              {/* Preview Container with Background */}
              <div 
                className="relative w-full bg-white rounded-xl overflow-hidden aspect-square max-h-[70vh] lg:max-h-none"
                onClick={(e) => {
                  // Deselect if clicking on background (not on an image)
                  if (e.target === e.currentTarget) {
                    setSelectedImageId(null);
                  }
                }}
              >
                {/* Background Image */}
                <img
                  src={BACKGROUND_IMAGES[currentBgIndex]}
                  alt="Background"
                  className="absolute inset-0 w-full h-full object-cover"
                />

                {/* Background Navigation */}
                <div className="absolute top-2 sm:top-4 left-0 right-0 flex justify-between px-2 sm:px-4 z-20">
                  <button
                    onClick={prevBackground}
                    className="p-1.5 sm:p-2 bg-white/90 backdrop-blur-sm hover:bg-white border border-[#E5D5C0] rounded-full shadow-lg transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-[#6B5444]" />
                  </button>
                  <div className="bg-white/90 backdrop-blur-sm px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-medium text-[#6B5444] border border-[#E5D5C0]">
                    {currentBgIndex + 1} / {BACKGROUND_IMAGES.length}
                  </div>
                  <button
                    onClick={nextBackground}
                    className="p-1.5 sm:p-2 bg-white/90 backdrop-blur-sm hover:bg-white border border-[#E5D5C0] rounded-full shadow-lg transition-colors"
                  >
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-[#6B5444]" />
                  </button>
                </div>

                {/* All User Images Overlay */}
                {images.map((img) => {
                  const dims = getDisplayDimensions(img);
                  return (
                    <div
                      key={img.id}
                      className={`absolute touch-none ${selectedImageId === img.id ? 'z-10' : 'z-5'}`}
                      style={{
                        left: '50%',
                        top: '50%',
                        transform: `translate(calc(-50% + ${img.position.x}px), calc(-50% + ${img.position.y}px))`,
                        cursor: isDragging && dragImageIdRef.current === img.id 
                          ? "url('/cursors/move.svg') 12 12, grabbing" 
                          : "url('/cursors/pointer.svg') 10 5, grab"
                      }}
                      onMouseDown={(e) => handleImageDragStart(e, img.id)}
                      onTouchStart={(e) => handleImageDragStart(e, img.id)}
                      onClick={(e) => {
                        e.stopPropagation();
                        const isMobile = windowWidth < 1024;
                        if (!isMobile && posterBoxRefs.current[img.id]) {
                          const element = posterBoxRefs.current[img.id];
                          if (element) {
                            const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
                            const offsetPosition = elementPosition - (window.innerHeight / 2) + (element.offsetHeight / 2);
                            const startPosition = window.pageYOffset;
                            const distance = offsetPosition - startPosition;
                            const duration = 800; // 800ms for smooth scroll
                            let start: number | null = null;
                            
                            const animation = (currentTime: number) => {
                              if (start === null) start = currentTime;
                              const timeElapsed = currentTime - start;
                              const progress = Math.min(timeElapsed / duration, 1);
                              
                              // Easing function for smooth animation
                              const ease = progress < 0.5
                                ? 4 * progress * progress * progress
                                : 1 - Math.pow(-2 * progress + 2, 3) / 2;
                              
                              window.scrollTo(0, startPosition + distance * ease);
                              
                              if (timeElapsed < duration) {
                                requestAnimationFrame(animation);
                              }
                            };
                            
                            requestAnimationFrame(animation);
                          }
                          setPulsingImageId(img.id);
                          setTimeout(() => setPulsingImageId(null), 1200);
                        }
                      }}
                    >
                      <div
                        className="relative shadow-2xl"
                        style={{
                          width: `${dims.width}px`,
                          height: `${dims.height}px`,
                        }}
                      >
                        <img
                          src={img.preview}
                          alt="Preview"
                          className="w-full h-full object-contain rounded-sm bg-white"
                          draggable={false}
                        />
                      </div>
                    </div>
                  );
                })}

                {/* Drag hint */}
                <div className="absolute bottom-2 sm:bottom-4 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium flex items-center space-x-1 z-30 text-[#6B5444] border border-[#E5D5C0]">
                  <Move className="w-3 h-3" />
                  <span className="hidden sm:inline">Drag to reposition • Click to select</span>
                  <span className="sm:hidden">Drag to move</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons - Fixed at Bottom on Mobile, Normal on Desktop */}
      <div className="fixed bottom-0 left-0 right-0 lg:relative lg:col-span-2 flex space-x-3 p-4 lg:p-0 bg-[#FFF9F0] lg:bg-transparent border-t lg:border-t-0 border-[#E5D5C0] z-50">
        <button
          onClick={onBack}
          className="px-4 lg:px-6 py-3 bg-white/80 backdrop-blur-sm border border-[#E5D5C0] hover:border-[#C4A57B] rounded-xl font-semibold text-[#6B5444] transition-all duration-150 flex items-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
        <button
          onClick={handleContinue}
          disabled={images.length === 0}
          className="flex-1 px-4 lg:px-6 py-3 bg-[#8B6F47] hover:bg-[#6B5444] text-white rounded-xl font-bold text-base lg:text-lg transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl ring-2 ring-[#C4A57B]/30"
        >
          Continue to Checkout ({images.length} {images.length === 1 ? 'poster' : 'posters'})
        </button>
      </div>
    </div>
  );
}
