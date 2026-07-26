import { Tabs, useRouter } from "expo-router";
import React from "react";
import { View, StyleSheet, Platform } from "react-native";
import Feather from "react-native-vector-icons/Feather";

// Komponen untuk ikon tengah yang menonjol
const CameraTabIcon = ({ color, focused }) => (
  <View style={styles.cameraButtonContainer}>
    <View
      style={[
        styles.cameraButton,
        { backgroundColor: focused ? "#4338CA" : "#7C3AED" }, // Indigo-700 kalau aktif, Violet-600 kalau tidak
      ]}
    >
      <Feather name="camera" size={28} color="white" />
    </View>
  </View>
);

export default function TabsLayout() {
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#4338CA", // Samain warna aktifnya sama tombol biar konsisten
        tabBarInactiveTintColor: "#94a3b8",
        // TAB BAR STYLE UPDATE
        tabBarStyle: {
          backgroundColor: "#ffffff",
          height: 70, // Sedikit ditinggiin biar tombol ngga terlalu mentok
          paddingBottom: 10,
          paddingTop: 10,
          borderTopWidth: 0, // Hilangin border atas biar clean
          // Shadow buat iOS
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -5 },
          shadowOpacity: 0.05,
          shadowRadius: 10,
          // Elevation buat Android
          elevation: 10,
        },
        tabBarLabelStyle: {
          fontFamily: "Poppins_400Regular",
          fontSize: 11,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Feather name="home" size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="activity"
        options={{
          title: "Activity",
          tabBarIcon: ({ color }) => (
            <Feather name="activity" size={24} color={color} />
          ),
        }}
      />

      {/* 4. TAB CAMERA — DIBUAT MENONJOL DI TENGAH */}
      <Tabs.Screen
        name="camera"
        options={{
          title: "", // Label dikosongin biar ikonnya full di tengah
          tabBarIcon: (props) => <CameraTabIcon {...props} />,
        }}
      />

      {/* 3. TAB ADD — dibajak: buka modal /add, bukan pindah tab */}
      <Tabs.Screen
        name="add"
        options={{
          title: "Add",
          tabBarIcon: ({ color }) => (
            <Feather name="plus" size={26} color={color} />
          ),
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            router.push("/add");
          },
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <Feather name="user" size={26} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  cameraButtonContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: 70, // Lebar area tombol
    height: 70, // Tinggi area tombol
    // Trick: Supaya bisa nongol ke atas tab bar
    ...Platform.select({
      ios: {
        marginTop: -20, // Geser ke atas di iOS
      },
      android: {
        marginTop: -10, // Geser ke atas di Android (perlu penyesuaian dikit biasanya)
      },
    }),
  },
  cameraButton: {
    width: 60, // Ukuran fisik tombol buletnya
    height: 60,
    borderRadius: 30, // Bunder sempurna
    alignItems: "center",
    justifyContent: "center",
    // Shadow buat tombolnya biar keliatan timbul
    shadowColor: "#7C3AED",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8, // Android shadow
  },
});
