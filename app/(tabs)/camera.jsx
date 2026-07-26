import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  Alert,
  StatusBar,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useRouter, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

export default function ScanScreen() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isActive, setIsActive] = useState(true);
  let cameraRef = null;

  useFocusEffect(
    useCallback(() => {
      setIsActive(true);
      return () => {
        setIsActive(false);
      };
    }, []),
  );

  if (!permission) return <View />;

  if (!permission.granted) {
    return (
      <View className="items-center justify-center flex-1 px-6 bg-white">
        <Text className="mb-4 text-center text-slate-700 font-poppins-regular">
          Butuh izin kamera untuk memindai struk belanjaanmu.
        </Text>
        <Pressable
          onPress={requestPermission}
          className="px-6 py-3 bg-indigo-600 rounded-xl"
        >
          <Text className="text-white font-poppins-semibold">
            Beri Izin Kamera
          </Text>
        </Pressable>
      </View>
    );
  }

  // Fungsi ambil foto dari Kamera
  const handleTakePicture = async () => {
    if (!cameraRef) return;

    try {
      setIsProcessing(true);
      const photo = await cameraRef.takePictureAsync({ quality: 0.7 });
      processLocalScan(photo.uri);
    } catch (err) {
      console.error("Gagal ambil foto:", err);
      setIsProcessing(false);
      Alert.alert("Error", "Gagal mengambil foto struk.");
    }
  };

  // Fungsi ambil foto dari Galeri
  const handlePickFromGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images",
        allowsEditing: true,
        quality: 0.7,
      });

      if (!result.canceled && result.assets[0]) {
        setIsProcessing(true);
        processLocalScan(result.assets[0].uri);
      }
    } catch (err) {
      console.error("Gagal ambil dari galeri:", err);
      setIsProcessing(false);
      Alert.alert("Error", "Gagal memilih foto dari galeri.");
    }
  };

  // Simulasi/Proses Ekstraksi Lokal (Kamu bisa pasang package OCR lokal di sini jika mau,
  // atau arahkan user input cepat dengan nominal default/bantuan parser)
  const processLocalScan = (imageUri) => {
    // Simulasi jeda baca lokal sebentar agar terasa proses "scanning"-nya
    setTimeout(() => {
      setIsProcessing(false);
      setIsActive(false);

      // Karena OCR lokal murni di React Native sering butuh linking native yang kompleks,
      // kita arahkan ke halaman add dengan membawa gambar/status scan,
      // atau set nominal 0 supaya user tinggal ketik cepat melihat struk aslinya.
      router.replace({
        pathname: "/add",
        params: {
          type: "expense",
          amount: "", // Dikosongkan sebentar atau diisi estimasi agar aman dari salah baca OCR
          description: "Belanja (Scan Struk)",
        },
      });
    }, 1200);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "black" }}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />

      {isActive && (
        <CameraView style={{ flex: 1 }} ref={(ref) => (cameraRef = ref)}>
          <View
            style={{
              flex: 1,
              justifyContent: "space-between",
              padding: 24,
              paddingTop: 60,
            }}
          >
            {/* Header */}
            <View className="flex-row items-center justify-between">
              <Pressable
                onPress={() => {
                  setIsActive(false);
                  router.back();
                }}
                className="p-2 rounded-full bg-black/40"
              >
                <Ionicons name="arrow-back" size={24} color="white" />
              </Pressable>
              <Text className="text-base text-white font-poppins-semibold">
                Scan Struk
              </Text>
              <View style={{ width: 40 }} />
            </View>

            {/* Kotak Panduan */}
            <View className="self-center w-72 h-[450px] border-2 border-dashed border-white/50 rounded-3xl items-center justify-center">
              {isProcessing && (
                <View className="items-center p-5 bg-black/80 rounded-2xl">
                  <ActivityIndicator size="large" color="#8b5cf6" />
                  <Text className="mt-3 text-xs text-white font-poppins-regular">
                    Memproses struk...
                  </Text>
                </View>
              )}
            </View>

            {/* Tombol Galeri & Shutter */}
            <View className="flex-row items-center justify-around px-6 pb-8">
              <Pressable
                onPress={handlePickFromGallery}
                disabled={isProcessing}
                className="items-center justify-center border rounded-full w-14 h-14 bg-white/20 border-white/40"
              >
                <Ionicons name="image-outline" size={24} color="white" />
              </Pressable>

              <Pressable
                onPress={handleTakePicture}
                disabled={isProcessing}
                className="items-center justify-center w-20 h-20 border-4 border-white rounded-full bg-white/20"
              >
                <View className="w-16 h-16 bg-white rounded-full" />
              </Pressable>

              <View style={{ width: 56 }} />
            </View>
          </View>
        </CameraView>
      )}
    </View>
  );
}
