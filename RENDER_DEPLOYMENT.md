# Deploying ChartEye to Render

This guide outlines the steps to deploy ChartEye to Render using the provided `render.yaml` configuration file.

## Prerequisites

1. A Render account (https://render.com)
2. Your code repository connected to Render
3. Access to all required environment variables

## Deployment Steps

### 1. Using the Render Blueprint

The easiest deployment method is via Render Blueprints:

1. Push your code to a Git repository (GitHub, GitLab, etc.)
2. Log in to your Render account
3. Navigate to "Blueprints" in the dashboard
4. Click "New Blueprint Instance"
5. Connect your Git repository
6. Render will automatically detect the `render.yaml` file and create the specified services

### 2. Environment Variables

The following environment variables need to be set in your Render dashboard:

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`
- `OPENAI_API_KEY`
- `SQUARE_ACCESS_TOKEN`
- `SQUARE_LOCATION_ID`
- `NEXT_PUBLIC_APP_URL` (Set to your Render URL, e.g., `https://charteye.onrender.com`)

### 3. Persistent Disk

The web service uses a 1GB persistent disk mounted at `/data`. This is used to store:

- News data collected by the scraper
- Any other data that needs to persist between deployments

### 4. Cron Job

The news scraper runs every 6 hours via a cron job defined in the render.yaml file.

## Monitoring

- The web service includes a health check endpoint at `/api/health`
- Monitor service logs in the Render dashboard
- Set up alerts for service failures

## Troubleshooting

If you encounter issues with the deployment:

1. Check the service logs in the Render dashboard
2. Verify all environment variables are set correctly
3. Ensure the persistent disk is mounted and accessible
4. Confirm that the news scraper has the necessary permissions to execute

## Scaling

To scale your application on Render:

1. Navigate to your web service settings
2. Adjust the instance type based on your needs
3. For higher traffic, consider upgrading to a paid plan with more resources

## Support

For issues related to the Render deployment, contact Render support or check their documentation at https://render.com/docs. 