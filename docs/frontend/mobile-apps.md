# 📱 Mobile Applications (React Native)

This document covers the React Native mobile applications for the Fixelo platform.

## 📋 Overview

Fixelo includes two mobile applications built with React Native and Expo:

1. **Fixelo App** (`apps/mobile-client/`) - Client application for service seekers
2. **Fixelo PRO** (`apps/mobile-provider/`) - Provider application for service professionals

**Status**: ✅ **Complete** - Both apps fully implemented and ready for production

## 🏗️ Architecture

### Project Structure

```
apps/
├── mobile-client/           # Client app
│   ├── App.tsx
│   ├── app.json
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── screens/         # Screen components
│   │   ├── navigation/      # Navigation setup
│   │   ├── services/        # API services
│   │   ├── store/           # State management
│   │   ├── utils/           # Utility functions
│   │   └── types/           # TypeScript types
│   └── assets/              # Images, fonts, etc.
└── mobile-provider/         # Provider app
    ├── App.tsx
    ├── app.json
    ├── src/
    │   ├── components/
    │   ├── screens/
    │   ├── navigation/
    │   ├── services/
    │   ├── store/
    │   ├── utils/
    │   └── types/
    └── assets/
```

### Technology Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Navigation**: React Navigation v6
- **State Management**: Zustand
- **UI Components**: NativeBase
- **Forms**: React Hook Form
- **Maps**: React Native Maps
- **Payments**: Stripe React Native
- **Push Notifications**: Expo Notifications
- **Camera**: Expo Camera
- **Location**: Expo Location

## 📱 Fixelo App (Client)

### Features

1. **Authentication**
   - Email/password login
   - Social login (Google, Apple)
   - Registration
   - Password reset

2. **Service Discovery**
   - Browse service categories
   - Search services
   - Filter by location, price, rating
   - View service details

3. **Booking System**
   - Book services
   - Select date/time
   - Add service address
   - Payment processing

4. **User Profile**
   - Profile management
   - Booking history
   - Payment history
   - Settings

5. **Real-time Features**
   - Chat with providers
   - Push notifications
   - Booking updates

### Key Screens

```typescript
// src/screens/HomeScreen.tsx
import React from 'react';
import { View, ScrollView } from 'react-native';
import { SearchBar } from '../components/SearchBar';
import { CategoryGrid } from '../components/CategoryGrid';
import { FeaturedServices } from '../components/FeaturedServices';

export const HomeScreen: React.FC = () => {
  return (
    <ScrollView>
      <View className="p-4">
        <SearchBar />
        <CategoryGrid />
        <FeaturedServices />
      </View>
    </ScrollView>
  );
};
```

### Navigation Structure

```typescript
// src/navigation/AppNavigator.tsx
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => (
  <Tab.Navigator>
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Search" component={SearchScreen} />
    <Tab.Screen name="Bookings" component={BookingsScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

export const AppNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen name="Tabs" component={TabNavigator} />
      <Stack.Screen name="ServiceDetails" component={ServiceDetailsScreen} />
      <Stack.Screen name="Booking" component={BookingScreen} />
      <Stack.Screen name="Payment" component={PaymentScreen} />
      <Stack.Screen name="Chat" component={ChatScreen} />
    </Stack.Navigator>
  </NavigationContainer>
);
```

## 🔧 Fixelo PRO (Provider)

### Features

1. **Provider Dashboard**
   - Earnings overview
   - Booking statistics
   - Performance metrics

2. **Service Management**
   - Create/edit services
   - Manage pricing
   - Service availability

3. **Booking Management**
   - View incoming bookings
   - Accept/decline bookings
   - Update booking status

4. **Customer Communication**
   - Chat with clients
   - Send updates
   - Share location

5. **Analytics**
   - Revenue tracking
   - Customer ratings
   - Service performance

### Key Screens

```typescript
// src/screens/DashboardScreen.tsx
import React from 'react';
import { View, ScrollView } from 'react-native';
import { EarningsCard } from '../components/EarningsCard';
import { BookingsList } from '../components/BookingsList';
import { QuickActions } from '../components/QuickActions';

export const DashboardScreen: React.FC = () => {
  return (
    <ScrollView>
      <View className="p-4">
        <EarningsCard />
        <QuickActions />
        <BookingsList />
      </View>
    </ScrollView>
  );
};
```

## 🎨 UI Components

### Shared Components

```typescript
// src/components/ui/Button.tsx
import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  loading?: boolean;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false
}) => {
  const baseStyle = 'px-6 py-3 rounded-lg items-center justify-center';
  const variantStyles = {
    primary: 'bg-blue-600',
    secondary: 'bg-gray-200',
    outline: 'border border-gray-300'
  };

  return (
    <TouchableOpacity
      className={`${baseStyle} ${variantStyles[variant]}`}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color="white" />
      ) : (
        <Text className="text-white font-semibold">{title}</Text>
      )}
    </TouchableOpacity>
  );
};
```

### Service Card Component

```typescript
// src/components/ServiceCard.tsx
import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Star, MapPin } from 'lucide-react-native';

interface ServiceCardProps {
  service: Service;
  onPress: () => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, onPress }) => {
  return (
    <TouchableOpacity
      className="bg-white rounded-lg shadow-md p-4 mb-4"
      onPress={onPress}
    >
      <Image
        source={{ uri: service.image }}
        className="w-full h-32 rounded-lg mb-3"
        resizeMode="cover"
      />
      
      <Text className="text-lg font-semibold mb-2">{service.title}</Text>
      
      <View className="flex-row items-center mb-2">
        <Star size={16} color="#fbbf24" />
        <Text className="ml-1 text-gray-600">{service.rating}</Text>
        <Text className="ml-2 text-gray-500">({service.reviewCount} reviews)</Text>
      </View>
      
      <View className="flex-row items-center mb-2">
        <MapPin size={16} color="#6b7280" />
        <Text className="ml-1 text-gray-600">{service.location}</Text>
      </View>
      
      <Text className="text-xl font-bold text-blue-600">
        ${service.price}
      </Text>
    </TouchableOpacity>
  );
};
```

## 💳 Payment Integration

### Stripe Implementation

```typescript
// src/services/PaymentService.ts
import { StripeProvider, useStripe } from '@stripe/stripe-react-native';

export const PaymentService = () => {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const processPayment = async (bookingId: string, amount: number) => {
    try {
      // Create payment intent
      const response = await fetch('/api/payments/intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId, amount })
      });
      
      const { clientSecret } = await response.json();

      // Initialize payment sheet
      const { error } = await initPaymentSheet({
        merchantDisplayName: 'Fixelo',
        paymentIntentClientSecret: clientSecret,
        defaultBillingDetails: {
          name: 'Customer Name'
        }
      });

      if (error) throw error;

      // Present payment sheet
      const { error: paymentError } = await presentPaymentSheet();
      
      if (paymentError) throw paymentError;

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  return { processPayment };
};
```

## 📍 Location Services

### Location Integration

```typescript
// src/services/LocationService.ts
import * as Location from 'expo-location';

export class LocationService {
  static async getCurrentLocation() {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        throw new Error('Location permission denied');
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High
      });

      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      };
    } catch (error) {
      console.error('Location error:', error);
      throw error;
    }
  }

  static async reverseGeocode(latitude: number, longitude: number) {
    try {
      const result = await Location.reverseGeocodeAsync({
        latitude,
        longitude
      });

      return result[0];
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      throw error;
    }
  }
}
```

## 📷 Camera Integration

### Camera Component

```typescript
// src/components/CameraComponent.tsx
import React, { useState, useRef } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { Camera } from 'expo-camera';

interface CameraComponentProps {
  onPhotoTaken: (uri: string) => void;
  onClose: () => void;
}

export const CameraComponent: React.FC<CameraComponentProps> = ({
  onPhotoTaken,
  onClose
}) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const cameraRef = useRef<Camera>(null);

  React.useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      onPhotoTaken(photo.uri);
    }
  };

  if (hasPermission === null) {
    return <View />;
  }

  if (hasPermission === false) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>No access to camera</Text>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <Camera
        ref={cameraRef}
        style={{ flex: 1 }}
        type={Camera.Constants.Type.back}
      />
      
      <View className="absolute bottom-0 left-0 right-0 p-4">
        <View className="flex-row justify-between">
          <TouchableOpacity
            className="bg-gray-600 px-4 py-2 rounded-lg"
            onPress={onClose}
          >
            <Text className="text-white">Cancel</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            className="bg-blue-600 px-4 py-2 rounded-lg"
            onPress={takePicture}
          >
            <Text className="text-white">Take Photo</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
```

## 🔔 Push Notifications

### Notification Service

```typescript
// src/services/NotificationService.ts
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export class NotificationService {
  static async registerForPushNotifications() {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        throw new Error('Push notification permission denied');
      }

      const token = (await Notifications.getExpoPushTokenAsync()).data;
      
      if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C'
        });
      }

      return token;
    } catch (error) {
      console.error('Push notification registration error:', error);
      throw error;
    }
  }

  static async sendLocalNotification(title: string, body: string) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data: { screen: 'BookingDetails' }
      },
      trigger: null
    });
  }
}
```

## 🗺️ Maps Integration

### Map Component

```typescript
// src/components/MapComponent.tsx
import React from 'react';
import MapView, { Marker } from 'react-native-maps';
import { View } from 'react-native';

interface MapComponentProps {
  services: Service[];
  userLocation?: { latitude: number; longitude: number };
  onServicePress: (service: Service) => void;
}

export const MapComponent: React.FC<MapComponentProps> = ({
  services,
  userLocation,
  onServicePress
}) => {
  const initialRegion = userLocation || {
    latitude: 25.7617,
    longitude: -80.1918,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421
  };

  return (
    <View className="flex-1">
      <MapView
        style={{ flex: 1 }}
        initialRegion={initialRegion}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {services.map(service => (
          <Marker
            key={service.id}
            coordinate={{
              latitude: service.location.lat,
              longitude: service.location.lng
            }}
            title={service.title}
            description={`$${service.price}`}
            onPress={() => onServicePress(service)}
          />
        ))}
      </MapView>
    </View>
  );
};
```

## 💬 Chat Integration

### Chat Screen

```typescript
// src/screens/ChatScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, FlatList, TextInput, TouchableOpacity, Text } from 'react-native';
import { useSocket } from '../hooks/useSocket';

interface ChatScreenProps {
  bookingId: string;
}

export const ChatScreen: React.FC<ChatScreenProps> = ({ bookingId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const socket = useSocket();

  useEffect(() => {
    if (socket) {
      socket.emit('join-conversation', { bookingId });
      
      socket.on('message-received', (message) => {
        setMessages(prev => [...prev, message]);
      });
    }
  }, [socket, bookingId]);

  const sendMessage = () => {
    if (socket && newMessage.trim()) {
      socket.emit('send-message', {
        bookingId,
        message: newMessage
      });
      setNewMessage('');
    }
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View className={`mb-2 ${item.isOwn ? 'items-end' : 'items-start'}`}>
      <View className={`max-w-xs p-3 rounded-lg ${
        item.isOwn ? 'bg-blue-600' : 'bg-gray-200'
      }`}>
        <Text className={item.isOwn ? 'text-white' : 'text-gray-800'}>
          {item.content}
        </Text>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-white">
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        className="flex-1 p-4"
      />
      
      <View className="flex-row items-center p-4 border-t border-gray-200">
        <TextInput
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 mr-2"
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message..."
          multiline
        />
        <TouchableOpacity
          className="bg-blue-600 px-4 py-2 rounded-lg"
          onPress={sendMessage}
        >
          <Text className="text-white font-semibold">Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
```

## 📊 State Management

### Zustand Store

```typescript
// src/store/useAppStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AppState {
  user: User | null;
  services: Service[];
  bookings: Booking[];
  location: Location | null;
  
  // Actions
  setUser: (user: User | null) => void;
  setServices: (services: Service[]) => void;
  addBooking: (booking: Booking) => void;
  setLocation: (location: Location) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      services: [],
      bookings: [],
      location: null,
      
      setUser: (user) => set({ user }),
      setServices: (services) => set({ services }),
      addBooking: (booking) => set((state) => ({
        bookings: [...state.bookings, booking]
      })),
      setLocation: (location) => set({ location })
    }),
    {
      name: 'fixelo-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        bookings: state.bookings,
        location: state.location
      })
    }
  )
);
```

## 🧪 Testing

### Component Testing

```typescript
// __tests__/components/Button.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from '../../src/components/ui/Button';

describe('Button', () => {
  it('renders correctly', () => {
    const { getByText } = render(
      <Button title="Test Button" onPress={() => {}} />
    );
    
    expect(getByText('Test Button')).toBeTruthy();
  });

  it('handles press events', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <Button title="Test Button" onPress={onPress} />
    );
    
    fireEvent.press(getByText('Test Button'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('shows loading state', () => {
    const { getByTestId } = render(
      <Button title="Test Button" onPress={() => {}} loading />
    );
    
    expect(getByTestId('loading-indicator')).toBeTruthy();
  });
});
```

## 🚀 Build & Deployment

### App Configuration

```json
// app.json (Client App)
{
  "expo": {
    "name": "Fixelo",
    "slug": "fixelo-client",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.fixelo.client"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#FFFFFF"
      },
      "package": "com.fixelo.client"
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "plugins": [
      "expo-location",
      "expo-camera",
      "expo-notifications"
    ]
  }
}
```

### Build Commands

```bash
# Development
npx expo start

# iOS Simulator
npx expo run:ios

# Android Emulator
npx expo run:android

# Production Builds
eas build --platform all

# App Store Submission
eas submit --platform all
```

## 🔧 Development Setup

### Environment Variables

```env
# .env
EXPO_PUBLIC_API_URL=http://localhost:3001
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=your-maps-api-key
```

### Development Scripts

```json
{
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web",
    "build": "eas build",
    "submit": "eas submit",
    "test": "jest",
    "lint": "eslint ."
  }
}
```

## 📱 Platform-Specific Features

### iOS Specific

```typescript
// src/utils/platform.ts
import { Platform } from 'react-native';

export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';

// iOS specific styling
export const iosStyles = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.25,
  shadowRadius: 3.84
};

// Android specific styling
export const androidStyles = {
  elevation: 5
};
```

### Android Specific

```typescript
// src/components/ui/Card.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { isIOS, iosStyles, androidStyles } from '../../utils/platform';

export const Card: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <View style={[styles.card, isIOS ? iosStyles : androidStyles]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    margin: 8
  }
});
```

---

Both mobile applications provide comprehensive functionality for their respective user types, with native performance, offline capabilities, and seamless integration with the Fixelo platform's backend services. The apps are ready for production deployment to both iOS App Store and Google Play Store.

For API integration details, refer to the backend documentation in `/docs/modules/`. 