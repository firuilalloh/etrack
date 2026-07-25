import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Diaktifkan
import { supabase } from "../../config/supabase";

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      // Ambil ID user yang sedang login dari AsyncStorage
      const storedId = await AsyncStorage.getItem("user_id");
      setUserId(storedId);

      if (storedId) {
        const { data: profileData, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", storedId)
          .maybeSingle();

        if (error) throw error;

        if (profileData) {
          setName(profileData.username || profileData.name || "");
          setNumber(profileData.phone || "");
          setEmail(profileData.email || "");
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleSave = async () => {
    try {
      if (!name || !email) {
        Alert.alert("Error", "Name dan Email wajib diisi!");
        return;
      }

      const { error } = await supabase
        .from("profiles")
        .update({
          username: name,
          phone: number,
          email: email,
        })
        .eq("id", userId);

      if (error) throw error;

      Alert.alert("Sukses", "Profile berhasil diperbarui!");
      setIsEditing(false);
    } catch (error) {
      Alert.alert("Error", "Gagal menyimpan profile: " + error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("user_id"); 
      router.replace("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <LinearGradient
        colors={["#4f46e5", "#8b5cf6"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="h-56 rounded-b-[35px]"
      >
        {/* Title */}
        <View className="items-center justify-center flex-1">
          <Text className="text-4xl font-bold text-white">E-TRACK</Text>
        </View>

        {/* Background Ungu */}
        <View className="absolute bottom-0 self-center w-[90%] h-6 bg-violet-300/50 rounded-t-2xl" />
      </LinearGradient>

      {/* Avatar */}
      <View className="absolute z-10 self-center top-36">
        <View className="items-center justify-center w-24 h-24 bg-white border border-gray-300 rounded-full shadow-lg">
          <Ionicons name="person-outline" size={40} color="black" />
        </View>
      </View>

      {/* Body */}
      <View className="flex-1 bg-white rounded-t-[30px] -mt-6 px-5 pt-20">
        <TextInput
          placeholder="Name"
          value={name}
          onChangeText={setName}
          editable={isEditing}
          className={`border rounded-md h-12 px-3 mb-4 text-slate-800 ${
            isEditing ? "border-blue-400 bg-white" : "border-gray-300 bg-gray-100"
          }`}
        />

        <TextInput
          placeholder="Number"
          value={number}
          onChangeText={setNumber}
          keyboardType="phone-pad"
          editable={isEditing}
          className={`border rounded-md h-12 px-3 mb-4 text-slate-800 ${
            isEditing ? "border-blue-400 bg-white" : "border-gray-300 bg-gray-100"
          }`}
        />

        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={isEditing}
          className={`border rounded-md h-12 px-3 text-slate-800 ${
            isEditing ? "border-blue-400 bg-white" : "border-gray-300 bg-gray-100"
          }`}
        />

        <View className="flex-1" />

        {/* Button */}
        <View className="flex-row justify-between gap-4 mb-8">
          <TouchableOpacity
            className="flex-1 overflow-hidden rounded-xl"
            onPress={() => (isEditing ? handleSave() : setIsEditing(true))}
          >
            <LinearGradient
              colors={["#4f46e5", "#8b5cf6"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="items-center justify-center h-12 rounded-xl"
            >
              <Text className="font-semibold text-white">
                {isEditing ? "Save Profile" : "Edit Profile"}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-1 overflow-hidden rounded-xl"
            onPress={handleLogout}
          >
            <LinearGradient
              colors={["#4f46e5", "#8b5cf6"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="items-center justify-center h-12 rounded-xl"
            >
              <Text className="font-semibold text-white">Logout</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}