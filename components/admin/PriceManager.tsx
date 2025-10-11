'use client';

import { useState, useEffect } from 'react';
import { DollarSign, Save, RotateCcw } from 'lucide-react';
import { DEFAULT_SIZES, StandardSize } from '@/lib/types';
import { getPrices, savePrices } from '@/lib/supabase';

interface PriceManagerProps {
  onClose: () => void;
}

export default function PriceManager({ onClose }: PriceManagerProps) {
  const [prices, setPrices] = useState<StandardSize[]>(DEFAULT_SIZES);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  // Load prices from Supabase on mount
  useEffect(() => {
    const loadPrices = async () => {
      const loadedPrices = await getPrices();
      setPrices(loadedPrices);
    };
    loadPrices();
  }, []);

  const handlePriceChange = (index: number, field: 'priceWithoutBoard' | 'priceWithBoard', value: string) => {
    const newPrices = [...prices];
    const numValue = parseInt(value) || 0;
    newPrices[index] = {
      ...newPrices[index],
      [field]: numValue,
    };
    setPrices(newPrices);
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    const success = await savePrices(prices);
    
    if (success) {
      setMessage('Prices updated successfully! All customers will see new prices.');
      setTimeout(() => {
        setIsSaving(false);
        onClose();
      }, 2000);
    } else {
      setMessage('Failed to save prices. Please try again.');
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    const success = await savePrices(DEFAULT_SIZES);
    if (success) {
      setPrices(DEFAULT_SIZES);
      setMessage('Prices reset to defaults');
      setTimeout(() => setMessage(''), 3000);
    } else {
      setMessage('Failed to reset prices');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-[#E5D5C0] p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#8B6F47] rounded-full flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#6B5444]">Manage Prices</h2>
                <p className="text-sm text-[#6B5444]/70">Update poster pricing</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-[#6B5444] hover:text-[#8B6F47] text-2xl font-bold"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {message && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-800 text-sm">
              {message}
            </div>
          )}

          <div className="space-y-4">
            {prices.map((size, index) => (
              <div key={index} className="bg-[#FFF9F0] border border-[#E5D5C0] rounded-lg p-4">
                <h3 className="font-bold text-[#6B5444] mb-3">
                  {size.width}" × {size.height}"
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#6B5444]/80 mb-2">
                      Without Board (৳)
                    </label>
                    <input
                      type="number"
                      value={size.priceWithoutBoard}
                      onChange={(e) => handlePriceChange(index, 'priceWithoutBoard', e.target.value)}
                      className="w-full px-4 py-2 border border-[#E5D5C0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B6F47] focus:border-transparent"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#6B5444]/80 mb-2">
                      With Board (৳)
                    </label>
                    <input
                      type="number"
                      value={size.priceWithBoard || 0}
                      onChange={(e) => handlePriceChange(index, 'priceWithBoard', e.target.value)}
                      className="w-full px-4 py-2 border border-[#E5D5C0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B6F47] focus:border-transparent"
                      min="0"
                      disabled={!size.priceWithBoard}
                    />
                    {!size.priceWithBoard && (
                      <p className="text-xs text-[#6B5444]/60 mt-1">Not available</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex space-x-3 pt-4 border-t border-[#E5D5C0]">
            <button
              onClick={handleReset}
              className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-[#6B5444] rounded-xl font-bold transition-all duration-150 flex items-center justify-center space-x-2"
            >
              <RotateCcw className="w-5 h-5" />
              <span>Reset to Defaults</span>
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1 px-6 py-3 bg-[#8B6F47] hover:bg-[#6B5444] text-white rounded-xl font-bold transition-all duration-150 shadow-xl flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              <span>{isSaving ? 'Saving...' : 'Save Prices'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
