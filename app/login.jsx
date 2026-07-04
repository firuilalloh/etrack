import React, { useState } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { supabase } from "../config/supabase";
import bcrypt from "react-native-bcrypt";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const cleanInput = email.trim();
    const cleanPassword = password;

    if (!cleanInput || !cleanPassword) {
      alert("Nomor HP/Email dan Password tidak boleh kosong!");
      return;
    }

    try {
      const { data: user, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("email", cleanInput)
        .maybeSingle();

      if (error) {
        console.error("Error Supabase:", error);
        throw error;
      }

      if (error) throw error;

      if (!user) {
        alert("Nomor HP atau Email yang Anda masukkan tidak terdaftar.");
        return;
      }

      const isPasswordMatch = bcrypt.compareSync(cleanPassword, user.password);

      if (!isPasswordMatch) {
        alert("Password yang Anda masukkan salah.");
        return;
      }

      console.log("Login Sukses! Mengarahkan ke Dashboard...");
      router.replace("/(tabs)");
    } catch (err) {
      console.error("Login Error:", err);
      alert("Gagal Masuk: " + err.message);
    }
  };

  return (
    <View className="flex-1">
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      <LinearGradient
        colors={["#1d4ed8", "#c084fc"]}
        start={{ x: 0, y: 0.2 }}
        end={{ x: 1, y: 0.75 }}
        className="h-[35%] pt-16 px-6 items-center justify-between pb-16"
      >
        <View className="flex-row items-center">
          <Text className="text-sm text-slate-200 font-poppins-regular">
            Don't have account ?{" "}
          </Text>
          <TouchableOpacity onPress={() => router.push("/register")}>
            <Text className="text-xs text-white underline font-poppins-semibold">
              Get Started
            </Text>
          </TouchableOpacity>
        </View>

        <Text className="text-4xl tracking-widest text-white uppercase font-nunito-bold">
          E-TRACK
        </Text>

        <View />
      </LinearGradient>

      <View
        className="bg-white opacity-25 h-14 -mt-12 rounded-t-[20px] mx-5"
        style={{ transform: [{ scaleX: 0.95 }] }}
      />

      <View className="flex-1 bg-white -mt-10 rounded-t-[32px] px-8 pt-10 justify-start pb-10">
        <View>
          <Text className="text-3xl tracking-wide text-center text-slate-800 font-poppins-semibold">
            Welcome Back
          </Text>
          <Text className="mt-1 mb-8 text-xs text-center text-slate-400 font-poppins-regular">
            Enter Your Detail Bellow
          </Text>

          <View className="space-y-5">
            <View>
              <TextInput
                className="p-4 text-sm bg-white border border-slate-300 rounded-xl text-slate-800 font-poppins-regular"
                placeholder="Email / Number"
                placeholderTextColor="#94a3b8"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
              />
            </View>

            <View className="mt-4">
              <TextInput
                className="p-4 text-sm bg-white border border-slate-300 rounded-xl text-slate-800 font-poppins-regular"
                placeholder="Password"
                placeholderTextColor="#94a3b8"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>
          </View>

          <TouchableOpacity
            onPress={handleLogin}
            className="mt-8 overflow-hidden active:opacity-90 rounded-xl"
          >
            <LinearGradient
              colors={["#1d4ed8", "#c084fc"]}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              className="items-center p-4 shadow-md rounded-xl shadow-blue-300"
            >
              <Text className="text-base text-white font-poppins-semibold">
                Sign In
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View className="flex-row items-center justify-center mt-10">
          <Text className="text-sm text-slate-400 font-poppins-regular">
            Forgot your password ?{" "}
          </Text>
          <TouchableOpacity>
            <Text className="text-sm underline text-slate-600 font-poppins-semibold">
              Reset
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
