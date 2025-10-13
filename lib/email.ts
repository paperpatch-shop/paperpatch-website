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
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #2c2c2c;
            background: #f5f5f5;
            padding: 20px;
          }
          .email-wrapper {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          }
          .header {
            background: linear-gradient(135deg, #8B6F47 0%, #6B5444 100%);
            padding: 40px 30px;
            text-align: center;
          }
          .logo {
            max-width: 160px;
            height: auto;
            background: white;
            padding: 15px;
            border-radius: 12px;
            margin: 0 auto;
            display: block;
          }
          .header-title {
            color: white;
            font-size: 20px;
            font-weight: 600;
            margin-top: 20px;
          }
          .content {
            padding: 40px 30px;
          }
          .order-number {
            background: #FFF9F0;
            border-left: 4px solid #8B6F47;
            padding: 16px 20px;
            margin-bottom: 30px;
            border-radius: 4px;
          }
          .order-number strong {
            color: #6B5444;
            font-size: 18px;
          }
          .greeting {
            font-size: 16px;
            color: #2c2c2c;
            margin-bottom: 12px;
          }
          .message {
            color: #666;
            margin-bottom: 30px;
          }
          .section-title {
            font-size: 14px;
            font-weight: 700;
            color: #6B5444;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin: 30px 0 15px 0;
            padding-bottom: 8px;
            border-bottom: 2px solid #E5D5C0;
          }
          .item-card {
            background: #FAFAFA;
            border: 1px solid #E5E5E5;
            border-radius: 8px;
            padding: 16px;
            margin-bottom: 12px;
          }
          .item-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
          }
          .item-name {
            font-weight: 600;
            color: #2c2c2c;
          }
          .item-price {
            font-weight: 700;
            color: #8B6F47;
            font-size: 16px;
          }
          .item-detail {
            display: flex;
            justify-content: space-between;
            font-size: 14px;
            color: #666;
            margin: 4px 0;
          }
          .info-card {
            background: #FAFAFA;
            border-radius: 8px;
            padding: 16px;
            margin-top: 12px;
          }
          .info-row {
            display: flex;
            margin: 8px 0;
            font-size: 14px;
          }
          .info-label {
            font-weight: 600;
            color: #666;
            min-width: 80px;
          }
          .info-value {
            color: #2c2c2c;
          }
          .total-section {
            background: #6B5444;
            color: white;
            padding: 24px;
            border-radius: 8px;
            margin-top: 30px;
          }
          .total-row {
            display: flex;
            justify-content: space-between;
            margin: 10px 0;
            font-size: 15px;
          }
          .total-final {
            border-top: 2px solid rgba(255,255,255,0.3);
            padding-top: 16px;
            margin-top: 16px;
            font-size: 20px;
            font-weight: 700;
          }
          .footer {
            background: #FAFAFA;
            padding: 30px;
            text-align: center;
            font-size: 14px;
            color: #666;
          }
          .footer-link {
            color: #8B6F47;
            text-decoration: none;
            font-weight: 600;
          }
        </style>
      </head>
      <body>
        <div class="email-wrapper">
          <div class="header">
            <img src="https://paperpatch.shop/logo.png" alt="Paperpatch" class="logo" />
            <div class="header-title">Order Confirmation</div>
          </div>

          <div class="content">
            <div class="order-number">
              <strong>Order #${data.orderId}</strong>
            </div>

            <div class="greeting">Hi ${data.customerName},</div>
            <div class="message">
              Thank you for your order! We've received it and will start processing soon.
            </div>

            <div class="section-title">Order Items</div>
            ${data.items.map((item, index) => `
              <div class="item-card">
                <div class="item-header">
                  <span class="item-name">Poster ${index + 1}</span>
                  <span class="item-price">৳${item.price}</span>
                </div>
                <div class="item-detail">
                  <span>Size</span>
                  <span>${item.width}" × ${item.height}"</span>
                </div>
                <div class="item-detail">
                  <span>Board</span>
                  <span>${item.withBoard ? 'Yes' : 'No'}</span>
                </div>
              </div>
            `).join('')}

            <div class="total-section">
              <div class="total-row">
                <span>Subtotal</span>
                <span>৳${data.subtotal}</span>
              </div>
              <div class="total-row">
                <span>Shipping</span>
                <span>৳${data.shippingCost}</span>
              </div>
              <div class="total-row total-final">
                <span>Total</span>
                <span>৳${data.total}</span>
              </div>
            </div>

            <div class="section-title">Delivery Details</div>
            <div class="info-card">
              <div class="info-row">
                <span class="info-label">Name</span>
                <span class="info-value">${data.customerName}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Phone</span>
                <span class="info-value">${data.customerPhone}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Address</span>
                <span class="info-value">${data.customerAddress}</span>
              </div>
            </div>

            <div class="section-title">Payment</div>
            <div class="info-card">
              <div class="info-value">${data.paymentMethod}</div>
            </div>
          </div>

          <div class="footer">
            <p>Questions? Reach us on <a href="https://instagram.com/paperpatchbd" class="footer-link">Instagram @paperpatchbd</a></p>
            <p style="margin-top: 10px; color: #999; font-size: 13px;">Paperpatch - Handcrafted in Dhaka, Bangladesh</p>
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
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #2c2c2c;
            background: #f5f5f5;
            padding: 20px;
          }
          .email-wrapper {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          }
          .alert-header {
            background: linear-gradient(135deg, #DC143C 0%, #8B0000 100%);
            color: white;
            padding: 30px;
            text-align: center;
          }
          .alert-header h1 {
            font-size: 24px;
            margin-bottom: 8px;
          }
          .alert-header p {
            font-size: 18px;
            opacity: 0.95;
          }
          .content {
            padding: 30px;
          }
          .section {
            background: #FAFAFA;
            border-left: 4px solid #8B6F47;
            padding: 20px;
            margin: 20px 0;
            border-radius: 4px;
          }
          .section-title {
            font-size: 14px;
            font-weight: 700;
            color: #6B5444;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 12px;
          }
          .info-row {
            display: flex;
            margin: 8px 0;
            font-size: 14px;
          }
          .info-label {
            font-weight: 600;
            color: #666;
            min-width: 100px;
          }
          .info-value {
            color: #2c2c2c;
          }
          .item-card {
            background: white;
            border: 1px solid #E5E5E5;
            border-radius: 8px;
            padding: 16px;
            margin: 12px 0;
          }
          .item-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            font-weight: 600;
          }
          .item-detail {
            display: flex;
            justify-content: space-between;
            font-size: 14px;
            color: #666;
            margin: 4px 0;
          }
          .total-highlight {
            background: #6B5444;
            color: white;
            padding: 20px;
            text-align: center;
            font-size: 22px;
            font-weight: 700;
            border-radius: 8px;
            margin: 25px 0;
          }
        </style>
      </head>
      <body>
        <div class="email-wrapper">
          <div class="alert-header">
            <h1>New Order Received</h1>
            <p>Order #${data.orderId}</p>
          </div>

          <div class="content">
            <div class="section">
              <div class="section-title">Customer Information</div>
              <div class="info-row">
                <span class="info-label">Name</span>
                <span class="info-value">${data.customerName}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Email</span>
                <span class="info-value">${data.customerEmail}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Phone</span>
                <span class="info-value">${data.customerPhone}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Address</span>
                <span class="info-value">${data.customerAddress}</span>
              </div>
            </div>

            <div class="section">
              <div class="section-title">Order Items</div>
              ${data.items.map((item, index) => `
                <div class="item-card">
                  <div class="item-header">
                    <span>Poster ${index + 1}</span>
                    <span>৳${item.price}</span>
                  </div>
                  <div class="item-detail">
                    <span>Size</span>
                    <span>${item.width}" × ${item.height}"</span>
                  </div>
                  <div class="item-detail">
                    <span>Board</span>
                    <span>${item.withBoard ? 'Yes' : 'No'}</span>
                  </div>
                </div>
              `).join('')}
            </div>

            <div class="section">
              <div class="section-title">Payment Details</div>
              <div class="info-row">
                <span class="info-label">Subtotal</span>
                <span class="info-value">৳${data.subtotal}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Shipping</span>
                <span class="info-value">৳${data.shippingCost}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Payment</span>
                <span class="info-value">${data.paymentMethod}</span>
              </div>
            </div>

            <div class="total-highlight">
              Total: ৳${data.total}
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
}
