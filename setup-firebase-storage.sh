#!/bin/bash

# Firebase Storage Setup Script
# This script sets up Firebase Storage and deploys security rules

echo "🔥 Setting up Firebase Storage..."

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI is not installed."
    echo "📦 Installing Firebase CLI..."
    npm install -g firebase-tools
fi

# Check if user is logged in
if ! firebase projects:list &> /dev/null; then
    echo "🔐 Please login to Firebase..."
    firebase login
fi

# Initialize Firebase if not already initialized
if [ ! -f ".firebaserc" ]; then
    echo "🚀 Initializing Firebase project..."
    firebase init storage
else
    echo "✅ Firebase project already initialized"
fi

# Deploy Storage rules
echo "📤 Deploying Storage security rules..."
firebase deploy --only storage

echo "✅ Firebase Storage setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Make sure Firebase Storage is enabled in Firebase Console"
echo "2. Test image upload in your application"
echo "3. Check Storage rules in Firebase Console → Storage → Rules"

