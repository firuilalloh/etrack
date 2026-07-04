import React, { useState } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { supabase } from "../config/supabase";
import bcrypt from "react-native-bcrypt";

export default function RegisterScreen() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    const cleanUsername = username.trim();
    const cleanInput = email.trim();
    const cleanPassword = password;

    if (!cleanUsername || !cleanInput || !cleanPassword) {
      Alert.alert("Error", "Semua kolom input wajib diisi!");
      return;
    }

    try {
      const hashedPassword = bcrypt.hashSync(cleanPassword, 4);
      const { data: userExist } = await supabase
        .from("profiles")
        .select("id")
        .or(`email.eq.${cleanInput},username.eq.${cleanUsername}`)
        .maybeSingle();

      if (userExist) {
        Alert.alert(
          "Pendaftaran Gagal",
          "Username atau Nomor HP/Email tersebut sudah terdaftar.",
        );
        return;
      }

      const { error } = await supabase.from("profiles").insert([
        {
          username: cleanUsername,
          email: cleanInput,
          password: hashedPassword,
          created_at: new Date().toISOString(),
        },
      ]);

      if (error) throw error;

      Alert.alert("Sukses", "Akun E-TRACK Anda berhasil dibuat!", [
        { text: "OK", onPress: () => router.replace("/login") },
      ]);
    } catch (err) {
      Alert.alert("Pendaftaran Gagal", err.message);
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
        className="h-[35%] pt-5 px-6 items-center justify-center pb-8"
      >
        <Text className="text-4xl tracking-widest text-white uppercase font-nunito-bold">
          E-TRACK
        </Text>
      </LinearGradient>

      <View
        className="bg-white opacity-25 h-14 -mt-12 rounded-t-[20px] mx-5"
        style={{ transform: [{ scaleX: 0.95 }] }}
      />

      <View className="flex-1 bg-white -mt-10 rounded-t-[32px] px-8 pt-10 pb-10">
        <View>
          <Text className="text-3xl tracking-wide text-center text-slate-800 font-poppins-semibold">
            Create Account
          </Text>
          <Text className="mt-1 mb-6 text-xs text-center text-slate-400 font-poppins-regular">
            Enter Your Detail Bellow
          </Text>

          <View className="space-y-4">
            <View>
              <TextInput
                className="p-4 text-sm bg-white border border-slate-300 rounded-xl text-slate-800 font-poppins-regular"
                placeholder="Username"
                placeholderTextColor="#94a3b8"
                value={username}
                onChangeText={setUsername}
              />
            </View>

            <View className="mt-4">
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
            onPress={handleRegister}
            className="mt-6 overflow-hidden active:opacity-90 rounded-xl"
          >
            <LinearGradient
              colors={["#1d4ed8", "#c084fc"]}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              className="items-center p-4 shadow-md rounded-xl shadow-blue-300"
            >
              <Text className="text-base text-white font-poppins-semibold">
                Register
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View className="flex-row items-center justify-center mt-10">
          <Text className="text-sm text-slate-400 font-poppins-regular">
            Have account ?{" "}
          </Text>
          <TouchableOpacity onPress={() => router.push("/login")}>
            <Text className="text-xs underline text-slate-600 font-poppins-semibold">
              Sign In
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
