import React from 'react';
import { StyleSheet, Text, View, StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <View style={styles.container}>
        <Text style={styles.title}>Fixelo Client</Text>
        <Text style={styles.subtitle}>Your Service Marketplace</Text>
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
  },
}); 