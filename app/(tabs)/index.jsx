import React from "react";
import {
  Text,
  View,
  FlatList,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

// Simulasi Data Transaksi di Gambar Kamu
const recentActivityData = [
  { id: "1", title: "Shopping", time: "Today, 12.30", amount: "Rp.23.000" },
  { id: "2", title: "Shopping", time: "Today, 12.30", amount: "Rp.23.000" },
  { id: "3", title: "Shopping", time: "Today, 12.30", amount: "Rp.23.000" },
  { id: "4", title: "Shopping", time: "Today, 12.30", amount: "Rp.23.000" },
  { id: "5", title: "Shopping", time: "Today, 12.30", amount: "Rp.23.000" },
];

export default function DashboardScreen() {
  return (
    <View className="flex-1 bg-white">
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      {/* 1. HEADER GRADASI UNGU (35% Tinggi Layar) */}
      <LinearGradient
        colors={["#4f46e5", "#8b5cf6"]} // Kombinasi Ungu-Indigo sesuai gambar
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="h-[35%] pt-14 px-6 justify-between pb-12"
      >
        {/* Teks Sapaan */}
        <Text className="text-base text-white font-poppins-regular">
          Selamat Malam, <Text className="font-poppins-semibold">Yanto</Text>
        </Text>

        {/* CARD SALDO PUTIH BESAR */}
        <View className="p-6 mt-2 bg-white shadow-lg rounded-3xl shadow-indigo-200">
          <Text className="text-xs tracking-wide text-slate-500 font-poppins-semibold">
            Saldo Anda
          </Text>
          <Text className="mt-1 text-3xl text-slate-800 font-poppins-semibold">
            Rp 150.000.000,00
          </Text>
        </View>

        {/* TOMBOL INCOME & EXPENSE */}
        <View className="flex-row mt-4 space-x-4">
          <TouchableOpacity className="items-center flex-1 py-3 bg-white shadow-sm rounded-xl">
            <Text className="text-sm text-indigo-600 font-poppins-semibold">
              Income
            </Text>
          </TouchableOpacity>
          <TouchableOpacity className="items-center flex-1 py-3 ml-4 bg-white shadow-sm rounded-xl">
            <Text className="text-sm text-indigo-600 font-poppins-semibold">
              Expanse
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* 2. RECENT ACTIVITY (CONTAINER PUTIH MELENGKUNG DI BAWAH) */}
      <View className="flex-1 bg-white -mt-6 rounded-t-[25px] px-6 pt-6">
        <Text className="mb-4 text-xs tracking-wide text-slate-500 font-poppins-semibold">
          Recent Activity
        </Text>

        <FlatList
          data={recentActivityData}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item }) => (
            <View className="flex-row items-center justify-between p-4 mb-3 border bg-slate-100 rounded-2xl border-slate-200/50">
              <View>
                <Text className="text-sm text-slate-700 font-poppins-semibold">
                  {item.title}
                </Text>
                <Text className="text-slate-400 text-[10px] font-poppins-regular mt-0.5">
                  {item.time}
                </Text>
              </View>
              <Text className="text-sm text-slate-700 font-poppins-semibold">
                {item.amount}
              </Text>
            </View>
          )}
        />
      </View>
    </View>
  );
}
