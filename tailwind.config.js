/** @type {import('tailwindcss').Config} */
module.exports = {
  // Menentukan folder mana saja yang akan membaca class Tailwind
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        "nunito-bold": ["Nunito_700Bold"],
        "poppins-regular": ["Poppins_400Regular"],
        "poppins-medium": ["Poppins_500Medium"],
        "poppins-semibold": ["Poppins_600SemiBold"],
      },
    },
  },
  plugins: [],
};
