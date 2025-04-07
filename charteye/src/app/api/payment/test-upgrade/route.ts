import { NextResponse } from 'next/server';
import { updateUserProfile } from '@/lib/services/firebase';

/**
 * Test endpoint to upgrade a user account to Premium without requiring payment
 * FOR TESTING PURPOSES ONLY
 */
export async function POST(request: Request) {
  try {
    console.log('Received test upgrade request');
    
    // Parse the request body
    const data = await request.json();
    const { userId, testKey } = data;

    // Validate request parameters
    if (!userId || !testKey) {
      console.error('Missing required fields for test upgrade:', { hasUserId: !!userId, hasTestKey: !!testKey });
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Very simple validation - only allow specific test key
    // In production, this would be much more secure
    const validTestKey = process.env.TEST_UPGRADE_KEY || 'test-upgrade-key-123';
    
    if (testKey !== validTestKey) {
      console.error('Invalid test key provided');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Update user's account status to Premium
    try {
      console.log('Updating user account to Premium:', userId);
      await updateUserProfile(userId, {
        accountStatus: 'Premium'
      });
      
      console.log('User account upgraded to Premium successfully:', userId);
      return NextResponse.json({ 
        success: true,
        message: 'User account upgraded to Premium successfully'
      });
    } catch (error) {
      console.error('Error updating user profile:', error);
      return NextResponse.json(
        { error: 'Failed to update user profile' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in test upgrade endpoint:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 