import React, { useEffect } from "react";
import { Text, View, StatusBar } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

export default function LaunchScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/login");
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View className="flex-1">
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <LinearGradient
        colors={["#1d4ed8", "#c084fc"]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.75 }}
        className="items-center justify-center flex-1"
      >
        <Text className="text-5xl tracking-widest text-center text-white uppercase font-nunito-bold">
          E-TRACK
        </Text>
      </LinearGradient>
    </View>
  );
}
