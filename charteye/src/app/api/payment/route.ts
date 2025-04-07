import { NextResponse } from 'next/server';
import { createPaymentLink, verifyPayment } from '@/lib/services/square';
import { updateUserProfile } from '@/lib/services/firebase';
import { getAuth } from 'firebase-admin/auth';

export async function POST(request: Request) {
  try {
    console.log('Received payment link creation request');
    
    const data = await request.json();
    const { token } = data;

    if (!token) {
      console.error('Missing token in payment request');
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify the Firebase ID token
    try {
      const decodedToken = await getAuth().verifyIdToken(token);
      const userId = decodedToken.uid;
      
      console.log('User authenticated successfully:', userId);

      // Create a payment link using Square
      const paymentLink = await createPaymentLink(userId);
      console.log('Payment link created:', paymentLink.substring(0, 50) + '...');

      return NextResponse.json({ paymentLink });
    } catch (authError) {
      console.error('Authentication error:', authError);
      return NextResponse.json(
        { error: 'Authentication failed' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Error creating payment link:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    console.log('Received payment verification request');
    
    const data = await request.json();
    const { token, orderId } = data;

    if (!token || !orderId) {
      console.error('Missing required fields in verification request:', { hasToken: !!token, hasOrderId: !!orderId });
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify the Firebase ID token
    try {
      const decodedToken = await getAuth().verifyIdToken(token);
      const userId = decodedToken.uid;
      
      console.log('User authenticated for verification:', userId);
      console.log('Verifying order ID:', orderId);

      // Verify the payment with Square
      const isVerified = await verifyPayment(orderId);
      
      console.log('Payment verification result:', isVerified);

      if (isVerified) {
        // Update user's account status to Premium
        await updateUserProfile(userId, {
          accountStatus: 'Premium'
        });
        
        console.log('User account upgraded to Premium:', userId);

        return NextResponse.json({ success: true });
      } else {
        console.error('Payment verification failed for orderId:', orderId);
        return NextResponse.json(
          { error: 'Payment verification failed' },
          { status: 400 }
        );
      }
    } catch (authError) {
      console.error('Authentication error during verification:', authError);
      return NextResponse.json(
        { error: 'Authentication failed' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 