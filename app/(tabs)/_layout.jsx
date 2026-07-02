import { Tabs } from "expo-router";
import React from "react";
// IMPORT SEBAGAI AKTOR IKON LANGSUNG DARI LIBRARY BARU
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Feather from "react-native-vector-icons/Feather";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#4f46e5", // Warna ungu saat menu aktif
        tabBarInactiveTintColor: "#94a3b8", // Warna abu-abu saat tidak aktif
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

      {/* 3. TAB ADD */}
      <Tabs.Screen
        name="add"
        options={{
          title: "Add",
          tabBarIcon: ({ color }) => (
            <Feather name="plus" size={26} color={color} />
          ),
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
