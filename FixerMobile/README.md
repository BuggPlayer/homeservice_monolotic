# Fixer Mobile App

A React Native mobile application for the Fixer home services marketplace, built with TypeScript and Android-first approach.

## Features

### 🔐 Authentication
- Phone number based login/registration
- OTP verification
- Profile setup
- Secure token management

### 🏠 Service Discovery
- Service category grid
- Search functionality
- Location-based services
- Quick booking flow

### 📱 Core Mobile Features
- Clean, intuitive Material Design UI
- Real-time notifications
- Camera integration for service photos
- Location services
- WhatsApp Business API integration
- Direct calling with Twilio

### 👥 User Roles
- **Customers**: Request services, book appointments, rate providers
- **Service Providers**: Manage profile, submit quotes, track bookings
- **Admins**: Manage platform, moderate content

## Tech Stack

- **Framework**: React Native 0.81.4
- **Language**: TypeScript
- **State Management**: Redux Toolkit + Redux Persist
- **Navigation**: React Navigation 6
- **UI Library**: React Native Paper
- **HTTP Client**: Axios
- **Storage**: AsyncStorage
- **Maps**: React Native Maps
- **Camera**: React Native Image Picker
- **Notifications**: Firebase Cloud Messaging
- **Calls**: Twilio SDK
- **WhatsApp**: WhatsApp Business API

## Project Structure

```
src/
├── components/          # Reusable UI components
├── constants/           # App constants and configuration
├── navigation/          # Navigation configuration
├── screens/            # Screen components
│   ├── auth/           # Authentication screens
│   └── main/           # Main app screens
├── services/           # API services
├── store/              # Redux store and slices
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- React Native CLI
- Android Studio (for Android development)
- Xcode (for iOS development)
- Java Development Kit (JDK 11 or higher)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd FixerMobile
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **iOS Setup (macOS only)**
   ```bash
   cd ios
   pod install
   cd ..
   ```

4. **Android Setup**
   - Open Android Studio
   - Install Android SDK and build tools
   - Create an Android Virtual Device (AVD)

### Running the App

#### Android
```bash
# Start Metro bundler
npm start

# Run on Android (in another terminal)
npm run android
```

#### iOS
```bash
# Start Metro bundler
npm start

# Run on iOS (in another terminal)
npm run ios
```

### Development

#### Available Scripts
- `npm start` - Start Metro bundler
- `npm run android` - Run on Android
- `npm run ios` - Run on iOS
- `npm run build:android` - Build Android APK
- `npm run clean` - Clean build cache
- `npm run lint` - Run ESLint

#### Environment Configuration

Create a `.env` file in the root directory:

```env
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
```

## Key Features Implementation

### 1. Authentication Flow
- Phone number input with country code
- OTP verification
- Profile setup
- Secure token storage

### 2. Service Discovery
- Category-based service browsing
- Search with filters
- Location-based results
- Provider profiles

### 3. Service Request Creation
- Step-by-step form
- Photo upload
- Location selection
- Urgency selection

### 4. Provider Interaction
- Provider profiles with ratings
- Direct WhatsApp messaging
- One-tap calling
- Real-time tracking

### 5. Booking Management
- Booking status updates
- Push notifications
- Payment integration
- Review system

## Android-Specific Features

### Material Design
- Follows Material Design guidelines
- Consistent color scheme
- Proper spacing and typography
- Material icons

### Performance Optimizations
- Image optimization
- Lazy loading
- Memory management
- Smooth animations

### Device Integration
- Camera access
- Location services
- Push notifications
- Background tasks

## API Integration

The app integrates with the Fixer backend API:

- **Authentication**: Login, register, profile management
- **Services**: Service requests, providers, bookings
- **Communication**: WhatsApp, Twilio calls
- **Payments**: Stripe integration
- **Notifications**: Firebase Cloud Messaging

## State Management

Uses Redux Toolkit for state management:

- **Auth Slice**: User authentication and profile
- **Service Slice**: Service requests, providers, bookings
- **UI Slice**: Loading states, modals, toasts

## Navigation

React Navigation 6 with:

- **Stack Navigator**: Main navigation flow
- **Tab Navigator**: Bottom tab navigation
- **Drawer Navigator**: Side menu (future)

## Styling

- Consistent design system
- Responsive layouts
- Dark mode support (future)
- Accessibility features

## Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## Building for Production

### Android
```bash
# Generate signed APK
cd android
./gradlew assembleRelease

# Generate AAB for Play Store
./gradlew bundleRelease
```

### iOS
```bash
# Build for iOS
npx react-native run-ios --configuration Release
```

## Deployment

### Google Play Store
1. Generate signed APK/AAB
2. Upload to Google Play Console
3. Configure store listing
4. Submit for review

### Apple App Store
1. Archive in Xcode
2. Upload to App Store Connect
3. Configure app information
4. Submit for review

## Troubleshooting

### Common Issues

1. **Metro bundler issues**
   ```bash
   npm run clean
   npm start --reset-cache
   ```

2. **Android build issues**
   ```bash
   cd android
   ./gradlew clean
   cd ..
   npm run android
   ```

3. **iOS build issues**
   ```bash
   cd ios
   pod install
   cd ..
   npm run ios
   ```

### Debug Mode
- Enable remote debugging
- Use React Native Debugger
- Check console logs
- Use Flipper for advanced debugging

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## Roadmap

### Phase 1 (Current)
- ✅ Basic authentication
- ✅ Service discovery
- ✅ Core navigation

### Phase 2 (Next)
- Service request creation
- Provider profiles
- Booking management

### Phase 3 (Future)
- Real-time messaging
- Payment integration
- Advanced features