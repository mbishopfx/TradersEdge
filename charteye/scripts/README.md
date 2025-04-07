# ChartEye Testing Scripts

This directory contains scripts for testing various functionalities of the ChartEye application.

## 1. Upload Limit Simulation Test

This test simulates the free trial limit of 10 chart analyses and verifies the enforcement logic.

### Prerequisites

- Node.js installed
- npm packages: node-fetch, form-data

### Files

- `testUploadLimit.js` - The main Node.js script that performs the simulation
- `runLimitTest.sh` - Shell script to automatically set up and run the test
- `test-chart.png` - Sample chart image used for testing

### Running the Test

```bash
cd charteye/scripts
./runLimitTest.sh
```

### Test Output

The test performs the following steps:

1. Creates a mock user session for testing
2. Sets up a simulated test environment
3. Simulates 11 chart uploads (1 more than the free limit)
4. Verifies that the first 10 uploads succeed
5. Verifies that the 11th upload is rejected with 403 status
6. Generates a summary report

This test runs completely in memory and doesn't require actual API calls or Firebase configuration.

## 2. Payment Prompt UI Test

This test uses browser automation to verify the payment prompt UI when a user reaches the upload limit.

### Prerequisites

- Node.js installed
- npm package: puppeteer
- Running ChartEye application (npm run dev)
- Google account for signing in

### Files

- `testPaymentPrompt.js` - Browser automation script
- `runPaymentPromptTest.sh` - Shell script to set up and run the test

### Running the Test

```bash
# First, make sure your app is running
cd charteye
npm run dev

# In another terminal, run the UI test
cd charteye/scripts
./runPaymentPromptTest.sh
```

### Test Process

1. Opens a browser window and navigates to your app
2. Takes screenshots at each stage
3. Prompts you to manually:
   - Sign in with your Google account
   - Upload and analyze charts until you reach the limit
   - Verify the payment prompt appears
4. Captures a final screenshot of the payment prompt

This test requires manual interaction but provides visual verification of the user interface.

## Interpreting Results

Both tests use color-coded console output for better readability:

- 🟢 Green text indicates success
- 🔴 Red text indicates errors
- 🟡 Yellow text indicates warnings or important information
- 🔵 Blue text indicates regular process steps
- 🟣 Magenta text indicates section headers
- 🟠 Cyan text indicates status information

## Troubleshooting

If tests fail:

1. For the Upload Limit Simulation:
   - Check that required packages are installed
   - Verify the test image exists in the scripts directory

2. For the Payment Prompt UI Test:
   - Ensure the ChartEye application is running at the expected URL
   - Check that you have puppeteer installed
   - Make sure Firebase authentication is properly configured
   - Verify that you're able to sign in manually

## Customization

You can modify test parameters:

- In `testUploadLimit.js`:
  - `MAX_FREE_UPLOADS`: Number of free uploads allowed (default: 10)

- In `testPaymentPrompt.js`:
  - `APP_URL`: Application URL (update if running on a different port)
  - `SCREENSHOT_DIR`: Directory to save screenshots 