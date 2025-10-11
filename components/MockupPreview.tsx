'use client';

import { Frame } from 'lucide-react';

interface MockupPreviewProps {
  imageUrl: string | null;
  width: number;
  height: number;
  withBoard: boolean;
}

export default function MockupPreview({ imageUrl, width, height, withBoard }: MockupPreviewProps) {
  // Calculate aspect ratio for display
  const aspectRatio = width / height;
  const maxWidth = 400;
  const displayWidth = Math.min(maxWidth, width * 10);
  const displayHeight = displayWidth / aspectRatio;

  return (
    <div className="paper-card p-6 paper-texture">
      <div className="flex items-center space-x-2 mb-4">
        <Frame className="w-5 h-5 text-warm-600" />
        <h3 className="text-xl font-display font-bold text-paper-900">
          Preview
        </h3>
      </div>

      {/* Wall Mockup */}
      <div className="relative bg-gradient-to-br from-paper-200 to-paper-300 rounded-lg p-8 min-h-[400px] flex items-center justify-center overflow-hidden">
        {/* Wall texture overlay */}
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: `repeating-linear-gradient(
            90deg,
            transparent,
            transparent 2px,
            rgba(0,0,0,0.03) 2px,
            rgba(0,0,0,0.03) 4px
          ),
          repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0,0,0,0.03) 2px,
            rgba(0,0,0,0.03) 4px
          )`
        }} />

        {/* Poster Frame */}
        <div 
          className="relative z-10 bg-white shadow-2xl"
          style={{
            width: `${displayWidth}px`,
            height: `${displayHeight}px`,
            padding: withBoard ? '20px' : '0',
            border: withBoard ? '2px solid #e5e7eb' : 'none',
          }}
        >
          {/* Poster Content */}
          <div className="w-full h-full bg-paper-100 flex items-center justify-center overflow-hidden">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="Poster preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-center p-8">
                <Frame className="w-16 h-16 text-paper-400 mx-auto mb-4" />
                <p className="text-paper-600 font-medium">
                  Your poster will appear here
                </p>
                <p className="text-sm text-paper-500 mt-2">
                  Upload an image to see preview
                </p>
              </div>
            )}
          </div>

          {/* Shadow effect */}
          <div className="absolute inset-0 pointer-events-none shadow-inner" />
        </div>

        {/* Hanging wire effect */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-32 h-8 z-0">
          <svg viewBox="0 0 100 30" className="w-full h-full">
            <path
              d="M 0,15 Q 50,25 100,15"
              stroke="#8b7355"
              strokeWidth="1"
              fill="none"
            />
          </svg>
        </div>
      </div>

      {/* Size Info */}
      <div className="mt-4 bg-paper-100 rounded-lg p-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-paper-600">Dimensions</p>
            <p className="font-semibold text-paper-900">
              {width}" × {height}"
            </p>
          </div>
          <div>
            <p className="text-paper-600">Board</p>
            <p className="font-semibold text-paper-900">
              {withBoard ? 'With Board' : 'Without Board'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
