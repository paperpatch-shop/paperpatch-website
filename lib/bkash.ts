// bKash Payment Gateway Integration

interface BkashTokenResponse {
  statusCode: string;
  statusMessage: string;
  id_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
}

interface BkashCreatePaymentResponse {
  paymentID: string;
  bkashURL: string;
  callbackURL: string;
  successCallbackURL: string;
  failureCallbackURL: string;
  cancelledCallbackURL: string;
  amount: string;
  intent: string;
  currency: string;
  paymentCreateTime: string;
  transactionStatus: string;
  merchantInvoiceNumber: string;
}

interface BkashExecutePaymentResponse {
  paymentID: string;
  paymentCreateTime: string;
  transactionStatus: string;
  amount: string;
  currency: string;
  intent: string;
  merchantInvoiceNumber: string;
  trxID?: string;
  customerMsisdn?: string;
}

const BKASH_CONFIG = {
  baseURL: process.env.BKASH_BASE_URL || 'https://tokenized.sandbox.bka.sh/v1.2.0-beta',
  appKey: process.env.BKASH_APP_KEY,
  appSecret: process.env.BKASH_APP_SECRET,
  username: process.env.BKASH_USERNAME,
  password: process.env.BKASH_PASSWORD,
};

// Get bKash grant token
export async function getBkashToken(): Promise<string> {
  const response = await fetch(`${BKASH_CONFIG.baseURL}/tokenized/checkout/token/grant`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'username': BKASH_CONFIG.username!,
      'password': BKASH_CONFIG.password!,
    },
    body: JSON.stringify({
      app_key: BKASH_CONFIG.appKey,
      app_secret: BKASH_CONFIG.appSecret,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to get bKash token');
  }

  const data: BkashTokenResponse = await response.json();
  return data.id_token;
}

// Create bKash payment
export async function createBkashPayment(
  amount: number,
  orderId: string,
  callbackURL: string
): Promise<BkashCreatePaymentResponse> {
  const token = await getBkashToken();

  const response = await fetch(`${BKASH_CONFIG.baseURL}/tokenized/checkout/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': token,
      'X-APP-Key': BKASH_CONFIG.appKey!,
    },
    body: JSON.stringify({
      mode: '0011', // Instant checkout
      payerReference: ' ',
      callbackURL: callbackURL,
      amount: amount.toString(),
      currency: 'BDT',
      intent: 'sale',
      merchantInvoiceNumber: orderId,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to create bKash payment: ${JSON.stringify(error)}`);
  }

  return await response.json();
}

// Execute bKash payment
export async function executeBkashPayment(paymentID: string): Promise<BkashExecutePaymentResponse> {
  const token = await getBkashToken();

  const response = await fetch(`${BKASH_CONFIG.baseURL}/tokenized/checkout/execute`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': token,
      'X-APP-Key': BKASH_CONFIG.appKey!,
    },
    body: JSON.stringify({
      paymentID,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to execute bKash payment: ${JSON.stringify(error)}`);
  }

  return await response.json();
}

// Query bKash payment status
export async function queryBkashPayment(paymentID: string): Promise<BkashExecutePaymentResponse> {
  const token = await getBkashToken();

  const response = await fetch(`${BKASH_CONFIG.baseURL}/tokenized/checkout/payment/status`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': token,
      'X-APP-Key': BKASH_CONFIG.appKey!,
    },
    body: JSON.stringify({
      paymentID,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to query bKash payment: ${JSON.stringify(error)}`);
  }

  return await response.json();
}
