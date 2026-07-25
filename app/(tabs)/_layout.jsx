import { Tabs, useRouter } from "expo-router";
import React from "react";
import Feather from "react-native-vector-icons/Feather";

export default function TabsLayout() {
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#4f46e5",
        tabBarInactiveTintColor: "#94a3b8",
        tabBarStyle: {
          backgroundColor: "#ffffff",
          height: 65,
          paddingBottom: 8,
          paddingTop: 8,
          borderTopWidth: 1,
          borderTopColor: "#f1f5f9",
        },
        tabBarLabelStyle: {
          fontFamily: "poppins-medium",
          fontSize: 11,
        },
      }}
    >
      {/* 1. TAB HOME */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Feather name="home" size={24} color={color} />
          ),
        }}
      />

      {/* 2. TAB ACTIVITY */}
      <Tabs.Screen
        name="activity"
        options={{
          title: "Activity",
          tabBarIcon: ({ color }) => (
            <Feather name="activity" size={24} color={color} />
          ),
        }}
      />

      {/* 3. TAB ADD — dibajak: buka modal /add-transaction, bukan pindah tab */}
      <Tabs.Screen
        name="add"
        options={{
          title: "Add",
          tabBarIcon: ({ color }) => (
            <Feather name="plus" size={26} color={color} />
          ),
        }}
        listeners={{
          tabPress: (e) => {
            // Cegah perilaku default (pindah ke tab "add")
            e.preventDefault();
            // Buka layar add-transaction sebagai modal di atas tab bar
            router.push("/add-transaction");
          },
        }}
      />

      {/* 4. TAB PEOPLE */}
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <Feather name="user" size={26} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}