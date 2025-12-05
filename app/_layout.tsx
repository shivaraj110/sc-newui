import { Stack } from "expo-router";
import { useRef, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { ClerkProvider, ClerkLoaded } from '@clerk/clerk-expo';
import { AlertProvider, Alert, AlertProviderRef } from "./components/AlertProvider";
import * as SecureStore from 'expo-secure-store';
import "../global.css";

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  throw new Error(
    'Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env'
  );
}

const tokenCache = {
  async getToken(key: string) {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (err) {
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};

export default function RootLayout() {
  const alertRef = useRef<AlertProviderRef>(null);

  useEffect(() => {
    Alert.setProviderRef(alertRef);
  }, []);

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <ClerkLoaded>
        <StatusBar style="dark" backgroundColor="transparent" translucent />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="auth" />
          <Stack.Screen name="add-recipe" />
          <Stack.Screen name="inventory" />
          <Stack.Screen name="mealplan" />
          <Stack.Screen name="profile" />
          <Stack.Screen name="recipes" />
          <Stack.Screen name="scan" />
          <Stack.Screen name="shopping" />
          <Stack.Screen name="timer" />
        </Stack>
        <AlertProvider ref={alertRef} />
      </ClerkLoaded>
    </ClerkProvider>
  );
}
