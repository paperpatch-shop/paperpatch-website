import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface OrderItem {
  imageUrl: string;
  width: number;
  height: number;
  withBoard: boolean;
  price: number;
}

interface OrderEmailData {
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  total: number;
  paymentMethod: string;
}

export async function sendOrderConfirmationEmail(data: OrderEmailData) {
  const adminEmail = process.env.ADMIN_EMAIL;
  
  if (!adminEmail) {
    throw new Error('ADMIN_EMAIL not configured');
  }

  try {
    // Send confirmation to customer (using verified domain)
    console.log('Sending customer email to:', data.customerEmail);
    const customerResult = await resend.emails.send({
      from: 'Paperpatch <orders@paperpatch.shop>',
      to: data.customerEmail,
      replyTo: adminEmail,
      subject: `Order Confirmation #${data.orderId}`,
      html: generateCustomerEmailHTML(data),
    });
    console.log('Customer email sent successfully:', customerResult);

    // Send notification to admin
    console.log('Sending admin email to:', adminEmail);
    const adminResult = await resend.emails.send({
      from: 'Paperpatch Orders <orders@paperpatch.shop>',
      to: adminEmail,
      replyTo: adminEmail,
      subject: `New Order #${data.orderId} - ${data.customerName}`,
      html: generateAdminEmailHTML(data),
    });
    console.log('Admin email sent successfully:', adminResult);

    return { success: true };
  } catch (error) {
    console.error('Email sending failed:', error);
    throw error;
  }
}

function generateCustomerEmailHTML(data: OrderEmailData): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #FFF9F0;
          }
          .container {
            background: white;
            border-radius: 12px;
            padding: 30px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          }
          .header {
            text-align: center;
            border-bottom: 3px solid #8B6F47;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .header h1 {
            color: #6B5444;
            margin: 0;
            font-size: 28px;
          }
          .order-id {
            background: #FFF9F0;
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
            text-align: center;
            border: 2px solid #E5D5C0;
          }
          .order-id strong {
            color: #8B6F47;
            font-size: 18px;
          }
          .section {
            margin: 25px 0;
          }
          .section h2 {
            color: #6B5444;
            font-size: 18px;
            margin-bottom: 15px;
            border-bottom: 2px solid #E5D5C0;
            padding-bottom: 8px;
          }
          .item {
            background: #FFF9F0;
            padding: 15px;
            margin: 10px 0;
            border-radius: 8px;
            border-left: 4px solid #8B6F47;
          }
          .item-details {
            display: flex;
            justify-content: space-between;
            margin: 5px 0;
          }
          .total-section {
            background: #8B6F47;
            color: white;
            padding: 20px;
            border-radius: 8px;
            margin-top: 25px;
          }
          .total-row {
            display: flex;
            justify-content: space-between;
            margin: 8px 0;
          }
          .total-row.final {
            font-size: 20px;
            font-weight: bold;
            border-top: 2px solid rgba(255,255,255,0.3);
            padding-top: 12px;
            margin-top: 12px;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 2px solid #E5D5C0;
            color: #6B5444;
          }
          .info-box {
            background: #FFF9F0;
            padding: 15px;
            border-radius: 8px;
            margin: 10px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎨 Paperpatch</h1>
            <p style="color: #8B6F47; margin: 10px 0 0 0;">Thank you for your order!</p>
          </div>

          <div class="order-id">
            <strong>Order #${data.orderId}</strong>
          </div>

          <p>Hi ${data.customerName},</p>
          <p>We've received your order and will start processing it soon. You'll receive updates as your order progresses.</p>

          <div class="section">
            <h2>📦 Order Details</h2>
            ${data.items.map((item, index) => `
              <div class="item">
                <div class="item-details">
                  <span><strong>Poster ${index + 1}</strong></span>
                  <span><strong>৳${item.price}</strong></span>
                </div>
                <div class="item-details">
                  <span>Size:</span>
                  <span>${item.width}" × ${item.height}"</span>
                </div>
                <div class="item-details">
                  <span>Board:</span>
                  <span>${item.withBoard ? 'Yes' : 'No'}</span>
                </div>
              </div>
            `).join('')}
          </div>

          <div class="total-section">
            <div class="total-row">
              <span>Subtotal:</span>
              <span>৳${data.subtotal}</span>
            </div>
            <div class="total-row">
              <span>Shipping:</span>
              <span>৳${data.shippingCost}</span>
            </div>
            <div class="total-row final">
              <span>Total:</span>
              <span>৳${data.total}</span>
            </div>
          </div>

          <div class="section">
            <h2>📍 Delivery Information</h2>
            <div class="info-box">
              <p style="margin: 5px 0;"><strong>Name:</strong> ${data.customerName}</p>
              <p style="margin: 5px 0;"><strong>Phone:</strong> ${data.customerPhone}</p>
              <p style="margin: 5px 0;"><strong>Address:</strong> ${data.customerAddress}</p>
            </div>
          </div>

          <div class="section">
            <h2>💳 Payment Method</h2>
            <div class="info-box">
              <p style="margin: 5px 0;">${data.paymentMethod}</p>
            </div>
          </div>

          <div class="footer">
            <p><strong>Questions?</strong></p>
            <p>Contact us at ${process.env.ADMIN_EMAIL}</p>
            <p style="color: #8B6F47; margin-top: 20px;">Thank you for choosing Paperpatch! 🎨</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

function generateAdminEmailHTML(data: OrderEmailData): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
          }
          .container {
            background: white;
            border-radius: 8px;
            padding: 30px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          }
          .alert {
            background: #8B6F47;
            color: white;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            margin-bottom: 25px;
          }
          .alert h1 {
            margin: 0;
            font-size: 24px;
          }
          .section {
            margin: 20px 0;
            padding: 15px;
            background: #FFF9F0;
            border-radius: 8px;
            border-left: 4px solid #8B6F47;
          }
          .section h2 {
            color: #6B5444;
            margin-top: 0;
            font-size: 16px;
          }
          .item {
            background: white;
            padding: 12px;
            margin: 8px 0;
            border-radius: 6px;
            border: 1px solid #E5D5C0;
          }
          .row {
            display: flex;
            justify-content: space-between;
            margin: 5px 0;
          }
          .total {
            background: #6B5444;
            color: white;
            padding: 15px;
            border-radius: 8px;
            font-size: 18px;
            font-weight: bold;
            text-align: center;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="alert">
            <h1>🔔 New Order Received!</h1>
            <p style="margin: 10px 0 0 0;">Order #${data.orderId}</p>
          </div>

          <div class="section">
            <h2>👤 Customer Information</h2>
            <p><strong>Name:</strong> ${data.customerName}</p>
            <p><strong>Email:</strong> ${data.customerEmail}</p>
            <p><strong>Phone:</strong> ${data.customerPhone}</p>
            <p><strong>Address:</strong> ${data.customerAddress}</p>
          </div>

          <div class="section">
            <h2>📦 Order Items (${data.items.length})</h2>
            ${data.items.map((item, index) => `
              <div class="item">
                <div class="row">
                  <strong>Poster ${index + 1}</strong>
                  <strong>৳${item.price}</strong>
                </div>
                <div class="row">
                  <span>Size: ${item.width}" × ${item.height}"</span>
                  <span>Board: ${item.withBoard ? 'Yes' : 'No'}</span>
                </div>
              </div>
            `).join('')}
          </div>

          <div class="section">
            <h2>💰 Payment Details</h2>
            <div class="row">
              <span>Subtotal:</span>
              <span>৳${data.subtotal}</span>
            </div>
            <div class="row">
              <span>Shipping:</span>
              <span>৳${data.shippingCost}</span>
            </div>
            <div class="row">
              <strong>Total:</strong>
              <strong>৳${data.total}</strong>
            </div>
            <p style="margin-top: 10px;"><strong>Payment Method:</strong> ${data.paymentMethod}</p>
          </div>

          <div class="total">
            Total Amount: ৳${data.total}
          </div>

          <p style="text-align: center; color: #8B6F47; margin-top: 25px;">
            <strong>Action Required:</strong> Process this order in your admin panel
          </p>
        </div>
      </body>
    </html>
  `;
}
