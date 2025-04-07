#!/usr/bin/env node

/**
 * ChartEye Payment Prompt UI Test Script
 * 
 * Simple script to open a browser for manual testing of the payment prompt UI
 */

const puppeteer = require('puppeteer');

// Configuration
const APP_URL = 'http://localhost:3003';
const SCREENSHOT_DIR = __dirname;

// Run the test
(async () => {
  console.log('=== ChartEye Payment Prompt UI Manual Test ====');
  
  let browser;
  
  try {
    console.log('Launching browser...');
    browser = await puppeteer.launch({
      headless: false,
      defaultViewport: { width: 1280, height: 800 },
      args: ['--start-maximized']
    });
    
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    
    // Navigate to application
    console.log(`Navigating to ${APP_URL}...`);
    await page.goto(APP_URL, { waitUntil: 'networkidle2' });
    
    // Take screenshot of the homepage
    await page.screenshot({ path: `${SCREENSHOT_DIR}/01-homepage.png` });
    console.log('Screenshot taken: 01-homepage.png');
    
    // Go directly to the analysis page
    console.log('Navigating to analysis page...');
    await page.goto(`${APP_URL}/analysis`, { waitUntil: 'networkidle2' });
    
    // Take screenshot of the analysis page
    await page.screenshot({ path: `${SCREENSHOT_DIR}/02-analysis.png` });
    console.log('Screenshot taken: 02-analysis.png');
    
    // Manual testing instructions
    console.log('\n=== Manual Testing Instructions ===');
    console.log('1. In the browser window, first sign in using the "Sign In" button');
    console.log('2. Upload a chart image and click "Analyze Chart"');
    console.log('3. Repeat step 2 until you reach the free trial limit (10 uploads)');
    console.log('4. Verify that the payment prompt appears after the 10th upload');
    console.log('5. Test the payment prompt functionality');
    console.log('6. When finished, close the browser window\n');
    
    console.log('The browser will stay open for you to complete the manual testing.');
    console.log('This terminal will wait until the browser is closed.');
    
    // The browser will stay open for manual testing
    // until the user closes it
    await new Promise(resolve => {
      browser.on('disconnected', resolve);
    });
    
    console.log('Browser closed. Test completed.');
    
  } catch (error) {
    console.error('Test failed:', error);
    if (browser) await browser.close();
  }
})(); 