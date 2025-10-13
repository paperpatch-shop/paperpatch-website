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
        <link href="https://fonts.googleapis.com/css2?family=Coming+Soon&display=swap" rel="stylesheet">
        <style>
          body {
            font-family: 'Coming Soon', cursive;
            line-height: 2.2;
            color: #1a1a1a;
            max-width: 650px;
            margin: 0 auto;
            padding: 20px;
            background-color: #e8e8e8;
          }
          .notebook {
            background: white;
            border: 3px solid #2c2c2c;
            border-radius: 8px;
            padding: 0;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            position: relative;
            background-image: 
              repeating-linear-gradient(
                transparent,
                transparent 33px,
                #4A90E2 33px,
                #4A90E2 34px
              ),
              linear-gradient(90deg, transparent 45px, #DC143C 45px, #DC143C 47px, transparent 47px);
            background-size: 100% 34px;
          }
          .header {
            text-align: center;
            padding: 40px 60px 20px 60px;
            position: relative;
          }
          .logo {
            max-width: 180px;
            height: auto;
            margin: 0 auto 10px;
            display: block;
          }
          .header-text {
            background: rgba(255, 255, 0, 0.4);
            display: inline-block;
            padding: 5px 15px;
            font-size: 18px;
            margin-top: 10px;
          }
          .hole {
            width: 16px;
            height: 16px;
            background: #2c2c2c;
            border-radius: 50%;
            position: absolute;
            left: 15px;
          }
          .hole-1 { top: 60px; }
          .hole-2 { top: 50%; }
          .hole-3 { bottom: 60px; }
          .content {
            padding: 20px 60px 40px 60px;
            position: relative;
          }
          .order-badge {
            background: rgba(255, 255, 0, 0.4);
            padding: 8px 20px;
            display: inline-block;
            font-size: 20px;
            font-weight: bold;
            margin: 10px 0 20px 0;
          }
          .greeting {
            font-size: 18px;
            margin: 20px 0;
          }
          .section-title {
            font-size: 20px;
            font-weight: bold;
            margin: 25px 0 15px 0;
            text-decoration: underline;
            text-decoration-color: #4A90E2;
            text-decoration-thickness: 2px;
          }
          .item-box {
            background: rgba(255, 255, 0, 0.15);
            padding: 12px 15px;
            margin: 15px 0;
            border-left: 4px solid #DC143C;
          }
          .item-row {
            display: flex;
            justify-content: space-between;
            margin: 5px 0;
            font-size: 16px;
          }
          .total-box {
            background: rgba(74, 144, 226, 0.2);
            padding: 20px;
            margin: 25px 0;
            border: 2px solid #4A90E2;
          }
          .total-row {
            display: flex;
            justify-content: space-between;
            margin: 8px 0;
            font-size: 17px;
          }
          .final-total {
            font-size: 22px;
            font-weight: bold;
            border-top: 2px solid #2c2c2c;
            padding-top: 12px;
            margin-top: 12px;
          }
          .info-section {
            background: rgba(255, 255, 0, 0.15);
            padding: 15px;
            margin: 20px 0;
            border-left: 4px solid #4A90E2;
          }
          .footer-text {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 2px dashed #4A90E2;
            font-size: 16px;
          }
        </style>
      </head>
      <body>
        <div class="notebook">
          <div class="hole hole-1"></div>
          <div class="hole hole-2"></div>
          <div class="hole hole-3"></div>
          
          <div class="header">
            <img src="https://paperpatch.shop/logo.png" alt="Paperpatch" class="logo" />
            <div class="header-text">Thank you for your order!</div>
          </div>

          <div class="content">
            <div class="order-badge">Order #${data.orderId}</div>

            <div class="greeting">Hi ${data.customerName},</div>
            <p>We've received your order and will start processing it soon. You'll receive updates as your order progresses.</p>

            <div class="section-title">📦 Order Details</div>
            ${data.items.map((item, index) => `
              <div class="item-box">
                <div class="item-row">
                  <span><strong>Poster ${index + 1}</strong></span>
                  <span><strong>৳${item.price}</strong></span>
                </div>
                <div class="item-row">
                  <span>Size:</span>
                  <span>${item.width}" × ${item.height}"</span>
                </div>
                <div class="item-row">
                  <span>Board:</span>
                  <span>${item.withBoard ? 'Yes' : 'No'}</span>
                </div>
              </div>
            `).join('')}

            <div class="total-box">
              <div class="total-row">
                <span>Subtotal:</span>
                <span>৳${data.subtotal}</span>
              </div>
              <div class="total-row">
                <span>Shipping:</span>
                <span>৳${data.shippingCost}</span>
              </div>
              <div class="total-row final-total">
                <span>Total:</span>
                <span>৳${data.total}</span>
              </div>
            </div>

            <div class="section-title">📍 Shipping Information</div>
            <div class="info-section">
              <p><strong>Name:</strong> ${data.customerName}</p>
              <p><strong>Phone:</strong> ${data.customerPhone}</p>
              <p><strong>Address:</strong> ${data.customerAddress}</p>
            </div>

            <div class="section-title">💳 Payment Method</div>
            <div class="info-section">
              <p>${data.paymentMethod}</p>
            </div>

            <div class="footer-text">
              <p>Questions? Reach us on Instagram @paperpatchbd</p>
              <p>🎨 Paperpatch - Handcrafted with care in Dhaka</p>
            </div>
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
        <link href="https://fonts.googleapis.com/css2?family=Coming+Soon&display=swap" rel="stylesheet">
        <style>
          body {
            font-family: 'Coming Soon', cursive;
            line-height: 2;
            color: #1a1a1a;
            max-width: 650px;
            margin: 0 auto;
            padding: 20px;
            background-color: #e8e8e8;
          }
          .notebook {
            background: white;
            border: 3px solid #2c2c2c;
            border-radius: 8px;
            padding: 0;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            position: relative;
            background-image: 
              repeating-linear-gradient(
                transparent,
                transparent 33px,
                #4A90E2 33px,
                #4A90E2 34px
              ),
              linear-gradient(90deg, transparent 45px, #DC143C 45px, #DC143C 47px, transparent 47px);
            background-size: 100% 34px;
          }
          .alert-header {
            background: linear-gradient(135deg, #DC143C 0%, #8B0000 100%);
            color: white;
            padding: 30px 60px;
            text-align: center;
            border-radius: 5px 5px 0 0;
          }
          .alert-header h1 {
            margin: 0;
            font-size: 28px;
          }
          .alert-header p {
            margin: 10px 0 0 0;
            font-size: 20px;
          }
          .hole {
            width: 16px;
            height: 16px;
            background: #2c2c2c;
            border-radius: 50%;
            position: absolute;
            left: 15px;
          }
          .hole-1 { top: 120px; }
          .hole-2 { top: 50%; }
          .hole-3 { bottom: 60px; }
          .content {
            padding: 20px 60px 40px 60px;
          }
          .section {
            background: rgba(255, 255, 0, 0.15);
            padding: 15px;
            margin: 20px 0;
            border-left: 4px solid #DC143C;
          }
          .section h2 {
            margin: 0 0 10px 0;
            font-size: 20px;
            text-decoration: underline;
            text-decoration-color: #4A90E2;
          }
          .section p {
            margin: 5px 0;
            font-size: 16px;
          }
          .item-box {
            background: white;
            padding: 12px;
            margin: 10px 0;
            border: 2px solid #4A90E2;
          }
          .row {
            display: flex;
            justify-content: space-between;
            margin: 5px 0;
          }
          .total-highlight {
            background: rgba(74, 144, 226, 0.3);
            padding: 15px;
            font-size: 22px;
            font-weight: bold;
            text-align: center;
            margin: 20px 0;
            border: 2px solid #4A90E2;
          }
        </style>
      </head>
      <body>
        <div class="notebook">
          <div class="alert-header">
            <h1>🔔 New Order Received!</h1>
            <p>Order #${data.orderId}</p>
          </div>
          
          <div class="hole hole-1"></div>
          <div class="hole hole-2"></div>
          <div class="hole hole-3"></div>

          <div class="content">
            <div class="section">
              <h2>👤 Customer Information</h2>
              <p><strong>Name:</strong> ${data.customerName}</p>
              <p><strong>Email:</strong> ${data.customerEmail}</p>
              <p><strong>Phone:</strong> ${data.customerPhone}</p>
              <p><strong>Address:</strong> ${data.customerAddress}</p>
            </div>

            <div class="section">
              <h2>📦 Order Items</h2>
              ${data.items.map((item, index) => `
                <div class="item-box">
                  <div class="row">
                    <span><strong>Poster ${index + 1}</strong></span>
                    <span><strong>৳${item.price}</strong></span>
                  </div>
                  <div class="row">
                    <span>Size:</span>
                    <span>${item.width}" × ${item.height}"</span>
                  </div>
                  <div class="row">
                    <span>Board:</span>
                    <span>${item.withBoard ? 'Yes' : 'No'}</span>
                  </div>
                </div>
              `).join('')}
            </div>

            <div class="section">
              <h2>💰 Payment Details</h2>
              <p><strong>Subtotal:</strong> ৳${data.subtotal}</p>
              <p><strong>Shipping:</strong> ৳${data.shippingCost}</p>
              <p><strong>Payment Method:</strong> ${data.paymentMethod}</p>
            </div>

            <div class="total-highlight">
              Total Amount: ৳${data.total}
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
}
