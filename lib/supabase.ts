import { createClient } from '@supabase/supabase-js';
import { StandardSize, DEFAULT_SIZES } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Get current prices from Supabase
export async function getPrices(): Promise<StandardSize[]> {
  console.log('[getPrices] Function called');
  
  if (!supabase) {
    console.warn('[getPrices] Supabase not configured. Using default prices.');
    return DEFAULT_SIZES;
  }

  try {
    console.log('[getPrices] Fetching from Supabase...');
    const { data, error } = await supabase
      .from('prices')
      .select('sizes')
      .eq('id', 'default')
      .single();

    if (error) {
      console.error('[getPrices] Supabase error:', error);
      throw error;
    }
    
    console.log('[getPrices] Data received:', data);
    const prices = data?.sizes || DEFAULT_SIZES;
    console.log('[getPrices] Returning prices:', prices);
    return prices;
  } catch (error) {
    console.error('[getPrices] Error fetching prices:', error);
    return DEFAULT_SIZES;
  }
}

// Save prices to Supabase
export async function savePrices(prices: StandardSize[]): Promise<boolean> {
  if (!supabase) {
    console.warn('Supabase not configured. Prices not saved.');
    return false;
  }

  try {
    const { error } = await supabase
      .from('prices')
      .upsert({
        id: 'default',
        sizes: prices,
        updated_at: new Date().toISOString(),
      });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error saving prices:', error);
    return false;
  }
}

export async function uploadImage(file: File, orderId: string): Promise<string | null> {
  if (!supabase) {
    console.warn('Supabase not configured. Image upload skipped.');
    return null;
  }

  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${orderId}-${Date.now()}.${fileExt}`;
    const filePath = `uploads/${fileName}`;

    const { data, error } = await supabase.storage
      .from('poster-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;

    const { data: urlData } = supabase.storage
      .from('poster-images')
      .getPublicUrl(filePath);

    return urlData.publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    return null;
  }
}

export async function saveOrder(order: any): Promise<string | null> {
  if (!supabase) {
    console.warn('Supabase not configured. Saving to localStorage instead.');
    // Remove imageFile from items to avoid quota issues
    const orderToSave = {
      ...order,
      items: order.items.map((item: any) => {
        const { imageFile, ...itemWithoutFile } = item;
        return itemWithoutFile;
      })
    };
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.push(orderToSave);
    localStorage.setItem('orders', JSON.stringify(orders));
    return order.id;
  }

  try {
    // Transform order to match database schema (snake_case)
    const dbOrder = {
      id: order.id,
      order_number: order.orderNumber,
      items: order.items,
      shipping: order.shipping,
      payment_method: order.paymentMethod,
      bkash_transaction_id: order.bkashTransactionId,
      shipping_cost: order.shippingCost,
      total_amount: order.totalAmount,
      status: order.status,
      created_at: order.createdAt,
    };

    const { data, error } = await supabase
      .from('orders')
      .insert([dbOrder])
      .select()
      .single();

    if (error) throw error;
    return data.id;
  } catch (error) {
    console.error('Error saving order:', error);
    return null;
  }
}

export async function getOrders(): Promise<any[]> {
  if (!supabase) {
    return JSON.parse(localStorage.getItem('orders') || '[]');
  }

  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    // Transform database records back to camelCase for frontend
    return (data || []).map((order: any) => ({
      id: order.id,
      orderNumber: order.order_number,
      item: order.items?.[0] || {},
      items: order.items || [],
      shipping: order.shipping,
      paymentMethod: order.payment_method,
      bkashTransactionId: order.bkash_transaction_id,
      shippingCost: order.shipping_cost,
      totalAmount: order.total_amount,
      status: order.status,
      notes: order.notes,
      createdAt: order.created_at,
      approvedAt: order.approved_at,
    }));
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
}

export async function updateOrderStatus(
  orderId: string, 
  status: string, 
  notes?: string
): Promise<boolean> {
  if (!supabase) {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const index = orders.findIndex((o: any) => o.id === orderId);
    if (index !== -1) {
      orders[index].status = status;
      if (notes) orders[index].notes = notes;
      if (status === 'approved') orders[index].approvedAt = new Date().toISOString();
      localStorage.setItem('orders', JSON.stringify(orders));
      return true;
    }
    return false;
  }

  try {
    const updateData: any = { status };
    if (notes) updateData.notes = notes;
    if (status === 'approved') updateData.approved_at = new Date().toISOString();

    const { error } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', orderId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating order:', error);
    return false;
  }
}

export async function updateOrderPrice(orderId: string, newPrice: number): Promise<boolean> {
  if (!supabase) {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const index = orders.findIndex((o: any) => o.id === orderId);
    if (index !== -1) {
      const shippingCost = orders[index].shippingCost || 0;
      orders[index].item.price = newPrice;
      orders[index].totalAmount = newPrice + shippingCost;
      localStorage.setItem('orders', JSON.stringify(orders));
      return true;
    }
    return false;
  }

  try {
    // First get the order to update items and calculate new total
    const { data: order, error: fetchError } = await supabase
      .from('orders')
      .select('items, shipping_cost')
      .eq('id', orderId)
      .single();

    if (fetchError) throw fetchError;

    // Update the first item's price in the items array
    const updatedItems = [...(order.items || [])];
    if (updatedItems.length > 0) {
      updatedItems[0] = { ...updatedItems[0], price: newPrice };
    }

    // Calculate new total (sum of all items + shipping)
    const itemsTotal = updatedItems.reduce((sum, item) => sum + (item.price || 0), 0);
    const newTotal = itemsTotal + (order.shipping_cost || 0);

    const { error } = await supabase
      .from('orders')
      .update({ 
        items: updatedItems,
        total_amount: newTotal 
      })
      .eq('id', orderId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating order price:', error);
    return false;
  }
}

// Gallery Management Functions
export async function getGalleryImages() {
  console.log('[getGalleryImages] Starting...');
  console.log('[getGalleryImages] Supabase client exists:', !!supabase);
  
  if (!supabase) {
    console.warn('[getGalleryImages] Supabase not configured');
    return [];
  }

  try {
    console.log('[getGalleryImages] Fetching from gallery_images table...');
    const { data, error } = await supabase
      .from('gallery_images')
      .select('*')
      .order('order_index', { ascending: true });

    console.log('[getGalleryImages] Response - data:', data, 'error:', error);
    
    if (error) throw error;
    console.log('[getGalleryImages] Returning', data?.length || 0, 'images');
    return data || [];
  } catch (error) {
    console.error('[getGalleryImages] Error fetching gallery images:', error);
    return [];
  }
}

export async function uploadGalleryImage(file: File, category: 'previous_orders' | 'reviews') {
  if (!supabase) {
    throw new Error('Supabase not configured');
  }

  try {
    // Upload to storage
    const fileExt = file.name.split('.').pop();
    const fileName = `${category}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('gallery')
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('gallery')
      .getPublicUrl(fileName);

    // Get the highest order_index for this category
    const { data: existingImages } = await supabase
      .from('gallery_images')
      .select('order_index')
      .eq('category', category)
      .order('order_index', { ascending: false })
      .limit(1);

    const nextOrderIndex = existingImages && existingImages.length > 0 
      ? (existingImages[0].order_index || 0) + 1 
      : 0;

    // Save to database
    const { error: dbError } = await supabase
      .from('gallery_images')
      .insert({
        image_url: publicUrl,
        category: category,
        order_index: nextOrderIndex,
      });

    if (dbError) throw dbError;
    return true;
  } catch (error) {
    console.error('Error uploading gallery image:', error);
    throw error;
  }
}

export async function deleteGalleryImage(id: string, imageUrl: string) {
  if (!supabase) {
    throw new Error('Supabase not configured');
  }

  try {
    // Extract file path from URL
    const urlParts = imageUrl.split('/');
    const fileName = urlParts[urlParts.length - 1];
    const category = urlParts[urlParts.length - 2];
    const filePath = `${category}/${fileName}`;

    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from('gallery')
      .remove([filePath]);

    if (storageError) console.error('Storage delete error:', storageError);

    // Delete from database
    const { error: dbError } = await supabase
      .from('gallery_images')
      .delete()
      .eq('id', id);

    if (dbError) throw dbError;
    return true;
  } catch (error) {
    console.error('Error deleting gallery image:', error);
    throw error;
  }
}

export async function updateGalleryImageOrder(imageId: string, newOrderIndex: number) {
  if (!supabase) {
    throw new Error('Supabase not configured');
  }

  try {
    const { error } = await supabase
      .from('gallery_images')
      .update({ order_index: newOrderIndex })
      .eq('id', imageId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating gallery image order:', error);
    throw error;
  }
}

// Delete order
export async function deleteOrder(orderId: string): Promise<boolean> {
  if (!supabase) {
    throw new Error('Supabase not configured');
  }

  try {
    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', orderId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting order:', error);
    throw error;
  }
}
