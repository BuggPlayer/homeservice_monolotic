#!/bin/bash

echo "🚀 Setting up Fixer Mobile App..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18 or higher."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18 or higher is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Check if React Native CLI is installed
if ! command -v react-native &> /dev/null; then
    echo "📦 Installing React Native CLI..."
    npm install -g @react-native-community/cli
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# iOS setup (macOS only)
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "🍎 Setting up iOS..."
    cd ios
    if command -v pod &> /dev/null; then
        pod install
    else
        echo "❌ CocoaPods is not installed. Please install CocoaPods for iOS development."
        echo "Run: sudo gem install cocoapods"
    fi
    cd ..
else
    echo "ℹ️  Skipping iOS setup (not on macOS)"
fi

# Android setup
echo "🤖 Setting up Android..."
if [ -d "android" ]; then
    cd android
    ./gradlew clean
    cd ..
else
    echo "❌ Android directory not found. Please run 'npx react-native init' first."
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file..."
    cat > .env << EOL
# API Configuration
API_BASE_URL=http://10.0.2.2:3000/api

# Firebase Configuration
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id

# Twilio Configuration
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number

# WhatsApp Business API
WHATSAPP_ACCESS_TOKEN=your_whatsapp_access_token
WHATSAPP_PHONE_NUMBER_ID=your_whatsapp_phone_number_id
EOL
    echo "✅ Created .env file. Please update it with your API keys."
else
    echo "✅ .env file already exists"
fi

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "Next steps:"
echo "1. Update .env file with your API keys"
echo "2. Start Metro bundler: npm start"
echo "3. Run on Android: npm run android"
echo "4. Run on iOS: npm run ios (macOS only)"
echo ""
echo "For more information, check the README.md file."
