import React, { useState, useEffect, useCallback } from "react";
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
import { useRouter, useFocusEffect, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "../../config/supabase"; // Sesuaikan path config supabase kamu

function formatRupiah(value) {
  const numeric = value.replace(/[^0-9]/g, "");
  if (!numeric) return "";
  return "Rp " + Number(numeric).toLocaleString("id-ID");
}

export default function AddTransactionScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [type, setType] = useState("expense"); // "income" atau "expense"
  const [rawAmount, setRawAmount] = useState("");
  const [category, setCategory] = useState(null); // Menyimpan objek kategori (id & name)
  const [description, setDescription] = useState("");
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);

  // State untuk menampung list kategori dari database Supabase
  const [categoriesList, setCategoriesList] = useState([]);

  useEffect(() => {
    if (params.type) {
      setType(params.type.toLowerCase());
    }
  }, [params.type]);

  // Tangkap parameter amount dan description dari halaman scan
  useEffect(() => {
    if (params.amount) {
      setRawAmount(String(params.amount));
    }
    if (params.description) {
      setDescription(params.description);
    }
  }, [params.amount, params.description]);

  // Ambil kategori dari database setiap kali user ganti tipe (Income / Expense)
  useEffect(() => {
    fetchCategories();
    // Reset kategori yang dipilih kalau user ganti tipe
    setCategory(null);
  }, [type]);

  const resetForm = () => {
    setType(params.type ? params.type.toLowerCase() : "income");
    setRawAmount("");
    setCategory(null);
    setDescription("");
  };

  useFocusEffect(
    useCallback(() => {
      if (params.type) {
        setType(params.type.toLowerCase());
      }
      resetForm();
    }, [params.type]),
  );

  async function fetchCategories() {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("id, name")
        .eq("type", type.toUpperCase()); // "INCOME" atau "EXPENSE"

      if (error) {
        console.error("Gagal ambil kategori:", error.message);
        return;
      }

      setCategoriesList(data || []);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  }

  const canSubmit = rawAmount.length > 0 && category !== null;

  async function handleSubmit() {
    if (!canSubmit) return;

    try {
      // 1. Ambil user_id langsung dari AsyncStorage pakai key "user_id" (seperti di ActivityScreen)
      const currentUserId = await AsyncStorage.getItem("user_id");

      if (!currentUserId) {
        console.error(
          "User ID tidak ditemukan di AsyncStorage. Silakan login ulang.",
        );
        return;
      }

      // 2. Insert data ke tabel transactions Supabase
      const { error: insertError } = await supabase
        .from("transactions")
        .insert([
          {
            user_id: currentUserId,
            type: type.toUpperCase(), // "INCOME" atau "EXPENSE"
            amount: Number(rawAmount),
            category_id: category.id, // UUID dari kategori yang dipilih
            description: description,
            date: new Date().toISOString(),
          },
        ]);

      if (insertError) {
        console.error("Gagal menyimpan transaksi:", insertError.message);
        return;
      }

      console.log("Transaksi berhasil disimpan!");
      router.back();
    } catch (err) {
      console.error("Terjadi kesalahan:", err);
    }
  }

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="light-content" />

      {/* Header + toggle di atas gradient */}
      <LinearGradient
        colors={["#4338CA", "#7C3AED", "#A855F7"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="px-5 pb-16 pt-14"
      >
        <View className="flex-row p-1 bg-white/20 rounded-2xl">
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
            className="text-center text-gray-500"
            style={{ fontFamily: "Poppins_400Regular" }}
          >
            Amount
          </Text>

          <TextInput
            value={rawAmount ? formatRupiah(rawAmount) : ""}
            onChangeText={(text) => setRawAmount(text.replace(/[^0-9]/g, ""))}
            placeholder="Rp 0"
            placeholderTextColor="#9CA3AF"
            keyboardType="numeric"
            textAlignVertical="center"
            className="pt-5 mb-6 text-3xl text-center text-gray-950"
            style={{
              fontFamily: "Poppins_600SemiBold",
              includeFontPadding: false,
            }}
          />

          {/* Category dropdown */}
          <Text
            className="mb-1 ml-1 text-gray-700"
            style={{ fontFamily: "Poppins_400Regular" }}
          >
            Category <Text className="text-red-500">*</Text>
          </Text>
          <Pressable
            onPress={() => setCategoryModalVisible(true)}
            className="flex-row items-center justify-between px-4 py-4 mb-4 border border-gray-200 rounded-2xl"
          >
            <Text
              className={category ? "text-gray-900" : "text-gray-400"}
              style={{ fontFamily: "Poppins_400Regular" }}
            >
              {category ? category.name : "Pilih kategori"}
            </Text>
            <Ionicons name="chevron-down" size={18} color="#9CA3AF" />
          </Pressable>

          {/* Description */}
          <Text
            className="mb-1 ml-1 text-gray-700"
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
            className="px-4 py-3 text-gray-900 border border-gray-200 rounded-2xl h-28"
            style={{ fontFamily: "Poppins_400Regular" }}
          />

          <View className="flex-1" />

          {/* Tombol Submit dengan overflow-hidden agar roundednya sempurna */}
          <Pressable
            onPress={handleSubmit}
            disabled={!canSubmit}
            className="mb-8 overflow-hidden rounded-2xl"
          >
            <LinearGradient
              colors={
                canSubmit ? ["#4338CA", "#A855F7"] : ["#D1D5DB", "#D1D5DB"]
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              className="items-center py-4 rounded-2xl"
            >
              <Text
                className="text-base text-white"
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
          className="justify-end flex-1 bg-black/40"
          onPress={() => setCategoryModalVisible(false)}
        >
          <View className="bg-white rounded-t-3xl px-5 pt-5 pb-8 max-h-[60%]">
            <View className="w-10 h-1.5 bg-gray-300 rounded-full self-center mb-4" />
            <Text
              className="mb-3 text-lg text-gray-900"
              style={{ fontFamily: "Poppins_600SemiBold" }}
            >
              Pilih Category
            </Text>
            <FlatList
              data={categoriesList}
              keyExtractor={(item) => item.id}
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
                    {item.name}
                  </Text>
                  {category?.id === item.id && (
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
