# ChartEye Deployment Guide

This guide will walk you through the process of deploying the ChartEye application to Vercel.

## Prerequisites

- Node.js 18+ and npm installed
- Vercel CLI installed (`npm install -g vercel`)
- Firebase project set up
- OpenAI API key
- Square account and API credentials

## Step 1: Environment Variables

1. Make sure your `.env.local` file is properly configured with all the necessary environment variables.
2. The file should include:
   - Firebase configuration
   - Firebase Admin SDK credentials
   - OpenAI API key
   - Square API credentials

## Step 2: Install Dependencies

```bash
npm install
```

## Step 3: Build the Application

```bash
npm run build
```

## Step 4: Deploy to Vercel

### Option 1: Using the Deployment Script

```bash
./deploy.sh
```

This script will:
1. Check if `.env.local` exists
2. Install dependencies
3. Build the application
4. Deploy to Vercel

### Option 2: Manual Deployment

1. Install Vercel CLI if you haven't already:
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy to Vercel:
   ```bash
   vercel --prod
   ```

## Step 5: Configure Environment Variables in Vercel

1. Go to the Vercel dashboard
2. Select your project
3. Go to Settings > Environment Variables
4. Add all the environment variables from your `.env.local` file

## Step 6: Set Up Custom Domain (Optional)

1. Go to the Vercel dashboard
2. Select your project
3. Go to Settings > Domains
4. Add your custom domain
5. Follow the instructions to configure DNS records

## Step 7: Verify Deployment

1. Visit your deployed application URL
2. Test the following functionality:
   - User authentication
   - Chart analysis
   - Indicator code generation
   - Payment processing
   - Social sharing

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check the build logs in Vercel dashboard
   - Ensure all dependencies are correctly installed
   - Verify that environment variables are properly set

2. **Authentication Issues**
   - Verify Firebase configuration
   - Check if Google Authentication is enabled in Firebase

3. **API Errors**
   - Check if API keys are correctly set in Vercel environment variables
   - Verify API rate limits and quotas

### Getting Help

If you encounter any issues during deployment, please:

1. Check the Vercel deployment logs
2. Review the Firebase console for any authentication or database issues
3. Contact support with specific error messages

## Security Considerations

- Never commit sensitive API keys or credentials to your repository
- Use environment variables for all sensitive information
- Regularly rotate API keys and credentials
- Monitor API usage to prevent abuse

## Maintenance

- Regularly update dependencies to patch security vulnerabilities
- Monitor application performance and error logs
- Back up your database regularly
- Keep your Firebase and other service configurations up to date 