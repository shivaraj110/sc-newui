import { Stack } from "expo-router";
import { useRef, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { AlertProvider, Alert, AlertProviderRef } from "./components/AlertProvider";
import "../global.css";

export default function RootLayout() {
  const alertRef = useRef<AlertProviderRef>(null);

  useEffect(() => {
    Alert.setProviderRef(alertRef);
  }, []);

  return (
    <>
      <StatusBar style="dark" backgroundColor="transparent" translucent />
      <Stack screenOptions={{ headerShown: false }} />
      <AlertProvider ref={alertRef} />
    </>
  );
}
