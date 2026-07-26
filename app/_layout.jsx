import React, { useEffect } from "react";
import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as SplashScreen from "expo-splash-screen";
import "./global.css";

// Import hooks pemuat font dan varian font yang kita inginkan
import { useFonts, Nunito_700Bold } from "@expo-google-fonts/nunito";
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
} from "@expo-google-fonts/poppins";

// Mencegah splash screen bawaan OS tertutup otomatis sebelum font selesai dimuat
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Nunito_700Bold,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
  });

  useEffect(() => {
    // Jika font sudah selesai dimuat atau terjadi error load, sembunyikan splash screen bawaan sistem
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // Jika font belum siap, biarkan aplikasi menahan layar kosong/splash bawaan sebentar
  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="add-transaction"
          options={{ presentation: "modal" }}
        />
      </Stack>
    </QueryClientProvider>
  );
}
