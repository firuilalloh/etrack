import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
// import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "../../config/supabase";

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [email, setEmail] = useState("");
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const storedEmail = await AsyncStorage.getItem("userEmail");
      setUserEmail(storedEmail);
      
      if (storedEmail) {
        const { data: profileData } = await supabase
          .from("profiles")
          .select("username, phone, email")
          .eq("email", storedEmail)
          .single();

        if (profileData) {
          setName(profileData.username || "");
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
      if (!name || !number || !email) {
        Alert.alert("Error", "Semua field harus diisi!");
        return;
      }

      const { error } = await supabase
        .from("profiles")
        .update({
          username: name,
          phone: number,
          email: email,
        })
        .eq("email", userEmail);

      if (error) throw error;

      Alert.alert("Sukses", "Profile berhasil diperbarui!");
      setIsEditing(false);
    } catch (error) {
      Alert.alert("Error", "Gagal menyimpan profile: " + error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("userEmail");
      await supabase.auth.signOut();
      router.replace("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <View className="flex-1 bg-white">

      {/* Header */}
      <LinearGradient
        colors={["#2948D3", "#A13FE6"]}
        className="h-56 rounded-b-[35px]"
      >
        {/* Back */}
        <TouchableOpacity
          onPress={() => router.back()}
          className="absolute top-14 left-5"
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>

        {/* Title */}
        <View className="flex-1 items-center justify-center">
          <Text className="text-white text-4xl font-bold">
            E-TRACK
          </Text>
        </View>

        {/* Background Ungu */}
        <View className="absolute bottom-0 self-center w-[90%] h-6 bg-violet-300/50 rounded-t-2xl" />
      </LinearGradient>

      {/* Avatar */}
      <View className="absolute top-36 self-center z-10">
        <View className="w-24 h-24 rounded-full bg-white border border-gray-300 items-center justify-center shadow-lg">
          <Ionicons
            name="person-outline"
            size={40}
            color="black"
          />
        </View>
      </View>

      {/* Body */}
      <View className="flex-1 bg-white rounded-t-[30px] -mt-6 px-5 pt-20">

        <TextInput
          placeholder="Name"
          editable={false}
          className="border border-gray-300 rounded-md h-12 px-3 mb-4 bg-gray-100"
        />

        <TextInput
          placeholder="Number"
          keyboardType="phone-pad"
          editable={false}
          className="border border-gray-300 rounded-md h-12 px-3 mb-4 bg-gray-100"
        />

        <TextInput
          placeholder="Email"
          keyboardType="email-address"
          editable={false}
          className="border border-gray-300 rounded-md h-12 px-3 bg-gray-100"
        />

        <View className="flex-1" />

        {/* Button */}
        <View className="flex-row justify-between gap-4 mb-8">

          <TouchableOpacity className="flex-1">
            <LinearGradient
              colors={["#2948D3", "#A13FE6"]}
              className="h-12 rounded-lg items-center justify-center"
            >
              <Text className="text-white font-semibold">
                Edit Profile
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-1"
            onPress={() => router.replace("/login")}
>
          <LinearGradient
            colors={["#2948D3", "#A13FE6"]}
            className="h-12 rounded-lg items-center justify-center"
  >
          <Text className="text-white font-semibold">
          Logout
    </Text>
  </LinearGradient>
</TouchableOpacity>

        </View>

      </View>
    </View>
  );
}