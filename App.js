import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Navigation from "./Navigation";
import * as SplashScreen from "expo-splash-screen";
import NetInfo from "@react-native-community/netinfo";

import {
  useFonts,
  Inter_600SemiBold,
  Inter_300Light,
  Inter_400Regular,
  Inter_500Medium,
  Inter_800ExtraBold,
} from "@expo-google-fonts/inter";

SplashScreen.preventAutoHideAsync();

export default function App() {
  let [fontsLoaded] = useFonts({
    Inter_600SemiBold,
    Inter_300Light,
    Inter_400Regular,
    Inter_500Medium,
    Inter_800ExtraBold,
  });

  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    // Hide splash screen after 2 seconds
    setTimeout(() => {
      SplashScreen.hideAsync();
    }, 2000);

    // Unsubscribe when the component unmounts
    return () => {
      unsubscribe();
    };
  }, []);

  if (!fontsLoaded) {
    return; // Render nothing until fonts are loaded
  }
  return <Navigation />;
}
