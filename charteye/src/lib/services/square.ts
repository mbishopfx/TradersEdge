/**
 * Square payment integration service
 * Using direct fetch API instead of SDK to avoid import issues
 */

// Check if we have the required environment variables
const accessToken = process.env.SQUARE_ACCESS_TOKEN;
const locationId = process.env.SQUARE_LOCATION_ID;

if (!accessToken || !locationId) {
  console.error('Square API keys are missing:', { 
    hasAccessToken: !!accessToken, 
    hasLocationId: !!locationId 
  });
}

// Base URL for Square API
const baseUrl = 'https://connect.squareupsandbox.com/v2'; // Use sandbox URL for testing
// const baseUrl = 'https://connect.squareup.com/v2'; // Production URL

/**
 * Creates a payment link for Square checkout
 */
export async function createPaymentLink(userId: string): Promise<string> {
  try {
    // Validate required environment variables
    if (!process.env.SQUARE_ACCESS_TOKEN || !process.env.SQUARE_LOCATION_ID) {
      throw new Error('Square API keys are not configured');
    }

    console.log('Creating payment link for user:', userId);
    
    // Get app URL with fallback
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    
    const response = await fetch(`${baseUrl}/online-checkout/payment-links`, {
      method: 'POST',
      headers: {
        'Square-Version': '2023-12-13',
        'Authorization': `Bearer ${process.env.SQUARE_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        idempotency_key: `${Date.now()}_${userId}`,
        quick_pay: {
          name: 'ChartEye Lifetime Access',
          price_money: {
            amount: 2000, // $20.00 in cents
            currency: 'USD'
          },
          location_id: process.env.SQUARE_LOCATION_ID
        },
        checkout_options: {
          redirect_url: `${appUrl}/upgrade?status=success&user_id=${userId}`,
          merchant_support_email: 'support@tradertools.com'
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Square API error:', errorData);
      throw new Error(`Square API error: ${errorData.errors?.[0]?.detail || 'Unknown error'}`);
    }

    const data = await response.json();
    console.log('Payment link created successfully');
    
    if (!data.payment_link?.url) {
      throw new Error('No payment link URL in the response');
    }

    return data.payment_link.url;
  } catch (error: any) {
    console.error('Error creating payment link:', error);
    throw new Error(`Square payment error: ${error.message || 'Unknown error'}`);
  }
}

/**
 * Verifies a payment status by order ID
 */
export async function verifyPayment(orderId: string): Promise<boolean> {
  try {
    // Validate required environment variables
    if (!process.env.SQUARE_ACCESS_TOKEN) {
      throw new Error('Square API keys are not configured');
    }

    console.log('Verifying order ID:', orderId);
    
    // Try to get the order details first
    const orderResponse = await fetch(`${baseUrl}/orders/${orderId}`, {
      method: 'GET',
      headers: {
        'Square-Version': '2023-12-13',
        'Authorization': `Bearer ${process.env.SQUARE_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    if (!orderResponse.ok) {
      console.error('Failed to get order details, order may not exist');
      return false;
    }

    const orderData = await orderResponse.json();
    console.log('Order details retrieved:', {
      state: orderData.order?.state,
      totalMoney: orderData.order?.total_money
    });

    // Check if order is completed
    return orderData.order?.state === 'COMPLETED';
  } catch (error: any) {
    console.error('Error verifying payment:', error);
    return false;
  }
} 