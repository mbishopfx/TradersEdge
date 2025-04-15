#!/bin/bash

# Script to deploy Firebase Firestore indexes
echo "Deploying Firestore indexes..."

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "Firebase CLI not found. Installing globally..."
    npm install -g firebase-tools
fi

# Deploy Firestore indexes only
firebase deploy --only firestore:indexes

echo "Firestore indexes deployment completed!" 