# ChartEye Deployment on SiteGround

This document provides instructions for deploying and maintaining the ChartEye application on SiteGround hosting.

## Prerequisites

- A SiteGround hosting account with Node.js support
- Domain name configured with SiteGround DNS
- SSH access to your SiteGround account
- Git installed on your local machine

## Deploying the Application

### 1. Set Up the Node.js App

1. Log in to your SiteGround account and go to Site Tools
2. Navigate to **Devs > Node.js**
3. Click **Create Node.js Application**
4. Fill in the following information:
   - **App Path**: `/charteye` (or your preferred path)
   - **Node.js Version**: Select the latest LTS version (14.x or higher)
   - **Application Entry Point**: `server.js` (we'll create this file)
   - **Application Domain**: Select your domain
5. Click **Create**

### 2. Upload the Application

#### Option 1: Using Git

1. SSH into your SiteGround account:
   ```
   ssh username@yoursite.com
   ```

2. Navigate to your app directory:
   ```
   cd ~/www/yoursite.com/public_html/charteye
   ```

3. Clone the repository:
   ```
   git clone https://github.com/yourusername/charteye.git .
   ```

4. Install dependencies:
   ```
   npm install --production
   ```

#### Option 2: Using SiteGround File Manager

1. Log in to your SiteGround account and go to Site Tools
2. Navigate to **Site > File Manager**
3. Go to your application directory
4. Upload a ZIP file of your application
5. Extract the ZIP file
6. SSH into your SiteGround account to run `npm install --production`

### 3. Create a Production Server File

Create a `server.js` file in the root directory:

```javascript
const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()
const port = process.env.PORT || 3000

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true)
    handle(req, res, parsedUrl)
  }).listen(port, (err) => {
    if (err) throw err
    console.log(`> Ready on port ${port}`)
  })
})
```

### 4. Configure Environment Variables

1. Create a `.env` file in the root directory:
   ```
   OPENAI_API_KEY=your_api_key
   NEWS_DATA_DIR=/home/username/www/yoursite.com/public_html/charteye/news-data
   ```

2. Make sure the `.env` file is included in your `.gitignore` if using Git

## Setting Up the News Scraper

### 1. Create News Data Directory

SSH into your SiteGround account and create the directory:

```
mkdir -p ~/www/yoursite.com/public_html/charteye/news-data
chmod 755 ~/www/yoursite.com/public_html/charteye/news-data
```

### 2. Install Python Dependencies

```
cd ~/www/yoursite.com/public_html/charteye
python3 -m venv venv
source venv/bin/activate
pip install requests beautifulsoup4 schedule
```

### 3. Set Up a Cron Job for the News Scraper

1. Create a shell script `run_scraper.sh`:
   ```bash
   #!/bin/bash
   cd ~/www/yoursite.com/public_html/charteye
   source venv/bin/activate
   python3 NewsScrape.py
   ```

2. Make the script executable:
   ```
   chmod +x ~/www/yoursite.com/public_html/charteye/run_scraper.sh
   ```

3. Add a cron job via SiteGround Site Tools:
   - Go to **Devs > Cron Jobs**
   - Create a new cron job that runs every 15 minutes:
     ```
     */15 * * * * ~/www/yoursite.com/public_html/charteye/run_scraper.sh
     ```

## Maintaining the Application

### Updating the Application

1. SSH into your SiteGround account
2. Navigate to your app directory
3. If using Git:
   ```
   git pull origin main
   npm install --production
   ```
4. Otherwise, upload the new files using File Manager

### Restarting the Node.js Application

1. Log in to your SiteGround account and go to Site Tools
2. Navigate to **Devs > Node.js**
3. Find your application in the list
4. Click the **Restart** button

### Monitoring Logs

1. SSH into your SiteGround account
2. Navigate to your app logs:
   ```
   cd ~/www/yoursite.com/public_html/charteye/logs
   ```
3. View the logs:
   ```
   tail -f node_app.log
   ```

## Troubleshooting

### News Scraper Issues

1. Check if the scraper is running:
   ```
   cd ~/www/yoursite.com/public_html/charteye/news-data
   ls -la
   ```

2. Check scraper logs:
   ```
   cat ~/www/yoursite.com/public_html/charteye/scraper_error.log
   ```

3. Run the scraper manually:
   ```
   cd ~/www/yoursite.com/public_html/charteye
   source venv/bin/activate
   python3 NewsScrape.py
   ```

### Node.js Application Issues

1. Check Node.js application logs in SiteGround Site Tools:
   - Navigate to **Devs > Node.js**
   - Click on your application
   - Click **Logs**

2. Ensure environment variables are properly set:
   - Check if `.env` file exists
   - Verify the content of `.env` file

3. Restart the Node.js application

## Support

If you encounter issues deploying or maintaining the application, please contact:

- Application developer: [Your Contact Information]
- SiteGround support: https://www.siteground.com/support

## License

This application is proprietary and confidential. Unauthorized copying or distribution is prohibited. 