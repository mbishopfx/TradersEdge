#!/bin/bash

# Ensure the script stops on first error
set -e

# Use locally installed firebase-tools
FIREBASE="./node_modules/.bin/firebase"

# Check if user is logged in to Firebase
echo "Checking Firebase login status..."
$FIREBASE login:list &> /dev/null || $FIREBASE login

# Select project if needed
echo "Selecting Firebase project..."
$FIREBASE use

# Deploy Firestore Rules
echo "Deploying Firestore rules..."
$FIREBASE deploy --only firestore:rules

# Deploy Storage Rules
echo "Deploying Storage rules..."
$FIREBASE deploy --only storage

echo "Firebase rules deployment completed!"
echo "Please restart your development server to apply changes." 