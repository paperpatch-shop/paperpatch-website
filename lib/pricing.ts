import { STANDARD_SIZES } from './types';

export function calculatePosterPrice(
  width: number,
  height: number,
  withBoard: boolean
): number {
  // Check if it matches a standard size
  const standardSize = STANDARD_SIZES.find(
    size => size.width === width && size.height === height
  );

  if (standardSize) {
    if (withBoard && standardSize.priceWithBoard) {
      return standardSize.priceWithBoard;
    }
    return standardSize.priceWithoutBoard;
  }

  // Custom size pricing calculation
  // Base price per square inch
  const area = width * height;
  const pricePerSqInch = withBoard ? 3.5 : 2.8;
  const basePrice = area * pricePerSqInch;

  // Add board premium for custom sizes
  const boardPremium = withBoard ? 200 : 0;

  // Round to nearest 50
  const totalPrice = Math.ceil((basePrice + boardPremium) / 50) * 50;

  return totalPrice;
}

export function validateCustomSize(height: number, width: number): {
  valid: boolean;
  error?: string;
} {
  if (height < 12) {
    return { valid: false, error: 'Height must be at least 12 inches' };
  }

  if (width < 1) {
    return { valid: false, error: 'Width must be at least 1 inch' };
  }

  if (height > 60 || width > 60) {
    return { valid: false, error: 'Maximum dimension is 60 inches' };
  }

  return { valid: true };
}

export function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `PP-${timestamp}-${random}`;
}
