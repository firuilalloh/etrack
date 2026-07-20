import React, { useState } from "react";
import {
  Text,
  View,
  FlatList,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter, useFocusEffect } from "expo-router";
import { supabase } from "../../config/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function DashboardScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState(""); 
  const [balance, setBalance] = useState(0);
  const [recentActivities, setRecentActivities] = useState([]);

  const fetchData = async () => {
    try {
      setLoading(true);

      const currentUserId = await AsyncStorage.getItem("user_id");

      if (!currentUserId) {
        router.replace("/login");
        return;
      }

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", currentUserId)
        .maybeSingle();

      if (profileError) {
        console.error("Error fetching profile:", profileError);
      }

      if (profileData) {
        const nameToShow = profileData.username || profileData.name || profileData.email.split("@")[0];
        setUserName(nameToShow);
      } else {
        console.log("Profile tidak ditemukan!");
        setLoading(false);
        return;
      }

      const { data: txData, error: txError } = await supabase
        .from("transactions")
        .select(`
          id,
          type,
          amount,
          description,
          date,
          categories (name)
        `)
        .eq("user_id", currentUserId)
        .order("date", { ascending: false })
        .limit(10);

      if (txError) throw txError;
      setRecentActivities(txData || []);

      const { data: allTx, error: allTxError } = await supabase
        .from("transactions")
        .select("type, amount")
        .eq("user_id", currentUserId);

      if (allTxError) throw allTxError;

      let totalIncome = 0;
      let totalExpense = 0;

      allTx?.forEach((tx) => {
        const amt = Number.parseFloat(tx.amount);
        if (tx.type === "INCOME") {
          totalIncome += amt;
        } else if (tx.type === "EXPENSE") {
          totalExpense += amt;
        }
      });

      setBalance(totalIncome - totalExpense);
    } catch (err) {
      console.error("Gagal memuat data dashboard:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [])
  );

  const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(number);
  };

  return (
    <View className="flex-1 bg-white">
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <LinearGradient
        colors={["#4f46e5", "#8b5cf6"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="h-[33%] pt-14 px-6 justify-between pb-10"
      >
        <Text className="text-base text-white font-poppins-regular">
          Selamat Datang,{" "}
          <Text className="uppercase font-poppins-semibold">{userName}</Text>
        </Text>

        <View className="p-6 bg-white shadow-lg rounded-xl shadow-indigo-200">
          <Text className="text-xs tracking-wide text-slate-500 font-poppins-semibold">
            Saldo Anda
          </Text>
          <Text className="mt-1 text-2xl text-slate-800 font-poppins-semibold">
            {formatRupiah(balance)}
          </Text>
        </View>

        <View className="flex-row space-x-4">
          <TouchableOpacity
            onPress={() => router.push("/income")}
            className="items-center flex-1 py-3 bg-white shadow-sm rounded-xl"
          >
            <Text className="text-sm text-indigo-600 font-poppins-semibold">
              + Income
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push("/expense")}
            className="items-center flex-1 py-3 ml-4 bg-white shadow-sm rounded-xl"
          >
            <Text className="text-sm text-rose-600 font-poppins-semibold">
              - Expense
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <View className="flex-1 bg-white -mt-6 rounded-t-[25px] px-6 pt-6">
        <Text className="mb-4 text-xs tracking-wide text-slate-500 font-poppins-semibold">
          Recent Activity
        </Text>

        {(() => {
          if (loading) {
            return (
              <View className="items-center justify-center flex-1">
                <ActivityIndicator size="large" color="#4f46e5" />
              </View>
            );
          }

          if (recentActivities.length === 0) {
            return (
              <View className="items-center justify-center flex-1">
                <Text className="text-sm text-slate-400 font-poppins-regular">
                  Belum ada aktivitas transaksi.
                </Text>
              </View>
            );
          }

          return (
            <FlatList
              data={recentActivities}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}
              renderItem={({ item }) => {
                const isIncome = item.type === "INCOME";
                return (
                  <View className="flex-row items-center justify-between p-4 mb-3 border bg-slate-50 rounded-2xl border-slate-200/50">
                    <View className="flex-1 pr-2">
                      <Text className="text-sm text-slate-700 font-poppins-semibold">
                        {item.categories?.name || "Kategori Lain"}
                      </Text>
                      <Text
                        className="text-slate-400 text-[11px] font-poppins-regular mt-0.5"
                        numberOfLines={1}
                      >
                        {item.description ||
                          item.categories?.name ||
                          "Transaksi"}{" "}
                        •{" "}
                        {new Date(item.date).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </Text>
                    </View>
                    <Text
                      className={`text-sm font-poppins-semibold ${isIncome ? "text-emerald-600" : "text-slate-700"}`}
                    >
                      {isIncome ? "+ " : "- "}
                      {formatRupiah(item.amount)}
                    </Text>
                  </View>
                );
              }}
            />
          );
        })()}
      </View>
    </View>
  );
}
