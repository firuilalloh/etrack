import React, { useState, useMemo, useCallback } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Feather from "react-native-vector-icons/Feather";
import { useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "../../config/supabase";

const ALL_MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// Mapping nama bulan angka ke string Supabase / Date formatting
const MONTH_MAP = {
  January: 0,
  February: 1,
  March: 2,
  April: 3,
  May: 4,
  June: 5,
  July: 6,
  August: 7,
  September: 8,
  October: 9,
  November: 10,
  December: 11,
};

// 1. Tentukan bulan sekarang (misal formatnya string sesuai ALL_MONTHS)
const currentMonthName = new Date().toLocaleString("en-US", { month: "long" });

// 2. Cari index bulan sekarang di dalam ALL_MONTHS supaya windowStart-nya pas
const currentMonthIndex = ALL_MONTHS.indexOf(currentMonthName);
// Kalau misal indexnya ketemu, kita geser windowStart supaya bulan ini keliatan (misal ditaruh di tengah atau awal window)
const initialWindowStart =
  currentMonthIndex !== -1 ? Math.max(0, currentMonthIndex - 1) : 3;

const formatAmount = (value) => {
  const sign = value < 0 ? "-" : "+";
  return `${sign}${Math.abs(value).toLocaleString("id-ID")}`;
};

export default function ActivityScreen() {
  const [activeTab, setActiveTab] = useState("Year"); // "Year" | "Month"

  const [selectedMonth, setSelectedMonth] = useState(
    ALL_MONTHS.includes(currentMonthName) ? currentMonthName : ALL_MONTHS[0],
  );

  const [windowStart, setWindowStart] = useState(initialWindowStart);

  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({
    Year: { income: 0, incomeCount: 0, expense: 0, expenseCount: 0 },
    Month: { income: 0, incomeCount: 0, expense: 0, expenseCount: 0 },
  });

  const visibleMonths = ALL_MONTHS.slice(windowStart, windowStart + 3);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const currentUserId = await AsyncStorage.getItem("user_id");

      if (!currentUserId) return;

      // Ambil seluruh transaksi user dari Supabase
      const { data, error } = await supabase
        .from("transactions")
        .select(
          `
          id,
          type,
          amount,
          description,
          date,
          categories (name)
        `,
        )
        .eq("user_id", currentUserId)
        .order("date", { ascending: false });

      if (error) throw error;

      const txs = data || [];
      setTransactions(txs);

      // Kalkulasi Summary & Pengelompokan Data
      let yearIncome = 0,
        yearIncomeCount = 0;
      let yearExpense = 0,
        yearExpenseCount = 0;
      let monthIncome = 0,
        monthIncomeCount = 0;
      let monthExpense = 0,
        monthExpenseCount = 0;

      const currentYear = new Date().getFullYear();
      const targetMonthIndex = MONTH_MAP[selectedMonth];

      txs.forEach((tx) => {
        const amt = Number.parseFloat(tx.amount) || 0;
        const txDate = new Date(tx.date);
        const txYear = txDate.getFullYear();
        const txMonthIndex = txDate.getMonth();

        // Hitung untuk Year (Tahun Berjalan)
        if (txYear === currentYear) {
          if (tx.type === "INCOME") {
            yearIncome += amt;
            yearIncomeCount += 1;
          } else {
            yearExpense += Math.abs(amt); // Simpan nilai positif untuk display, tandanya diatur format
            yearExpenseCount += 1;
          }

          // Hitung untuk Month yang sedang dipilih
          if (txMonthIndex === targetMonthIndex) {
            if (tx.type === "INCOME") {
              monthIncome += amt;
              monthIncomeCount += 1;
            } else {
              monthExpense += Math.abs(amt);
              monthExpenseCount += 1;
            }
          }
        }
      });

      setSummary({
        Year: {
          income: yearIncome,
          incomeCount: yearIncomeCount,
          expense: -yearExpense,
          expenseCount: yearExpenseCount,
        },
        Month: {
          income: monthIncome,
          incomeCount: monthIncomeCount,
          expense: -monthExpense,
          expenseCount: monthExpenseCount,
        },
      });
    } catch (err) {
      console.error("Gagal memuat data activity:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchActivities();
    }, [selectedMonth]),
  );

  // Filter & Grouping transaksi berdasarkan bulan yang dipilih & per hari
  const groupedData = useMemo(() => {
    const targetMonthIndex = MONTH_MAP[selectedMonth];
    const filteredByMonth = transactions.filter((tx) => {
      const txDate = new Date(tx.date);
      return txDate.getMonth() === targetMonthIndex;
    });

    // Kelompokkan per tanggal (Label: "Today", "Yesterday", atau Format Tanggal)
    const groupsMap = {};
    const todayStr = new Date().toDateString();
    const yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterdayStr = yesterdayDate.toDateString();

    filteredByMonth.forEach((tx) => {
      const txDate = new Date(tx.date);
      const dateString = txDate.toDateString();

      let label = txDate.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
      if (dateString === todayStr) {
        label = `Today, ${selectedMonth} ${txDate.getDate()}`;
      } else if (dateString === yesterdayStr) {
        label = `Yesterday, ${selectedMonth} ${txDate.getDate()}`;
      }

      if (!groupsMap[label]) {
        groupsMap[label] = [];
      }

      groupsMap[label].push({
        id: tx.id,
        title: tx.categories?.name || tx.description || "Transaksi",
        amount:
          tx.type === "INCOME"
            ? Number(tx.amount)
            : -Math.abs(Number(tx.amount)),
      });
    });

    return Object.keys(groupsMap).map((label) => ({
      id: label,
      label,
      items: groupsMap[label],
    }));
  }, [transactions, selectedMonth]);

  const currentSummary = summary[activeTab];

  return (
    <View className="flex-1 bg-white">
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      {/* HEADER GRADASI UNGU */}
      <LinearGradient
        colors={["#4f46e5", "#8b5cf6"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="px-6 pb-10 pt-14"
      >
        {/* TOGGLE YEAR / MONTH */}
        <View className="flex-row self-center p-1 mb-6 rounded-full bg-white/20">
          <TouchableOpacity
            onPress={() => setActiveTab("Year")}
            className={`px-6 py-2 rounded-full ${activeTab === "Year" ? "bg-white" : ""}`}
          >
            <Text
              className={`text-sm font-poppins-semibold ${activeTab === "Year" ? "text-indigo-600" : "text-white/70"}`}
            >
              Year
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab("Month")}
            className={`px-6 py-2 rounded-full ${activeTab === "Month" ? "bg-white" : ""}`}
          >
            <Text
              className={`text-sm font-poppins-semibold ${activeTab === "Month" ? "text-indigo-600" : "text-white/70"}`}
            >
              Month
            </Text>
          </TouchableOpacity>
        </View>

        {/* CARD INCOME & EXPENSE */}
        <View className="flex-row gap-4">
          <View className="flex-1 p-4 bg-white shadow-sm rounded-2xl">
            <Text className="text-xs text-indigo-500 font-poppins-semibold">
              Income
            </Text>
            <Text className="mt-1 text-xl text-slate-800 font-poppins-semibold">
              {formatAmount(currentSummary.income)}
            </Text>
            <Text className="mt-1 text-[10px] text-right text-slate-400 font-poppins-regular">
              {currentSummary.incomeCount}T
            </Text>
          </View>
          <View className="flex-1 p-4 bg-white shadow-sm rounded-2xl">
            <Text className="text-xs text-indigo-500 font-poppins-semibold">
              Expense
            </Text>
            <Text className="mt-1 text-xl text-slate-800 font-poppins-semibold">
              {formatAmount(currentSummary.expense)}
            </Text>
            <Text className="mt-1 text-[10px] text-right text-slate-400 font-poppins-regular">
              {currentSummary.expenseCount}T
            </Text>
          </View>
        </View>

        {/* NAVIGASI BULAN */}
        <View className="mt-6">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 4, gap: 8 }}
          >
            {ALL_MONTHS.map((month) => {
              const isSelected = month === selectedMonth;
              return (
                <TouchableOpacity
                  key={month}
                  onPress={() => setSelectedMonth(month)}
                  className={`px-5 py-2 rounded-full ${
                    isSelected
                      ? "bg-white"
                      : "border border-white/50 bg-white/10"
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
          </ScrollView>
        </View>
      </LinearGradient>

      {/* DAFTAR AKTIVITAS */}
      <View className="flex-1 px-6 pt-6 bg-white -mt-6 rounded-t-[25px]">
        {loading ? (
          <View className="items-center justify-center flex-1">
            <ActivityIndicator size="large" color="#4f46e5" />
          </View>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 24 }}
          >
            {groupedData.length === 0 ? (
              <View className="items-center justify-center mt-16">
                <Text className="text-sm text-slate-400 font-poppins-regular">
                  Belum ada transaksi bulan ini
                </Text>
              </View>
            ) : (
              groupedData.map((group) => (
                <View key={group.id} className="mb-6">
                  <Text className="mb-2 text-xs text-slate-500 font-poppins-semibold">
                    {group.label}
                  </Text>
                  <View className="px-4 bg-slate-100 rounded-2xl">
                    {group.items.map((item, idx) => (
                      <View
                        key={item.id}
                        className={`flex-row items-center py-3 ${
                          idx !== group.items.length - 1
                            ? "border-b border-slate-200"
                            : ""
                        }`}
                      >
                        <View className="items-center justify-center mr-3 rounded-lg w-9 h-9 bg-slate-300">
                          <Feather name="activity" size={16} color="#64748b" />
                        </View>
                        <Text className="flex-1 text-sm text-slate-700 font-poppins-medium">
                          {item.title}
                        </Text>
                        <Text
                          className={`text-sm font-poppins-semibold ${item.amount < 0 ? "text-slate-700" : "text-emerald-600"}`}
                        >
                          {formatAmount(item.amount)}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              ))
            )}
          </ScrollView>
        )}
      </View>
    </View>
  );
}
