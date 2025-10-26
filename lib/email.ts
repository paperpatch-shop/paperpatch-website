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
          .logo-text {
            font-size: 32px;
            font-weight: 700;
            color: white;
            letter-spacing: 1px;
            text-transform: uppercase;
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
            gap: 12px;
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
            flex-shrink: 0;
          }
          .info-value {
            color: #2c2c2c;
            flex: 1;
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
            gap: 12px;
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
            <div class="logo-text">Paperpatch</div>
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
                  <span class="item-price">৳ ${item.price}</span>
                </div>
                <div class="item-detail">
                  <span>Size - ${item.width}" × ${item.height}"</span>
                </div>
                <div class="item-detail">
                  <span>Board - ${item.withBoard ? 'Yes' : 'No'}</span>
                </div>
              </div>
            `).join('')}

            <div class="total-section">
              <div class="total-row">
                <span>Subtotal -</span>
                <span>৳ ${data.subtotal}</span>
              </div>
              <div class="total-row">
                <span>Delivery -</span>
                <span>৳ ${data.shippingCost}</span>
              </div>
              <div class="total-row total-final">
                <span>Total -</span>
                <span>৳ ${data.total}</span>
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
            gap: 12px;
            margin: 8px 0;
            font-size: 14px;
          }
          .info-label {
            font-weight: 600;
            color: #666;
            min-width: 100px;
            flex-shrink: 0;
          }
          .info-value {
            color: #2c2c2c;
            flex: 1;
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
            gap: 12px;
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
                    <span>৳ ${item.price}</span>
                  </div>
                  <div class="item-detail">
                    <span>Size - ${item.width}" × ${item.height}"</span>
                  </div>
                  <div class="item-detail">
                    <span>Board - ${item.withBoard ? 'Yes' : 'No'}</span>
                  </div>
                </div>
              `).join('')}
            </div>

            <div class="section">
              <div class="section-title">Payment Details</div>
              <div class="info-row">
                <span class="info-label">Subtotal -</span>
                <span class="info-value">৳ ${data.subtotal}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Delivery -</span>
                <span class="info-value">৳ ${data.shippingCost}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Payment</span>
                <span class="info-value">${data.paymentMethod}</span>
              </div>
            </div>

            <div class="total-highlight">
              Total: ৳ ${data.total}
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
}

interface StatusUpdateEmailData {
  orderId: string;
  customerName: string;
  customerEmail: string;
}

export async function sendReadyToShipEmail(data: StatusUpdateEmailData) {
  try {
    await resend.emails.send({
      from: 'Paperpatch <orders@paperpatch.shop>',
      to: data.customerEmail,
      subject: 'Your Paperpatch order is ready for delivery!',
      html: generateReadyToShipEmailHTML(data),
    });
    return { success: true };
  } catch (error) {
    console.error('Failed to send ready-to-ship email:', error);
    throw error;
  }
}

export async function sendDeliveredEmail(data: StatusUpdateEmailData) {
  try {
    await resend.emails.send({
      from: 'Paperpatch <orders@paperpatch.shop>',
      to: data.customerEmail,
      subject: 'Your Paperpatch order has been delivered!',
      html: generateDeliveredEmailHTML(data),
    });
    return { success: true };
  } catch (error) {
    console.error('Failed to send delivered email:', error);
    throw error;
  }
}

function generateReadyToShipEmailHTML(data: StatusUpdateEmailData): string {
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
          .logo-text {
            font-size: 32px;
            font-weight: 700;
            color: white;
            letter-spacing: 1px;
            text-transform: uppercase;
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
            margin-bottom: 20px;
            line-height: 1.8;
          }
          .signature {
            margin-top: 30px;
            color: #666;
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
            <div class="logo-text">Paperpatch</div>
            <div class="header-title">Order Ready for Delivery</div>
          </div>

          <div class="content">
            <div class="order-number">
              <strong>Order #${data.orderId}</strong>
            </div>

            <div class="greeting">Dear ${data.customerName},</div>
            
            <div class="message">
              We're happy to let you know that your Order #${data.orderId} is now prepared and ready to be delivered. It will be on its way to you shortly.
            </div>

            <div class="message">
              Thank you for choosing Paperpatch! We truly appreciate your support and look forward to creating more posters for you soon.
            </div>

            <div class="signature">
              Yours sincerely,<br>
              <strong>Paperpatch</strong>
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

function generateDeliveredEmailHTML(data: StatusUpdateEmailData): string {
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
          .logo-text {
            font-size: 32px;
            font-weight: 700;
            color: white;
            letter-spacing: 1px;
            text-transform: uppercase;
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
            margin-bottom: 20px;
            line-height: 1.8;
          }
          .signature {
            margin-top: 30px;
            color: #666;
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
            <div class="logo-text">Paperpatch</div>
            <div class="header-title">Order Delivered</div>
          </div>

          <div class="content">
            <div class="order-number">
              <strong>Order #${data.orderId}</strong>
            </div>

            <div class="greeting">Dear ${data.customerName},</div>
            
            <div class="message">
              We are excited to inform you that your Order #${data.orderId} has been successfully delivered.
            </div>

            <div class="message">
              As we'd love to hear your thoughts on your new purchase, please do take a moment to send a review to our Instagram page. This will also help other buyers get an idea for the product(s).
            </div>

            <div class="message">
              Thank you for shopping with Paperpatch and we look forward to your next purchase. Stay safe!
            </div>

            <div class="signature">
              Yours sincerely,<br>
              <strong>Paperpatch</strong>
            </div>
          </div>

          <div class="footer">
            <p>Share your review on <a href="https://instagram.com/paperpatchbd" class="footer-link">Instagram @paperpatchbd</a></p>
            <p style="margin-top: 10px; color: #999; font-size: 13px;">Paperpatch - Handcrafted in Dhaka, Bangladesh</p>
          </div>
        </div>
      </body>
    </html>
  `;
}
