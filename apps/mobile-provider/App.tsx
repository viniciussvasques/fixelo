import React from 'react';
import { StyleSheet, Text, View, StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <View style={styles.container}>
        <Text style={styles.title}>Fixelo Pro</Text>
        <Text style={styles.subtitle}>Grow Your Service Business</Text>
        <Text style={styles.description}>
          Manage bookings, connect with clients, and grow your business in Florida
        </Text>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0ea5e9',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    lineHeight: 24,
  },
}); 