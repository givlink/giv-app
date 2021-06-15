module.exports = {
  // mode: "jit",
  purge: [
    "./components/**/*.{vue,js}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./nuxt.config.{js,ts}"
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        "giv-blue": "#0eb9ec"
      }
    }
  },
  variants: {
    boxShadow: ["hover", "group-hover", "focus", "active"]
  },
  plugins: []
};
