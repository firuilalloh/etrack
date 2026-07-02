import "react-native-url-polyfill/auto";
import { createClient } from "@supabase/supabase-js";
import * as Crypto from "expo-crypto";
import bcrypt from "react-native-bcrypt";

bcrypt.setRandomFallback((len) => {
  const randomBytes = Crypto.getRandomBytes(len);
  return Array.from(randomBytes);
});

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_KEY;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
});
