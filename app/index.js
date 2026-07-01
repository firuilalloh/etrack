import React, { useEffect } from "react";
import { Text, View, StatusBar } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

export default function LaunchScreen() {
  const router = useRouter();

  // Efek otomatis: Menunggu 3 detik, lalu pindah ke halaman utama/home
  useEffect(() => {
    const timer = setTimeout(() => {
      // Nanti jika folder halaman home sudah siap, aktifkan baris di bawah ini:
      router.replace('/login');
    }, 3000); // 3000 milidetik = 3 detik

    return () => clearTimeout(timer);
  }, []);

  return (
    // Membuka container penuh di layar
    <View className="flex-1">
      {/* Membuat status bar atas (baterai/jam) menjadi transparan agar gradasi penuh */}
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      {/* Membuat background gradasi sesuai gambar (Biru Tua/Indigo ke Ungu Cerah) */}
      <LinearGradient
        colors={["#1d4ed8", "#c084fc"]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.75 }}
        className="flex-1 items-center justify-center"
      >
        {/* Teks E-TRACK Putih Tebal di Tengah Layar */}
        <Text className="text-white text-5xl tracking-widest text-center uppercase font-nunito-bold">
          E-TRACK
        </Text>
      </LinearGradient>
    </View>
  );
}
