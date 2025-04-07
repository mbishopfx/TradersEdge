#!/usr/bin/env node

/**
 * ChartEye Authentication and Payment Flow Test
 * 
 * Tests the authentication and payment flow in the ChartEye application
 */

const puppeteer = require('puppeteer');

// Configuration
const APP_URL = 'http://localhost:3000';
const SCREENSHOT_DIR = __dirname;

// Run the test
(async () => {
  console.log('=== ChartEye Authentication and Payment Flow Test ====');
  
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
    
    // Manual authentication test instructions
    console.log('\n=== Manual Authentication Testing Instructions ===');
    console.log('1. Click on the "Sign In" button to authenticate with Google');
    console.log('2. Complete the Google authentication flow');
    console.log('3. Verify that you are successfully signed in (check user profile/icon)');
    console.log('4. After signing in, the page will navigate to the upgrade page');
    
    // Navigate to the upgrade page after authentication
    console.log('Navigating to upgrade page...');
    await page.goto(`${APP_URL}/upgrade`, { waitUntil: 'networkidle2' });
    
    // Take screenshot of the upgrade page
    await page.screenshot({ path: `${SCREENSHOT_DIR}/02-upgrade-page.png` });
    console.log('Screenshot taken: 02-upgrade-page.png');
    
    // Manual payment test instructions
    console.log('\n=== Manual Payment Testing Instructions ===');
    console.log('1. On the upgrade page, click "Upgrade Now - $20"');
    console.log('2. You should be redirected to Square payment page');
    console.log('3. Complete the Square payment flow');
    console.log('4. Verify that you are redirected back to the application');
    console.log('5. Verify that your account status is updated to Premium');
    console.log('6. Try accessing premium features to check access control');
    
    // Manual chart analysis test instructions
    console.log('\n=== Manual Chart Analysis Testing Instructions ===');
    console.log('1. Navigate to the analysis page');
    console.log('2. Upload a chart image for analysis');
    console.log('3. Verify that the analysis works and results are displayed');
    console.log('4. Verify that the analysis is saved and can be viewed later');
    
    console.log('\nThe browser will stay open for you to complete the manual testing.');
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