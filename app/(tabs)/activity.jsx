import React, { useState, useMemo } from "react";
import { Text, View, TouchableOpacity, ScrollView, StatusBar } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Feather from "react-native-vector-icons/Feather";

// Daftar bulan lengkap, dipakai untuk navigasi chip bulan
const ALL_MONTHS = [
  "January", "February", "March", "April", "Mey", "June",
  "July", "August", "September", "October", "November", "December",
];

// Ringkasan Income/Expense per tab (Year/Month) - data simulasi
const SUMMARY_DATA = {
  Year: { income: 24000000, incomeCount: 2, expense: -940000, expenseCount: 12 },
  Month: { income: 2500000, incomeCount: 1, expense: -300000, expenseCount: 4 },
};

// Simulasi transaksi, dikelompokkan per bulan lalu per hari
const ACTIVITY_DATA = {
  Mey: [
    {
      id: "today",
      label: "Today,  Mey 16",
      items: [
        { id: "t1", title: "Tips For Waiter", amount: -2 },
        { id: "t2", title: "Shopping Mall", amount: -200 },
        { id: "t3", title: "Gift From Brother", amount: 300 },
        { id: "t4", title: "Shopping Manna", amount: -100 },
        { id: "t5", title: "Salary", amount: 2200 },
      ],
    },
    {
      id: "yesterday",
      label: "Yesterday,  Mey 15",
      items: [
        { id: "y1", title: "Shopping Mall", amount: -200 },
        { id: "y2", title: "Shopping Manna", amount: -100 },
      ],
    },
  ],
};

// Format angka dengan tanda +/- dan pemisah ribuan gaya Indonesia
const formatAmount = (value) => {
  const sign = value < 0 ? "-" : "+";
  return `${sign}${Math.abs(value).toLocaleString("id-ID")}`;
};

export default function ActivityScreen() {
  const [activeTab, setActiveTab] = useState("Year"); // "Year" | "Month"
  const [selectedMonth, setSelectedMonth] = useState("Mey");
  // Window index untuk menampilkan 3 chip bulan sekaligus (sesuai desain: April, Mey, June)
  const [windowStart, setWindowStart] = useState(3);

  const visibleMonths = ALL_MONTHS.slice(windowStart, windowStart + 3);
  const summary = SUMMARY_DATA[activeTab];
  const groups = ACTIVITY_DATA[selectedMonth] || [];

  const handlePrevWindow = () => setWindowStart((prev) => Math.max(0, prev - 1));
  const handleNextWindow = () =>
    setWindowStart((prev) => Math.min(ALL_MONTHS.length - 3, prev + 1));

  const handleSelectMonth = (month) => setSelectedMonth(month);

  const dots = useMemo(() => [0, 1, 2], []);

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* HEADER GRADASI UNGU */}
      <LinearGradient
        colors={["#4f46e5", "#8b5cf6"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="pt-14 px-6 pb-10"
      >

        {/* TOGGLE YEAR / MONTH */}
        <View className="flex-row self-center p-1 mb-6 bg-white/20 rounded-full">
          <TouchableOpacity
            onPress={() => setActiveTab("Year")}
            className={`px-6 py-2 rounded-full ${activeTab === "Year" ? "bg-white" : ""}`}
          >
            <Text
              className={`text-sm font-poppins-semibold ${
                activeTab === "Year" ? "text-indigo-600" : "text-white/70"
              }`}
            >
              Year
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab("Month")}
            className={`px-6 py-2 rounded-full ${activeTab === "Month" ? "bg-white" : ""}`}
          >
            <Text
              className={`text-sm font-poppins-semibold ${
                activeTab === "Month" ? "text-indigo-600" : "text-white/70"
              }`}
            >
              Month
            </Text>
          </TouchableOpacity>
        </View>

        {/* CARD INCOME & EXPENSE */}
        <View className="flex-row gap-4">
          <View className="flex-1 p-4 bg-white shadow-sm rounded-2xl">
            <Text className="text-xs text-indigo-500 font-poppins-semibold">Income</Text>
            <Text className="mt-1 text-xl text-slate-800 font-poppins-semibold">
              {formatAmount(summary.income)}
            </Text>
            <Text className="mt-1 text-[10px] text-right text-slate-400 font-poppins-regular">
              {summary.incomeCount}T
            </Text>
          </View>
          <View className="flex-1 p-4 bg-white shadow-sm rounded-2xl">
            <Text className="text-xs text-indigo-500 font-poppins-semibold">Expense</Text>
            <Text className="mt-1 text-xl text-slate-800 font-poppins-semibold">
              {formatAmount(summary.expense)}
            </Text>
            <Text className="mt-1 text-[10px] text-right text-slate-400 font-poppins-regular">
              {summary.expenseCount}T
            </Text>
          </View>
        </View>

        {/* DOT INDICATOR */}
        <View className="flex-row justify-center gap-4 mt-2">
          <View className="flex-row justify-center flex-1 gap-1">
            {dots.map((d) => (
              <View key={`income-dot-${d}`} className="w-1 h-1 rounded-full bg-white/50" />
            ))}
          </View>
          <View className="flex-row justify-center flex-1 gap-1">
            {dots.map((d) => (
              <View key={`expense-dot-${d}`} className="w-1 h-1 rounded-full bg-white/50" />
            ))}
          </View>
        </View>

        {/* NAVIGASI BULAN */}
        <View className="flex-row items-center justify-between mt-6">
          <TouchableOpacity
            onPress={handlePrevWindow}
            className="items-center justify-center bg-white rounded-full w-9 h-9"
          >
            <Feather name="chevrons-left" size={18} color="#4f46e5" />
          </TouchableOpacity>

          <View className="flex-row flex-1 justify-evenly">
            {visibleMonths.map((month) => {
              const isSelected = month === selectedMonth;
              return (
                <TouchableOpacity
                  key={month}
                  onPress={() => handleSelectMonth(month)}
                  className={`px-4 py-2 mx-1 rounded-full ${
                    isSelected ? "bg-white" : "border border-white/50"
                  }`}
                >
                  <Text
                    className={`text-xs font-poppins-medium ${
                      isSelected ? "text-indigo-600" : "text-white"
                    }`}
                  >
                    {month}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <TouchableOpacity
            onPress={handleNextWindow}
            className="items-center justify-center bg-white rounded-full w-9 h-9"
          >
            <Feather name="chevrons-right" size={18} color="#4f46e5" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* DAFTAR AKTIVITAS */}
      <View className="flex-1 px-6 pt-6 bg-white -mt-6 rounded-t-[25px]">
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
          {groups.length === 0 ? (
            <View className="items-center justify-center mt-16">
              <Text className="text-sm text-slate-400 font-poppins-regular">
                Belum ada transaksi bulan ini
              </Text>
            </View>
          ) : (
            groups.map((group) => (
              <View key={group.id} className="mb-6">
                <Text className="mb-2 text-xs text-slate-500 font-poppins-semibold">
                  {group.label}
                </Text>
                <View className="px-4 bg-slate-100 rounded-2xl">
                  {group.items.map((item, idx) => (
                    <View
                      key={item.id}
                      className={`flex-row items-center py-3 ${
                        idx !== group.items.length - 1 ? "border-b border-slate-200" : ""
                      }`}
                    >
                      <View className="w-9 h-9 mr-3 bg-slate-300 rounded-lg" />
                      <Text className="flex-1 text-sm text-indigo-500 font-poppins-medium">
                        {item.title}
                      </Text>
                      <Text className="text-sm text-indigo-500 font-poppins-semibold">
                        {formatAmount(item.amount)}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            ))
          )}
        </ScrollView>
      </View>
    </View>
  );
}