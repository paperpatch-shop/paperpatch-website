'use client';

import { useState, useEffect } from 'react';
import { DEFAULT_SIZES, OrderItem, StandardSize } from '@/lib/types';
import { getPrices } from '@/lib/supabase';
import { calculatePosterPrice, validateCustomSize } from '@/lib/pricing';
import { Ruler, CheckCircle2 } from 'lucide-react';

interface ProductSelectorProps {
  onSelect: (item: OrderItem) => void;
  currentSelection: OrderItem;
}

export default function ProductSelector({ onSelect, currentSelection }: ProductSelectorProps) {
  console.log('[ProductSelector] Component rendered');
  
  const [standardSizes, setStandardSizes] = useState<StandardSize[]>(DEFAULT_SIZES);
  const [isLoadingPrices, setIsLoadingPrices] = useState(true);
  const [sizeType, setSizeType] = useState<'standard' | 'custom'>('standard');
  const [selectedStandardIndex, setSelectedStandardIndex] = useState(0);
  const [withBoard, setWithBoard] = useState(false);
  const [customHeight, setCustomHeight] = useState('12');
  const [customWidth, setCustomWidth] = useState('8');
  const [error, setError] = useState('');

  // Load prices from Supabase on mount
  useEffect(() => {
    console.log('[ProductSelector] useEffect triggered');
    const loadPrices = async () => {
      console.log('[ProductSelector] Loading prices from Supabase...');
      const loadedSizes = await getPrices();
      console.log('[ProductSelector] Loaded prices:', loadedSizes);
      setStandardSizes(loadedSizes);
      setIsLoadingPrices(false);
      
      // Trigger initial selection with loaded prices
      const size = loadedSizes[0];
      const price = size.priceWithoutBoard;
      
      console.log('Initial selection price:', price);
      
      onSelect({
        width: size.width,
        height: size.height,
        withBoard: false,
        price: price,
      });
    };
    
    loadPrices();
  }, [onSelect]);

  const handleStandardSizeSelect = (index: number) => {
    setSelectedStandardIndex(index);
    setError('');
    const size = standardSizes[index];
    
    // Check if board option is available for this size
    const canHaveBoard = size.priceWithBoard !== undefined;
    const finalWithBoard = canHaveBoard ? withBoard : false;
    
    if (!canHaveBoard && withBoard) {
      setWithBoard(false);
    }

    // Update parent with new selection and price
    const price = finalWithBoard && size.priceWithBoard 
      ? size.priceWithBoard 
      : size.priceWithoutBoard;
    
    onSelect({
      width: size.width,
      height: size.height,
      withBoard: finalWithBoard,
      price: price,
    });
  };

  const handleBoardToggle = (hasBoard: boolean) => {
    setWithBoard(hasBoard);
    setError('');
    const size = standardSizes[selectedStandardIndex];
    if (hasBoard && !size.priceWithBoard) {
      setError('Board option not available for this size');
      return;
    }

    // Update parent with new price
    const price = hasBoard && size.priceWithBoard 
      ? size.priceWithBoard 
      : size.priceWithoutBoard;
    
    onSelect({
      width: size.width,
      height: size.height,
      withBoard: hasBoard,
      price: price,
    });
  };

  const calculateCurrentPrice = () => {
    if (sizeType === 'standard') {
      const size = standardSizes[selectedStandardIndex];
      return withBoard && size.priceWithBoard 
        ? size.priceWithBoard 
        : size.priceWithoutBoard;
    } else {
      const height = parseFloat(customHeight) || 0;
      const width = parseFloat(customWidth) || 0;
      return calculatePosterPrice(width, height, withBoard);
    }
  };

  const handleContinue = () => {
    let width: number, height: number;

    if (sizeType === 'standard') {
      const size = standardSizes[selectedStandardIndex];
      width = size.width;
      height = size.height;
    } else {
      height = parseFloat(customHeight);
      width = parseFloat(customWidth);

      const validation = validateCustomSize(height, width);
      if (!validation.valid) {
        setError(validation.error || 'Invalid size');
        return;
      }
    }

    const price = calculatePosterPrice(width, height, withBoard);

    onSelect({
      width,
      height,
      withBoard,
      price,
    });
  };
  const currentPrice = calculateCurrentPrice();

  return (
    <div className="paper-card p-6 paper-texture">
      <div className="flex items-center space-x-2 mb-6">
        <Ruler className="w-6 h-6 text-warm-600" />
        <h2 className="text-2xl font-display font-bold text-paper-900">
          Select Poster Size
        </h2>
      </div>

      {/* Size Type Toggle */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setSizeType('standard')}
          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
            sizeType === 'standard'
              ? 'bg-warm-500 text-white shadow-md'
              : 'bg-paper-100 text-paper-700 hover:bg-paper-200'
          }`}
        >
          Standard Sizes
        </button>
        <button
          onClick={() => setSizeType('custom')}
          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
            sizeType === 'custom'
              ? 'bg-warm-500 text-white shadow-md'
              : 'bg-paper-100 text-paper-700 hover:bg-paper-200'
          }`}
        >
          Custom Size
        </button>
      </div>

      {/* Standard Sizes */}
      {sizeType === 'standard' && (
        <div className="space-y-3 mb-6">
          {isLoadingPrices && (
            <div className="text-center py-4 text-paper-600">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-warm-600 mx-auto mb-2"></div>
              Loading prices...
            </div>
          )}
          {!isLoadingPrices && standardSizes.map((size, index) => (
            <div
              key={index}
              onClick={() => handleStandardSizeSelect(index)}
              className={`radio-card ${
                selectedStandardIndex === index ? 'radio-card-selected' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedStandardIndex === index
                        ? 'border-warm-500 bg-warm-500'
                        : 'border-paper-400'
                    }`}
                  >
                    {selectedStandardIndex === index && (
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-paper-900">{size.label}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-warm-700">
                    ৳{withBoard && size.priceWithBoard ? size.priceWithBoard : size.priceWithoutBoard}
                  </p>
                  {!size.priceWithBoard && (
                    <p className="text-xs text-paper-500">No board option</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Custom Size */}
      {sizeType === 'custom' && (
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-paper-700 mb-2">
              Height (inches) - Minimum 12"
            </label>
            <input
              type="number"
              min="12"
              max="60"
              step="0.5"
              value={customHeight}
              onChange={(e) => {
                setCustomHeight(e.target.value);
                setError('');
              }}
              className="input-field"
              placeholder="e.g., 12"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-paper-700 mb-2">
              Width (inches)
            </label>
            <input
              type="number"
              min="1"
              max="60"
              step="0.5"
              value={customWidth}
              onChange={(e) => {
                setCustomWidth(e.target.value);
                setError('');
              }}
              className="input-field"
              placeholder="e.g., 8"
            />
          </div>
          {error && (
            <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
              {error}
            </p>
          )}
        </div>
      )}

      {/* Board Option */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-paper-700 mb-3">
          Board Option
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => handleBoardToggle(false)}
            className={`radio-card ${!withBoard ? 'radio-card-selected' : ''}`}
          >
            <div className="text-center">
              <p className="font-semibold text-paper-900">Without Board</p>
              <p className="text-xs text-paper-600 mt-1">Paper only</p>
            </div>
          </button>
          <button
            onClick={() => handleBoardToggle(true)}
            className={`radio-card ${withBoard ? 'radio-card-selected' : ''}`}
          >
            <div className="text-center">
              <p className="font-semibold text-paper-900">With Board</p>
              <p className="text-xs text-paper-600 mt-1">Mounted on board</p>
            </div>
          </button>
        </div>
      </div>

      {/* Price Summary */}
      <div className="bg-warm-50 border-2 border-warm-200 rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-paper-700 font-medium">Poster Price:</span>
          <span className="text-2xl font-bold text-warm-700">
            ৳{currentPrice}
          </span>
        </div>
        <p className="text-xs text-paper-600 mt-2">
          + Shipping cost (calculated at checkout)
        </p>
      </div>

      {/* Continue Button */}
      <button
        onClick={handleContinue}
        className="btn-primary w-full"
      >
        Continue to Upload Image
      </button>
    </div>
  );
}
