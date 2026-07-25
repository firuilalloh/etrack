import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Modal,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const CATEGORIES = [
  "Makanan & Minuman",
  "Transportasi",
  "Belanja",
  "Hiburan",
  "Tagihan",
  "Kesehatan",
  "Pendidikan",
  "Lainnya",
];

function formatRupiah(value) {
  const numeric = value.replace(/[^0-9]/g, "");
  if (!numeric) return "";
  return "Rp " + Number(numeric).toLocaleString("id-ID");
}

export default function AddTransactionScreen() {
  const router = useRouter();

  const [type, setType] = useState("expense");
  const [rawAmount, setRawAmount] = useState("");
  const [category, setCategory] = useState(null);
  const [description, setDescription] = useState("");
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);

  const canSubmit = rawAmount.length > 0 && category !== null;

  function handleSubmit() {
    if (!canSubmit) return;

    const payload = {
      type,
      amount: Number(rawAmount),
      category,
      description,
    };

    // TODO: ganti dengan logic simpan transaksi (API call / local storage / context)
    console.log("New transaction:", payload);

    router.back();
  }

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="light-content" />

      {/* Header + toggle di atas gradient */}
      <LinearGradient
        colors={["#4338CA", "#7C3AED", "#A855F7"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="pt-14 pb-16 px-5 rounded-b-[32px]"
      >
        <View className="flex-row items-center mb-6">
          <Pressable onPress={() => router.back()} hitSlop={12}>
            <Ionicons name="chevron-back" size={24} color="white" />
          </Pressable>
          <Text
            className="text-white text-xl ml-3"
            style={{ fontFamily: "Poppins_500Medium" }}
          >
            Add New Transaction
          </Text>
        </View>

        <View className="flex-row bg-white/20 rounded-2xl p-1">
          <Pressable
            onPress={() => setType("income")}
            className={`flex-1 py-3 rounded-xl items-center ${
              type === "income" ? "bg-white" : ""
            }`}
          >
            <Text
              style={{ fontFamily: "Poppins_600SemiBold" }}
              className={type === "income" ? "text-indigo-700" : "text-white"}
            >
              Income
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setType("expense")}
            className={`flex-1 py-3 rounded-xl items-center ${
              type === "expense" ? "bg-white" : ""
            }`}
          >
            <Text
              style={{ fontFamily: "Poppins_600SemiBold" }}
              className={type === "expense" ? "text-indigo-700" : "text-white"}
            >
              Expense
            </Text>
          </Pressable>
        </View>
      </LinearGradient>

      {/* Card putih menumpuk di atas gradient */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1 -mt-8"
      >
        <View className="flex-1 bg-white rounded-t-[32px] px-5 pt-8">
          <Text
            className="text-center text-gray-500 mb-1"
            style={{ fontFamily: "Poppins_400Regular" }}
          >
            Amount
          </Text>

          <TextInput
            value={rawAmount ? formatRupiah(rawAmount) : ""}
            onChangeText={(text) => setRawAmount(text.replace(/[^0-9]/g, ""))}
            placeholder="Rp 0"
            keyboardType="numeric"
            className="text-center text-3xl text-gray-900 mb-6"
            style={{ fontFamily: "Poppins_600SemiBold" }}
          />

          {/* Category dropdown */}
          <Text
            className="text-gray-700 mb-1 ml-1"
            style={{ fontFamily: "Poppins_400Regular" }}
          >
            Category <Text className="text-red-500">*</Text>
          </Text>
          <Pressable
            onPress={() => setCategoryModalVisible(true)}
            className="flex-row items-center justify-between border border-gray-200 rounded-2xl px-4 py-4 mb-4"
          >
            <Text
              className={category ? "text-gray-900" : "text-gray-400"}
              style={{ fontFamily: "Poppins_400Regular" }}
            >
              {category ?? "Pilih kategori"}
            </Text>
            <Ionicons name="chevron-down" size={18} color="#9CA3AF" />
          </Pressable>

          {/* Description */}
          <Text
            className="text-gray-700 mb-1 ml-1"
            style={{ fontFamily: "Poppins_400Regular" }}
          >
            Description
          </Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Description"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            className="border border-gray-200 rounded-2xl px-4 py-3 h-28 text-gray-900"
            style={{ fontFamily: "Poppins_400Regular" }}
          />

          <View className="flex-1" />

          <Pressable onPress={handleSubmit} disabled={!canSubmit} className="mb-8">
            <LinearGradient
              colors={
                canSubmit ? ["#4338CA", "#A855F7"] : ["#D1D5DB", "#D1D5DB"]
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              className="py-4 rounded-2xl items-center"
            >
              <Text
                className="text-white text-base"
                style={{ fontFamily: "Poppins_600SemiBold" }}
              >
                Submit
              </Text>
            </LinearGradient>
          </Pressable>
        </View>
      </KeyboardAvoidingView>

      {/* Modal pilih kategori */}
      <Modal
        visible={categoryModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setCategoryModalVisible(false)}
      >
        <Pressable
          className="flex-1 bg-black/40 justify-end"
          onPress={() => setCategoryModalVisible(false)}
        >
          <View className="bg-white rounded-t-3xl px-5 pt-5 pb-8 max-h-[60%]">
            <View className="w-10 h-1.5 bg-gray-300 rounded-full self-center mb-4" />
            <Text
              className="text-lg text-gray-900 mb-3"
              style={{ fontFamily: "Poppins_600SemiBold" }}
            >
              Pilih Category
            </Text>
            <FlatList
              data={CATEGORIES}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => {
                    setCategory(item);
                    setCategoryModalVisible(false);
                  }}
                  className="flex-row items-center justify-between py-3.5 border-b border-gray-100"
                >
                  <Text
                    className="text-gray-800"
                    style={{ fontFamily: "Poppins_400Regular" }}
                  >
                    {item}
                  </Text>
                  {category === item && (
                    <Ionicons name="checkmark" size={18} color="#7C3AED" />
                  )}
                </Pressable>
              )}
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}