#!/usr/bin/env node

/**
 * Test script for upgrading a user to Premium
 * Usage: node test-payment-upgrade.js <userId>
 */

const fetch = require('node-fetch');

async function testUpgrade() {
  // Get userId from command line args
  const userId = process.argv[2];
  
  if (!userId) {
    console.error('Usage: node test-payment-upgrade.js <userId>');
    process.exit(1);
  }
  
  console.log(`Testing upgrade for user: ${userId}`);
  
  try {
    // Make request to test endpoint
    const response = await fetch('http://localhost:3000/api/payment/test-upgrade', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: userId,
        testKey: 'test-upgrade-key-123'
      })
    });
    
    // Get response as text first for debugging
    const responseText = await response.text();
    
    try {
      // Try to parse as JSON
      const data = JSON.parse(responseText);
      
      if (response.ok) {
        console.log('✅ Upgrade successful!');
        console.log('Response:', data);
      } else {
        console.error('❌ Upgrade failed!');
        console.error('Error:', data.error);
      }
    } catch (parseError) {
      console.error('❌ Failed to parse response as JSON:');
      console.error(responseText);
    }
  } catch (error) {
    console.error('❌ Request failed:', error.message);
  }
}

testUpgrade().catch(console.error); 