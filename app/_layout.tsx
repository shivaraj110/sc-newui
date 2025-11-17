import { Stack } from "expo-router";
import { useRef, useEffect } from "react";
import { AlertProvider, Alert, AlertProviderRef } from "./components/AlertProvider";
import "../global.css";

export default function RootLayout() {
  const alertRef = useRef<AlertProviderRef>(null);

  useEffect(() => {
    Alert.setProviderRef(alertRef);
  }, []);

  return (
    <>
      <Stack screenOptions={{ headerShown: false }} />
      <AlertProvider ref={alertRef} />
    </>
  );
}
