# Google Authentication Troubleshooting Guide

## Changes Made to Fix Authentication

1. Updated Firebase configuration to use the correct storage bucket domain (`appspot.com` instead of `firebasestorage.app`)
2. Added proper error handling in AuthContext for auth-related errors
3. Exported and used googleProvider consistently across the app
4. Updated the Navigation component to show loading states during authentication
5. Fixed Firebase Admin initialization to properly use environment variables

## Additional Steps to Check

1. Make sure Google Authentication is enabled in your Firebase Console:
   - Go to https://console.firebase.google.com/project/charteye-5be44/authentication/providers
   - Ensure "Google" provider is enabled
   - If not, click on Google and enable it

2. Verify Authorized Domains in Firebase Console:
   - Go to Authentication > Sign-in methods > Google > Authorized domains
   - Ensure `localhost` is added to the list for local development
   - Add any other domains where your app will be hosted

3. Check Firebase Project Settings:
   - Verify that your Web App configuration is correct in Firebase Console
   - Project Settings > Your Apps > Web App (charteye)
   - Copy the configuration if needed and update .env.local

4. Test in Incognito/Private Window:
   - Sometimes browser cache/cookies can cause issues
   - Test in an incognito/private window

5. Check Console for Errors:
   - Open browser developer tools (F12)
   - Check the Console tab for any errors during sign-in
   - Look for CORS errors, Firebase initialization errors, etc.

6. Verify Web SDK Version:
   - Ensure you're using Firebase Web SDK version 9+ with proper imports
   - Check for any version mismatches in your dependencies

## Common Error Messages and Solutions

### "Firebase: Error (auth/unauthorized-domain)"
- Your domain is not authorized in Firebase Console
- Add your domain to Authentication > Sign-in methods > Authorized domains

### "Firebase: Error (auth/popup-closed-by-user)"
- User closed the authentication popup
- This is normal behavior if user cancels sign-in

### "Firebase: Error (auth/popup-blocked)"
- Browser blocked the popup
- Check popup blocker settings in browser
- Use signInWithRedirect instead of signInWithPopup for mobile devices

### "Firebase: Error (auth/network-request-failed)"
- Network connectivity issue
- Check internet connection
- Ensure Firebase services are not blocked by firewall/proxy

## Testing Authentication Flow

After making the changes:
1. Restart your development server
2. Clear browser cache and cookies
3. Test signing in with Google
4. Check if you're properly redirected after authentication
5. Verify that user information is displayed correctly in the UI 